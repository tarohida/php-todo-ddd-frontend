<template>
  <div class="todo-workspace">
    <section class="quick-capture" data-testid="quick-capture" aria-label="タスクを追加">
      <form class="quick-capture__form" @submit.prevent="addTask">
          <label for="create-task-input-box" class="visually-hidden">新しいタスク</label>
          <input
            id="create-task-input-box"
            v-model="newTask"
            type="text"
            class="create-task-input-box"
            placeholder="例：資料の下書きを仕上げる"
            aria-label="新しいタスク"
            :disabled="isBusy"
          >
          <button
            class="primary-button add-task-button"
            type="submit"
            data-testid="add-task"
            :disabled="isBusy"
          >追加する</button>
      </form>
    </section>

    <section class="task-panel" aria-labelledby="task-list-title">
      <header class="task-panel__header">
        <h2 id="task-list-title">タスク</h2>
        <p class="task-summary" data-testid="task-summary"><strong>未完了 {{ activeTaskCount }}件</strong><span>完了 {{ completedTaskCount }}件</span></p>
      </header>
      <div class="task-toolbar">
          <div class="task-filters" role="group" aria-label="タスクの表示切り替え">
            <button
              v-for="option in filterOptions"
              :key="option.value"
              type="button"
              class="filter-button"
              :class="{ 'filter-button--active': filter === option.value }"
              :aria-pressed="filter === option.value"
              :data-testid="`filter-${option.value}`"
              @click="filter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
          <button type="button" class="refresh-button" aria-label="タスクを更新" data-testid="refresh-tasks" :disabled="isBusy" @click="refreshTasks">↻</button>
      </div>
          <p v-if="isLoading" class="state-message state-message--loading" role="status" aria-live="polite">タスクを読み込み中です。</p>
          <p v-else-if="errorMessage" class="state-message state-message--error" role="alert">{{ errorMessage }}</p>
          <p
            v-if="successMessage"
            class="state-message state-message--success"
            role="status"
            aria-live="polite"
            data-testid="success-message"
          >
            {{ successMessage }}
          </p>
          <p v-if="!isLoading && !errorMessage && tasks.length === 0" class="empty-state" data-testid="empty-state">
            タスクはありません。
          </p>
          <p
            v-else-if="!isLoading && !errorMessage && filteredTasks.length === 0"
            class="empty-state" data-testid="filtered-empty-state"
          >
            {{ filteredEmptyMessage }}
          </p>

          <ul v-if="filteredTasks.length > 0" class="task-list" role="list">
                <li
                  v-for="task in filteredTasks"
                  :key="task.id"
                  class="todo-list"
                  :class="{ 'todo-list-completed': task.completed, 'todo-list--editing': editingTaskId === task.id }"
                >
                  <div class="task-completion">
                    <input
                      type="checkbox"
                      :checked="task.completed"
                      :aria-label="`${task.title}を${task.completed ? '未完了' : '完了'}にする`"
                      :data-testid="`complete-task-${task.id}`"
                      :disabled="isBusy"
                      @change="requestTaskCompletion(task, $event)"
                    >
                  </div>
                  <div class="task-content">
                    <form
                      v-if="editingTaskId === task.id"
                      class="title-edit-form"
                      :data-testid="`edit-form-${task.id}`"
                      @submit.prevent="saveTitle(task)"
                    >
                      <label :for="`edit-title-${task.id}`" class="visually-hidden">{{ task.title }}のタスク名</label>
                      <input :id="`edit-title-${task.id}`" :ref="`editTitle${task.id}`" v-model="editingTitle" type="text" maxlength="255" :aria-label="`${task.title}のタスク名`" :data-testid="`edit-title-${task.id}`" :disabled="isBusy" @keydown.enter.prevent="saveTitle(task)" @keydown.esc.prevent="cancelTitleEdit">
                      <div class="edit-actions"><button type="submit" class="primary-button compact-button" :data-testid="`save-title-${task.id}`" :disabled="isBusy">保存</button><button type="button" class="quiet-button compact-button" :data-testid="`cancel-title-${task.id}`" :disabled="isBusy" @click="cancelTitleEdit">キャンセル</button></div>
                    </form>
                    <span v-else class="task-title">{{ task.title }}</span>
                  </div>
                  <div class="task-actions">
                    <button
                      type="button"
                      class="icon-button"
                      :aria-label="`${task.title}を編集`"
                      :data-testid="`edit-task-${task.id}`"
                      :disabled="isBusy"
                      @click="startTitleEdit(task)"
                    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" /></svg></button>
                    <button
                      type="button"
                      class="icon-button delete-button"
                      :aria-label="`${task.title}を削除`"
                      :data-testid="`delete-task-${task.id}`"
                      :disabled="isBusy"
                      @click="deleteTask(task.id)"
                    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" /></svg></button>
                  </div>
                </li>
          </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TodoList',
  props: {
    todoApi: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tasks: [],
      newTask: '',
      isLoading: true,
      isMutating: false,
      errorMessage: '',
      successMessage: '',
      isActive: false,
      requestGeneration: 0,
      filter: 'all',
      filterOptions: [
        { value: 'all', label: 'すべて' },
        { value: 'active', label: '未完了' },
        { value: 'completed', label: '完了済み' },
      ],
      editingTaskId: null,
      editingTitle: '',
    }
  },
  computed: {
    isBusy() {
      return this.isLoading || this.isMutating
    },
    activeTaskCount() {
      return this.tasks.filter((task) => !task.completed).length
    },
    completedTaskCount() {
      return this.tasks.filter((task) => task.completed).length
    },
    filteredTasks() {
      if (this.filter === 'active') {
        return this.tasks.filter((task) => !task.completed)
      }
      if (this.filter === 'completed') {
        return this.tasks.filter((task) => task.completed)
      }
      return this.tasks
    },
    filteredEmptyMessage() {
      return this.filter === 'completed'
        ? '完了済みのタスクはありません。'
        : '未完了のタスクはありません。'
    },
  },
  mounted() {
    this.isActive = true
    this.loadTasks()
  },
  beforeUnmount() {
    this.isActive = false
    this.requestGeneration += 1
  },
  methods: {
    errorText(error) {
      return error instanceof Error && error.message
        ? error.message
        : '予期しないエラーが発生しました。'
    },
    requestTaskCompletion(task, event) {
      const completed = event.target.checked
      event.target.checked = task.completed
      this.updateTaskCompletion(task, completed)
    },
    async loadTasks({ preserveSuccess = false } = {}) {
      if (!this.isActive) {
        return false
      }

      const generation = ++this.requestGeneration
      this.isLoading = true
      this.errorMessage = ''
      if (!preserveSuccess) {
        this.successMessage = ''
      }

      try {
        const tasks = await this.todoApi.list()
        if (!this.isActive || generation !== this.requestGeneration) {
          return false
        }
        this.tasks = tasks
        return true
      } catch (error) {
        if (!this.isActive || generation !== this.requestGeneration) {
          return false
        }
        this.errorMessage = this.errorText(error)
        this.successMessage = ''
        return false
      } finally {
        if (this.isActive && generation === this.requestGeneration) {
          this.isLoading = false
        }
      }
    },
    async refreshTasks() {
      if (this.isBusy) {
        return
      }
      await this.loadTasks()
    },
    async addTask() {
      const title = this.newTask.trim()
      if (!title || this.isBusy) {
        return
      }

      this.isMutating = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        await this.todoApi.create(title)
        if (!this.isActive) {
          return
        }
        this.newTask = ''
        this.successMessage = 'タスクを追加しました。'
        await this.loadTasks({ preserveSuccess: true })
      } catch (error) {
        if (this.isActive) {
          this.errorMessage = this.errorText(error)
        }
      } finally {
        if (this.isActive) {
          this.isMutating = false
        }
      }
    },
    async deleteTask(id) {
      if (this.isBusy) {
        return
      }

      this.isMutating = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        await this.todoApi.delete(id)
        if (!this.isActive) {
          return
        }
        this.successMessage = 'タスクを削除しました。'
        await this.loadTasks({ preserveSuccess: true })
      } catch (error) {
        if (this.isActive) {
          this.errorMessage = this.errorText(error)
        }
      } finally {
        if (this.isActive) {
          this.isMutating = false
        }
      }
    },
    async updateTaskCompletion(task, completed) {
      if (this.isBusy || task.completed === completed) {
        return
      }

      this.isMutating = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        await this.todoApi.updateCompleted(task.id, completed)
        if (!this.isActive) {
          return
        }
        this.successMessage = completed
          ? 'タスクを完了にしました。'
          : 'タスクを未完了に戻しました。'
        await this.loadTasks({ preserveSuccess: true })
      } catch (error) {
        if (this.isActive) {
          this.errorMessage = this.errorText(error)
        }
      } finally {
        if (this.isActive) {
          this.isMutating = false
        }
      }
    },
    async startTitleEdit(task) {
      if (this.isBusy) {
        return
      }
      this.editingTaskId = task.id
      this.editingTitle = task.title
      this.errorMessage = ''
      this.successMessage = ''
      await this.$nextTick()
      const inputRef = this.$refs[`editTitle${task.id}`]
      const input = Array.isArray(inputRef) ? inputRef[0] : inputRef
      input?.focus()
    },
    cancelTitleEdit() {
      if (this.isBusy) {
        return
      }
      this.editingTaskId = null
      this.editingTitle = ''
      this.errorMessage = ''
    },
    async saveTitle(task) {
      if (this.isBusy || this.editingTaskId !== task.id) {
        return
      }
      const title = this.editingTitle.trim()
      if (!title) {
        this.errorMessage = 'タスク名を入力してください。'
        return
      }

      this.isMutating = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        await this.todoApi.updateTitle(task.id, title)
        if (!this.isActive) {
          return
        }
        this.successMessage = 'タスク名を変更しました。'
        const refreshed = await this.loadTasks({ preserveSuccess: true })
        if (refreshed && this.isActive) {
          this.editingTaskId = null
          this.editingTitle = ''
        }
      } catch (error) {
        if (this.isActive) {
          this.errorMessage = this.errorText(error)
        }
      } finally {
        if (this.isActive) {
          this.isMutating = false
        }
      }
    },
  },
}
</script>

<style scoped>
.todo-workspace { display: grid; gap: var(--space-6); }
.quick-capture, .task-panel { border: 1px solid var(--color-border-subtle); border-radius: 1.35rem; background: var(--color-surface); box-shadow: var(--shadow-card); }
.quick-capture { padding: clamp(1.25rem,4vw,2rem); }
.task-panel__header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); }
.task-panel__header h2 { margin: 0; color: var(--color-text-strong); font-size: clamp(1.15rem,3vw,1.45rem); letter-spacing: -.025em; }
.quick-capture__form { display: grid; grid-template-columns: 1fr auto; gap: var(--space-3); }
.create-task-input-box, .title-edit-form input { width: 100%; min-width: 0; border: 1px solid var(--color-border); border-radius: .8rem; background: var(--color-surface-raised); color: var(--color-text-strong); }
.create-task-input-box { min-height: 3.25rem; padding: .75rem 1rem; }
.create-task-input-box::placeholder { color: var(--color-text-muted); }
.primary-button, .quiet-button, .filter-button, .refresh-button, .icon-button { border: 0; border-radius: .75rem; font-weight: 700; transition: background-color .16s ease, color .16s ease, transform .16s ease; }
.primary-button { padding: .75rem 1.15rem; background: var(--color-accent); color: white; }
.primary-button:hover:not(:disabled) { background: var(--color-accent-hover); transform: translateY(-1px); }
.task-panel { overflow: hidden; }
.task-panel__header { padding: clamp(1.25rem,4vw,2rem) clamp(1.25rem,4vw,2rem) var(--space-4); }
.task-summary { display: flex; gap: var(--space-3); margin: .15rem 0 0; color: var(--color-text-muted); font-size: .8rem; }
.task-summary strong { color: var(--color-text-strong); }
.task-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: 0 clamp(1.25rem,4vw,2rem) var(--space-5); border-bottom: 1px solid var(--color-border-subtle); }
.task-filters { display: flex; gap: var(--space-1); padding: .25rem; border-radius: .8rem; background: var(--color-canvas); }
.filter-button { padding: .5rem .75rem; background: transparent; color: var(--color-text-muted); font-size: .78rem; }
.filter-button--active { background: var(--color-surface); color: var(--color-accent-readable); box-shadow: var(--shadow-soft); }
.refresh-button { padding: .5rem .7rem; background: transparent; color: var(--color-text-muted); }
.refresh-button:hover:not(:disabled), .icon-button:hover:not(:disabled) { background: var(--color-accent-soft); color: var(--color-accent-readable); }
.task-list { margin: 0; padding: 0; list-style: none; }
.todo-list { display: grid; grid-template-columns: auto minmax(0,1fr) auto; gap: var(--space-4); min-height: 4.6rem; padding: 1rem clamp(1.25rem,4vw,2rem); align-items: center; border-bottom: 1px solid var(--color-border-subtle); transition: background-color .16s ease; }
.todo-list:last-child { border-bottom: 0; }
.todo-list:hover, .todo-list--editing { background: var(--color-surface-raised); }
.task-completion input { width: 1.25rem; height: 1.25rem; margin: 0; accent-color: var(--color-accent); }
.task-title { display: block; overflow-wrap: anywhere; color: var(--color-text-strong); line-height: 1.55; }
.todo-list-completed .task-title { color: var(--color-text-muted); text-decoration: line-through; text-decoration-thickness: 1.5px; }
.todo-list-completed { background-image: linear-gradient(90deg,var(--color-success-soft),transparent 34%); }
.task-actions { display: flex; gap: var(--space-1); }
.icon-button { display: grid; width: 2.5rem; height: 2.5rem; padding: 0; place-items: center; background: transparent; color: var(--color-text-muted); }
.icon-button svg { width: 1.15rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8; }
.delete-button:hover:not(:disabled) { background: var(--color-danger-soft); color: var(--color-danger); }
.title-edit-form { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: var(--space-2); }
.title-edit-form input { min-height: 2.6rem; padding: .55rem .7rem; }
.edit-actions { display: flex; gap: var(--space-2); }
.compact-button { padding: .55rem .75rem; font-size: .78rem; }
.quiet-button { border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); }
.state-message { margin: var(--space-4) clamp(1.25rem,4vw,2rem); padding: .85rem 1rem; border-radius: .8rem; font-size: .9rem; }
.state-message--loading { background: var(--color-accent-soft); color: var(--color-accent-readable); }
.state-message--error { background: var(--color-danger-soft); color: var(--color-danger); }
.state-message--success { background: var(--color-success-soft); color: var(--color-success); }
.empty-state { display: grid; gap: var(--space-2); margin: 0; padding: clamp(2.5rem,8vw,4.5rem) 1.5rem; color: var(--color-text-muted); text-align: center; }
@media (max-width: 38rem) {
  .quick-capture__form { grid-template-columns: 1fr; }
  .add-task-button { width: 100%; }
  .task-panel__header { display: grid; }
  .task-summary { justify-content: flex-start; }
  .task-toolbar { align-items: stretch; }
  .task-filters { flex: 1; }
  .filter-button { flex: 1; padding-inline: .45rem; }
  .todo-list { grid-template-columns: auto minmax(0,1fr); gap: var(--space-3); }
  .task-actions { grid-column: 2; }
  .title-edit-form { grid-template-columns: 1fr; }
}
</style>
