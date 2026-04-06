// src/components/__tests__/ScreenTimezone.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ScreenTimezone from '../ScreenTimezone.vue'
import { useAppStore } from '../../store/app'

vi.mock('../../api/client', () => ({
  api: { getMe: vi.fn(), postOnboarding: vi.fn() },
  ApiError: class extends Error { status = 0; body = {} },
}))

describe('ScreenTimezone', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders 13 timezone rows', () => {
    const wrapper = mount(ScreenTimezone)
    const rows = wrapper.findAll('[data-testid="tz-row"]')
    expect(rows).toHaveLength(13)
  })

  it('displays primary city names', () => {
    const wrapper = mount(ScreenTimezone)
    expect(wrapper.text()).toContain('New York')
    expect(wrapper.text()).toContain('Tokyo')
  })

  it('clicking a row selects it and updates draft.timezone', async () => {
    const wrapper = mount(ScreenTimezone)
    const store = useAppStore()
    const row = wrapper.find('[data-testid="tz-row"][data-iana="America/New_York"]')
    await row.trigger('click')
    expect(store.draft.timezone).toBe('America/New_York')
  })

  it('selected row has selected class', async () => {
    const wrapper = mount(ScreenTimezone)
    const store = useAppStore()
    store.draft.timezone = 'Asia/Tokyo'
    await wrapper.vm.$nextTick()
    const row = wrapper.find('[data-testid="tz-row"][data-iana="Asia/Tokyo"]')
    expect(row.classes()).toContain('tz-row--selected')
  })

  it('Next button advances to topic screen when timezone is selected', async () => {
    const wrapper = mount(ScreenTimezone)
    const store = useAppStore()
    store.editContext = 'onboarding'
    store.draft.timezone = 'Europe/London'
    await wrapper.find('[data-testid="next-btn"]').trigger('click')
    expect(store.currentScreen).toBe('topic')
  })

  it('Next button is disabled when no timezone is selected', async () => {
    const wrapper = mount(ScreenTimezone)
    const store = useAppStore()
    store.draft.timezone = ''
    await wrapper.vm.$nextTick()
    const btn = wrapper.find('[data-testid="next-btn"]')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })
})
