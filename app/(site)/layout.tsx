import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { StickyCta } from '@/components/sticky-cta'
import { getSiteSettings } from '@/sanity/lib/content'

/**
 * Public site shell — header, footer, sticky mobile CTA.
 * Settings come from the CMS (or bundled fallback content).
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header settings={settings} />
      <main id="main-content">{children}</main>
      <Footer settings={settings} phone="+975 17901780" email="gihbucketlist@gmail.com" />
      <StickyCta />
    </>
  )
}
