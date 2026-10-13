import { ButtonLink } from '@/components/ui/button'
import { Container, Heading } from '@/components/ui/layout'

/**
 * 404 — on-brand not-found page. The (site) layout header/footer wrap route
 * group misses automatically, so this renders inside the site shell.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center bg-cream py-24">
      <Container className="text-center">
        <p aria-hidden="true" className="font-serif text-7xl text-ochre-400">
          404
        </p>
        <Heading level={1} className="mt-4">
          This path has wandered off the trail
        </Heading>
        <p className="mx-auto mt-4 max-w-measure text-body-lg text-charcoal-soft">
          The page you are looking for may have moved or never existed. Let&apos;s get your journey back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Go back to homepage</ButtonLink>
          <ButtonLink href="/tours" variant="secondary">
            Explore tours
          </ButtonLink>
        </div>
      </Container>
    </div>
  )
}
