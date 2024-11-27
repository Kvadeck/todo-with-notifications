import { defineStore } from 'pinia';
import { db, Task } from '../services/db';
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
    onDialogClose: null as (() => void) | null,
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
      if (data == null) {
        this.error = ErrorMessage.failedAdd;
        return;
      }
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
      if (id == null) {
        this.error = ErrorMessage.failedDelete;
        return;
      }
      try {
        await db.transaction('rw', db.tasks, async () => {
          await db.tasks.delete(id);
        });
      } catch (error) {
        this.error = ErrorMessage.failedDelete + ' ' + error;
      }
    },
    async deleteSelectedTasks(tasksIds: number[]) {
      if (tasksIds == null) {
        this.error = ErrorMessage.failedDeleteSelected;
        return;
      }
      try {
        await db.transaction('rw', db.tasks, async () => {
          await Promise.all(tasksIds.map((id) => db.tasks.delete(id)));
        });
        this.resetSelectedTasks();
      } catch (error) {
        this.error = ErrorMessage.failedDeleteSelected + ' ' + error;
      }
    },
    async toggleCompleted(id: number) {
      if (id == null) {
        this.error = ErrorMessage.failedToggleCompleted;
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
        this.error = `${ErrorMessage.failedToggleCompleted} ${error}`;
      }
    },
    async checkNoticeTime() {
      const nowISO = new Date().toISOString().slice(0, 16);
      try {
        for (const taskItem of this.tasksForNotice) {
          const taskTimeISO = new Date(taskItem.date)
            .toISOString()
            .slice(0, 16);

          if (taskTimeISO === nowISO) {
            const task = await db.tasks.get(taskItem.id);
            if (task == null) {
              this.error = ErrorMessage.notExist;
              return;
            }
            await db.transaction('rw', db.tasks, async () => {
              await db.tasks.update(task.id, { ...task, completed: true });
            });
            this.tasks = await db.tasks.toArray();
            await this.showDialogForTask(task);
          }
        }
      } catch (error) {
        this.error = ErrorMessage.notExist + ' ' + error;
        return;
      }
    },
    async showDialogForTask(task: Task): Promise<void> {
      this.isNotice = true;
      this.noticeData = task;

      return new Promise((resolve) => {
        this.onDialogClose = resolve;
      });
    },
    async refreshDbTasks(tasks: Task[]) {
      try {
        await db.transaction('rw', db.tasks, async () => {
          await db.tasks.clear();
          const taskPromises = tasks.map((task, index) =>
            db.tasks.add({
              id: index,
              taskName: task.taskName,
              date: task.date,
              category: task.category,
              completed: task.completed,
            }),
          );
          await Promise.all(taskPromises);
        });
      } catch (error) {
        this.error = ErrorMessage.failedRefresh + ' ' + error;
      }
    },
    async updatePosition(tasks: { newTasks: Task[]; startValue: number }) {
      if (
        !tasks.newTasks ||
        tasks.newTasks.length === 0 ||
        tasks.startValue == null
      ) {
        this.error = ErrorMessage.failedUpdatePosition;
        return;
      }
      try {
        this.tasks.splice(
          tasks.startValue,
          tasks.newTasks.length,
          ...tasks.newTasks,
        );
        await this.refreshDbTasks(this.tasks);
        this.status = StatusMessage.taskMoved;
      } catch (error) {
        this.error = ErrorMessage.failedUpdatePosition + ' ' + error;
      }
    },
    async pinTask(task: Task) {
      if (task == null) {
        this.error = ErrorMessage.failedPinTask;
        return;
      }
      try {
        this.tasks = this.tasks.filter((item) => item.id !== task.id);
        this.tasks.unshift({ ...task });
        await this.refreshDbTasks(this.tasks);
        this.status = StatusMessage.taskPinned;
      } catch (error) {
        this.error = ErrorMessage.failedPinTask + ' ' + error;
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
      if (this.onDialogClose) {
        this.onDialogClose();
        this.onDialogClose = null;
      }

      this.isNotice = null;
      this.noticeData = null;
    },
    preDeleteTask(id: number) {
      if (id == null) {
        this.error = ErrorMessage.failedDelete;
        return;
      }
      this.tasks = this.tasks = this.tasks.filter((item) => item.id !== id);
    },
    preDeleteSelectedTasks(tasksIds: number[]) {
      if (tasksIds == null) {
        this.error = ErrorMessage.failedDeleteSelected;
        return;
      }
      tasksIds.forEach((taskId) => {
        this.tasks = this.tasks.filter((item) => item.id !== taskId);
      });
    },
  },
});
