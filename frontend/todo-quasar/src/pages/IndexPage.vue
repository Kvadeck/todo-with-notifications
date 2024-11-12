<!-- TODO: Задача автоматически ставится выполненной при истечение срока выполнения -->
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

    <q-dialog v-model="isNotice">
      <div v-if="noticeData">
        <q-card>
          <q-card-section>
            <div class="text-h6">
              Task is completed.
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list bordered separator>
              <q-item v-ripple clickable>
                <q-item-section>
                  ID: {{ noticeData.id }}
                </q-item-section>
              </q-item>
              <q-item v-ripple clickable>
                <q-item-section>
                  Name: {{ noticeData.taskName }}
                </q-item-section>
              </q-item>
              <q-item v-ripple clickable>
                <q-item-section
                  >Date:
                  {{
                    date.formatDate(noticeData.date, 'DD.MM.YYYY HH:mm')
                  }}</q-item-section
                >
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              v-close-popup
              @click="store.resetIsNotice"
              flat
              label="OK"
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
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
import { date } from 'quasar';

const store = useTasksStore();

const error = computed(() => store.error),
  isLoading = computed(() => store.isLoading),
  tasksForNotice = computed(() => store.tasksForNotice),
  tasks = computed(() => store.tasks),
  noticeData = computed(() => store.noticeData),
  isNotice = computed(() => store.isNotice),
  timer = ref<null | number>(null);

watch(
  tasks,
  async () => {
    // TODO: В тексте уведомления пишу что такая то задача завершена
    if (timer.value !== null) {
      clearInterval(timer.value);
    }

    if (tasksForNotice.value.length) {
      timer.value = window.setInterval(store.checkNoticeTime, 1000);
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
