import { Card, CardBody } from '@/components/ui/card'
import type { Testimonial } from '@/lib/types'

/**
 * TestimonialCard — a real traveller quote with name, country and optional
 * photo. Quotes are shown word-for-word; never paraphrased.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full">
      <CardBody className="flex h-full flex-col">
        <div aria-hidden="true" className="font-serif text-4xl text-ochre-400">
          &ldquo;
        </div>
        <blockquote className="flex-1 text-body text-charcoal-soft">
          <p>{testimonial.quote}</p>
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          {testimonial.photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote CMS images are served unoptimized by design
            <img
              src={testimonial.photo.src}
              alt={testimonial.photo.alt}
              loading="lazy"
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-ochre-100 font-serif text-lg text-ochre-600">
              {testimonial.name.charAt(0)}
            </span>
          )}
          <div>
            <p className="font-semibold text-charcoal">{testimonial.name}</p>
            {testimonial.country ? <p className="text-sm text-charcoal-muted">{testimonial.country}</p> : null}
          </div>
          {testimonial.rating ? (
            <p className="ml-auto text-sm text-ochre-500" aria-label={`Rated ${testimonial.rating} out of 5 stars`}>
              {'★'.repeat(testimonial.rating)}
              <span className="sr-only"> stars</span>
            </p>
          ) : null}
        </figcaption>
      </CardBody>
    </Card>
  )
}
