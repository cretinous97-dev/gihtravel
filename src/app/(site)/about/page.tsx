import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Eyebrow } from '@/components/ui'
import { PageHero } from '@/components/page-hero'
import { getContentPage, getTeamMembers, getTestimonials } from '@/lib/cms'

export const metadata = { title: 'About GIH Tour and Travel' }

export default async function AboutPage() {
  const [page, team, stories] = await Promise.all([getContentPage('about'), getTeamMembers(), getTestimonials()])
  return (
    <>
      <PageHero eyebrow="A team from Bhutan" title={page?.title ?? 'About Glide Into Happiness Tours & Travel'} description="We know these valleys as home. We’d love to help you discover them at your own pace." />
      <section className="section"><Container className="detail-content-grid">
        <div className="plain-text">{(page?.body ?? '').split(/\n\n+/).filter(Boolean).map((paragraph, index) => paragraph === paragraph.toUpperCase() && paragraph.length < 100 ? <h2 key={index}>{paragraph}</h2> : <p key={index}>{paragraph}</p>)}</div>
        <aside className="detail-aside"><h3>Meet your local team</h3><p>Guides, storytellers and travel specialists who know the country from the inside.</p><Link href="#team" className="text-link">Meet the team <ArrowUpRight size={15} /></Link></aside>
      </Container></section>
      <section className="section section-sand" id="team"><Container>
        <div className="section-head-row"><div><Eyebrow>Meet our heart and soul</Eyebrow><h2 style={{ margin: 0, color: 'var(--pine)', fontFamily: 'var(--serif)', fontSize: 43, fontWeight: 400 }}>The people behind your journey.</h2></div></div>
        <div className="grid-3">{team.map((member) => <article key={member.name} className="testimonial-page-card"><Eyebrow>{member.role}</Eyebrow><h3 style={{ margin: '5px 0 12px', color: 'var(--pine)', fontFamily: 'var(--serif)', fontSize: 27, fontWeight: 400 }}>{member.name}</h3>{member.bio ? <p>{member.bio}</p> : null}</article>)}</div>
      </Container></section>
      <section className="section"><Container><div className="section-head-row"><div><Eyebrow>Stories from our guests</Eyebrow><h2 style={{ margin: 0, color: 'var(--pine)', fontFamily: 'var(--serif)', fontSize: 43, fontWeight: 400 }}>A few kind words from the road.</h2></div><Link href="/testimonials" className="text-link">Read all stories <ArrowUpRight size={15} /></Link></div><div className="testimonial-page-grid">{stories.slice(0, 3).map((story) => <article key={story.name} className="testimonial-page-card"><div className="quote-stars">★★★★★</div><blockquote>“{story.quote}”</blockquote><p>{story.name} · {story.country}</p></article>)}</div></Container></section>
    </>
  )
}
