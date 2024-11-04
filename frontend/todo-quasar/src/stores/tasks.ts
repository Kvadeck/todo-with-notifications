import { defineStore } from 'pinia';
import { db, Task } from '../services/db';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    status: '',
    error: '',
  }),
  getters: {},
  actions: {
    async addTask(data: Task) {
      try {
        const id = await db.tasks.add({ ...data, completed: false });
        this.status = `Task with id:${id} successfully added.`;
      } catch (error) {
        this.error = `Failed to add task! Error: ${error}`;
      }
    },
    reset() {
      this.status = '';
      this.error = '';
    },
  },
});
