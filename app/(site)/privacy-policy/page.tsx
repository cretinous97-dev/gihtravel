import type { Metadata } from 'next'
import { Container, Eyebrow, Heading, Section } from '@/components/ui/layout'
import { RichText } from '@/components/rich-text'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { getLegalPage } from '@/sanity/lib/content'

/** /privacy-policy — rendered from the `privacy-policy` legalPage document. */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('privacy-policy')
  return buildMetadata({
    title: page?.seo?.metaTitle ?? 'Privacy Policy',
    description: page?.seo?.metaDescription ?? 'How GIH Tour and Travel collects, uses and protects your personal information.',
    path: '/privacy-policy',
    seo: page?.seo,
    type: 'article',
  })
}

export default async function PrivacyPolicyPage() {
  const page = await getLegalPage('privacy-policy')

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/privacy-policy' }]} />
      <Section tone="cream">
        <Container className="max-w-4xl">
          <Eyebrow>Legal</Eyebrow>
          <Heading level={1}>{page?.title ?? 'Privacy Policy'}</Heading>
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
