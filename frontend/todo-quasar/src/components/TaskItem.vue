<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Task } from 'src/services/db';
import { errorMessage, successMessage } from 'src/utils/main';
import { useTasksStore } from 'stores/tasks';
import { computed, ref } from 'vue';
const store = useTasksStore();
const $q = useQuasar();

interface Props {
  task: Task;
}

const props = defineProps<Props>(),
  colors: Record<string, string> = {
    life: 'orange',
    work: 'red',
    family: 'cyan',
  },
  checked = ref(false),
  error = computed(() => store.error),
  status = computed(() => store.status),
  markedText = computed(() => {
    return props.task.completed ? 'uncompleted' : 'completed';
  });

function deleteTask(id: number | undefined) {
  store.reset();
  store.deleteTask(id).then(() => {
    if (error.value) {
      $q.notify(errorMessage(error.value));
    } else {
      $q.notify(successMessage(status.value));
      store.loadTasks();
    }
  });
}

function toggleCompleted(id: number | undefined) {
  store.reset();
  store.toggleCompleted(id).then(() => {
    if (error.value) {
      $q.notify(errorMessage(error.value));
    } else {
      $q.notify(successMessage(status.value));
      store.loadTasks();
    }
  });
}
</script>

<template>
  <div class="col-12" :class="{ blurred: task.completed }">
    <q-card class="bg-grey-2" flat bordered>
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
                    <q-item clickable @click="toggleCompleted(task.id)">
                      <q-item-section>
                        Mark as {{ markedText }}
                      </q-item-section>
                    </q-item>
                    <q-item @click="deleteTask(task.id)" clickable>
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
      <div class="q-pa-sm q-gutter-sm">
        <q-badge
          v-for="category in JSON.parse(task.category)"
          :key="category"
          outline
          :color="colors[category]"
          :label="category"
        />
      </div>
    </q-card>
  </div>
</template>
