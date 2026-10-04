import type { ReactNode } from 'react'
import { Container, Eyebrow } from '@/components/ui'

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <Container className="page-hero-inner">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {description ? <p className="page-hero-copy">{description}</p> : children}
      </Container>
    </section>
  )
}
