// src/components/__tests__/ScreenTopic.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ScreenTopic from '../ScreenTopic.vue'
import { useAppStore } from '../../store/app'

const mockSubmitOnboarding = vi.fn()

vi.mock('../../api/client', () => ({
  api: { getMe: vi.fn(), postOnboarding: vi.fn(), postTopic: vi.fn() },
  ApiError: class extends Error { status = 0; body = {} },
}))

describe('ScreenTopic', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockSubmitOnboarding.mockClear()
  })

  it('renders the topic text input', () => {
    const wrapper = mount(ScreenTopic)
    expect(wrapper.find('input[data-testid="topic-input"]').exists()).toBe(true)
  })

  it('renders all 4 suggestion chips', () => {
    const wrapper = mount(ScreenTopic)
    const chips = wrapper.findAll('[data-testid="suggestion-chip"]')
    expect(chips).toHaveLength(4)
  })

  it('clicking a chip fills the input', async () => {
    const wrapper = mount(ScreenTopic)
    const chip = wrapper.find('[data-testid="suggestion-chip"]')
    await chip.trigger('click')
    const input = wrapper.find<HTMLInputElement>('input[data-testid="topic-input"]')
    expect(input.element.value).not.toBe('')
  })

  it('submit button is disabled when input is empty', () => {
    const wrapper = mount(ScreenTopic)
    const btn = wrapper.find<HTMLButtonElement>('[data-testid="submit-btn"]')
    expect(btn.element.disabled).toBe(true)
  })

  it('submit button is enabled when input has text', async () => {
    const wrapper = mount(ScreenTopic)
    await wrapper.find('input[data-testid="topic-input"]').setValue('Stoicism')
    const btn = wrapper.find<HTMLButtonElement>('[data-testid="submit-btn"]')
    expect(btn.element.disabled).toBe(false)
  })

  it('clicking submit calls store.submitOnboarding with the topic title', async () => {
    const store = useAppStore()
    store.submitOnboarding = mockSubmitOnboarding
    const wrapper = mount(ScreenTopic)
    await wrapper.find('input[data-testid="topic-input"]').setValue('Stoicism')
    await wrapper.find('[data-testid="submit-btn"]').trigger('click')
    expect(mockSubmitOnboarding).toHaveBeenCalledWith('Stoicism')
  })
})
