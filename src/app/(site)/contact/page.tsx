import { Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { Container, Eyebrow } from '@/components/ui'
import { PageHero } from '@/components/page-hero'
import { getSiteSettings } from '@/lib/cms'

export const metadata = { title: 'Contact GIH Tour and Travel' }

type ContactProps = { searchParams: Promise<{ package?: string | string[] }> }

export default async function ContactPage({ searchParams }: ContactProps) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams])
  const selectedPackage = Array.isArray(params.package) ? params.package[0] : params.package
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Tell us what you have in mind." description="A short note is enough to get started. Our team in Paro will help you work through the details." />
      <section className="section"><Container className="detail-content-grid">
        <div><ContactForm initialSubject={selectedPackage ? `Question about ${selectedPackage.replaceAll('-', ' ')}` : ''} /></div>
        <aside className="detail-aside"><Eyebrow>We’re in Paro</Eyebrow><h2 style={{ margin: '0 0 20px', color: 'var(--pine)', fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 400 }}>Let’s talk about Bhutan.</h2><p style={{ color: '#68766d', fontSize: 13 }}>Glide Into Happiness Tour and Travel</p><ul className="detail-list"><li><MapPin size={14} style={{ display: 'inline', marginRight: 7 }} />{settings.address}</li><li><Phone size={14} style={{ display: 'inline', marginRight: 7 }} /><a href={settings.phoneLink}>{settings.phone}</a></li><li><Mail size={14} style={{ display: 'inline', marginRight: 7 }} /><a href={`mailto:${settings.email}`}>{settings.email}</a></li></ul><div style={{ marginTop: 24 }}><Eyebrow>Follow our travels</Eyebrow>{settings.socialLinks.map((social) => <p key={social.label} style={{ margin: '9px 0', fontSize: 12 }}><a href={social.url} target="_blank" rel="noreferrer">{social.label} ↗</a></p>)}</div></aside>
      </Container></section>
    </>
  )
}
