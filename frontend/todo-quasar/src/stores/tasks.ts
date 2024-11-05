import { defineStore } from 'pinia';
import { db, Task } from '../services/db';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    status: '',
    error: '',
    isLoading: false,
    tasks: [] as Task[],
  }),
  getters: {},
  actions: {
    async addTask(data: Task) {
      try {
        const id = await db.tasks.add({ ...data, completed: false });
        this.status = `Task with ID:${id} successfully added.`;
      } catch (error) {
        this.error = `Failed to add task! ${error}`;
      }
    },
    async loadTasks() {
      try {
        this.isLoading = true;
        this.tasks = await db.tasks.toArray();
      } catch (error) {
        this.error = `Failed to load tasks! ${error}`;
      } finally {
        this.isLoading = false;
      }
    },
    reset() {
      this.status = '';
      this.error = '';
    },
  },
});
