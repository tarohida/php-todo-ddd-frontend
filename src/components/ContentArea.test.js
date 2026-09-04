import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ContentArea from './ContentArea.vue'

describe('ContentArea', () => {
  it('provides the semantic main workspace and Japanese page heading', () => {
    const wrapper = mount(ContentArea, {
      props: { backendUrl: '', todoApi: null },
    })

    expect(wrapper.get('main').attributes('aria-labelledby')).toBe('page-title')
    expect(wrapper.get('#page-title').text()).toBe('今日のやること')
  })

  it.each([undefined, '', '   '])('shows a non-interactive configuration error for %s', (backendUrl) => {
    const wrapper = mount(ContentArea, {
      props: { backendUrl, todoApi: null },
      global: {
        stubs: {
          TodoList: { template: '<div data-testid="backend-list" />' },
        },
      },
    })

    const error = wrapper.get('[data-testid="api-configuration-error"]')

    expect(error.attributes('role')).toBe('alert')
    expect(error.text()).toContain('VITE_BACKEND_URL')
    expect(error.text()).toContain('.env.local')
    expect(error.text()).toContain('README')
    expect(error.text()).toContain('再作成')
    expect(error.text()).not.toContain('再起動')
    expect(error.findAll('input, button, a')).toHaveLength(0)
    expect(wrapper.find('[data-testid="backend-list"]').exists()).toBe(false)
  })

  it('does not keep a volatile task store while configuration is missing', () => {
    const wrapper = mount(ContentArea, {
      props: { backendUrl: '', todoApi: null },
    })

    expect(wrapper.vm.$data).toEqual({})
    expect(wrapper.find('form, input, button, [role="list"]').exists()).toBe(false)
  })

  it('renders the API-backed list when the URL is configured', () => {
    const todoApi = { list: () => Promise.resolve([]) }
    const wrapper = mount(ContentArea, {
      props: { backendUrl: 'http://api.example.test', todoApi },
      global: {
        stubs: {
          TodoList: {
            name: 'TodoList',
            props: ['todoApi'],
            template: '<div data-testid="backend-list" />',
          },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'TodoList' }).props('todoApi')).toEqual(todoApi)
    expect(wrapper.find('[data-testid="api-configuration-error"]').exists()).toBe(false)
  })
})
