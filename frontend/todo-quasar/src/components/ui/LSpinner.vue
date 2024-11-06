<script setup lang="ts">
interface Props {
  label?: string;
}

withDefaults(defineProps<Props>(), {
  label: 'Please wait...',
});
</script>

<template>
  <div class="side-wrapper relative-position full-width">
    <q-inner-loading
      :showing="true"
      :label="label"
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>
</template>
>
