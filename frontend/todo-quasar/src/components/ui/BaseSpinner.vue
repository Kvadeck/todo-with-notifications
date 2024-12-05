<script setup lang="ts">
interface Props {
  label?: string;
}
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps<Props>();
</script>

<template>
  <div class="side-wrapper relative-position full-width">
    <q-inner-loading
      :showing="true"
      :label="t('pleaseWait')"
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>
</template>
>
