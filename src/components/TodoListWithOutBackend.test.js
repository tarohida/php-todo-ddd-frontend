import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TodoListWithOutBackend from './TodoListWithOutBackend.vue'

describe('TodoListWithOutBackend', () => {
  it('provides Japanese local-mode semantics and an empty state', () => {
    const wrapper = mount(TodoListWithOutBackend)

    expect(wrapper.get('section[aria-labelledby="offline-capture-title"]')).toBeTruthy()
    expect(wrapper.get('#offline-capture-title').text()).toBe('タスクを追加')
    expect(wrapper.get('#offline-list-title').text()).toBe('タスク')
    expect(wrapper.get('.offline-empty').text()).toBe('タスクはありません。')
  })

  it('trims and adds a task, then deletes it with an accessible control', async () => {
    const wrapper = mount(TodoListWithOutBackend)

    await wrapper.get('#offline-task-input').setValue('  本を読む  ')
    await wrapper.get('.offline-form').trigger('submit')

    expect(wrapper.find('.offline-empty').exists()).toBe(false)
    expect(wrapper.get('li span').text()).toBe('本を読む')
    expect(wrapper.get('li button').attributes('aria-label')).toBe('本を読むを削除')
    expect(wrapper.get('#offline-task-input').element.value).toBe('')

    await wrapper.get('li button').trigger('click')
    expect(wrapper.get('.offline-empty').text()).toBe('タスクはありません。')
  })
})
