<script setup lang="ts">
import { useTasksStore } from 'stores/tasks';
const store = useTasksStore();

// function deleteSelectedTasks() {
//   store.reset();
//
//   // store.deleteSelectedTasks().then(() => {
//   //   if (store.error) {
//   //     $q.notify(errorMessage(store.error));
//   //   } else {
//   //     $q.notify(successMessage(store.status));
//   //     store.loadTasks();
//   //   }
//   // });
// }
</script>

<template>
  <q-card flat bordered class="q-mb-sm">
    <q-card-section>
      <div class="flex justify-between q-mb-sm">
        <q-btn
          @click="store.loadTasks"
          outline
          rounded
          label="Refresh"
          color="secondary"
        />
        <q-btn unelevated rounded label="Delete selected" color="secondary" />
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
