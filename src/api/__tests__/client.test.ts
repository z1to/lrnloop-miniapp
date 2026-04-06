// src/api/__tests__/client.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Stub window.Telegram before importing client
const mockInitData = 'query_id=abc&user=%7B%22id%22%3A123%7D&hash=xyz'
vi.stubGlobal('Telegram', {
  WebApp: { initData: mockInitData },
})

// Import after stub
const { api, ApiError } = await import('../client')

describe('api client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('getMe sends GET /miniapp/me with initData header', async () => {
    const mockResponse = { user: { id: '1' }, topics: [], onboarding_complete: false }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response)

    const result = await api.getMe()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/miniapp/me'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'X-Telegram-Init-Data': mockInitData,
        }),
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it('postOnboarding sends POST /miniapp/onboarding with snake_case body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: '1', wake_time: '07:00:00' }),
    } as Response)

    await api.postOnboarding('07:00', 'America/New_York')

    const [, opts] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse((opts as RequestInit).body as string)
    expect(body).toEqual({ wake_time: '07:00', timezone: 'America/New_York' })
  })

  it('postTopic sends POST /miniapp/topics', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: '2', title: 'Stoicism' }),
    } as Response)

    await api.postTopic('Stoicism')

    const [, opts] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse((opts as RequestInit).body as string)
    expect(body).toEqual({ title: 'Stoicism' })
  })

  it('deleteTopic sends DELETE and returns undefined on 204', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => { throw new Error('no body') },
    } as Response)

    const result = await api.deleteTopic('topic-id-123')
    expect(result).toBeUndefined()

    const [url] = vi.mocked(fetch).mock.calls[0]
    expect(url).toContain('/miniapp/topics/topic-id-123')
  })

  it('throws ApiError with status and body on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ detail: 'Invalid initData' }),
    } as Response)

    await expect(api.getMe()).rejects.toMatchObject({
      status: 403,
      body: { detail: 'Invalid initData' },
    })
  })

  it('throws ApiError on 429', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ detail: 'Topic limit reached' }),
    } as Response)

    const err = await api.postTopic('test').catch(e => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(429)
  })
})
