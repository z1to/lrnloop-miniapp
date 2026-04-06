// src/store/app.ts
import { defineStore } from 'pinia'
import { api, ApiError } from '../api/client'
import type { UserResponse, TopicResponse } from '../api/types'

export type Screen =
  | 'loading'
  | 'welcome'
  | 'wake-time'
  | 'timezone'
  | 'topic'
  | 'dashboard'

// Tracks flow context so wake-time and timezone screens know where to go on "Next/Save"
// 'onboarding'    → wake-time → timezone → topic → dashboard
// 'wake-time-edit' → wake-time → saveSettings() → dashboard
// 'timezone-edit'  → timezone → saveSettings() → dashboard
type EditContext = 'onboarding' | 'wake-time-edit' | 'timezone-edit'

interface AppState {
  currentScreen: Screen
  editContext: EditContext
  user: UserResponse | null
  topics: TopicResponse[]
  draft: { wakeTime: string; timezone: string }
  error: string | null
  loading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    currentScreen: 'loading',
    editContext: 'onboarding',
    user: null,
    topics: [],
    draft: { wakeTime: '07:00', timezone: '' },
    error: null,
    loading: false,
  }),

  getters: {
    // Format wake_time from "HH:MM:SS" (backend) to "HH:MM" for display
    displayWakeTime(state): string {
      if (!state.user?.wake_time) return '07:00'
      return state.user.wake_time.slice(0, 5)
    },

    // Find primary city name for the user's IANA timezone
    displayTimezone(state): string {
      return state.user?.timezone ?? ''
    },
  },

  actions: {
    async init() {
      this.loading = true
      this.error = null
      try {
        const data = await api.getMe()
        this.user = data.user
        this.topics = data.topics
        // Pre-fill draft from existing user data for the settings edit flow
        if (data.user.wake_time) {
          this.draft.wakeTime = data.user.wake_time.slice(0, 5)
        }
        if (data.user.timezone) {
          this.draft.timezone = data.user.timezone
        }
        this.currentScreen = data.onboarding_complete ? 'dashboard' : 'welcome'
      } catch {
        this.error = 'Failed to load. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async retryInit() {
      await this.init()
    },

    setWakeTimeDraft(wakeTime: string) {
      this.draft.wakeTime = wakeTime
    },

    setTimezoneDraft(timezone: string) {
      this.draft.timezone = timezone
    },

    // Called from ScreenWakeTime "Next →" (onboarding) or "Save" (wake-time-edit)
    advanceFromWakeTime() {
      if (this.editContext === 'wake-time-edit') {
        void this.saveSettings()
      } else {
        this.currentScreen = 'timezone'
      }
    },

    // Called from ScreenTimezone "Next →" (onboarding) or "Save" (timezone-edit)
    advanceFromTimezone() {
      if (this.editContext === 'timezone-edit') {
        void this.saveSettings()
      } else {
        this.currentScreen = 'topic'
      }
    },

    async saveSettings() {
      this.loading = true
      this.error = null
      try {
        const user = await api.postOnboarding(this.draft.wakeTime, this.draft.timezone)
        this.user = user
        this.currentScreen = 'dashboard'
      } catch {
        this.error = 'Failed to save settings.'
      } finally {
        this.loading = false
      }
    },

    // Called from ScreenTopic "Start learning →"
    async submitOnboarding(title: string) {
      this.loading = true
      this.error = null
      try {
        const user = await api.postOnboarding(this.draft.wakeTime, this.draft.timezone)
        this.user = user
        const topic = await api.postTopic(title)
        this.topics = [topic]
        this.currentScreen = 'dashboard'
      } catch (e) {
        if (e instanceof ApiError) {
          this.error = (e.body as { detail?: string })?.detail ?? 'Something went wrong.'
        } else {
          this.error = 'Something went wrong.'
        }
      } finally {
        this.loading = false
      }
    },

    async addTopic(title: string) {
      this.loading = true
      this.error = null
      try {
        const topic = await api.postTopic(title)
        this.topics = [...this.topics, topic]
      } catch (e) {
        if (e instanceof ApiError && e.status === 429) {
          this.error = 'You already have 2 active topics. Remove one to add another.'
        } else {
          this.error = 'Failed to add topic.'
        }
      } finally {
        this.loading = false
      }
    },

    async deleteTopic(id: string) {
      this.loading = true
      this.error = null
      try {
        await api.deleteTopic(id)
        this.topics = this.topics.filter(t => t.id !== id)
      } catch {
        this.error = 'Failed to remove topic. Please try again.'
      } finally {
        this.loading = false
      }
    },

    navigateToEditWakeTime() {
      this.editContext = 'wake-time-edit'
      this.currentScreen = 'wake-time'
    },

    navigateToEditTimezone() {
      this.editContext = 'timezone-edit'
      this.currentScreen = 'timezone'
    },

    navigate(screen: Screen) {
      this.currentScreen = screen
      this.error = null
    },

    clearError() {
      this.error = null
    },
  },
})
