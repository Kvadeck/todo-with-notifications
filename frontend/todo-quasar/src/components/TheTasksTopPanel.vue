<script setup lang="ts">
import { useTasksStore } from 'stores/tasks';
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { errorMessage } from 'src/utils/main';
import { ErrorMessage } from 'src/models/errorMessage';
import { useTaskAction } from 'src/composables/useTaskAction';

const store = useTasksStore(),
  { executeTaskAction } = useTaskAction(),
  $q = useQuasar(),
  selected = computed(() => store.selectedTasks);

function deleteSelectedTasks() {
  store.reset();

  if (!selected.value.length) {
    $q.notify(errorMessage(ErrorMessage.selectOneTask));
    return;
  }
  executeTaskAction(store.deleteSelectedTasks, selected.value);
  store.resetSelectedTasks();
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
