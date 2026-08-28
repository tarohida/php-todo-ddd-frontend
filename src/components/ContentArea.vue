<template>
  <div class="vue-todo-app-content-area">
    <TodoListWithOutBackend
        v-if="backendUrlIsEmpty"
    >
    </TodoListWithOutBackend>
    <TodoList
        v-else
        :todo-api="todoApi"
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
      'backendUrl',
      'todoApi'
  ],
  computed: {
    backendUrlIsEmpty: function () {
      return !this.backendUrl?.trim();
    }
  }
}
</script>

<style scoped>
.vue-todo-app-content-area {
  padding: 2em;
}
</style>
