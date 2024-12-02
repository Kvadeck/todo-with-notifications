<script setup lang="ts">
import { errorMessage, nowDateOrTime } from 'src/utils/main';
import { useTasksStore } from 'stores/tasks';
import { useTaskAction } from 'src/composables/useTaskAction';
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { executeTaskAction } = useTaskAction(),
  task_name = ref(''),
  category = ref(['life']),
  date = ref(nowDateOrTime('date')),
  time = ref(nowDateOrTime('time')),
  store = useTasksStore();

function setDateTimeInputsToNow() {
  date.value = nowDateOrTime('date');
  time.value = nowDateOrTime('time');
}

function validateTaskInput(): boolean {
  const selectedDateTime =
    date.value && time.value
      ? new Date(`${date.value}T${time.value}:00`)
      : null;
  const now = new Date();

  if (selectedDateTime && selectedDateTime < now) {
    errorMessage(t('dateInFuture'));
    return false;
  }
  if (!time.value || !date.value) {
    errorMessage(t('dateNotSelected'));
    return false;
  }
  if (!category.value.length) {
    errorMessage(t('selectCategory'));
    return false;
  }
  return true;
}

function onSubmit() {
  if (!validateTaskInput()) return;

  executeTaskAction(
    store.addTask,
    {
      taskName: task_name.value,
      category: JSON.stringify(category.value),
      date: new Date(`${date.value}T${time.value}:00`),
    },
    true,
  );
  onReset();
}

function onReset() {
  task_name.value = '';
  category.value = ['life'];
  setDateTimeInputsToNow();
}
</script>
<template>
  <div class="q-px-sm row items-start">
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h6 q-pb-md">{{ $t('writeYourTask') }}:</div>
        <q-form @submit.prevent="onSubmit" @reset="onReset">
          <q-input
            v-model="task_name"
            outlined
            :label="t('decideWhatItIsYouPlaningToDo')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || t('pleaseInputYourTask'),
            ]"
          />
          <div class="text-h6 q-py-xs">{{ $t('category') }}:</div>
          <div class="q-pb-xs">
            <q-toggle
              v-model="category"
              :label="t('life')"
              color="orange"
              val="life"
            />
            <q-toggle
              v-model="category"
              :label="t('work')"
              color="red"
              val="work"
            />
            <q-toggle
              v-model="category"
              color="cyan"
              :label="t('family')"
              val="family"
            />
          </div>
          <div class="text-h6 q-py-xs">{{ $t('noticeTime') }}:</div>
          <div class="q-pb-md">
            <div class="row">
              <div class="col-6 q-pr-xs">
                <q-input v-model="date" outlined type="date" />
              </div>
              <div class="col-6 q-pl-xs">
                <q-input v-model="time" outlined type="time" />
              </div>
            </div>
          </div>
          <div>
            <q-btn
              unelevated
              rounded
              :label="t('addTask')"
              type="submit"
              color="secondary"
            />
            <q-btn
              class="q-ml-sm"
              :label="t('reset')"
              type="reset"
              color="secondary"
              flat
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
