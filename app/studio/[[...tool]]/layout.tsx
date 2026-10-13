import type { Metadata, Viewport } from 'next'

/**
 * Studio layout — keeps /studio out of search indexes. The root layout
 * provides <html>/<body>; Studio fills the viewport via NextStudio.
 */

export const metadata: Metadata = {
  title: 'Sanity Studio — GIH Tour and Travel',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ height: '100dvh' }}>{children}</div>
}
