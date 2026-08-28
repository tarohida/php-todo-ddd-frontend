import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ContentArea from './ContentArea.vue'

describe('ContentArea', () => {
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
