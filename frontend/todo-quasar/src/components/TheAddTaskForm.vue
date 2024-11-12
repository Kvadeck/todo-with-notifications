<script setup lang="ts">
import { errorMessage, nowDateOrTime } from 'src/utils/main';
import { useTasksStore } from 'stores/tasks';
import { useTaskAction } from 'src/composables/useTaskAction';
import { ref } from 'vue';
import { ErrorMessage } from 'src/models/errorMessage';

const { executeTaskAction } = useTaskAction(),
  task_name = ref(''),
  category = ref(['life']),
  date = ref(nowDateOrTime('date')),
  time = ref(nowDateOrTime('time')),
  store = useTasksStore();

function onSubmit() {
  const selectedDateTime =
      date.value && time.value
        ? new Date(`${date.value}T${time.value}:00`)
        : null,
    now = new Date();

  if (selectedDateTime && selectedDateTime < now) {
    errorMessage(ErrorMessage.dateInFuture);
    return;
  }

  if (!time.value || !date.value) {
    errorMessage(ErrorMessage.dateNotSelected);
    return;
  }

  if (!category.value.length) {
    errorMessage(ErrorMessage.selectCategory);
    return;
  }

  executeTaskAction(store.addTask, {
    taskName: task_name.value,
    category: JSON.stringify(category.value),
    date: new Date(`${date.value}T${time.value}:00`),
  });

  task_name.value = '';
  date.value = '';
  time.value = '';
}

function onReset() {
  task_name.value = '';
  category.value = ['life'];
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
            v-model="task_name"
            outlined
            label="Decide what it is you planing to do"
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
              class="q-ml-sm"
              label="Reset"
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
