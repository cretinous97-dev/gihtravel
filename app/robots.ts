import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/utils'

/** robots.txt — allow everything public; disallow the embedded Studio. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
