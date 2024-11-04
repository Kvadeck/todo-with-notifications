import Dexie, { type EntityTable } from 'dexie';

interface Task {
  id?: number;
  taskName: string;
  date: Date;
  category: string;
  completed?: boolean;
}

const db = new Dexie('TasksDb') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
};

db.version(1).stores({
  tasks: '++id, taskName, date, category, completed',
});

export type { Task };
export { db };
