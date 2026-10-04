import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
  let sitemap: string | undefined
  try {
    const siteUrl = new URL(configuredUrl ?? '')
    if (['http:', 'https:'].includes(siteUrl.protocol) && siteUrl.hostname) sitemap = `${siteUrl.origin}/sitemap.xml`
  } catch { /* Set the canonical site URL to include the sitemap in robots.txt. */ }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/account', '/login', '/register'] },
    ...(sitemap ? { sitemap } : {}),
  }
}
