// src/components/__tests__/ScreenWakeTime.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ScreenWakeTime from '../ScreenWakeTime.vue'
import { useAppStore } from '../../store/app'

vi.mock('../../api/client', () => ({
  api: { getMe: vi.fn(), postOnboarding: vi.fn() },
  ApiError: class extends Error { status = 0; body = {} },
}))

describe('ScreenWakeTime', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('displays the current draft wake time', () => {
    const wrapper = mount(ScreenWakeTime)
    expect(wrapper.text()).toContain('07:00')
  })

  it('clicking + steps forward by 30 min', async () => {
    const wrapper = mount(ScreenWakeTime)
    const store = useAppStore()
    store.draft.wakeTime = '07:00'
    await wrapper.find('[data-testid="step-up"]').trigger('click')
    expect(store.draft.wakeTime).toBe('07:30')
  })

  it('clicking - steps back by 30 min', async () => {
    const wrapper = mount(ScreenWakeTime)
    const store = useAppStore()
    store.draft.wakeTime = '07:00'
    await wrapper.find('[data-testid="step-down"]').trigger('click')
    expect(store.draft.wakeTime).toBe('06:30')
  })

  it('tapping the time display switches to text input mode', async () => {
    const wrapper = mount(ScreenWakeTime)
    await wrapper.find('[data-testid="time-display"]').trigger('click')
    expect(wrapper.find('input[data-testid="time-input"]').exists()).toBe(true)
  })

  it('valid typed input updates the draft on blur', async () => {
    const wrapper = mount(ScreenWakeTime)
    const store = useAppStore()
    await wrapper.find('[data-testid="time-display"]').trigger('click')
    const input = wrapper.find('input[data-testid="time-input"]')
    await input.setValue('730')
    await input.trigger('blur')
    expect(store.draft.wakeTime).toBe('07:30')
  })

  it('invalid typed input reverts to last valid value on blur', async () => {
    const wrapper = mount(ScreenWakeTime)
    const store = useAppStore()
    store.draft.wakeTime = '08:00'
    await wrapper.find('[data-testid="time-display"]').trigger('click')
    const input = wrapper.find('input[data-testid="time-input"]')
    await input.setValue('banana')
    await input.trigger('blur')
    expect(store.draft.wakeTime).toBe('08:00')
  })

  it('Next → advances to timezone screen in onboarding context', async () => {
    const wrapper = mount(ScreenWakeTime)
    const store = useAppStore()
    // editContext defaults to 'onboarding' in fresh store
    await wrapper.find('[data-testid="next-btn"]').trigger('click')
    expect(store.currentScreen).toBe('timezone')
  })
})
