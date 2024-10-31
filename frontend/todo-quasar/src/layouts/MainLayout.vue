<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-purple text-white">
        <q-toolbar-title class="flex justify-center">
          <header-icon />
          <span class="q-px-xs">To-Do</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import HeaderIcon from 'components/ui/HeaderIcon.vue';

defineOptions({
  name: 'MainLayout',
});
</script>
