<script setup lang="ts">
import { Task } from 'src/services/db';
import { useTasksStore } from 'stores/tasks';
import { useTaskAction } from 'src/composables/useTaskAction';
import { computed, ref } from 'vue';
import { date } from 'quasar';
const store = useTasksStore();

interface Props {
  task: Task;
  currentPage: number;
}
const { executeTaskAction } = useTaskAction(),
  props = defineProps<Props>(),
  colors: Record<string, string> = {
    life: 'orange',
    work: 'red',
    family: 'cyan',
  },
  checked = ref(false),
  markedText = computed(() => {
    return props.task.completed ? 'uncompleted' : 'completed';
  }),
  completedBorder = computed(() =>
    props.task.completed ? 'completed-border' : 'uncompleted-border',
  ),
  isFirstPage = computed(() => {
    return props.currentPage === 1;
  });

function pinTask(task: Task) {
  executeTaskAction(store.pinTask, task);
}
</script>

<template>
  <div class="col-12" :class="{ completed: task.completed }">
    <q-card :class="completedBorder" flat bordered>
      <q-icon
        class="absolute pin-icon"
        v-if="!isFirstPage"
        color="grey-7"
        name="fa-solid fa-thumbtack"
        @click="pinTask(task)"
      >
        <q-tooltip :delay="500" :offset="[0, 10]">Pin to first page</q-tooltip>
      </q-icon>
      <q-card-section>
        <div class="task-card-inner">
          <q-checkbox
            v-model="checked"
            @click="store.addSelectedTask(task.id)"
            size="sm"
          />
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6 flex">
                {{ task.taskName }}
              </div>
            </div>
            <div class="col-auto">
              <div class="flex items-center">
                <q-icon
                  class="handle q-px-sm move-icon"
                  color="grey-7"
                  name="fa fa-bars"
                  size="20px"
                ></q-icon>
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item
                        clickable
                        @click="
                          executeTaskAction(
                            store.toggleCompleted,
                            task.id,
                            true,
                          )
                        "
                      >
                        <q-item-section>
                          Mark as {{ markedText }}
                        </q-item-section>
                      </q-item>
                      <q-item
                        @click="
                          executeTaskAction(store.deleteTask, task.id, true)
                        "
                        clickable
                      >
                        <q-item-section>Remove Task</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <div class="flex items-center justify-between q-px-sm">
        <div class="q-pa-sm q-gutter-sm">
          <q-badge
            v-for="(category, index) in JSON.parse(task.category)"
            :key="index"
            outline
            :color="colors[category]"
            :label="category"
          />
        </div>
        <div class="q-gutter-sm">
          <q-badge
            outline
            color="purple"
            :label="date.formatDate(task.date, 'HH:mm')"
          />
          <q-badge
            outline
            color="primary"
            :label="date.formatDate(task.date, 'DD.MM.YYYY')"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>
