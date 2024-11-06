<script setup lang="ts">
import { useTasksStore } from 'stores/tasks';
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { errorMessage, successMessage } from 'src/utils/main';
import { ErrorMessage } from 'src/models/errorMessage';

const store = useTasksStore(),
  $q = useQuasar(),
  error = computed(() => store.error),
  status = computed(() => store.status),
  selected = computed(() => store.selectedTasks);

function deleteSelectedTasks() {
  store.reset();

  if (!selected.value.length) {
    $q.notify(errorMessage(ErrorMessage.selectOneTask));
    return;
  }

  store.deleteSelectedTasks(selected.value).then(() => {
    if (error.value) {
      $q.notify(errorMessage(error.value));
    } else {
      $q.notify(successMessage(status.value));

      // Reset selected tasks array after deletion
      store.resetSelectedTasks();
      store.loadTasks();
    }
  });
}

function refreshTasks() {
  store.reset();
  store.loadTasks();
}
</script>

<template>
  <q-card class="q-mb-sm" flat bordered>
    <q-card-section>
      <div class="flex justify-between q-mb-sm">
        <q-btn
          @click="refreshTasks"
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
