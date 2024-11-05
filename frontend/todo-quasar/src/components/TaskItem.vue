<script setup lang="ts">
import { Task } from 'src/services/db';
import { computed, ref } from 'vue';
import { useTasksStore } from 'stores/tasks';
import { errorMessage, successMessage } from 'src/utils/main';
import { useQuasar } from 'quasar';
const store = useTasksStore();
const $q = useQuasar();

interface Props {
  task: Task;
}

const colors: Record<string, string> = {
  life: 'orange',
  work: 'red',
  family: 'cyan',
};

const checked = ref(false);

const error = computed(() => store.error);
const status = computed(() => store.status);

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

defineProps<Props>();
</script>

<template>
  <div class="col-12">
    <q-card flat bordered class="bg-grey-2">
      <q-card-section>
        <div class="task-card-inner">
          <q-checkbox @change="store.addSelectedTask(task.id)"  size="sm" />
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6 flex">{{ task.taskName }}</div>
            </div>
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section>Mark as completed</q-item-section>
                    </q-item>
                    <q-item @click="deleteTask(task.id)" clickable>
                      <q-item-section>Remove Card</q-item-section>
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

<style scoped>
.task-card-inner {
  display: grid;
  grid-template-columns: 50px 1fr 0;
  align-items: center;
}
</style>
