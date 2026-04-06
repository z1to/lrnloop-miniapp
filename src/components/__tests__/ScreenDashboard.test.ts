// src/components/__tests__/ScreenDashboard.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ScreenDashboard from '../ScreenDashboard.vue'
import { useAppStore } from '../../store/app'
import type { TopicResponse, UserResponse } from '../../api/types'

const mockDeleteTopic = vi.fn()
const mockAddTopic = vi.fn()

vi.mock('../../api/client', () => ({
  api: { getMe: vi.fn(), deleteTopic: vi.fn(), postTopic: vi.fn() },
  ApiError: class extends Error { status = 0; body = {} },
}))

const mockUser: UserResponse = {
  id: 'user-1', email: null, name: null, telegram_user_id: 123,
  telegram_username: 'testuser', telegram_first_name: 'Test',
  timezone: 'America/New_York', wake_time: '07:00:00',
  is_active: true, created_at: null,
}

const mockTopic: TopicResponse = {
  id: 'topic-1', title: 'Stoicism', difficulty: 'beginner',
  schedule_frequency: 'standard', is_active: true,
  sr_stability: null, sr_difficulty: null, sr_next_review_at: null, created_at: null,
}

describe('ScreenDashboard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockDeleteTopic.mockClear()
    mockAddTopic.mockClear()
  })

  it('shows topic count in heading', () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = [mockTopic]
    const wrapper = mount(ScreenDashboard)
    expect(wrapper.text()).toContain('1/2')
  })

  it('lists active topics', () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = [mockTopic]
    const wrapper = mount(ScreenDashboard)
    expect(wrapper.text()).toContain('Stoicism')
  })

  it('shows "Add second topic" slot when fewer than 2 topics', () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = [mockTopic]
    const wrapper = mount(ScreenDashboard)
    expect(wrapper.find('[data-testid="add-topic-slot"]').exists()).toBe(true)
  })

  it('hides "Add second topic" slot when 2 topics exist', () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = [mockTopic, { ...mockTopic, id: 'topic-2', title: 'Sleep science' }]
    const wrapper = mount(ScreenDashboard)
    expect(wrapper.find('[data-testid="add-topic-slot"]').exists()).toBe(false)
  })

  it('Remove button calls store.deleteTopic', async () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = [mockTopic]
    store.deleteTopic = mockDeleteTopic
    const wrapper = mount(ScreenDashboard)
    await wrapper.find('[data-testid="remove-btn"]').trigger('click')
    expect(mockDeleteTopic).toHaveBeenCalledWith('topic-1')
  })

  it('wake time settings row shows formatted time', () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = []
    const wrapper = mount(ScreenDashboard)
    expect(wrapper.text()).toContain('07:00')
  })

  it('wake time row click navigates to wake-time edit screen', async () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = []
    const wrapper = mount(ScreenDashboard)
    await wrapper.find('[data-testid="edit-waketime"]').trigger('click')
    expect(store.currentScreen).toBe('wake-time')
    expect(store.editContext).toBe('wake-time-edit')
  })

  it('timezone row click navigates to timezone edit screen', async () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = []
    const wrapper = mount(ScreenDashboard)
    await wrapper.find('[data-testid="edit-timezone"]').trigger('click')
    expect(store.currentScreen).toBe('timezone')
    expect(store.editContext).toBe('timezone-edit')
  })

  it('tapping add-topic slot reveals an input', async () => {
    const store = useAppStore()
    store.user = mockUser
    store.topics = [mockTopic]
    const wrapper = mount(ScreenDashboard)
    await wrapper.find('[data-testid="add-topic-slot"]').trigger('click')
    expect(wrapper.find('[data-testid="add-topic-input"]').exists()).toBe(true)
  })
})
