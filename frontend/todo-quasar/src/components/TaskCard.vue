<script setup lang="ts">
import { Task } from 'src/services/db';
import { ref } from 'vue';

interface Props {
  task: Task;
}

const colors: Record<string, string> = {
  life: 'orange',
  work: 'red',
  family: 'cyan',
};

const completed = ref(false);

// const emit = defineEmits<{
//   (e: 'setId', id: number): void
// }>()

defineProps<Props>();
</script>

<template>
  <div class="col-12">
    <q-card flat bordered class="bg-grey-2">
      <q-card-section>
          <div class="task-card-inner">
              <q-checkbox size="sm" v-model="completed" />
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
                                  <q-item clickable>
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
