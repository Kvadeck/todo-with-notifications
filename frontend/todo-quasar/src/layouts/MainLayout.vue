<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar class="text-white">
        <q-toolbar-title class="row justify-center">
          <div class="col-lg-7 col-md-9 col-12 flex justify-between">
            <div class="flex items-center">
              <header-icon />
              <span class="q-px-xs">TO-DO</span>
            </div>
            <div class="flex items-center cursor-pointer q-gutter-md">
              <q-toggle
                v-model="theme"
                checked-icon="fa-regular fa-moon"
                color="blue-grey-10"
                unchecked-icon="fa-regular fa-sun"
              />
              <q-select
                v-model="locale"
                :options="localeOptions"
                dense
                borderless
                emit-value
                map-options
                options-dense
                style="min-width: 40px"
              />
            </div>
          </div>
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
import { useQuasar } from 'quasar';
import { ref, watch } from 'vue';
import { getLocalStorage, setLocalStorage } from 'src/utils/main';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();

const theme = ref(initialTheme());

const localeOptions = ref([
  { value: 'en-US', label: 'EN' },
  { value: 'ru-RU', label: 'RU' },
]);

const { locale } = useI18n({ useScope: 'global' });

watch(theme, () => {
  setLocalStorage('theme', theme.value);
  $q.dark.toggle();
});

function initialTheme() {
  const theme = getLocalStorage('theme', false);
  $q.dark.set(theme);
  return theme;
}

defineOptions({
  name: 'MainLayout',
});
</script>
