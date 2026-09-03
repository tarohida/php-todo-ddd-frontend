<template>
  <div class="offline-workspace">
    <section class="offline-capture" aria-labelledby="offline-capture-title">
      <h2 id="offline-capture-title">タスクを追加</h2>
      <p class="offline-note">API未接続のため、この画面を閉じると内容は消去されます。</p>
      <form class="offline-form" @submit.prevent="addTask"><label class="visually-hidden" for="offline-task-input">新しいタスク</label><input id="offline-task-input" v-model="newTask" type="text" placeholder="例：読みたい本をメモする"><button type="submit">追加する</button></form>
    </section>
    <section class="offline-list-panel" aria-labelledby="offline-list-title">
      <header><h2 id="offline-list-title">タスク</h2><span>{{ tasks.length }}件</span></header>
      <p v-if="tasks.length === 0" class="offline-empty">タスクはありません。</p>
      <ul v-else role="list"><li v-for="(task, index) in tasks" :key="`${task}-${index}`"><span>{{ task }}</span><button type="button" :aria-label="`${task}を削除`" @click="deleteTask(index)">削除</button></li></ul>
    </section>
  </div>
</template>
<script>
export default { name: 'TodoListWithOutBackend', data() { return { tasks: [], newTask: '' } }, methods: { addTask() { const value = this.newTask && this.newTask.trim(); if (!value) return; this.tasks.push(value); this.newTask = '' }, deleteTask(index) { this.tasks.splice(index, 1) } } }
</script>
<style scoped>
.offline-workspace { display: grid; gap: var(--space-6); }
.offline-capture, .offline-list-panel { padding: clamp(1.25rem,4vw,2rem); border: 1px solid var(--color-border-subtle); border-radius: 1.35rem; background: var(--color-surface); box-shadow: var(--shadow-card); }
h2 { margin: 0; color: var(--color-text-strong); font-size: 1.35rem; }
.offline-note { margin: var(--space-3) 0 0; color: var(--color-text-muted); font-size: .85rem; }
.offline-form { display: grid; grid-template-columns: 1fr auto; gap: var(--space-3); margin-top: var(--space-5); }
.offline-form input { min-width: 0; min-height: 3.25rem; padding: .75rem 1rem; border: 1px solid var(--color-border); border-radius: .8rem; background: var(--color-surface-raised); }
.offline-form button { border: 0; border-radius: .75rem; padding: .75rem 1.15rem; background: var(--color-accent); color: white; font-weight: 700; transition: background-color .16s ease, transform .16s ease; }
.offline-form button:hover { background: var(--color-accent-hover); transform: translateY(-1px); }
.offline-list-panel header { display: flex; justify-content: space-between; align-items: start; }
.offline-list-panel header > span, .offline-empty { color: var(--color-text-muted); }
.offline-empty { margin: var(--space-5) 0 0; padding: 2.5rem; text-align: center; }
ul { margin: var(--space-5) calc(clamp(1.25rem,4vw,2rem) * -1) calc(clamp(1.25rem,4vw,2rem) * -1); padding: 0; list-style: none; }
li { display: flex; min-height: 4rem; padding: 1rem clamp(1.25rem,4vw,2rem); align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--color-border-subtle); }
li button { border: 0; border-radius: .6rem; padding: .5rem .65rem; background: transparent; color: var(--color-danger); font-weight: 700; }
@media (max-width: 38rem) { .offline-form { grid-template-columns: 1fr; } }
</style>
