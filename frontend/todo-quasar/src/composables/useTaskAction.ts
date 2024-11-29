import { computed } from 'vue';
import { useTasksStore } from 'stores/tasks';
import { errorMessage, successMessage } from 'src/utils/main';
import { Task } from 'src/services/db';
import { useI18n } from 'vue-i18n';


type param =
  | { newTasks: Task[]; startValue: number }
  | Task
  | number
  | undefined
  | number[]
  | { taskName: string; category: string[]; date: Date };

export function useTaskAction() {

  const { t } = useI18n();

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
        if (isLoad) {
          await store.loadTasks();
        }
        successMessage(status.value);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err.message : t('unknownError');
      errorMessage(error);
    }
  }

  return {
    executeTaskAction,
  };
}
