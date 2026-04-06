// src/api/types.ts

export interface UserResponse {
  id: string
  email: string | null
  name: string | null
  telegram_user_id: number | null
  telegram_username: string | null
  telegram_first_name: string | null
  timezone: string | null
  wake_time: string | null  // FastAPI serialises Python `time` as "HH:MM:SS"
  is_active: boolean
  created_at: string | null
}

export interface TopicResponse {
  id: string
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  schedule_frequency: 'light' | 'standard' | 'intensive'
  is_active: boolean
  sr_stability: number | null
  sr_difficulty: number | null
  sr_next_review_at: string | null
  created_at: string | null
}

export interface MiniappDashboardResponse {
  user: UserResponse
  topics: TopicResponse[]
  onboarding_complete: boolean
}
