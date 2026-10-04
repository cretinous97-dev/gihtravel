'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Status = { paid?: boolean; bookingReference?: string; message?: string; error?: string }

export function CheckoutReturn() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const [status, setStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(() => Boolean(sessionId))

  useEffect(() => {
    let alive = true
    if (!sessionId) return
    fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((result: Status) => { if (alive) setStatus(result) })
      .catch(() => { if (alive) setStatus({ error: 'We could not check this payment yet.' }) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [sessionId])

  const heading = status?.paid
    ? 'Payment received.'
    : loading
      ? 'Checking your payment…'
      : status?.error
        ? 'We could not confirm your payment yet.'
        : sessionId
          ? 'Your payment is being checked.'
          : 'No payment session was found.'

  return <div className="checkout-return">
    <p className="eyebrow">GIH Tour and Travel</p>
    <h1>{heading}</h1>
    {status?.paid ? <><p>Thank you. Your booking reference is <strong>{status.bookingReference}</strong>. The GIH team will contact you to confirm trip availability and details.</p><Link href="/account" className="button button-primary">View my bookings</Link></> : <><p>{status?.error || (sessionId ? 'Stripe has returned you to GIH. Payment confirmation may take a moment to appear in your account.' : 'To make a booking, choose a GIH trip and continue through secure checkout.')}</p><Link href={sessionId ? '/account' : '/packages'} className="button button-primary">{sessionId ? 'Go to my account' : 'Browse journeys'}</Link></>}
  </div>
}
