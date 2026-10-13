import Link from 'next/link'
import { existsSync } from 'fs'
import path from 'path'
import { Container } from '@/components/ui/layout'
import { ButtonLink } from '@/components/ui/button'
import { MobileNav } from '@/components/mobile-nav'
import type { SiteSettings } from '@/lib/types'

/**
 * Header — logo (with text wordmark fallback), primary navigation, and a
 * persistent "Plan Your Trip" CTA. Per the brand spec the logo is served
 * from /logo.png; if the file is missing we render the wordmark in the
 * serif heading font instead of a broken image.
 */

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Tours', href: '/tours' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'About Bhutan', href: '/about-bhutan' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function hasLogoFile(): boolean {
  try {
    return existsSync(path.join(process.cwd(), 'public', 'logo.png'))
  } catch {
    return false
  }
}

export function Header({ settings }: { settings: SiteSettings }) {
  // Per the brand spec: serve /logo.png when present; if missing, fall back
  // to the CMS logo; if that is missing too, render a text wordmark only.
  const logoSrc = hasLogoFile() ? '/logo.png' : settings.logo?.src

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          aria-label={`${settings.siteName} — home`}
        >
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- CMS/fallback logo; next/image adds no value for a small brand mark
            <img src={logoSrc} alt="" width={52} height={52} className="h-12 w-12 rounded-full object-contain" />
          ) : null}
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold tracking-tight text-himalaya-600 sm:text-xl">
              GIH Tour and Travel
            </span>
            <span className="block text-xs uppercase tracking-[0.18em] text-charcoal-muted">{settings.siteTagline}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-charcoal-soft transition-colors hover:bg-white hover:text-himalaya-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Plan Your Trip
          </ButtonLink>
          <MobileNav links={NAV_LINKS} />
        </div>
      </Container>
    </header>
  )
}
