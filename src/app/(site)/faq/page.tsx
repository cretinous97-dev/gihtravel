import { PageHero } from '@/components/page-hero'
import { Container } from '@/components/ui'
import { getFAQs } from '@/lib/cms'

export const metadata = { title: 'Frequently asked questions | GIH Tour and Travel' }

export default async function FAQPage() {
  const faqs = await getFAQs()
  return (
    <>
      <PageHero eyebrow="Before you go" title="A few things worth knowing." description="Answers to common questions about visas, travel, payments and getting around Bhutan." />
      <section className="section"><Container>
        <div className="faq-list">{faqs.map((faq, index) => <details className="faq-item" key={faq.question} open={index === 0}><summary>{faq.question}</summary><div className="faq-answer">{faq.answer}</div></details>)}</div>
        <p className="faq-help">Still wondering about something? <a href="/contact" className="text-link">Talk with our team</a>.</p>
      </Container></section>
    </>
  )
}
