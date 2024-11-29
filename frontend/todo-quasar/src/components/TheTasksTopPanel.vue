<script setup lang="ts">
import { useTasksStore } from 'stores/tasks';
import { computed } from 'vue';
import { deleteMessage, errorMessage } from 'src/utils/main';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const store = useTasksStore(),
  selectedTasks = computed(() => store.selectedTasks);

function loadSelectedTasks(): void {
  store.resetSelectedTasks();
  store.loadTasks();
}

function deleteSelectedTasks() {
  store.reset();
  if (!selectedTasks.value.length) {
    errorMessage(t('selectOneTask'));
    return;
  }

  store.preDeleteSelectedTasks(selectedTasks.value);
  deleteMessage(t('selectedDeleted'), loadSelectedTasks, () => {
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
          :label="$t('refresh')"
          color="secondary"
        />
        <q-btn
          unelevated
          @click="deleteSelectedTasks"
          rounded
          :label="$t('deleteSelected')"
          color="secondary"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
