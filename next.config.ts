import type { NextConfig } from 'next'

/**
 * Next.js configuration for GIH Tour and Travel.
 *
 * `images.unoptimized` is intentionally `true` so remote photography
 * (legacy gihtourtravel.com URLs seeded from the old site, and later
 * Sanity-hosted assets) is served straight from its CDN to the browser.
 * This keeps the site working in restricted build/preview environments and
 * avoids bundling an image-optimisation dependency into the free tier.
 * To enable Vercel's image optimisation later, set `unoptimized: false` —
 * the remotePatterns below already whitelist both image hosts.
 */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'gihtourtravel.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
