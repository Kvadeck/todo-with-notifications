import { defineStore } from 'pinia';
import { db, Task } from '../services/db';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    status: '',
    error: '',
    isLoading: false,
    tasks: [] as Task[],
    selectedTasks: [] as number[],
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
    async deleteTask(id: number | undefined) {
      try {
        await db.tasks.delete(id);
        this.status = `Task with ID:${id} successfully deleted.`;
      } catch (error) {
        this.error = `Failed to delete task! ${error}`;
      }
    },
    async deleteSelectedTasks(tasksIds: number[]) {
      try {
        for (const item of tasksIds) {
          await db.tasks.delete(item);
        }
        this.status = 'Selected tasks successfully deleted.';
      } catch (error) {
        this.error = `Failed to delete selected tasks! ${error}`;
      }
    },
    reset() {
      this.status = '';
      this.error = '';
    },
    addSelectedTask(id: number | undefined) {
      if (id === undefined) {
        this.error = 'Failed to add selected task!';
        return;
      }
      console.log(id, 'id')
      if (this.selectedTasks.includes(id)) {
        this.selectedTasks = this.selectedTasks.filter(item => item !== id);
      } else {
        this.selectedTasks.push(id);
      }
    },
  },
});
