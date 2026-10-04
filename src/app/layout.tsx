import type { Metadata } from 'next'
import './globals.css'
import { getSiteSettings } from '@/lib/cms'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  let metadataBase: URL | undefined
  try {
    const configuredUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? '')
    if (['http:', 'https:'].includes(configuredUrl.protocol) && configuredUrl.hostname) metadataBase = new URL(configuredUrl.origin)
  } catch { /* A site URL is configured separately for each deployed environment. */ }
  const heroImage = settings.heroImage ?? '/images/bhutan-himalayan-hero.jpg'
  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: settings.seoTitle,
    description: settings.seoDescription,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      type: 'website',
      ...(metadataBase ? { images: [{ url: new URL(heroImage, metadataBase).toString(), width: 1600, height: 900, alt: settings.heroHeadline }] } : {}),
    },
    twitter: { card: 'summary_large_image', title: settings.seoTitle, description: settings.seoDescription },
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
