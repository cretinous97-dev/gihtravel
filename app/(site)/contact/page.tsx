import type { Metadata } from 'next'
import { Container, Eyebrow, Heading, Lead, Section } from '@/components/ui/layout'
import { Reveal } from '@/components/ui/reveal'
import { InquiryForm } from '@/components/inquiry-form'
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/icons'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { getContactPage } from '@/sanity/lib/content'

/**
 * /contact — enquiry form (Zod + RHF validated), contact details, map embed.
 * Submissions POST to /api/inquiry and land in Sanity + Gmail.
 */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage()
  return buildMetadata({
    title: page.seo?.metaTitle ?? 'Contact Us',
    description:
      'Plan your Bhutan journey with GIH Tour and Travel. Get in touch — we reply within 24–48 hours with a personalised plan.',
    path: '/contact',
    seo: page.seo,
  })
}

export default async function ContactPage() {
  const page = await getContactPage()

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]} />

      <section className="bg-himalaya-600 py-20 text-white">
        <Container>
          <Eyebrow className="text-ochre-200">{page.heroSubtitle ?? 'Get in touch'}</Eyebrow>
          <Heading level={1} className="text-white">
            {page.heroTitle}
          </Heading>
          <Lead className="mt-4 text-white/85">
            Tell us what your perfect Bhutan looks like — our team in Paro will craft the rest. We reply within 24–48
            hours.
          </Lead>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal>
                <InquiryForm />
              </Reveal>
            </div>

            {/* Details */}
            <aside className="lg:col-span-2">
              <Reveal>
                <div className="rounded-2xl border border-cream-200 bg-white p-8 shadow-soft">
                  <h2 className="font-serif text-heading-3 text-charcoal">Contact information</h2>
                  <ul className="mt-6 space-y-5">
                    <li className="flex items-start gap-4">
                      <span className="mt-0.5 text-ochre-500">
                        <PinIcon />
                      </span>
                      <div>
                        <p className="font-medium text-charcoal">Address</p>
                        <p className="text-body-sm text-charcoal-muted">
                          {page.addressLine}
                          <br />
                          {page.city}, {page.country}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="mt-0.5 text-ochre-500">
                        <PhoneIcon />
                      </span>
                      <div>
                        <p className="font-medium text-charcoal">Phone</p>
                        <a href={`tel:${page.phone.replace(/\s/g, '')}`} className="text-body-sm text-charcoal-muted hover:text-ochre-500">
                          {page.phone}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="mt-0.5 text-ochre-500">
                        <MailIcon />
                      </span>
                      <div>
                        <p className="font-medium text-charcoal">Email</p>
                        <a href={`mailto:${page.email}`} className="text-body-sm text-charcoal-muted hover:text-ochre-500">
                          {page.email}
                        </a>
                      </div>
                    </li>
                    {page.officeHours ? (
                      <li className="flex items-start gap-4">
                        <span className="mt-0.5 text-ochre-500">
                          <ClockIcon />
                        </span>
                        <div>
                          <p className="font-medium text-charcoal">Office hours</p>
                          <p className="text-body-sm text-charcoal-muted">{page.officeHours}</p>
                        </div>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </Reveal>

              {page.mapEmbedUrl ? (
                <Reveal>
                  <div className="mt-8 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft">
                    <iframe
                      src={page.mapEmbedUrl}
                      title={`Map showing ${page.city}, ${page.country}`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-72 w-full border-0"
                      allowFullScreen
                    />
                  </div>
                </Reveal>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}
