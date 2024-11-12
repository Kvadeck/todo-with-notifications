<script setup lang="ts">
import { Task } from 'src/services/db';
import { useTasksStore } from 'stores/tasks';
import { useTaskAction } from 'src/composables/useTaskAction';
import { computed, ref } from 'vue';
import { date } from 'quasar';
const store = useTasksStore();

interface Props {
  task: Task;
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
  });
</script>

<template>
  <div class="col-12" :class="{ blurred: task.completed }">
    <q-card flat bordered>
      <q-card-section>
        <div class="task-card-inner">
          <q-checkbox
            v-model="checked"
            @click="store.addSelectedTask(task.id)"
            size="sm"
          />
          <div class="row items-center no-wrap">
            <div class="col">
              <div
                class="text-h6 flex"
                :class="{ 'text-strike': task.completed }"
              >
                {{ task.taskName }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item
                      clickable
                      @click="executeTaskAction(store.toggleCompleted, task.id)"
                    >
                      <q-item-section>
                        Mark as {{ markedText }}
                      </q-item-section>
                    </q-item>
                    <q-item
                      @click="executeTaskAction(store.deleteTask, task.id)"
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
