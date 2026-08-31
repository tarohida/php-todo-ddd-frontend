<template>
  <div class="container">
    <div class="col-md-12 col-12 col-sm-12">
      <div class="card">
        <form class="card-header" @submit.prevent="addTask">
          <label for="create-task-input-box" class="create-task-input-box-label" aria-hidden="true">&gt;</label>
          <input
            id="create-task-input-box"
            v-model="newTask"
            type="text"
            class="custom-control-input create-task-input-box"
            placeholder="What needs to be done?"
            aria-label="新しいタスク"
            :disabled="isBusy"
          >
          <button
            class="btn btn-primary add-task-button"
            type="submit"
            data-testid="add-task"
            :disabled="isBusy"
          >
            追加
          </button>
        </form>

        <div class="card-body">
          <div class="d-flex justify-content-end mb-3">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-testid="refresh-tasks"
              :disabled="isBusy"
              @click="refreshTasks"
            >
              一覧を更新
            </button>
          </div>
          <div class="task-filters mb-3" role="group" aria-label="タスクの表示切り替え">
            <button
              v-for="option in filterOptions"
              :key="option.value"
              type="button"
              class="btn btn-sm btn-outline-secondary"
              :class="{ active: filter === option.value }"
              :aria-pressed="filter === option.value"
              :data-testid="`filter-${option.value}`"
              @click="filter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
          <p v-if="isLoading" role="status" aria-live="polite">タスクを読み込み中です。</p>
          <p v-else-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>
          <p
            v-if="successMessage"
            class="alert alert-success"
            role="status"
            aria-live="polite"
            data-testid="success-message"
          >
            {{ successMessage }}
          </p>
          <p v-if="!isLoading && !errorMessage && tasks.length === 0" data-testid="empty-state">
            タスクはありません。
          </p>
          <p
            v-else-if="!isLoading && !errorMessage && filteredTasks.length === 0"
            data-testid="filtered-empty-state"
          >
            {{ filteredEmptyMessage }}
          </p>

          <div v-if="filteredTasks.length > 0" class="table-responsive">
            <table class="table table-hover">
              <caption class="visually-hidden">Todoタスク一覧</caption>
              <tbody>
                <tr
                  v-for="task in filteredTasks"
                  :key="task.id"
                  class="todo-list"
                  :class="{ 'todo-list-completed': task.completed }"
                >
                  <td class="p-1 text-center">
                    <input
                      type="checkbox"
                      :checked="task.completed"
                      :aria-label="`${task.title}を${task.completed ? '未完了' : '完了'}にする`"
                      :data-testid="`complete-task-${task.id}`"
                      :disabled="isBusy"
                      @change="requestTaskCompletion(task, $event)"
                    >
                  </td>
                  <td class="p-1 text-center">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      :aria-label="`${task.title}を編集`"
                      :data-testid="`edit-task-${task.id}`"
                      :disabled="isBusy"
                      @click="startTitleEdit(task)"
                    >編集</button>
                  </td>
                  <td class="p-1 text-center">
                    <button
                      type="button"
                      class="delete-button"
                      :aria-label="`${task.title}を削除`"
                      :data-testid="`delete-task-${task.id}`"
                      :disabled="isBusy"
                      @click="deleteTask(task.id)"
                    >&times;</button>
                  </td>
                  <td>
                    <form
                      v-if="editingTaskId === task.id"
                      class="title-edit-form"
                      :data-testid="`edit-form-${task.id}`"
                      @submit.prevent="saveTitle(task)"
                    >
                      <label :for="`edit-title-${task.id}`" class="visually-hidden">
                        {{ task.title }}のタスク名
                      </label>
                      <input
                        :id="`edit-title-${task.id}`"
                        :ref="`editTitle${task.id}`"
                        v-model="editingTitle"
                        type="text"
                        maxlength="255"
                        :aria-label="`${task.title}のタスク名`"
                        :data-testid="`edit-title-${task.id}`"
                        :disabled="isBusy"
                        @keydown.enter.prevent="saveTitle(task)"
                        @keydown.esc.prevent="cancelTitleEdit"
                      >
                      <button
                        type="submit"
                        class="btn btn-sm btn-primary"
                        :data-testid="`save-title-${task.id}`"
                        :disabled="isBusy"
                      >保存</button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        :data-testid="`cancel-title-${task.id}`"
                        :disabled="isBusy"
                        @click="cancelTitleEdit"
                      >キャンセル</button>
                    </form>
                    <span v-else>{{ task.title }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
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
.create-task-input-box {
  position: relative;
  width: calc(100% - 84px);
  padding: 12px 12px 12px 70px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  color: inherit;
  font-family: inherit;
  font-size: 24px;
  font-weight: inherit;
  line-height: 1.4em;
}

.add-task-button {
  width: 76px;
  margin-left: 8px;
}

.create-task-input-box-label {
  position: absolute;
  top: 12px;
  left: 28px;
  z-index: 1;
  color: #555;
  font-size: 32px;
}

.card-header {
  position: relative;
}

.todo-list {
  position: relative;
  font-size: 24px;
}

.todo-list-completed td:last-child {
  color: #6c757d;
  text-decoration: line-through;
}

.task-filters {
  display: flex;
  gap: 0.5rem;
}

.title-edit-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.title-edit-form input {
  min-width: 12rem;
  flex: 1;
}

.delete-button {
  border: 0;
  background: transparent;
  color: darkred;
  font-size: 28px;
  line-height: 1;
}

.delete-button:disabled,
.create-task-input-box:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
