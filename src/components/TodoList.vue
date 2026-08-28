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

          <div v-if="tasks.length > 0" class="table-responsive">
            <table class="table table-hover">
              <caption class="visually-hidden">Todoタスク一覧</caption>
              <tbody>
                <tr v-for="task in tasks" :key="task.id" class="todo-list">
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
                  <td>{{ task.title }}</td>
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
    }
  },
  computed: {
    isBusy() {
      return this.isLoading || this.isMutating
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
