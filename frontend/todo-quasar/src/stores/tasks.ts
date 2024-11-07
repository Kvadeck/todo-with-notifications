import { defineStore } from 'pinia';

import { Task, db } from '../services/db';
import { StatusMessage } from 'src/models/statusMessage';
import { ErrorMessage } from 'src/models/errorMessage';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    status: '',
    error: '',
    isLoading: false,
    tasks: [] as Task[],
    selectedTasks: [] as number[],
  }),
  getters: {
    async hasTasks(): Promise<boolean> {
      return this.tasks.length > 0;
    },
  },
  actions: {
    async addTask(data: Task) {
      try {
        const id = await db.tasks.add({ ...data, completed: false });
        this.status = StatusMessage.taskAdded + id;
      } catch (error) {
        this.error = ErrorMessage.failedAdd + ' ' + error;
      }
    },
    async loadTasks() {
      try {
        this.isLoading = true;
        this.tasks = await db.tasks.toArray();
      } catch (error) {
        this.error = ErrorMessage.failedLoad + ' ' + error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteTask(id: number) {
      try {
        await db.tasks.delete(id);
        this.status = StatusMessage.taskDeleted + id;
      } catch (error) {
        this.error = ErrorMessage.failedDelete + ' ' + error;
      }
    },
    async deleteSelectedTasks(tasksIds: number[]) {
      try {
        for (const item of tasksIds) {
          await db.tasks.delete(item);
        }
        this.status = StatusMessage.selectedDeleted;
      } catch (error) {
        this.error = ErrorMessage.failedDeleteSelected + ' ' + error;
      }
    },
    async toggleCompleted(id: number) {
      if (id === undefined) {
        this.error = ErrorMessage.failedSetCompleted;
        return;
      }
      try {
        const task = await db.tasks.get(id);
        const updated = { completed: !task?.completed };
        await db.tasks.update(id, updated);
        this.status = StatusMessage.taskUpdated;
      } catch (error) {
        this.error = ErrorMessage.failedSetCompleted + ' ' + error;
      }
    },
    reset() {
      this.status = '';
      this.error = '';
    },
    addSelectedTask(id: number | undefined) {
      if (id === undefined) {
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
    checkNoticeTime() {
      // Перебираю задачи из массива не завершенных в каждую секунду
      // На каждой итерации элемента сравниваю время сейчас и то которое было при отправке формы
      // Стоит условие на каждой итерации и смотрит когда время равно
      // Если это время совпало то ставлю у этого элемента свойство завершено и показываю уведомление с помощью состояния
      // В компоненте есть вычисляемое свойство которое слушает это свойство и если оно равно true то показывает уведомление
      // В тексте уведомления пишу что такая то задача завершена
    },
  },
});
