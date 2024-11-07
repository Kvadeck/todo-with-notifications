<!-- TODO: Задача автоматически ставится выполненой при истечение срока выполнения -->
<!-- TODO: Сделать возможность показа уведомление по истечению времени задачи -->

<!-- TODO: Добавить пагинацию -->
<!-- TODO: Добавить возможность передвигать карточки задач -->

<!-- TODO: Добавить возможность темный темы -->
<!-- TODO: Добавить интернационализацию -->

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
              <task-card v-for="task in tasks" :key="task.id" :task="task" />
            </div>
            <error-block v-else icon="today" text="No tasks found..." />
          </template>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useTasksStore } from 'stores/tasks';
import { computed, onMounted, ref, watch } from 'vue';

import TaskCard from 'components/TaskItem.vue';
import AddTask from 'components/TheAddTaskForm.vue';
import TasksControls from 'components/TheTasksTopPanel.vue';
import ErrorBlock from 'components/ui/ErrorBlock.vue';
import Spinner from 'components/ui/LSpinner.vue';

const store = useTasksStore();

const error = computed(() => store.error),
  isLoading = computed(() => store.isLoading),
  hasTasks = computed(() => store.hasTasks),
  tasks = computed(() => store.tasks),
  intervalId = ref<ReturnType<typeof setInterval> | null>(null);

watch(
  tasks,
  async () => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value);
    }
    const tasksExist = await hasTasks.value;
    if (tasksExist) {
      intervalId.value = setInterval(store.checkNoticeTime, 1000);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await store.loadTasks();
});

defineOptions({
  name: 'IndexPage',
});
</script>
