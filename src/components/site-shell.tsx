import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { getSiteSettings } from '@/lib/cms'

const navigation = [
  { label: 'Journeys', href: '/packages' },
  { label: 'Places', href: '/destinations' },
  { label: 'Our story', href: '/about' },
  { label: 'Journal', href: '/blog' },
]

function Brand({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl) {
    return <Image src={logoUrl} alt={name} width={150} height={52} className="brand-image" priority />
  }
  return (
    <span className="brand-lockup">
      <span className="brand-mark" aria-hidden="true">G</span>
      <span className="brand-text">{name}</span>
    </span>
  )
}

export async function SiteHeader() {
  const settings = await getSiteSettings()
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-link" aria-label={`${settings.name} home`}>
          <Brand name={settings.name} logoUrl={settings.logoUrl} />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="header-phone" href={settings.phoneLink} aria-label={`Call ${settings.phone}`}>
            <Phone size={15} strokeWidth={1.7} /> <span>{settings.phone}</span>
          </Link>
          <Link className="header-cta" href="/booking">Plan a trip <ArrowUpRight size={15} /></Link>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation menu"><span></span><span></span></summary>
          <nav aria-label="Mobile navigation">
            <Link href="/">Home</Link>
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/faq">FAQs</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/visa">Visa information</Link>
            <Link href="/account">My bookings</Link>
          </nav>
        </details>
      </div>
    </header>
  )
}

export async function SiteFooter() {
  const settings = await getSiteSettings()
  return (
    <footer className="site-footer">
      <div className="footer-main wrap">
        <div className="footer-brand-column">
          <Link href="/" className="brand-link footer-brand"><Brand name={settings.name} logoUrl={settings.logoUrl} /></Link>
          <p className="footer-tagline">{settings.tagline}</p>
          <p className="footer-note">{settings.footerText.replace('{year}', String(new Date().getFullYear()))}</p>
        </div>
        <div className="footer-links">
          <h2>Explore</h2>
          <Link href="/packages">Bhutan journeys</Link>
          <Link href="/destinations">Places to visit</Link>
          <Link href="/faq">Travel questions</Link>
          <Link href="/testimonials">Guest stories</Link>
        </div>
        <div className="footer-links">
          <h2>Plan with us</h2>
          <Link href="/about">About GIH</Link>
          <Link href="/contact">Get in touch</Link>
          <Link href="/account">My bookings</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms of service</Link>
        </div>
        <div className="footer-contact">
          <h2>We’re in Paro</h2>
          <p><MapPin size={15} />{settings.address}</p>
          <Link href={settings.phoneLink}><Phone size={15} />{settings.phone}</Link>
          <Link href={`mailto:${settings.email}`}><Mail size={15} />{settings.email}</Link>
          <div className="footer-socials">
            {settings.socialLinks.map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noreferrer" aria-label={social.label}>
                {social.label === 'Instagram' ? <Instagram size={16} /> : <span>{social.label}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <span>{settings.legalName}</span>
        <span>Paro, Bhutan <span aria-hidden="true">·</span> USD</span>
      </div>
    </footer>
  )
}
