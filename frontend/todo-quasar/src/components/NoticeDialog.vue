<script setup lang="ts">
import { date } from 'quasar';
import { computed, ref } from 'vue';
import { useTasksStore } from 'stores/tasks';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const store = useTasksStore(),
  noticeData = computed(() => store.noticeData),
  isNotice = computed(() => store.isNotice),
  colors = ref<string[]>(['primary', 'orange', 'secondary']),
  labels = computed(() => [t('id'), t('todo'), t('date')]);
</script>

<template>
  <q-dialog v-model="isNotice">
    <div class="notice-wrapper" v-if="noticeData">
      <q-card>
        <q-card-section class="dialog-title-bar text-white">
          <div class="text-h6">{{ $t('taskCompleted') }}</div>
        </q-card-section>
        <q-card-section>
          <q-list bordered separator>
            <q-item v-for="(_, key, index) in noticeData" v-ripple :key="index">
              <q-item-section>
                <div class="row items-center">
                  <div class="col-4 col-md-2">
                    <q-badge outline align="middle" :color="colors[index]">
                      {{ labels[index] }}
                    </q-badge>
                  </div>
                  <div class="col-md">
                    <div class="text-h6">
                      {{
                        key === 'date'
                          ? date.formatDate(noticeData[key], 'DD.MM.YYYY HH:mm')
                          : noticeData[key]
                      }}
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
            :label="$t('close')"
            @click="store.resetIsNotice"
          />
        </div>
      </q-card>
    </div>
  </q-dialog>
</template>
<style scoped>
.notice-wrapper {
  width: 700px;
  max-width: 80vw;
}
</style>
