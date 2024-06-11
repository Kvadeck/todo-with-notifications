<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">
          <header-icon></header-icon>
          <span>To-Do List</span>
        </router-link>
      </h1>
    </nav>
  </header>
</template>

<script>

import HeaderIcon from "@/components/ui/HeaderIcon.vue";

export default {
  components: {
    HeaderIcon
  },
}
</script>

<style scoped>
header {
  width: 100%;
  height: 4rem;
  background-color: #ff412f;
  display: flex;
  justify-content: center;
  align-items: center;
}

header a {
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
}

header a span {
  display: inline-block;
  padding: 0 5px;
}

h1 {
  margin: 0;
  display: flex;
  align-items: center;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>