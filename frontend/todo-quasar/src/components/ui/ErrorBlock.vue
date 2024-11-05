<script setup lang="ts">
interface Props {
  text: string;
  icon: string;
}
defineProps<Props>();
</script>

<template>
  <div class="side-wrapper text-h6 justify-center relative-position">
    <q-icon :name="icon" />
    {{ text }}
  </div>
</template>
