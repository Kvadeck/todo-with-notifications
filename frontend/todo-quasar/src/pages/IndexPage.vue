<!-- Добавить пагинацию -->
<!-- Добавить возможность передвигать карточки задач -->
<!-- Добавить возможность темный темы -->
<!-- Добавить интернационализацию -->
<!-- После добавление задачи обновлять список задач -->

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
          <div
            v-else-if="isLoading"
            class="side-wrapper relative-position full-width"
          >
            <spinner />
          </div>
          <template v-else>
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
              class="row q-col-gutter-sm"
            >
              <div v-if="tasks?.length">
                <task-card v-for="task in tasks" :key="task.id" :task="task" />
              </div>
              <error-block icon="today" text="No tasks found..." v-else />
            </transition>
          </template>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AddTask from 'components/TheAddTaskForm.vue';
import TasksControls from 'components/TheTasksTopPanel.vue';
import TaskCard from 'components/TaskItem.vue';
import { computed, onMounted } from 'vue';

import { useTasksStore } from 'stores/tasks';
import ErrorBlock from 'components/ui/ErrorBlock.vue';
import Spinner from 'components/ui/LSpinner.vue';
const store = useTasksStore();

const error = computed(() => store.error),
      isLoading = computed(() => store.isLoading),
      tasks = computed(() => store.tasks);

async function loadTasks() {
  await store.loadTasks();
}

onMounted(() => {
  loadTasks();
});

defineOptions({
  name: 'IndexPage',
});
</script>
