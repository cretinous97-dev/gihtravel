'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container, Heading } from '@/components/ui/layout'

/**
 * Error boundary — friendly, on-brand failure state. Never shows a raw
 * stack trace to travellers. Retrying re-renders the route segment.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app] route error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center bg-cream py-24">
      <Container className="text-center">
        <p aria-hidden="true" className="font-serif text-6xl text-terracotta-400">
          !
        </p>
        <Heading level={1} className="mt-4">
          Something unexpected happened
        </Heading>
        <p className="mx-auto mt-4 max-w-measure text-body-lg text-charcoal-soft">
          We hit a bump on the mountain trail. Please try again — and if it keeps happening, call us on +975 17901780 or
          email gihbucketlist@gmail.com.
        </p>
        <div className="mt-8">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
        </div>
      </Container>
    </div>
  )
}
