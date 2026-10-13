import Link from 'next/link'
import { Container } from '@/components/ui/layout'
import { RichText } from '@/components/rich-text'
import type { SiteSettings } from '@/lib/types'

/**
 * Footer — contact details, quick links, social links, and a short
 * sustainability note (Bhutan's high-value, low-impact promise).
 */

const SOCIAL_LABELS: Record<string, string> = {
  WhatsApp: 'WhatsApp',
  Facebook: 'Facebook',
  Instagram: 'Instagram',
  X: 'X (Twitter)',
  YouTube: 'YouTube',
  TripAdvisor: 'TripAdvisor',
}

export function Footer({ settings, phone, email }: { settings: SiteSettings; phone: string; email: string }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-himalaya-700/40 bg-himalaya-600 text-cream">
      <Container className="py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-2xl">{settings.siteName}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-cream/70">{settings.siteTagline}</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/80">
              Every journey aligns with Bhutan&apos;s high-value, low-impact tourism policy — supporting conservation,
              culture, and community.
            </p>
          </div>

          {settings.footerColumns.map((column) => (
            <nav key={column._key} aria-label={column.heading}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ochre-200">{column.heading}</h2>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link href={link.href} className="text-sm text-cream/85 transition-colors hover:text-ochre-200">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-cream/85 transition-colors hover:text-ochre-200"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-cream/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/80">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-ochre-200">
              {phone}
            </a>
            <a href={`mailto:${email}`} className="hover:text-ochre-200">
              {email}
            </a>
            <span>Paro, Bhutan</span>
          </div>
          {settings.socialLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-3">
              {settings.socialLinks.map((social) => (
                <li key={social._key}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-cream/25 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-cream/85 transition-colors hover:border-ochre-200 hover:text-ochre-200"
                  >
                    {SOCIAL_LABELS[social.platform] ?? social.platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-8 text-sm text-cream/60">
          <RichText value={settings.footerText} />
          {settings.footerText.length === 0 ? <p>© {year} {settings.siteName}. All rights reserved.</p> : null}
        </div>
      </Container>
    </footer>
  )
}
