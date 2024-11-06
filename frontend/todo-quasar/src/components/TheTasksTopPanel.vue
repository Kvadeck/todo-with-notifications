<script setup lang="ts">
import { useTasksStore } from 'stores/tasks';
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { errorMessage, successMessage } from 'src/utils/main';

const store = useTasksStore();
const $q = useQuasar();

const error = computed(() => store.error);
const status = computed(() => store.status);
const selected = computed(() => store.selectedTasks);

function deleteSelectedTasks() {
  store.reset();

  if (!selected.value.length) {
    $q.notify(errorMessage('You need to select at least one task.'));
    return;
  }

  store.deleteSelectedTasks(selected.value).then(() => {
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
  <q-card class="q-mb-sm" flat bordered>
    <q-card-section>
      <div class="flex justify-between q-mb-sm">
        <q-btn
          @click="store.loadTasks"
          outline
          rounded
          label="Refresh"
          color="secondary"
        />
        <q-btn
          unelevated
          @click="deleteSelectedTasks"
          rounded
          label="Delete selected"
          color="secondary"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
