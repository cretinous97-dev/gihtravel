/**
 * Simple in-memory sliding-window rate limiter for the /api/inquiry endpoint.
 *
 * On Vercel's serverless platform each lambda instance keeps its own Map, so
 * this is a best-effort guard rather than a global quota — it stops bursts
 * from a single client hitting one instance, and the honeypot + Zod checks
 * handle the rest. If spam becomes a problem, swap this module for a
 * Upstash/Vercel KV implementation; the exported API is intentionally tiny.
 */

type Bucket = { timestamps: number[] }

const buckets = new Map<string, Bucket>()

// Periodically drop idle buckets so the Map cannot grow unbounded.
const MAX_BUCKETS = 5_000
const IDLE_MS = 10 * 60 * 1000

function prune(now: number): void {
  if (buckets.size < MAX_BUCKETS) {
    for (const [key, bucket] of buckets) {
      if (bucket.timestamps.every((t) => now - t > IDLE_MS)) buckets.delete(key)
    }
    return
  }
  // Hard cap reached: clear everything (fail-open rather than leak memory).
  buckets.clear()
}

/**
 * Record a hit for `key` and report whether it is allowed.
 * @param key stable identifier (e.g. client IP)
 * @param limit max hits per window
 * @param windowMs window length in milliseconds
 */
export function rateLimit(key: string, limit = 5, windowMs = 60_000): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  prune(now)

  const bucket = buckets.get(key) ?? { timestamps: [] }
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs)

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now
    buckets.set(key, bucket)
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)) }
  }

  bucket.timestamps.push(now)
  buckets.set(key, bucket)
  return { allowed: true, retryAfterSeconds: 0 }
}

/** Test helper: clear all buckets. */
export function resetRateLimiter(): void {
  buckets.clear()
}
