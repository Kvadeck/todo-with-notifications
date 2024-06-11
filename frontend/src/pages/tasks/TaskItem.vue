<template>
  <li>
    <div class="item-header">
      <h3 :class="{marked: completed}">{{ taskDescription }}</h3>
      <input :value="id" class="item-checkbox" @change="toggleSelection" type="checkbox">
    </div>

    <h4 :class="{marked: completed}">{{ deadlineFormatted }}</h4>
    <div>
      <base-badge v-for="item in category" :key="item" :type="item" :title="item"></base-badge>
    </div>
    <div class="actions">
      <base-button mode="outline" @click="markTask">
        {{ completed ? 'Unmark as completed' : 'Mark as completed' }}
      </base-button>
    </div>
  </li>
</template>

<script>
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";

export default {
  components: {BaseBadge, BaseButton},
  props: ['id', 'taskDescription', 'deadline', 'category', 'completed'],
  computed: {
    deadlineFormatted() {
      return this.deadline.replace('T', ' ')
    }
  },
  data() {
    return {
      error: null,
    }
  },
  methods: {
    async markTask() {
      try {
        await this.$store.dispatch('tasks/markTask', {
          id: this.id,
          taskDescription: this.taskDescription,
          deadline: this.deadline,
          category: this.category,
          completed: this.completed
        });
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
      }
    },
    toggleSelection(event) {
      if (event.target.checked) {
        this.$emit('selectTask', this.id);
      } else {
        this.$emit('removeTask', this.id);
      }
    }
  }
}
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.marked {
  text-decoration: line-through;
}

.item-checkbox {
  width: 20px;
}

</style>