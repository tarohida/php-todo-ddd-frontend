<template>
  <main class="workspace" aria-labelledby="page-title">
    <header class="workspace__intro">
      <h1 id="page-title">今日のやること</h1>
    </header>
    <section
      v-if="apiConfigurationMissing"
      class="configuration-error"
      data-testid="api-configuration-error"
      role="alert"
      aria-labelledby="api-configuration-error-title"
    >
      <span class="configuration-error__mark" aria-hidden="true">!</span>
      <div>
        <h2 id="api-configuration-error-title">API URLが設定されていません</h2>
        <p>
          ブラウザから到達できるAPI URLを
          <code>VITE_BACKEND_URL</code> として <code>.env.local</code> に設定し、
          READMEの起動コマンドでフロントエンドコンテナを再作成してください。
        </p>
      </div>
    </section>
    <TodoList v-else :todo-api="todoApi" />
  </main>
</template>
<script>
import TodoList from './TodoList.vue'

export default {
  name: 'ContentArea',
  components: { TodoList },
  props: {
    backendUrl: {
      type: String,
      default: '',
    },
    todoApi: {
      type: Object,
      default: null,
    },
  },
  computed: {
    apiConfigurationMissing() {
      return !this.backendUrl.trim()
    },
  },
}
</script>
<style scoped>
.workspace { width: min(100% - 2rem, var(--workspace-width)); margin-inline: auto; padding-block: clamp(2.5rem,7vw,5.5rem) 6rem; }
.workspace__intro { margin-bottom: clamp(2rem,5vw,3.5rem); }
.workspace__intro h1 { margin: 0; color: var(--color-text-strong); font-size: clamp(2.15rem,7vw,4.25rem); font-weight: 760; letter-spacing: -.055em; line-height: 1.04; }
.configuration-error { display: grid; grid-template-columns: auto minmax(0,1fr); gap: var(--space-4); padding: clamp(1.25rem,4vw,2rem); border: 1px solid var(--color-danger); border-radius: 1.35rem; background: var(--color-danger-soft); box-shadow: var(--shadow-card); }
.configuration-error__mark { display: grid; width: 2rem; height: 2rem; border-radius: 50%; place-items: center; background: var(--color-danger); color: var(--color-surface); font-weight: 800; }
.configuration-error h2 { margin: .15rem 0 0; color: var(--color-text-strong); font-size: clamp(1.15rem,3vw,1.45rem); letter-spacing: -.025em; }
.configuration-error p { margin: var(--space-3) 0 0; color: var(--color-text); line-height: 1.7; }
.configuration-error code { padding: .1em .35em; border-radius: .35rem; background: var(--color-surface); color: var(--color-danger); font: inherit; font-weight: 700; overflow-wrap: anywhere; }
</style>
