import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Navigation from './Navigation.vue'

describe('Navigation', () => {
  it('does not imply that the unauthenticated app has a profile or logout', () => {
    const wrapper = mount(Navigation)
    expect(wrapper.text()).not.toContain('ログアウト')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.get('nav').attributes('aria-label')).toBe('メインナビゲーション')
    expect(wrapper.get('[data-testid="app-title"]').text()).toBe('Todoホーム')
  })
})
