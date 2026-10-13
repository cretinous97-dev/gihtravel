import { rateLimit, resetRateLimiter } from '@/lib/rate-limit'

/**
 * Tests for the inquiry rate limiter (in-memory sliding window) and the
 * Sanity client's fail-soft behaviour.
 */

// The real next-sanity client pulls ESM-only helpers that Jest's jsdom
// environment cannot parse; we only need createClient to be importable.
jest.mock('next-sanity', () => ({
  createClient: () => ({
    fetch: jest.fn().mockResolvedValue(null),
  }),
}))

describe('rateLimit', () => {
  beforeEach(() => {
    resetRateLimiter()
  })

  it('allows up to the limit within the window', () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit('ip-a', 5, 60_000).allowed).toBe(true)
    }
  })

  it('blocks the next request within the window', () => {
    for (let i = 0; i < 5; i++) rateLimit('ip-a', 5, 60_000)
    const result = rateLimit('ip-a', 5, 60_000)
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks keys independently', () => {
    for (let i = 0; i < 5; i++) rateLimit('ip-a', 5, 60_000)
    expect(rateLimit('ip-b', 5, 60_000).allowed).toBe(true)
  })

  it('allows again after the window slides', () => {
    for (let i = 0; i < 3; i++) rateLimit('ip-c', 3, 50) // 50ms window
    expect(rateLimit('ip-c', 3, 50).allowed).toBe(false)
    const later = Date.now() + 100
    jest.spyOn(Date, 'now').mockReturnValue(later)
    expect(rateLimit('ip-c', 3, 50).allowed).toBe(true)
    ;(Date.now as jest.Mock).mockRestore?.()
    jest.restoreAllMocks()
  })
})

describe('sanity client fail-soft behaviour', () => {
  const ORIGINAL = { ...process.env }

  afterEach(() => {
    process.env = { ...ORIGINAL }
    jest.resetModules()
  })

  it('reports unconfigured and returns null when no project id is set', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    jest.resetModules()
    const mod = await import('@/sanity/lib/client')
    expect(mod.isSanityConfigured).toBe(false)
    await expect(mod.sanityFetch({ query: '*[_type == "tour"]' })).resolves.toBeNull()
  })

  it('reports configured when a real-looking project id is present', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'abc12345'
    jest.resetModules()
    const mod = await import('@/sanity/lib/client')
    expect(mod.isSanityConfigured).toBe(true)
  })

  it('requires a write token before writes are considered configured', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'abc12345'
    delete process.env.SANITY_API_WRITE_TOKEN
    jest.resetModules()
    const mod = await import('@/sanity/lib/client')
    expect(mod.isSanityWriteConfigured()).toBe(false)

    process.env.SANITY_API_WRITE_TOKEN = 'sk-real-token'
    jest.resetModules()
    const mod2 = await import('@/sanity/lib/client')
    expect(mod2.isSanityWriteConfigured()).toBe(true)
  })
})
