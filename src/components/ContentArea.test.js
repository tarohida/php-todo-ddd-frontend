import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ContentArea from './ContentArea.vue'

describe('ContentArea', () => {
  it('provides the semantic main workspace and Japanese page heading', () => {
    const wrapper = mount(ContentArea, {
      props: { backendUrl: '', todoApi: null },
      global: {
        stubs: {
          TodoListWithOutBackend: { template: '<div />' },
        },
      },
    })

    expect(wrapper.get('main').attributes('aria-labelledby')).toBe('page-title')
    expect(wrapper.get('#page-title').text()).toBe('今日のやること')
  })

  it.each([undefined, '', '   '])('uses the backend-less list for %s', (backendUrl) => {
    const wrapper = mount(ContentArea, {
      props: { backendUrl, todoApi: null },
      global: {
        stubs: {
          TodoList: { template: '<div data-testid="backend-list" />' },
          TodoListWithOutBackend: { template: '<div data-testid="offline-list" />' },
        },
      },
    })

    expect(wrapper.find('[data-testid="offline-list"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="backend-list"]').exists()).toBe(false)
  })
})
