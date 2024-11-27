<script setup lang="ts">
import { useTasksStore } from 'stores/tasks';
import { computed } from 'vue';
import { deleteMessage, errorMessage } from 'src/utils/main';
import { ErrorMessage } from 'src/models/errorMessage';
import { StatusMessage } from 'src/models/statusMessage';

const store = useTasksStore(),
  selectedTasks = computed(() => store.selectedTasks);

function loadSelectedTasks(): void {
  store.resetSelectedTasks();
  store.loadTasks();
}

function deleteSelectedTasks() {
  store.reset();

  if (!selectedTasks.value.length) {
    errorMessage(ErrorMessage.selectOneTask);
    return;
  }

  store.preDeleteSelectedTasks(selectedTasks.value);

  deleteMessage(StatusMessage.selectedDeleted, loadSelectedTasks, () => {
    store.deleteSelectedTasks(selectedTasks.value);
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
