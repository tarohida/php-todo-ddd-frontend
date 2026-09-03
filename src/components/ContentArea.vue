<template>
  <main class="workspace" aria-labelledby="page-title">
    <header class="workspace__intro">
      <h1 id="page-title">今日のやること</h1>
    </header>
    <TodoListWithOutBackend v-if="backendUrlIsEmpty" />
    <TodoList v-else :todo-api="todoApi" />
  </main>
</template>
<script>
import TodoList from './TodoList.vue'
import TodoListWithOutBackend from './TodoListWithOutBackend.vue'
export default { name: 'ContentArea', components: { TodoListWithOutBackend, TodoList }, props: ['backendUrl', 'todoApi'], computed: { backendUrlIsEmpty() { return !this.backendUrl?.trim() } } }
</script>
<style scoped>
.workspace { width: min(100% - 2rem, var(--workspace-width)); margin-inline: auto; padding-block: clamp(2.5rem,7vw,5.5rem) 6rem; }
.workspace__intro { margin-bottom: clamp(2rem,5vw,3.5rem); }
.workspace__intro h1 { margin: 0; color: var(--color-text-strong); font-size: clamp(2.15rem,7vw,4.25rem); font-weight: 760; letter-spacing: -.055em; line-height: 1.04; }
</style>
