<!-- TODO: Когда находишься на странице и удаляешь все текущие элементы то она становится пустой  -->
<!-- TODO: Добавить возможность передвигать карточки задач -->
<!-- TODO: Подумать над тем как можно показывать несколько уведомлений по очереди в одно и тоже время -->
<!-- TODO: Добавить возможность темный темы -->
<!-- TODO: Добавить интернационализацию -->

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

const store = useTasksStore();

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

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * ELEMENTS_ON_PAGE,
    end = start + ELEMENTS_ON_PAGE;
  return tasks.value.slice(start, end);
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
      <div class="col-12 col-md-4 col-lg-3">
        <add-task />
      </div>
      <div class="col-12 col-md-5 col-lg-4">
        <div class="q-px-sm q-mt-lg q-mt-md-none">
          <tasks-controls />
          <error-block v-if="error" icon="error" :text="error" />
          <spinner v-else-if="isLoading" />
          <template v-else>
            <div class="row q-col-gutter-sm" v-if="tasks?.length">
              <task-card
                v-for="task in paginatedItems"
                :key="task.id"
                :task="task"
              />
              <div class="flex justify-center full-width" v-if="isPagination">
                <q-pagination
                  v-model="currentPage"
                  :max="totalPages"
                  direction-links
                  flat
                  color="grey"
                  active-color="primary"
                />
              </div>
            </div>
            <error-block v-else icon="today" text="No tasks found..." />
          </template>
        </div>
      </div>
    </div>
    <notice-dialog />
  </q-page>
</template>
