<!--<script setup lang="ts">-->

<!--</script>-->

<script>
// import { useQuasar } from 'quasar';
import { ref } from 'vue';

export default {
  setup() {
    // const $q = useQuasar();
    const name = ref(null);
    const date = ref('2019-02-01 12:44')

    return {
      name,
      date,
      orange: ref(true),
      red: ref(false),
      cyan: ref(false),
      onSubmit() {
        // if (accept.value !== true) {
        //   $q.notify({
        //     color: 'red-5',
        //     textColor: 'white',
        //     icon: 'warning',
        //     message: 'You need to accept the license and terms first',
        //   });
        // } else {
        //   $q.notify({
        //     color: 'green-4',
        //     textColor: 'white',
        //     icon: 'cloud_done',
        //     message: 'Submitted',
        //   });
        // }
      },

      onReset() {
        name.value = null;
      },
    };
  },
};
</script>
<template>
  <div class="q-pa-md row items-start">
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h6 q-pb-md">Write your task:</div>
        <q-form @submit="onSubmit" @reset="onReset">
          <q-input
            outlined
            label="Decide what it is you want"
            v-model="name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <div class="text-h6 q-py-xs">Category:</div>
          <div class="q-pb-xs">
            <q-checkbox v-model="orange" label="Life" color="orange" />
            <q-checkbox v-model="red" label="Work" color="red" />
            <q-checkbox v-model="cyan" label="Family" color="cyan" />
          </div>
          <div class="text-h6 q-py-xs">Notice time:</div>
          <div class="q-pb-md">
            <q-input outlined v-model="date">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div>
            <q-btn unelevated rounded label="Add task" type="submit" color="secondary" />
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
  max-width: 40rem
  margin: 2rem auto
</style>
