<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { errorMessage, nowDateOrTime, successMessage } from 'src/utils/main';
const $q = useQuasar();

const task_name = ref(null);
const category = ref(['life']);

const date = ref(nowDateOrTime('date'));
const time = ref(nowDateOrTime('time'));

function onSubmit() {
  if (date.value && time.value) {
    const selectedDateTime = new Date(`${date.value}T${time.value}:00`);
    const now = new Date();

    if (selectedDateTime < now) {
      $q.notify(
        errorMessage('You need to selected date and time is in the future.')
      );
      return;
    }
  }

  if (!category.value.length) {
    $q.notify(errorMessage('You need to select at least one category.'));
  } else if (!time.value || !date.value) {
    $q.notify(errorMessage('Date or time is not selected.'));
  } else {
    $q.notify(successMessage('Yor task added successfully'));

    task_name.value = null;
    date.value = '';
    time.value = '';
  }
}

function onReset() {
  task_name.value = null;
  date.value = nowDateOrTime('date');
  time.value = nowDateOrTime('time');
}
</script>
<template>
  <div class="q-px-sm row items-start">
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h6 q-pb-md">Write your task:</div>
        <q-form @submit="onSubmit" @reset="onReset">
          <q-input
            outlined
            label="Decide what it is you planing to do"
            v-model="task_name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please input your task',
            ]"
          />
          <div class="text-h6 q-py-xs">Category:</div>
          <div class="q-pb-xs">
            <q-checkbox
              v-model="category"
              val="life"
              label="Life"
              color="orange"
            />
            <q-checkbox
              v-model="category"
              val="work"
              label="Work"
              color="red"
            />
            <q-checkbox
              v-model="category"
              val="family"
              label="Family"
              color="cyan"
            />
          </div>
          <div class="text-h6 q-py-xs">Notice time:</div>
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
              label="Add task"
              type="submit"
              color="secondary"
            />
            <q-btn
              label="Reset"
              type="reset"
              color="secondary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="sass" scoped>
.form-card
  width: 100%
</style>
