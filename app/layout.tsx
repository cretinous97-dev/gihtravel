import type { Metadata, Viewport } from 'next'
import './globals.css'
import { getSiteSettings } from '@/sanity/lib/content'
import { absoluteUrl } from '@/lib/utils'

/**
 * Root layout — fonts, global metadata, and shared SEO defaults.
 * Fonts are loaded with a Google Fonts stylesheet link (keeps builds working
 * in offline/CI environments; swap for next/font when building on Vercel).
 */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    metadataBase: new URL(absoluteUrl('/')),
    title: {
      default: settings.defaultSeo.metaTitle ?? 'GIH Tour and Travel',
      template: '%s | GIH Tour and Travel',
    },
    description: settings.defaultSeo.metaDescription,
    openGraph: {
      siteName: settings.siteName,
      type: 'website',
    },
    icons: {
      icon: '/favicon.svg',
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Headings: Playfair Display · Body: Inter.
          Using a stylesheet link keeps `next build` hermetic; if you prefer
          self-hosted fonts later, switch to next/font/google.
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- intentional: stylesheet link keeps builds hermetic in offline/CI environments (see README) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
