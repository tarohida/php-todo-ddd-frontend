import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import TodoList from './TodoList.vue'

function deferred() {
  let resolve
  let reject
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

function api(overrides = {}) {
  return {
    list: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ id: 2, title: 'New task' }),
    delete: vi.fn().mockResolvedValue(undefined),
    updateCompleted: vi.fn().mockResolvedValue({ id: 1, title: 'Task', completed: true }),
    updateTitle: vi.fn().mockResolvedValue({ id: 1, title: 'Renamed', completed: false }),
    ...overrides,
  }
}

function mountList(todoApi) {
  return mount(TodoList, { props: { todoApi } })
}

describe('TodoList', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a semantic quick capture, summary, filters, and task list', async () => {
    const wrapper = mountList(api({ list: vi.fn().mockResolvedValue([
      { id: 1, title: '設計を確認する', completed: false },
      { id: 2, title: 'テストを書く', completed: true },
    ]) }))
    await flushPromises()

    expect(wrapper.get('[data-testid="quick-capture"]').attributes('aria-label')).toBe('タスクを追加')
    expect(wrapper.get('[data-testid="task-summary"]').text()).toContain('未完了 1件')
    expect(wrapper.get('[data-testid="task-summary"]').text()).toContain('完了 1件')
    expect(wrapper.get('section[aria-labelledby="task-list-title"]')).toBeTruthy()
    expect(wrapper.get('#task-list-title').text()).toBe('タスク')
    expect(wrapper.findAll('ul[role="list"] > li')).toHaveLength(2)
    expect(wrapper.get('[data-testid="delete-task-1"]').attributes('aria-label')).toBe('設計を確認するを削除')
  })

  it('loads tasks once on mount without starting a timer', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
    const todoApi = api({ list: vi.fn().mockResolvedValue([{ id: 1, title: 'Read' }]) })

    const wrapper = mountList(todoApi)
    expect(wrapper.get('[role="status"]').text()).toContain('読み込み中')
    await flushPromises()

    expect(todoApi.list).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('Read')
    expect(setIntervalSpy).not.toHaveBeenCalled()
  })

  it('shows an empty state', async () => {
    const wrapper = mountList(api())
    await flushPromises()
    expect(wrapper.get('[data-testid="empty-state"]').text()).toContain('タスクはありません')
  })

  it('shows a user-visible loading error', async () => {
    const wrapper = mountList(api({ list: vi.fn().mockRejectedValue(new Error('接続できません。')) }))
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toBe('接続できません。')
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
  })

  it('offers visible create and refresh controls', async () => {
    const pending = deferred()
    const wrapper = mountList(api({ list: vi.fn(() => pending.promise) }))

    expect(wrapper.get('[data-testid="add-task"]').isVisible()).toBe(true)
    expect(wrapper.get('[data-testid="refresh-tasks"]').isVisible()).toBe(true)
    expect(wrapper.get('[data-testid="add-task"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-testid="refresh-tasks"]').attributes('disabled')).toBeDefined()

    pending.resolve([])
    await flushPromises()
    expect(wrapper.get('[data-testid="add-task"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('[data-testid="refresh-tasks"]').attributes('disabled')).toBeUndefined()
  })

  it('recovers from a list failure with an explicit retry', async () => {
    const retry = deferred()
    const list = vi.fn()
      .mockRejectedValueOnce(new Error('接続できません。'))
      .mockImplementationOnce(() => retry.promise)
    const wrapper = mountList(api({ list }))
    await flushPromises()

    await wrapper.get('[data-testid="refresh-tasks"]').trigger('click')
    expect(wrapper.get('[data-testid="refresh-tasks"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[role="status"]').text()).toContain('読み込み中')
    await wrapper.get('[data-testid="refresh-tasks"]').trigger('click')
    expect(list).toHaveBeenCalledTimes(2)

    retry.resolve([{ id: 1, title: 'Recovered' }])
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(2)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Recovered')
  })

  it('ignores an initial list response after unmount', async () => {
    const pending = deferred()
    const wrapper = mountList(api({ list: vi.fn(() => pending.promise) }))
    const vm = wrapper.vm

    wrapper.unmount()
    pending.resolve([{ id: 1, title: 'Too late' }])
    await flushPromises()

    expect(vm.tasks).toEqual([])
    expect(vm.isLoading).toBe(true)
  })

  it('does not refresh or update state when unmounted during create', async () => {
    const pending = deferred()
    const list = vi.fn().mockResolvedValue([])
    const todoApi = api({ list, create: vi.fn(() => pending.promise) })
    const wrapper = mountList(todoApi)
    await flushPromises()
    await wrapper.get('input').setValue('Late create')
    await wrapper.get('form').trigger('submit')
    const vm = wrapper.vm

    wrapper.unmount()
    pending.resolve({ id: 2, title: 'Late create' })
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(vm.newTask).toBe('Late create')
    expect(vm.successMessage).toBe('')
  })

  it('does not refresh or update state when unmounted during delete', async () => {
    const pending = deferred()
    const list = vi.fn().mockResolvedValue([{ id: 1, title: 'Late delete' }])
    const todoApi = api({ list, delete: vi.fn(() => pending.promise) })
    const wrapper = mountList(todoApi)
    await flushPromises()
    await wrapper.get('[data-testid="delete-task-1"]').trigger('click')
    const vm = wrapper.vm

    wrapper.unmount()
    pending.resolve()
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(vm.successMessage).toBe('')
  })

  it('awaits create, disables controls, then refreshes and reports success', async () => {
    const pending = deferred()
    const list = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 2, title: 'New task' }])
    const todoApi = api({ list, create: vi.fn(() => pending.promise) })
    const wrapper = mountList(todoApi)
    await flushPromises()

    await wrapper.get('input').setValue(' New task ')
    await wrapper.get('form').trigger('submit')

    expect(todoApi.create).toHaveBeenCalledWith('New task')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(list).toHaveBeenCalledTimes(1)

    pending.resolve({ id: 2, title: 'New task' })
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('New task')
    expect(wrapper.get('[data-testid="success-message"]').text()).toBe('タスクを追加しました。')
    expect(wrapper.get('input').element.value).toBe('')
  })

  it('shows a create failure and does not refresh or clear the input', async () => {
    const list = vi.fn().mockResolvedValue([])
    const todoApi = api({ list, create: vi.fn().mockRejectedValue(new Error('追加できません。')) })
    const wrapper = mountList(todoApi)
    await flushPromises()

    await wrapper.get('input').setValue('Keep me')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[role="alert"]').text()).toBe('追加できません。')
    expect(wrapper.get('input').element.value).toBe('Keep me')
  })

  it('shows an inline create error for whitespace-only input without calling the API', async () => {
    const todoApi = api()
    const wrapper = mountList(todoApi)
    await flushPromises()

    const input = wrapper.get('#create-task-input-box')
    await input.setValue(' \t\u3000')
    await wrapper.get('.quick-capture__form').trigger('submit')

    const error = wrapper.get('[data-testid="create-title-error"]')
    expect(todoApi.create).not.toHaveBeenCalled()
    expect(error.attributes('id')).toBe('create-task-title-error')
    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toBe('タイトルを入力してください。')
    expect(input.element.value).toBe(' \t\u3000')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
    expect(wrapper.find('.state-message--error').exists()).toBe(false)
  })

  it('rejects a create title over 255 Unicode code points and does not use maxlength', async () => {
    const todoApi = api()
    const wrapper = mountList(todoApi)
    await flushPromises()

    const title = '😀'.repeat(256)
    const input = wrapper.get('#create-task-input-box')
    await input.setValue(title)
    await wrapper.get('.quick-capture__form').trigger('submit')

    expect(todoApi.create).not.toHaveBeenCalled()
    expect(wrapper.get('[data-testid="create-title-error"]').text()).toBe('タイトルは255文字以内で入力してください。')
    expect(input.element.value).toBe(title)
    expect(input.attributes('maxlength')).toBeUndefined()
  })

  it.each([
    ['ASCII', 'a'],
    ['Japanese', 'あ'],
    ['emoji', '😀'],
  ])('creates a %s title at the 255-code-point boundary exactly once', async (_label, character) => {
    const todoApi = api()
    const wrapper = mountList(todoApi)
    await flushPromises()

    const title = character.repeat(255)
    await wrapper.get('#create-task-input-box').setValue(`  ${title}  `)
    await wrapper.get('.quick-capture__form').trigger('submit')
    await flushPromises()

    expect(todoApi.create).toHaveBeenCalledTimes(1)
    expect(todoApi.create).toHaveBeenCalledWith(title)
  })

  it('clears only stale create validation while retaining an unrelated API error', async () => {
    const create = vi.fn().mockRejectedValueOnce(new Error('追加できません。'))
    const wrapper = mountList(api({ create }))
    await flushPromises()

    const input = wrapper.get('#create-task-input-box')
    await input.setValue('API failure')
    await wrapper.get('.quick-capture__form').trigger('submit')
    await flushPromises()
    expect(wrapper.get('.state-message--error').text()).toBe('追加できません。')

    await input.setValue('   ')
    await wrapper.get('.quick-capture__form').trigger('submit')
    expect(create).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-testid="create-title-error"]').text()).toBe('タイトルを入力してください。')
    expect(wrapper.get('.state-message--error').text()).toBe('追加できません。')

    await input.setValue('corrected')
    expect(wrapper.find('[data-testid="create-title-error"]').exists()).toBe(false)
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.get('.state-message--error').text()).toBe('追加できません。')
  })

  it('awaits delete, disables controls, then refreshes and reports success', async () => {
    const pending = deferred()
    const list = vi.fn()
      .mockResolvedValueOnce([{ id: 1, title: 'Delete me' }])
      .mockResolvedValueOnce([])
    const todoApi = api({ list, delete: vi.fn(() => pending.promise) })
    const wrapper = mountList(todoApi)
    await flushPromises()

    await wrapper.get('[data-testid="delete-task-1"]').trigger('click')
    expect(todoApi.delete).toHaveBeenCalledWith(1)
    expect(wrapper.get('[data-testid="delete-task-1"]').attributes('disabled')).toBeDefined()
    expect(list).toHaveBeenCalledTimes(1)

    pending.resolve()
    await flushPromises()
    expect(list).toHaveBeenCalledTimes(2)
    expect(wrapper.get('[data-testid="success-message"]').text()).toBe('タスクを削除しました。')
    expect(wrapper.find('[data-testid="delete-task-1"]').exists()).toBe(false)
  })

  it('shows a delete failure and does not refresh', async () => {
    const list = vi.fn().mockResolvedValue([{ id: 1, title: 'Keep me' }])
    const todoApi = api({ list, delete: vi.fn().mockRejectedValue(new Error('削除できません。')) })
    const wrapper = mountList(todoApi)
    await flushPromises()

    await wrapper.get('[data-testid="delete-task-1"]').trigger('click')
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[role="alert"]').text()).toBe('削除できません。')
    expect(wrapper.text()).toContain('Keep me')
  })

  it('filters active and completed tasks without another request', async () => {
    const list = vi.fn().mockResolvedValue([
      { id: 1, title: 'Active', completed: false },
      { id: 2, title: 'Done', completed: true },
    ])
    const wrapper = mountList(api({ list }))
    await flushPromises()

    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('タスクの表示切り替え')
    expect(wrapper.get('[data-testid="complete-task-1"]').element.checked).toBe(false)
    expect(wrapper.get('[data-testid="complete-task-2"]').element.checked).toBe(true)
    expect(wrapper.get('[data-testid="complete-task-2"]').attributes('aria-label')).toContain('未完了にする')
    expect(wrapper.get('[data-testid="complete-task-2"]').element.closest('li').classList).toContain('todo-list-completed')

    await wrapper.get('[data-testid="filter-active"]').trigger('click')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).not.toContain('Done')
    expect(wrapper.get('[data-testid="filter-active"]').attributes('aria-pressed')).toBe('true')

    await wrapper.get('[data-testid="filter-completed"]').trigger('click')
    expect(wrapper.text()).not.toContain('Active')
    expect(wrapper.text()).toContain('Done')
    expect(list).toHaveBeenCalledTimes(1)
  })

  it('shows a filter-specific empty state', async () => {
    const wrapper = mountList(api({ list: vi.fn().mockResolvedValue([{ id: 1, title: 'Active', completed: false }]) }))
    await flushPromises()
    await wrapper.get('[data-testid="filter-completed"]').trigger('click')
    expect(wrapper.get('[data-testid="filtered-empty-state"]').text()).toContain('完了済みのタスクはありません')
  })

  it('awaits completion update, then explicitly refreshes the list', async () => {
    const pending = deferred()
    const list = vi.fn()
      .mockResolvedValueOnce([{ id: 1, title: 'Toggle me', completed: false }])
      .mockResolvedValueOnce([{ id: 1, title: 'Toggle me', completed: true }])
    const todoApi = api({ list, updateCompleted: vi.fn(() => pending.promise) })
    const wrapper = mountList(todoApi)
    await flushPromises()

    const checkbox = wrapper.get('[data-testid="complete-task-1"]')
    await checkbox.setValue(true)
    expect(todoApi.updateCompleted).toHaveBeenCalledWith(1, true)
    expect(checkbox.attributes('disabled')).toBeDefined()
    expect(wrapper.vm.tasks[0].completed).toBe(false)
    expect(list).toHaveBeenCalledTimes(1)

    pending.resolve({ id: 1, title: 'Toggle me', completed: true })
    await flushPromises()
    expect(list).toHaveBeenCalledTimes(2)
    expect(wrapper.get('[data-testid="complete-task-1"]').element.checked).toBe(true)
    expect(wrapper.get('[data-testid="success-message"]').text()).toBe('タスクを完了にしました。')
  })

  it('shows a completion failure without refreshing or mutating the task', async () => {
    const list = vi.fn().mockResolvedValue([{ id: 1, title: 'Keep active', completed: false }])
    const todoApi = api({ list, updateCompleted: vi.fn().mockRejectedValue(new Error('更新できません。')) })
    const wrapper = mountList(todoApi)
    await flushPromises()
    await wrapper.get('[data-testid="complete-task-1"]').setValue(true)
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.tasks[0].completed).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toBe('更新できません。')
    expect(wrapper.get('[data-testid="complete-task-1"]').element.checked).toBe(false)
  })

  it('does not refresh or update state when unmounted during completion update', async () => {
    const pending = deferred()
    const list = vi.fn().mockResolvedValue([{ id: 1, title: 'Late toggle', completed: false }])
    const todoApi = api({ list, updateCompleted: vi.fn(() => pending.promise) })
    const wrapper = mountList(todoApi)
    await flushPromises()
    await wrapper.get('[data-testid="complete-task-1"]').setValue(true)
    const vm = wrapper.vm
    wrapper.unmount()
    pending.resolve({ id: 1, title: 'Late toggle', completed: true })
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(vm.tasks[0].completed).toBe(false)
    expect(vm.successMessage).toBe('')
  })

  it('saves with Enter exactly once, waits for PATCH, then refreshes in exact order', async () => {
    const pending = deferred()
    const calls = []
    const list = vi.fn()
      .mockImplementationOnce(async () => {
        calls.push('GET initial')
        return [{ id: 1, title: 'Before', completed: true }]
      })
      .mockImplementationOnce(async () => {
        calls.push('GET refresh')
        return [{ id: 1, title: 'After', completed: true }]
      })
    const updateTitle = vi.fn(() => {
      calls.push('PATCH')
      return pending.promise
    })
    const wrapper = mountList(api({ list, updateTitle }))
    await flushPromises()

    const focus = vi.spyOn(HTMLElement.prototype, 'focus')
    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    await flushPromises()
    const input = wrapper.get('[data-testid="edit-title-1"]')
    expect(focus).toHaveBeenCalledOnce()
    await input.setValue(' After ')
    await input.trigger('keydown', { key: 'Enter' })

    expect(updateTitle).toHaveBeenCalledWith(1, 'After')
    expect(updateTitle).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.tasks[0]).toEqual({ id: 1, title: 'Before', completed: true })
    expect(list).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-testid="save-title-1"]').attributes('disabled')).toBeDefined()

    pending.resolve({ id: 1, title: 'After', completed: true })
    await flushPromises()
    expect(calls).toEqual(['GET initial', 'PATCH', 'GET refresh'])
    expect(wrapper.text()).toContain('After')
    expect(wrapper.get('[data-testid="complete-task-1"]').element.checked).toBe(true)
    expect(wrapper.get('[data-testid="complete-task-1"]').element.closest('li').classList).toContain('todo-list-completed')
  })

  it('cancels editing with button and Escape without a request', async () => {
    const todoApi = api({ list: vi.fn().mockResolvedValue([{ id: 1, title: 'Original', completed: false }]) })
    const wrapper = mountList(todoApi)
    await flushPromises()

    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    await wrapper.get('[data-testid="edit-title-1"]').setValue('Discard')
    await wrapper.get('[data-testid="cancel-title-1"]').trigger('click')
    expect(wrapper.text()).toContain('Original')
    expect(todoApi.updateTitle).not.toHaveBeenCalled()

    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    await wrapper.get('[data-testid="edit-title-1"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[data-testid="edit-title-1"]').exists()).toBe(false)
    expect(todoApi.updateTitle).not.toHaveBeenCalled()
  })

  it('shows an inline edit error for a blank title and keeps the input active', async () => {
    const todoApi = api({ list: vi.fn().mockResolvedValue([{ id: 1, title: 'Original', completed: false }]) })
    const wrapper = mountList(todoApi)
    await flushPromises()
    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    const input = wrapper.get('[data-testid="edit-title-1"]')
    await input.setValue(' \t\u3000')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')

    const error = wrapper.get('[data-testid="edit-title-error-1"]')
    expect(todoApi.updateTitle).not.toHaveBeenCalled()
    expect(error.attributes('id')).toBe('edit-task-title-error-1')
    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toBe('タイトルを入力してください。')
    expect(input.element.value).toBe(' \t\u3000')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
    expect(wrapper.find('[data-testid="edit-title-1"]').exists()).toBe(true)
    expect(wrapper.find('.state-message--error').exists()).toBe(false)
  })

  it('rejects an edited title over 255 Unicode code points without an HTML maxlength', async () => {
    const todoApi = api({ list: vi.fn().mockResolvedValue([{ id: 1, title: 'Original', completed: false }]) })
    const wrapper = mountList(todoApi)
    await flushPromises()
    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')

    const title = '😀'.repeat(256)
    const input = wrapper.get('[data-testid="edit-title-1"]')
    await input.setValue(title)
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')

    expect(todoApi.updateTitle).not.toHaveBeenCalled()
    expect(wrapper.get('[data-testid="edit-title-error-1"]').text()).toBe('タイトルは255文字以内で入力してください。')
    expect(input.element.value).toBe(title)
    expect(input.attributes('maxlength')).toBeUndefined()
  })

  it.each([
    ['ASCII', 'a'],
    ['Japanese', 'あ'],
    ['emoji', '😀'],
  ])('updates a %s title at the 255-code-point boundary exactly once', async (_label, character) => {
    const todoApi = api({ list: vi.fn().mockResolvedValue([{ id: 1, title: 'Original', completed: false }]) })
    const wrapper = mountList(todoApi)
    await flushPromises()
    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')

    const title = character.repeat(255)
    await wrapper.get('[data-testid="edit-title-1"]').setValue(`  ${title}  `)
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    await flushPromises()

    expect(todoApi.updateTitle).toHaveBeenCalledTimes(1)
    expect(todoApi.updateTitle).toHaveBeenCalledWith(1, title)
  })

  it('clears only edit validation while typing and retains an API error', async () => {
    const updateTitle = vi.fn().mockRejectedValueOnce(new Error('変更できません。'))
    const wrapper = mountList(api({
      list: vi.fn().mockResolvedValue([
        { id: 1, title: 'First', completed: false },
        { id: 2, title: 'Second', completed: false },
      ]),
      updateTitle,
    }))
    await flushPromises()

    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    let input = wrapper.get('[data-testid="edit-title-1"]')
    await input.setValue('API failure')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    await flushPromises()
    expect(wrapper.get('.state-message--error').text()).toBe('変更できません。')

    await input.setValue('   ')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    expect(updateTitle).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-testid="edit-title-error-1"]').exists()).toBe(true)
    expect(wrapper.get('.state-message--error').text()).toBe('変更できません。')

    await input.setValue('corrected')
    expect(wrapper.find('[data-testid="edit-title-error-1"]').exists()).toBe(false)
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.get('.state-message--error').text()).toBe('変更できません。')
  })

  it.each([
    ['the cancel button', async (wrapper) => {
      await wrapper.get('[data-testid="cancel-title-1"]').trigger('click')
    }],
    ['Escape', async (wrapper) => {
      await wrapper.get('[data-testid="edit-title-1"]').trigger('keydown', { key: 'Escape' })
    }],
  ])('clears edit validation and the API error with %s', async (_label, cancel) => {
    const updateTitle = vi.fn().mockRejectedValueOnce(new Error('変更できません。'))
    const wrapper = mountList(api({
      list: vi.fn().mockResolvedValue([{ id: 1, title: 'First', completed: false }]),
      updateTitle,
    }))
    await flushPromises()

    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    const input = wrapper.get('[data-testid="edit-title-1"]')
    await input.setValue('API failure')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    await flushPromises()
    await input.setValue('   ')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    expect(wrapper.get('[data-testid="edit-title-error-1"]').exists()).toBe(true)
    expect(wrapper.get('.state-message--error').text()).toBe('変更できません。')

    await cancel(wrapper)

    expect(wrapper.find('[data-testid="edit-title-1"]').exists()).toBe(false)
    expect(wrapper.find('.state-message--error').exists()).toBe(false)
    expect(wrapper.vm.editTitleError).toBe('')
  })

  it('clears edit validation and the API error when editing another task', async () => {
    const updateTitle = vi.fn().mockRejectedValueOnce(new Error('変更できません。'))
    const wrapper = mountList(api({
      list: vi.fn().mockResolvedValue([
        { id: 1, title: 'First', completed: false },
        { id: 2, title: 'Second', completed: false },
      ]),
      updateTitle,
    }))
    await flushPromises()

    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    const input = wrapper.get('[data-testid="edit-title-1"]')
    await input.setValue('API failure')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    await flushPromises()
    await input.setValue('   ')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    expect(wrapper.get('[data-testid="edit-title-error-1"]').exists()).toBe(true)
    expect(wrapper.get('.state-message--error').text()).toBe('変更できません。')

    await wrapper.get('[data-testid="edit-task-2"]').trigger('click')
    const nextInput = wrapper.get('[data-testid="edit-title-2"]')
    expect(wrapper.find('[data-testid="edit-title-error-2"]').exists()).toBe(false)
    expect(nextInput.attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.find('.state-message--error').exists()).toBe(false)
  })

  it('keeps the old title and editing input when title update fails', async () => {
    const list = vi.fn().mockResolvedValue([{ id: 1, title: 'Original', completed: false }])
    const updateTitle = vi.fn().mockRejectedValue(new Error('変更できません。'))
    const wrapper = mountList(api({ list, updateTitle }))
    await flushPromises()
    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    await wrapper.get('[data-testid="edit-title-1"]').setValue('Attempt')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.tasks[0].title).toBe('Original')
    expect(wrapper.get('[role="alert"]').text()).toBe('変更できません。')
    expect(wrapper.get('[data-testid="edit-title-1"]').element.value).toBe('Attempt')
  })

  it('does not refresh or update state when unmounted during title update', async () => {
    const pending = deferred()
    const list = vi.fn().mockResolvedValue([{ id: 1, title: 'Original', completed: false }])
    const wrapper = mountList(api({ list, updateTitle: vi.fn(() => pending.promise) }))
    await flushPromises()
    await wrapper.get('[data-testid="edit-task-1"]').trigger('click')
    await wrapper.get('[data-testid="edit-title-1"]').setValue('Late')
    await wrapper.get('[data-testid="edit-form-1"]').trigger('submit')
    const vm = wrapper.vm
    wrapper.unmount()
    pending.resolve({ id: 1, title: 'Late', completed: false })
    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(vm.tasks[0].title).toBe('Original')
    expect(vm.successMessage).toBe('')
  })
})
