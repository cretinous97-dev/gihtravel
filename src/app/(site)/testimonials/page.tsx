import { Container, Eyebrow } from '@/components/ui'
import { PageHero } from '@/components/page-hero'
import { getTestimonials } from '@/lib/cms'

export const metadata = { title: 'Guest stories | GIH Tour and Travel' }

export default async function TestimonialsPage() {
  const stories = await getTestimonials()
  return (
    <>
      <PageHero eyebrow="Notes from our guests" title="Travelers share their GIH journeys." description="A selection of the words guests have shared about their time in Bhutan." />
      <section className="section"><Container><div className="testimonial-page-grid">{stories.map((story) => <article className="testimonial-page-card" key={`${story.name}-${story.title}`}><Eyebrow>{story.title}</Eyebrow><div className="quote-stars">★★★★★</div><blockquote>“{story.quote}”</blockquote><p>{story.name} · {story.country}</p></article>)}</div></Container></section>
    </>
  )
}
