import { defineStore } from 'pinia';

import { Task, db } from '../services/db';
import { StatusMessage } from 'src/models/statusMessage';
import { ErrorMessage } from 'src/models/errorMessage';
import { ELEMENTS_ON_PAGE } from 'src/constants';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    status: '' as string,
    error: '' as string,
    isLoading: false as boolean,
    tasks: [] as Task[],
    selectedTasks: [] as number[],
    isNotice: null as boolean | null,
    noticeData: null as Task | null,
  }),
  getters: {
    tasksForNotice(): Task[] {
      const now = new Date();
      return this.tasks.filter((task) => !task.completed && task.date > now);
    },
    isPagination(): boolean {
      return this.tasks.length > ELEMENTS_ON_PAGE;
    },
    totalPages(): number {
      return Math.ceil(this.tasks.length / ELEMENTS_ON_PAGE);
    },
  },
  actions: {
    async addTask(data: Task) {
      try {
        await db.transaction('rw', db.tasks, async () => {
          const id = await db.tasks.add({ ...data, completed: false });
          this.status = StatusMessage.taskAdded + id;
        });
      } catch (error) {
        this.error = ErrorMessage.failedAdd + ' ' + error;
      }
    },
    async loadTasks() {
      try {
        this.isLoading = true;
        await db.transaction('r', db.tasks, async () => {
          this.tasks = await db.tasks.orderBy('id').toArray();
        });
      } catch (error) {
        this.error = ErrorMessage.failedLoad + ' ' + error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteTask(id: number) {
      try {
        await db.transaction('rw', db.tasks, async () => {
          await db.tasks.delete(id);
          this.status = StatusMessage.taskDeleted + id;
        });
      } catch (error) {
        this.error = ErrorMessage.failedDelete + ' ' + error;
      }
    },
    async deleteSelectedTasks(tasksIds: number[]) {
      try {
        await db.transaction('rw', db.tasks, async () => {
          await Promise.all(tasksIds.map((id) => db.tasks.delete(id)));
          this.tasks = await db.tasks.toArray();
        });
        this.status = StatusMessage.selectedDeleted;
      } catch (error) {
        this.error = ErrorMessage.failedDeleteSelected + ' ' + error;
      }
    },
    async toggleCompleted(id: number) {
      if (id == null) {
        this.error = ErrorMessage.failedSetCompleted;
        return;
      }
      try {
        await db.transaction('rw', db.tasks, async () => {
          const task = await db.tasks.get(id);
          if (!task) {
            throw new Error(ErrorMessage.notExist);
          }
          await db.tasks.update(id, { completed: !task.completed });
        });
        this.status = StatusMessage.taskUpdated;
      } catch (error) {
        this.error = `${ErrorMessage.failedSetCompleted} ${error}`;
      }
    },
    async checkNoticeTime() {
      const nowISO = new Date().toISOString().slice(0, 16);
      try {
        await db.transaction('rw', db.tasks, async () => {
          for (const taskItem of this.tasksForNotice) {
            const taskTimeISO = new Date(taskItem.date)
              .toISOString()
              .slice(0, 16);
            if (taskTimeISO === nowISO) {
              const task = await db.tasks.get(taskItem.id);
              if (task) {
                await db.tasks.update(task.id, { ...task, completed: true });
                this.tasks = await db.tasks.toArray();
                await this.showDialogForTask(task);
              }
            }
          }
        });
      } catch (error) {
        this.error = ErrorMessage.notExist + ' ' + error;
        return;
      }
    },
    async showDialogForTask(task: Task) {
      this.isNotice = true;
      this.noticeData = task;

      // TODO: It can be reworked with event
      await new Promise<void>((resolve) => {
        // Wait until dialog is closed
        const interval = setInterval(() => {
          if (!this.isNotice) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    },
    async updatePosition(tasks: Task[], startPosition: number) {
      if (!tasks || tasks.length === 0) {
        return;
      }
      try {
        this.tasks.splice(startPosition, tasks.length, ...tasks);
        await db.transaction('rw', db.tasks, async () => {
          await db.tasks.clear();
          const taskPromises = this.tasks.map((task, index) =>
            db.tasks.add({
              id: index,
              taskName: task.taskName,
              date: task.date,
              category: task.category,
              completed: task.completed,
            }),
          );
          await Promise.all(taskPromises);
          await this.loadTasks();
        });
      } catch (error) {
        this.error = ErrorMessage.failedUpdatePosition + ' ' + error;
      }
    },
    reset() {
      this.status = '';
      this.error = '';
    },
    addSelectedTask(id: number | undefined) {
      if (id == null) {
        this.error = ErrorMessage.failedAddSelected;
        return;
      }
      if (this.selectedTasks.includes(id)) {
        this.selectedTasks = this.selectedTasks.filter((item) => item !== id);
      } else {
        this.selectedTasks.push(id);
      }
    },
    resetSelectedTasks() {
      this.selectedTasks = [];
    },
    resetIsNotice() {
      this.isNotice = null;
      this.noticeData = null;
    },
  },
});
