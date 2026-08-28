<template>
  <div class="vue-todo-app-content-area">
    <TodoListWithOutBackend
        v-if="backendUrlIsEmpty"
    >
    </TodoListWithOutBackend>
    <TodoList
        v-else
        v-bind:backend-url="backendUrl"
    ></TodoList>
  </div>
</template>

<script>
import TodoList from "./TodoList.vue";
import TodoListWithOutBackend from "./TodoListWithOutBackend.vue";
export default {
  name: "ContentArea",
  components: {
    TodoListWithOutBackend,
    TodoList
  },
  props: [
      'backendUrl'
  ],
  computed: {
    backendUrlIsEmpty: function () {
      return !this.backendUrl;
    }
  }
}
</script>

<style scoped>
.vue-todo-app-content-area {
  padding: 2em;
}
</style>
