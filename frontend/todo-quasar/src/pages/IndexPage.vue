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
          <div class="side-wrapper relative-position full-width" v-if="error">

          </div>
          <div v-else-if="isLoading"
            class="side-wrapper relative-position full-width"
          >
            <q-inner-loading
              :showing="true"
              label="Please wait..."
              label-class="text-teal"
              label-style="font-size: 1.1em"
            />
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
              <div
                class="side-wrapper text-h6 justify-center relative-position"
                v-else
              >
                <q-icon name="today" />
                No tasks found...
              </div>
            </transition>
          </template>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AddTask from 'components/TheAddTask.vue';
import TasksControls from 'components/TheTasksControls.vue';
import TaskCard from 'components/TaskCard.vue';
import { computed, onMounted } from 'vue';

import { useTasksStore } from 'stores/tasks';
const store = useTasksStore();

const error = computed(() => store.error);
const isLoading = computed(() => store.isLoading);
const tasks = computed(() => store.tasks);

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

<style scoped>
.side-wrapper {
  background: rgba(255, 255, 255, 0.6);
  min-height: 200px;
  display: flex;
  justify-content: center;
  flex-flow: column;
  align-items: center;
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
