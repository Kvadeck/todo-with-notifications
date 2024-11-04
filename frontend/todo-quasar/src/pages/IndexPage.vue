<!-- Добавить пагинацию -->
<!-- Добавить возможность передвигать карточки задач -->
<!-- Добавить возможность темный темы -->
<!-- Добавить интернационализацию -->

<template>
  <q-page>
    <div class="row justify-center q-pt-lg">
      <div class="col-12 col-sm-5 col-md-4 col-lg-3">
        <add-task />
      </div>
      <div class="col-12 col-sm-7 col-md-7 col-lg-6">
        <div class="q-px-sm q-mt-md q-mt-sm-none">
          <tasks-controls />
          <div class="row q-col-gutter-sm">
            <task-card/>
            <task-card/>
            <task-card/>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AddTask from 'components/TheAddTask.vue';
import TasksControls from 'components/TheTasksControls.vue';
import TaskCard from 'components/TaskCard.vue';
import {useTasksStore} from 'stores/tasks';

// Get all tasks from IndexDB
const store = useTasksStore();

defineOptions({
  name: 'IndexPage',
});
</script>
