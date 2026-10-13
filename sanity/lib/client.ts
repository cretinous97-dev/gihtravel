import { createClient, type SanityClient } from 'next-sanity'

/**
 * Sanity client used for all data fetching (server-side) and, with
 * `SANITY_API_WRITE_TOKEN`, for writes (inquiries + the seed script).
 *
 * When the project is not configured yet (no NEXT_PUBLIC_SANITY_PROJECT_ID),
 * `isSanityConfigured` is false and `sanityFetch` falls back to the bundled
 * seed content — the site renders complete, real content from day one and
 * switches to live CMS data the moment the owner fills in `.env.local`.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

export const isSanityConfigured =
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your-project-id'

/** Read client (published content only, CDN, no token needed). */
export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: { enabled: false },
})

/** Write client (seed script + inquiry creation). Requires a write token. */
export const writeClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  stega: { enabled: false },
})

/**
 * Fetch with graceful failure: returns `null` when Sanity is unconfigured or
 * unreachable so pages can fail softly instead of crashing.
 */
export async function sanityFetch<T>(options: { query: string; params?: Record<string, unknown>; tags?: string[] }): Promise<T | null> {
  if (!isSanityConfigured) return null
  try {
    return await client.fetch<T>(options.query, options.params ?? {}, {
      next: { revalidate: 60, tags: options.tags },
    })
  } catch (error) {
    console.error('[sanity] fetch failed:', error)
    return null
  }
}

/** Can we write to Sanity (inquiries / seeding)? */
export function isSanityWriteConfigured(): boolean {
  return isSanityConfigured && Boolean(process.env.SANITY_API_WRITE_TOKEN)
}
