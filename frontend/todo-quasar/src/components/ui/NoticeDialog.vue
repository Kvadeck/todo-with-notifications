<script setup lang="ts">
import { date } from 'quasar';
import { computed } from 'vue';
import { useTasksStore } from 'stores/tasks';

const store = useTasksStore(),
  noticeData = computed(() => store.noticeData),
  isNotice = computed(() => store.isNotice);
</script>

<template>
  <q-dialog v-model="isNotice">
    <div v-if="noticeData" style="width: 700px; max-width: 80vw">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Completed</div>
        </q-card-section>
        <q-card-section>
          <q-list bordered separator>
            <q-item v-ripple>
              <q-item-section>
                <div class="row items-center">
                  <div class="col-4 col-md-2">
                    <q-badge outline align="middle" color="primary">ID</q-badge>
                  </div>
                  <div class="col-md">
                    <div class="text-h6">{{ noticeData.id }}</div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item v-ripple>
              <q-item-section>
                <div class="row items-center">
                  <div class="col-4 col-md-2">
                    <q-badge outline align="middle" color="orange"
                      >TODO</q-badge
                    >
                  </div>
                  <div class="col-md">
                    <div class="text-h6">{{ noticeData.taskName }}</div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item v-ripple>
              <q-item-section>
                <div class="row items-center">
                  <div class="col-4 col-md-2">
                    <q-badge outline align="middle" color="secondary"
                      >DATE</q-badge
                    >
                  </div>
                  <div class="col-md">
                    <div class="text-h6">
                      {{ date.formatDate(noticeData.date, 'DD.MM.YYYY HH:mm') }}
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <div class="q-px-md q-pb-md flex justify-end">
          <q-btn
            class="q-px-lg"
            v-close-popup
            size="md"
            outline
            color="secondary"
            label="Close"
            @click="store.resetIsNotice"
          />
        </div>
      </q-card>
    </div>
  </q-dialog>
</template>
