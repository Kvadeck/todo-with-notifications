import { computed } from 'vue';
import { useTasksStore } from 'stores/tasks';
import { errorMessage, successMessage } from 'src/utils/main';
import { ErrorMessage } from 'src/models/errorMessage';
import { Task } from 'src/services/db';

type param =
  | { newTasks: Task[]; startValue: number }
  | Task
  | number
  | undefined
  | number[]
  | { taskName: string; category: string[]; date: Date };

export function useTaskAction() {
  const store = useTasksStore(),
    error = computed(() => store.error),
    status = computed(() => store.status);

  async function executeTaskAction(
    action: (param: any) => Promise<void>,
    param: param,
    isLoad = false,
  ) {
    store.reset();
    try {
      await action(param);

      if (error.value) {
        errorMessage(error.value);
      } else {
        // TODO: Set it when it need it.
        if (isLoad) {
          await store.loadTasks();
        }
        successMessage(status.value);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err.message : ErrorMessage.unknownError;
      errorMessage(error);
    }
  }

  return {
    executeTaskAction,
  };
}
