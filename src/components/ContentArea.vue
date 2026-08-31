<template>
  <main class="workspace" aria-labelledby="page-title">
    <header class="workspace__intro">
      <p class="workspace__eyebrow">マイワークスペース</p>
      <h1 id="page-title">今日のやること</h1>
      <p>頭の中の予定をここに置いて、ひとつずつ片づけましょう。</p>
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
.workspace__eyebrow { margin: 0 0 var(--space-3); color: var(--color-accent-readable); font-size: .72rem; font-weight: 800; letter-spacing: .14em; }
.workspace__intro h1 { margin: 0; color: var(--color-text-strong); font-size: clamp(2.15rem,7vw,4.25rem); font-weight: 760; letter-spacing: -.055em; line-height: 1.04; }
.workspace__intro > p:last-child { max-width: 34rem; margin: var(--space-4) 0 0; color: var(--color-text-muted); font-size: clamp(.95rem,2vw,1.08rem); line-height: 1.7; }
</style>
