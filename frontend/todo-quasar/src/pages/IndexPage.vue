<!-- TODO: Добавить интернационализацию -->
<!-- TODO: Добавить стили метки для переключения языка -->
<!-- TODO: После того как перемещаю и потом ставлю статус завершенный у перемещнной карточки то изменяется не та -->
<!-- TODO: Уведомление не работает если нажимаю на кнопку изменить позицию в начало -->
<!-- TODO: Выложить на Vercel -->

<script setup lang="ts">
import { useTasksStore } from 'stores/tasks';
import { computed, onMounted, ref, watch } from 'vue';
import TaskCard from 'components/TaskItem.vue';
import AddTask from 'components/TheAddTaskForm.vue';
import TasksControls from 'components/TheTasksTopPanel.vue';
import ErrorBlock from 'components/ui/ErrorBlock.vue';
import Spinner from 'components/ui/LSpinner.vue';
import NoticeDialog from 'components/ui/NoticeDialog.vue';
import { ELEMENTS_ON_PAGE } from 'src/constants';
import draggable from 'vuedraggable';
import { useTaskAction } from 'src/composables/useTaskAction';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const store = useTasksStore();
const { executeTaskAction } = useTaskAction();

const error = computed(() => store.error),
  isLoading = computed(() => store.isLoading),
  tasksForNotice = computed(() => store.tasksForNotice),
  tasks = computed(() => store.tasks),
  totalPages = computed(() => store.totalPages),
  isPagination = computed(() => store.isPagination),
  timer = ref<null | number>(null),
  currentPage = ref(1);

watch(
  tasks,
  async () => {
    if (timer.value !== null) {
      clearInterval(timer.value);
    }

    if (tasksForNotice.value.length) {
      timer.value = window.setInterval(store.checkNoticeTime, 1000);
    }
  },
  { immediate: true },
);

const start = computed(() => {
  return (currentPage.value - 1) * ELEMENTS_ON_PAGE;
});

const paginatedItems = computed({
  get() {
    const end = start.value + ELEMENTS_ON_PAGE;
    return !tasks.value.slice(start.value, end).length
      ? tasks.value
      : tasks.value.slice(start.value, end);
  },
  set(newTasks) {
    executeTaskAction(store.updatePosition, {
      newTasks,
      startValue: start.value,
    });
  },
});

onMounted(async () => {
  await store.loadTasks();
});

defineOptions({
  name: 'IndexPage',
});
</script>

<template>
  <q-page>
    <div class="row justify-center q-pt-lg">
      <div class="col-12 col-md-5 col-lg-3">
        <add-task />
      </div>
      <div class="col-12 col-md-5 col-lg-4">
        <div class="q-px-sm q-mt-lg q-mt-md-none">
          <tasks-controls />
          <error-block v-if="error" icon="error" :text="error" />
          <spinner v-else-if="isLoading" />
          <template v-else>
            <template v-if="tasks?.length">
              <draggable
                class="row q-col-gutter-sm"
                v-model="paginatedItems"
                item-key="id"
                handle=".handle"
              >
                <template #item="{ element }">
                  <task-card :currentPage="currentPage" :task="element" />
                </template>
              </draggable>
              <div
                class="flex justify-center full-width q-my-sm"
                v-if="isPagination"
              >
                <q-pagination
                  v-model="currentPage"
                  :max="totalPages"
                  direction-links
                  flat
                  active-color="cyan"
                />
              </div>
            </template>
            <error-block v-else icon="today" :text="t('noTasksFound')" />
          </template>
        </div>
      </div>
    </div>
    <notice-dialog />
  </q-page>
</template>
