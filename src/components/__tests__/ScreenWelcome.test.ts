// src/components/__tests__/ScreenWelcome.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ScreenWelcome from '../ScreenWelcome.vue'
import { useAppStore } from '../../store/app'

// Stub the API so the store's init() doesn't actually fetch
vi.mock('../../api/client', () => ({
  api: {
    getMe: vi.fn().mockResolvedValue({
      user: { id: '1', wake_time: null, timezone: null },
      topics: [],
      onboarding_complete: false,
    }),
  },
  ApiError: class ApiError extends Error {
    status: number; body: unknown
    constructor(status: number, body: unknown) { super(); this.status = status; this.body = body }
  },
}))

describe('ScreenWelcome', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the LrnLoop heading', () => {
    const wrapper = mount(ScreenWelcome)
    expect(wrapper.text()).toContain('LrnLoop')
  })

  it('renders a "Get started" button', () => {
    const wrapper = mount(ScreenWelcome)
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toMatch(/get started/i)
  })

  it('navigates to wake-time screen on button click', async () => {
    const wrapper = mount(ScreenWelcome)
    const store = useAppStore()
    await wrapper.find('button').trigger('click')
    expect(store.currentScreen).toBe('wake-time')
  })
})
