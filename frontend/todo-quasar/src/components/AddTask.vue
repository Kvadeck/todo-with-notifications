<!-- Поставить их в один ряд с отступом. -->
<!-- Разделить время и дату на два инпута. -->
<!-- Ставить время по умолчанию или заставлять ставить время принудительно? -->
<!-- Чтобы дата и время были выбраны и дата была в будущем! -->
<!-- Что делать если стоит дата но не стоит время? -->
<!-- С пустым временем нельзя и время должно быть в будущем! -->
<!-- Поставить стартовое время текущем временем! -->

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
const $q = useQuasar();

const task_name = ref(null);
const category = ref(['life']);
const date = ref('2019-02-01');
const time = ref('12:44');

function onSubmit() {
  if (!category.value.length) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to select at least one category',
    });
  } else {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Yor task added successfully',
    });
  }
}

function onReset() {
  task_name.value = null;
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
