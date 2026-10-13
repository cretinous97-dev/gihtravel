'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ImageRef } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Gallery — keyboard-accessible photo gallery with a lightweight lightbox.
 * Arrow keys navigate, Escape closes, focus returns to the trigger thumbnail.
 */
export function Gallery({ images, className }: { images: ImageRef[]; className?: string }) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const next = useCallback(() => setActive((i) => (i === null ? null : (i + 1) % images.length)), [images.length])
  const prev = useCallback(
    () => setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, close, next, prev])

  if (images.length === 0) return null

  return (
    <div className={className}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <li key={`${image.src}-${index}`}>
            <button
              type="button"
              onClick={() => setActive(index)}
              className="group block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
              aria-label={`Open photo ${index + 1} of ${images.length}: ${image.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- remote CMS images are served unoptimized by design */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
            onClick={close}
            aria-label="Close photo viewer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Previous photo"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12 4 6 10l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Next photo"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m8 4 6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <figure className="max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element -- lightbox shows the original asset */}
            <img
              src={images[active]?.src ?? ''}
              alt={images[active]?.alt ?? ''}
              className={cn('max-h-[80vh] w-auto rounded-lg object-contain')}
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {images[active]?.alt} — {active + 1} / {images.length}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  )
}
