import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useTasksStore } from 'stores/tasks';
import { errorMessage, successMessage } from 'src/utils/main';
import { ErrorMessage } from 'src/models/errorMessage';

export function useTaskAction() {
  const $q = useQuasar(),
    store = useTasksStore(),
    error = computed(() => store.error),
    status = computed(() => store.status);

  async function executeTaskAction(
    action: (param: any) => Promise<void>,
    param: any,
  ) {
    store.reset();
    try {
      await action(param);

      if (error.value) {
        $q.notify(errorMessage(error.value));
      } else {
        await store.loadTasks();
        $q.notify(successMessage(status.value));
      }
    } catch (err) {
      const error =
        err instanceof Error ? err.message : ErrorMessage.unknownError;
      $q.notify(errorMessage(error));
    }
  }

  return {
    executeTaskAction,
  };
}
