import { notFound } from 'next/navigation'
import { Container, Eyebrow } from '@/components/ui'
import { getContentPage } from '@/lib/cms'

export const metadata = { title: 'Privacy Policy | GIH Tour and Travel' }

export default async function PrivacyPolicyPage() {
  const page = await getContentPage('privacy-policy')
  if (!page) notFound()
  const paragraphs = page.body.split(/\n\n+/).filter(Boolean)
  return <Container><article className="plain-page"><Eyebrow>GIH Tour and Travel</Eyebrow><h1 className="page-hero-title">{page.title}</h1><div className="plain-text">{paragraphs.map((paragraph, index) => /^\d+\./.test(paragraph) || paragraph === paragraph.toUpperCase() ? <h2 key={index}>{paragraph}</h2> : <p key={index}>{paragraph}</p>)}</div></article></Container>
}
