<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="text-white">
        <q-toolbar-title class="row justify-center">
          <div class="col-lg-7 col-md-9 col-12 flex justify-between">
            <div class="flex items-center">
              <header-icon />
              <span class="q-px-xs">To-Do</span>
            </div>
            <div>
              <q-toggle
                v-model="theme"
                checked-icon="fa-regular fa-moon"
                color="blue-grey-10"
                unchecked-icon="fa-regular fa-sun"
              />
              <q-toggle
                v-model="language"
                color="cyan"
                label="EN"
              />
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import HeaderIcon from 'components/ui/HeaderIcon.vue';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const $q = useQuasar();

const theme = ref(false);
const language = ref(false);

console.log($q.dark.isActive);

defineOptions({
  name: 'MainLayout',
});
</script>
