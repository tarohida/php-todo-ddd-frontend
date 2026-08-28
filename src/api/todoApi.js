import axios from 'axios'

const ERROR_DETAILS = {
  400: ['validation', '入力内容を確認してください。'],
  404: ['not-found', '対象のタスクが見つかりません。'],
}

export class TodoApiError extends Error {
  constructor({ type, status = null, message }) {
    super(message)
    this.name = 'TodoApiError'
    this.type = type
    this.status = status
  }
}

function normalizeError(error) {
  if (!axios.isAxiosError(error)) {
    return new TodoApiError({
      type: 'unexpected',
      message: '予期しないエラーが発生しました。',
    })
  }

  const status = error.response?.status
  if (status === undefined) {
    return new TodoApiError({
      type: 'network',
      message: 'サーバーに接続できません。',
    })
  }

  const [type, message] = ERROR_DETAILS[status]
    ?? (status >= 500
      ? ['server', 'サーバーでエラーが発生しました。']
      : ['http', 'リクエストに失敗しました。'])

  return new TodoApiError({ type, status, message })
}

function contractError() {
  return new TodoApiError({
    type: 'contract',
    message: 'サーバーから不正な応答を受信しました。',
  })
}

function isTask(value) {
  return value !== null
    && typeof value === 'object'
    && Number.isInteger(value.id)
    && value.id > 0
    && typeof value.title === 'string'
    && value.title.trim() !== ''
}

async function request(action) {
  try {
    return await action()
  } catch (error) {
    throw normalizeError(error)
  }
}

export function createTodoApi({ baseUrl, httpClient } = {}) {
  const normalizedBaseUrl = baseUrl?.trim().replace(/\/+$/, '')
  if (!normalizedBaseUrl) {
    throw new TypeError('Todo API base URL is required.')
  }

  const http = httpClient ?? axios.create({ baseURL: normalizedBaseUrl })

  return {
    async list() {
      const response = await request(() => http.get('/tasks'))
      if (response.status !== 200
        || !Array.isArray(response.data)
        || !response.data.every(isTask)) {
        throw contractError()
      }
      return response.data
    },

    async create(title) {
      const response = await request(() => http.post('/tasks', { title }))
      if (response.status !== 201 || !isTask(response.data?.task)) {
        throw contractError()
      }
      return response.data.task
    },

    async delete(id) {
      const response = await request(() => http.delete(`/tasks/${encodeURIComponent(id)}`))
      if (response.status !== 204
        || (response.data !== undefined && response.data !== '')) {
        throw contractError()
      }
    },
  }
}
