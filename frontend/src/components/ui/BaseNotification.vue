<template>
  <div v-if="show" class="notification-popup">
    <p>{{ notification }}</p>
    <button @click="close">Close</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      notification: {}
    };
  },
  mounted() {
    this.$socket.on('notification', (data) => {
      this.notification = data;
      this.show = true;
    });
  },
  beforeUnmount() {
    this.$socket.off('notification');
  },
  methods: {
    close() {
      this.show = false;
    }
  }
};
</script>

<style scoped>
.notification-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
}
</style>