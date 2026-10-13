import type { Metadata } from 'next'
import { Container, Eyebrow, Heading, Section } from '@/components/ui/layout'
import { RichText } from '@/components/rich-text'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { getLegalPage } from '@/sanity/lib/content'

/** /terms — rendered from the `terms` legalPage document. */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('terms')
  return buildMetadata({
    title: page?.seo?.metaTitle ?? 'Terms & Conditions of Service',
    description: page?.seo?.metaDescription ?? 'Booking terms, payments, cancellations and conditions of service for GIH Tour and Travel.',
    path: '/terms',
    seo: page?.seo,
    type: 'article',
  })
}

export default async function TermsPage() {
  const page = await getLegalPage('terms')

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Terms & Conditions', path: '/terms' }]} />
      <Section tone="cream">
        <Container className="max-w-4xl">
          <Eyebrow>Legal</Eyebrow>
          <Heading level={1}>{page?.title ?? 'Terms & Conditions of Service'}</Heading>
          {page?.lastUpdated ? (
            <p className="mt-3 text-sm text-charcoal-muted">Last updated: {page.lastUpdated}</p>
          ) : null}
          <RichText value={page?.body} className="mt-8" />
          {!page ? (
            <p className="mt-8 text-charcoal-muted">
              This page is being prepared. Please check back soon, or contact us at gihbucketlist@gmail.com.
            </p>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
