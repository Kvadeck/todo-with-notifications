<template>
  <q-page>
    <div class="row justify-center q-pt-lg">
      <div class="col-12 col-sm-5 col-md-4 col-lg-3">
        <add-task />
      </div>
      <div class="col-12 col-sm-7 col-md-7 col-lg-4">
        <tasks-card />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AddTask from 'components/TheAddTask.vue';
import TasksCard from 'components/TheTasksCard.vue';

defineOptions({
  name: 'IndexPage',
});
</script>
