<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="!!handleCompleteDeleting" title="Deleting complete!" @close="handleDeleting">
      <p>All selected tasks are removed.</p>
    </base-dialog>
    <base-dialog :show="!!handleEmptyTasks" title="Nothing to delete!" @close="handleEmpty">
      <p>Please select task to remove.</p>
    </base-dialog>
    <section>
      <add-task @save-data="saveData"></add-task>
    </section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadTasks(true)">Refresh</base-button>
          <base-button @click="deleteSelectedTasks">Delete selected tasks</base-button>
        </div>

        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>

        <ul v-else-if="hasTasks">
          <task-item @selectTask="selectTask" @removeTask="removeTask" v-for="task in getTasks" :key="task.id"
                     :id="task.id"
                     :taskDescription="task.taskName" :deadline="task.time"
                     :category="task.category" :completed="task.completed"></task-item>
        </ul>
        <h3 v-else>No tasks found.</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import TaskItem from "@/pages/tasks/TaskItem.vue";
import BaseCard from "@/components/ui/BaseCard.vue"
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import AddTask from "@/components/tasks/AddTaskForm.vue";

export default {
  components: {AddTask, BaseDialog, BaseSpinner, BaseButton, TaskItem, BaseCard},
  data() {
    return {
      isLoading: false,
      error: null,
      handleCompleteDeleting: null,
      handleEmptyTasks: null
    }
  },
  computed: {
    getTasks() {
      return this.$store.getters['tasks/tasks'];
    },
    hasTasks() {
      return !this.isLoading && this.$store.getters['tasks/hasTasks'];
    },
    selectedTasks() {
      return this.$store.getters['tasks/getSelectedTasks']
    }
  },
  created() {
    this.loadTasks();
  },
  methods: {
    async saveData(data) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('tasks/addTask', data);
      } catch (error) {
        this.error = error.message
      }
      this.isLoading = false;

    },
    async loadTasks(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('tasks/loadTasks', {
          forceRefresh: refresh
        });
      } catch (error) {
        this.error = error.message
      }
      this.isLoading = false;
    },
    selectTask(id) {
      this.$store.dispatch('tasks/selectTask', id)
    },
    removeTask(id) {
      this.$store.dispatch('tasks/removeTask', id)
    },
    async deleteSelectedTasks() {

      if (this.selectedTasks.length) {
        this.isLoading = true;

        try {
          await this.$store.dispatch('tasks/deleteSelectedTasks');
          await this.loadTasks(true);
        } catch (error) {
          this.error = error.message
        }
        this.handleCompleteDeleting = true
        this.isLoading = false;
      } else {
        return this.handleEmptyTasks = true;
      }

    },
    handleError() {
      this.error = null;
    },
    handleDeleting() {
      this.handleCompleteDeleting = null;
    },
    handleEmpty() {
      this.handleEmptyTasks = null;
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>