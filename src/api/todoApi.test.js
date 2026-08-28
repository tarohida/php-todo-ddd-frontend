import axios from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createTodoApi, TodoApiError } from './todoApi.js'

function createHttpClient() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  }
}

function axiosError(status, data) {
  return {
    isAxiosError: true,
    config: { headers: { Authorization: 'secret-token' } },
    response: status === undefined ? undefined : { status, data },
  }
}

describe('todo API client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('configures Axios from the injected backend URL', () => {
    const httpClient = createHttpClient()
    const create = vi.spyOn(axios, 'create').mockReturnValue(httpClient)

    createTodoApi({ baseUrl: '  http://localhost:8081///  ' })

    expect(create).toHaveBeenCalledWith({ baseURL: 'http://localhost:8081' })
  })

  it.each([undefined, '', '   '])('rejects an empty backend URL (%s)', (baseUrl) => {
    expect(() => createTodoApi({ baseUrl })).toThrow(TypeError)
  })

  it('lists tasks from the canonical endpoint', async () => {
    const httpClient = createHttpClient()
    const tasks = [{ id: 1, title: 'write tests' }]
    httpClient.get.mockResolvedValue({ status: 200, data: tasks })

    const api = createTodoApi({ baseUrl: 'http://localhost:8081/', httpClient })

    await expect(api.list()).resolves.toEqual(tasks)
    expect(httpClient.get).toHaveBeenCalledWith('/tasks')
  })

  it('creates a task with JSON on the canonical endpoint', async () => {
    const httpClient = createHttpClient()
    const task = { id: 2, title: 'ship it' }
    httpClient.post.mockResolvedValue({ status: 201, data: { task } })

    const api = createTodoApi({ baseUrl: 'http://localhost:8081', httpClient })

    await expect(api.create('ship it')).resolves.toEqual(task)
    expect(httpClient.post).toHaveBeenCalledWith('/tasks', { title: 'ship it' })
  })

  it('deletes a task from the canonical endpoint', async () => {
    const httpClient = createHttpClient()
    httpClient.delete.mockResolvedValue({ status: 204 })

    const api = createTodoApi({ baseUrl: 'http://localhost:8081', httpClient })

    await expect(api.delete(42)).resolves.toBeUndefined()
    expect(httpClient.delete).toHaveBeenCalledWith('/tasks/42')
  })

  it('encodes a task ID as one path segment', async () => {
    const httpClient = createHttpClient()
    httpClient.delete.mockResolvedValue({ status: 204 })

    const api = createTodoApi({ baseUrl: 'http://localhost:8081', httpClient })

    await api.delete('1/2 ?')
    expect(httpClient.delete).toHaveBeenCalledWith('/tasks/1%2F2%20%3F')
  })

  it.each([
    ['list', { status: 201, data: [] }],
    ['create', { status: 200, data: { task: { id: 1, title: 'task' } } }],
    ['delete', { status: 200, data: '' }],
    ['delete', { status: 204, data: { unexpected: true } }],
  ])('rejects an invalid successful %s HTTP contract', async (method, response) => {
    const httpClient = createHttpClient()
    httpClient.get.mockResolvedValue(response)
    httpClient.post.mockResolvedValue(response)
    httpClient.delete.mockResolvedValue(response)

    const api = createTodoApi({ baseUrl: 'http://localhost:8081', httpClient })
    const error = await api[method]('task').catch((reason) => reason)

    expect(error).toBeInstanceOf(TodoApiError)
    expect(error).toMatchObject({
      type: 'contract',
      status: null,
      message: 'サーバーから不正な応答を受信しました。',
    })
  })

  it.each([
    [400, 'validation', '入力内容を確認してください。'],
    [404, 'not-found', '対象のタスクが見つかりません。'],
    [409, 'http', 'リクエストに失敗しました。'],
    [500, 'server', 'サーバーでエラーが発生しました。'],
    [501, 'server', 'サーバーでエラーが発生しました。'],
  ])('normalizes an HTTP %s response', async (status, type, message) => {
    const httpClient = createHttpClient()
    httpClient.get.mockRejectedValue(axiosError(status, {
      error: { status, message: 'backend detail' },
    }))

    const api = createTodoApi({ baseUrl: 'http://localhost:8081', httpClient })
    const error = await api.list().catch((reason) => reason)

    expect(error).toBeInstanceOf(TodoApiError)
    expect(error).toMatchObject({ type, status, message })
    expect(error).not.toHaveProperty('cause')
    expect(JSON.stringify(error)).not.toContain('backend detail')
    expect(JSON.stringify(error)).not.toContain('secret-token')
  })

  it('normalizes an Axios network failure without exposing console-only errors', async () => {
    const httpClient = createHttpClient()
    httpClient.get.mockRejectedValue(axiosError())

    const api = createTodoApi({ baseUrl: 'http://localhost:8081', httpClient })
    const error = await api.list().catch((reason) => reason)

    expect(error).toMatchObject({
      type: 'network',
      status: null,
      message: 'サーバーに接続できません。',
    })
    expect(error).not.toHaveProperty('cause')
    expect(JSON.stringify(error)).not.toContain('secret-token')
  })

  it('normalizes a non-Axios failure without retaining the original error', async () => {
    const httpClient = createHttpClient()
    httpClient.get.mockRejectedValue(new Error('private implementation detail'))

    const api = createTodoApi({ baseUrl: 'http://localhost:8081', httpClient })
    const error = await api.list().catch((reason) => reason)

    expect(error).toMatchObject({
      type: 'unexpected',
      status: null,
      message: '予期しないエラーが発生しました。',
    })
    expect(error).not.toHaveProperty('cause')
    expect(JSON.stringify(error)).not.toContain('private implementation detail')
  })

  it.each([
    ['list', { status: 200, data: { tasks: [] } }],
    ['list', { status: 200, data: [{ id: '1', title: 'wrong id type' }] }],
    ['list', { status: 200, data: [{ id: 1, title: '   ' }] }],
    ['create', { status: 201, data: { task: { id: 1 } } }],
    ['create', { status: 201, data: { task: { id: 0, title: 'wrong id' } } }],
  ])('rejects a malformed successful %s response', async (method, response) => {
    const httpClient = createHttpClient()
    httpClient.get.mockResolvedValue(response)
    httpClient.post.mockResolvedValue(response)

    const api = createTodoApi({ baseUrl: 'http://localhost:8081', httpClient })
    const error = await api[method]('title').catch((reason) => reason)

    expect(error).toBeInstanceOf(TodoApiError)
    expect(error).toMatchObject({
      type: 'contract',
      status: null,
      message: 'サーバーから不正な応答を受信しました。',
    })
    expect(error).not.toHaveProperty('cause')
  })
})
