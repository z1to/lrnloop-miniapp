// src/api/client.ts
import type { MiniappDashboardResponse, TopicResponse, UserResponse } from './types'

export class ApiError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`API error ${status}`)
    this.name = 'ApiError'
  }
}

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const initData = window.Telegram?.WebApp?.initData ?? ''
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': initData,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new ApiError(res.status, errorBody)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  getMe: () =>
    request<MiniappDashboardResponse>('GET', '/miniapp/me'),

  postOnboarding: (wakeTime: string, timezone: string) =>
    request<UserResponse>('POST', '/miniapp/onboarding', {
      wake_time: wakeTime,
      timezone,
    }),

  postTopic: (title: string) =>
    request<TopicResponse>('POST', '/miniapp/topics', { title }),

  deleteTopic: (id: string) =>
    request<void>('DELETE', `/miniapp/topics/${id}`),
}
