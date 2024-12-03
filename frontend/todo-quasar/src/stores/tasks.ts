import { defineStore } from 'pinia';
import { db, Task } from '../services/db';
import { ELEMENTS_ON_PAGE } from 'src/constants';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    status: '' as string,
    error: '' as string,
    isLoading: false as boolean,
    tasks: [] as Task[],
    selectedTasks: [] as number[],
    isNotice: null as boolean | null,
    noticeData: null as {
      id: number | undefined;
      taskName: string;
      date: Date;
    } | null,
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
        this.error = t('failedAdd');
        return;
      }
      try {
        await db.transaction('rw', db.tasks, async () => {
          const id = await db.tasks.add({ ...data, completed: false });
          this.status = t('taskAdded') + id;
        });
      } catch (error) {
        this.error = t('failedAdd') + ' ' + error;
      }
    },
    async loadTasks() {
      try {
        this.isLoading = true;
        await db.transaction('r', db.tasks, async () => {
          this.tasks = await db.tasks.orderBy('id').toArray();
        });
      } catch (error) {
        this.error = t('failedLoad') + ' ' + error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteTask(id: number) {
      if (id == null) {
        this.error = t('failedDelete');
        return;
      }
      try {
        await db.transaction('rw', db.tasks, async () => {
          await db.tasks.delete(id);
        });
      } catch (error) {
        this.error = t('failedDelete') + ' ' + error;
      }
    },
    async deleteSelectedTasks(tasksIds: number[]) {
      if (tasksIds == null) {
        this.error = t('failedDeleteSelected');
        return;
      }
      try {
        await db.transaction('rw', db.tasks, async () => {
          await Promise.all(tasksIds.map((id) => db.tasks.delete(id)));
        });
        this.resetSelectedTasks();
      } catch (error) {
        this.error = t('failedDeleteSelected') + ' ' + error;
      }
    },
    async toggleCompleted(id: number) {
      if (id == null) {
        this.error = t('failedToggleCompleted');
        return;
      }
      try {
        await db.transaction('rw', db.tasks, async () => {
          const task = await db.tasks.get(id);
          if (!task) {
            throw new Error(t('notExist'));
          }
          await db.tasks.update(id, { completed: !task.completed });
        });
        this.status = t('taskUpdated');
      } catch (error) {
        this.error = `${t('failedToggleCompleted')} ${error}`;
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
              this.error = t('notExist');
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
        this.error = t('notExist') + ' ' + error;
        return;
      }
    },
    async showDialogForTask(task: Task): Promise<void> {
      this.isNotice = true;

      this.noticeData = {
        id: task.id,
        taskName: task.taskName,
        date: task.date,
      };

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
        this.error = t('failedRefresh') + ' ' + error;
      }
    },
    async updatePosition(tasks: { newTasks: Task[]; startValue: number }) {
      if (
        !tasks.newTasks ||
        tasks.newTasks.length === 0 ||
        tasks.startValue == null
      ) {
        this.error = t('failedUpdatePosition');
        return;
      }
      try {
        this.tasks.splice(
          tasks.startValue,
          tasks.newTasks.length,
          ...tasks.newTasks,
        );
        await this.refreshDbTasks(this.tasks);
        this.status = t('taskMoved');
      } catch (error) {
        this.error = t('failedUpdatePosition') + ' ' + error;
      }
    },
    async pinTask(task: Task) {
      if (task == null) {
        this.error = t('failedPinTask');
        return;
      }
      try {
        this.tasks = this.tasks.filter((item) => item.id !== task.id);
        this.tasks.unshift({ ...task });
        await this.refreshDbTasks(this.tasks);
        this.status = t('taskPinned');
      } catch (error) {
        this.error = t('failedPinTask') + ' ' + error;
      }
    },
    reset() {
      this.status = '';
      this.error = '';
    },
    addSelectedTask(id: number | undefined) {
      if (id == null) {
        this.error = t('failedAddSelected');
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
        this.error = t('failedDelete');
        return;
      }
      this.tasks = this.tasks = this.tasks.filter((item) => item.id !== id);
    },
    preDeleteSelectedTasks(tasksIds: number[]) {
      if (tasksIds == null) {
        this.error = t('failedDeleteSelected');
        return;
      }
      tasksIds.forEach((taskId) => {
        this.tasks = this.tasks.filter((item) => item.id !== taskId);
      });
    },
  },
});
