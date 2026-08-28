import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App.vue'

afterEach(() => {
  vi.unstubAllEnvs()
})

function mountApp() {
  return mount(App, {
    global: {
      stubs: {
        Navigation: true,
        ContentArea: {
          props: ['backendUrl', 'todoApi'],
          template: '<div data-testid="content" />',
        },
      },
    },
  })
}

describe('App API configuration', () => {
  it.each([undefined, '', '   '])('uses backend-less mode for %s', (value) => {
    vi.stubEnv('VITE_BACKEND_URL', value)
    const wrapper = mountApp()

    expect(wrapper.vm.backendUrl).toBe('')
    expect(wrapper.vm.todoApi).toBeNull()
  })

  it('trims the API URL before creating and passing the client', () => {
    vi.stubEnv('VITE_BACKEND_URL', '  http://api.example.test/  ')
    const wrapper = mountApp()

    expect(wrapper.vm.backendUrl).toBe('http://api.example.test/')
    expect(wrapper.vm.todoApi).not.toBeNull()
  })
})
