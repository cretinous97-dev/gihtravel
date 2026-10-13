'use client'

import { useState } from 'react'
import { TestimonialCard } from '@/components/testimonial-card'
import type { Testimonial } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * TestimonialCarousel — simple prev/next carousel showing one card per slide
 * on mobile, two on larger screens. No autoplay (motion-sensitive visitors).
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0)
  if (testimonials.length === 0) return null

  const maxIndex = Math.max(0, testimonials.length - 1)
  const visible = [testimonials[index], testimonials[(index + 1) % testimonials.length]].filter(
    (t): t is Testimonial => Boolean(t),
  )

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2" aria-live="polite">
        {visible.map((t) => (
          <TestimonialCard key={t._id} testimonial={t} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-200 bg-white text-himalaya-600 transition-colors hover:border-ochre-400 hover:text-ochre-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
          aria-label="Previous testimonials"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12 4 6 10l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex gap-2" role="tablist" aria-label="Choose testimonial slide">
          {testimonials.map((t, i) => (
            <button
              key={t._id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-2.5 rounded-full transition-all',
                i === index ? 'w-8 bg-ochre-400' : 'w-2.5 bg-cream-200 hover:bg-sage-300',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % (maxIndex + 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-200 bg-white text-himalaya-600 transition-colors hover:border-ochre-400 hover:text-ochre-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
          aria-label="Next testimonials"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m8 4 6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
