import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui'
import { PageHero } from '@/components/page-hero'
import { getContentPage } from '@/lib/cms'

export async function ImportedContentPage({ slug, eyebrow, notice }: { slug: string; eyebrow: string; notice?: string }) {
  const page = await getContentPage(slug)
  if (!page) notFound()
  const paragraphs = page.body.split(/\n\n+/).filter(Boolean)
  return <>
    <PageHero eyebrow={eyebrow} title={page.title} description={page.description || undefined} />
    <Container><article className="plain-page" style={{ paddingTop: 42 }}>
      {notice ? <div className="booking-notice"><strong>Before you rely on this information:</strong> {notice}</div> : null}
      <div className="plain-text">{paragraphs.map((paragraph, index) => /^\d+\./.test(paragraph) || paragraph === paragraph.toUpperCase() ? <h2 key={index}>{paragraph}</h2> : <p key={index}>{paragraph}</p>)}</div>
      {page.sourceUrl ? <p className="source-note">Imported from the <a href={page.sourceUrl} target="_blank" rel="noreferrer">GIH Tour and Travel source page</a>.</p> : null}
      <p className="faq-help">Questions? <Link href="/contact" className="text-link">Contact GIH</Link>.</p>
    </article></Container>
  </>
}
