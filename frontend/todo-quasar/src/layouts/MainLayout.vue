<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar class="text-white">
        <q-toolbar-title class="row justify-center">
          <div class="col-lg-7 col-md-10 col-12 flex justify-between">
            <div class="flex items-center">
              <header-icon />
              <span class="q-px-xs">TO-DO</span>
            </div>
            <div class="flex items-center q-gutter-md">
              <q-toggle
                v-model="theme"
                checked-icon="fa-regular fa-moon"
                color="blue-grey-10"
                unchecked-icon="fa-regular fa-sun"
              />
              <div class="cursor-pointer" @click="toggleLocale">
                {{ languageLabel }}
              </div>
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
import HeaderIcon from 'components/ui/BaseHeaderIcon.vue';
import { useQuasar } from 'quasar';
import { computed, ref, watch } from 'vue';
import { getLocalStorage, setLocalStorage } from 'src/utils/main';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { locale } = useI18n({ useScope: 'global' });

const theme = ref(getInitialTheme());
const isLanguage = ref(getInitialLanguage());

watch(isLanguage, () => setLocalStorage('language', isLanguage.value));

watch(theme, () => {
  setLocalStorage('theme', theme.value);
  $q.dark.toggle();
});

const languageLabel = computed(() => {
  return isLanguage.value ? 'RU' : 'EN';
});

function toggleLocale() {
  isLanguage.value = !isLanguage.value;
  isLanguage.value ? (locale.value = 'ru-RU') : (locale.value = 'en-EN');
}

function getInitialTheme() {
  const theme = getLocalStorage('theme', false);
  $q.dark.set(theme);
  return theme;
}
function getInitialLanguage() {
  const language = getLocalStorage('language', false);
  language ? (locale.value = 'ru-RU') : (locale.value = 'en-EN');
  return language;
}

defineOptions({
  name: 'MainLayout',
});
</script>
