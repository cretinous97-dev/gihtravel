import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { DestinationCard, TripCard } from '@/components/cards'
import { Container, Eyebrow, OutlineLink, PrimaryLink, SectionHeading } from '@/components/ui'
import { getDestinations, getSiteSettings, getTestimonials, getTrips } from '@/lib/cms'

export default async function HomePage() {
  const [settings, trips, destinations, testimonials] = await Promise.all([
    getSiteSettings(), getTrips(), getDestinations(), getTestimonials(),
  ])
  const featuredTrips = trips.filter((trip) => trip.featured).slice(0, 6)
  const featuredPlaces = destinations.filter((place) => place.pageFound).slice(0, 4)
  const guestStories = testimonials.slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="hero-image"><Image src={settings.heroImage ?? '/images/bhutan-himalayan-hero.jpg'} alt="Morning light settles over forested Bhutanese mountains and prayer flags" fill priority sizes="100vw" /></div>
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker">Paro, Bhutan <span aria-hidden="true">·</span> Made with local care</p>
          <h1>{settings.heroHeadline}</h1>
          <p className="hero-copy">{settings.heroSubheadline}</p>
          <div className="hero-actions">
            <PrimaryLink href="/packages">Explore our journeys <ArrowUpRight size={15} /></PrimaryLink>
            <OutlineLink href="/contact" className="button-white">Talk with our team</OutlineLink>
          </div>
        </div>
        <a className="hero-note" href="#welcome"><ArrowDown size={14} /> A slower way to travel</a>
      </section>

      <section className="intro-band" id="welcome">
        <Container className="intro-grid">
          <div>
            <p className="intro-label">A warm welcome to Bhutan</p>
            <h2>{settings.introductionHeading}</h2>
          </div>
          <div className="intro-copy">
            <p>{settings.introduction}</p>
            <Link href="/about" className="text-link">Get to know GIH <ArrowUpRight size={15} /></Link>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="section-head-row">
            <SectionHeading eyebrow="Find your kind of Bhutan" title="Journeys shaped around the way you like to travel." text="Browse a few of our Bhutan trips, then tell us what matters to you. We’ll help with the details." />
            <Link href="/packages" className="text-link">View all journeys <ArrowUpRight size={15} /></Link>
          </div>
          <div className="grid-3">
            {featuredTrips.map((trip) => <TripCard key={trip.slug} trip={trip} />)}
          </div>
        </Container>
      </section>

      <section className="section section-sand">
        <Container>
          <div className="section-head-row">
            <SectionHeading eyebrow="Across the valleys" title="A closer look at Bhutan." text="From the country’s only international airport to quiet central valleys, each place has its own pace and stories." />
            <Link href="/destinations" className="text-link">All destinations <ArrowUpRight size={15} /></Link>
          </div>
          <div className="destinations-grid">
            {featuredPlaces.map((place) => <DestinationCard key={place.slug} destination={place} />)}
          </div>
        </Container>
      </section>

      <section className="feature-split">
        <div className="feature-split-image">
          <Image src={settings.featureImage ?? '/images/bhutanese-farm-meal.jpg'} alt="A Bhutanese meal set out on a wooden table in a local farmhouse" fill sizes="(max-width: 760px) 100vw, 50vw" />
        </div>
        <div className="feature-split-copy">
          <Eyebrow light>Why Bhutan? Why GIH?</Eyebrow>
          <h2>{settings.whyHeading}</h2>
          <p>{settings.whyText}</p>
          <PrimaryLink href="/about">Our way of travelling <ArrowUpRight size={15} /></PrimaryLink>
        </div>
      </section>

      <section className="section section-forest">
        <Container>
          <div className="section-head-row">
            <SectionHeading eyebrow="A note from the road" title="Travelers share their GIH journeys." light />
            <Link href="/testimonials" className="text-link">Read every story <ArrowUpRight size={15} /></Link>
          </div>
          <div className="quote-grid">
            {guestStories.map((story) => (
              <article className="quote-card" key={`${story.name}-${story.title}`}>
                <div>
                  <div className="quote-stars" aria-label="Five out of five">★★★★★</div>
                  <blockquote>“{story.quote}”</blockquote>
                </div>
                <div className="quote-by">{story.name} <span>· {story.country}</span></div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section-tight">
        <Container>
          <div className="cta-panel">
            <div>
              <Eyebrow>Let’s start with a conversation</Eyebrow>
              <h2>Tell us what you’d love to see in Bhutan.</h2>
            </div>
            <Link href="/contact" className="button button-primary">Plan a trip with GIH <ArrowUpRight size={15} /></Link>
          </div>
        </Container>
      </section>
    </>
  )
}
