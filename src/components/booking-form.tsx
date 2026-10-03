'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Trip } from '@/data/trips'
import { todayInBhutan } from '@/lib/format'

type Customer = { id: string | number; email: string; fullName?: string }
type CheckoutResult = { url?: string; error?: string; errors?: Array<{ message?: string }> }

export function BookingForm({ trip }: { trip: Trip }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [travelers, setTravelers] = useState(1)
  const perTraveler = trip.priceUsd ?? 0
  const total = useMemo(() => Math.max(1, Number(travelers) || 1) * perTraveler, [travelers, perTraveler])
  const next = encodeURIComponent(`/booking?package=${trip.slug}`)

  useEffect(() => {
    let active = true
    fetch('/api/customers/me?depth=0', { credentials: 'same-origin', cache: 'no-store' })
      .then((response) => response.json())
      .then((data: { user?: Customer | null }) => { if (active) setCustomer(data.user ?? null) })
      .catch(() => { if (active) setCustomer(null) })
      .finally(() => { if (active) setAuthChecked(true) })
    return () => { active = false }
  }, [])

  async function submit(formData: FormData) {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: trip.slug,
          travelDate: formData.get('travelDate'),
          travelers: Number(formData.get('travelers')),
          specialRequests: formData.get('specialRequests'),
          termsAccepted: formData.get('termsAccepted') === 'on',
        }),
      })
      const result = await response.json() as CheckoutResult
      if (!response.ok || !result.url) throw new Error(result.errors?.[0]?.message || result.error || 'We could not start checkout.')
      window.location.assign(result.url)
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'We could not start checkout.') }
    finally { setBusy(false) }
  }

  if (!trip.priceUsd || !trip.pricePerPerson) {
    return <div className="quote-only"><strong>Online checkout is not available for this trip yet.</strong><br />The previous site did not confirm whether the listed amount is per traveler or for the full group. Please contact GIH to confirm the current rate before booking.<p><Link className="text-link" href={`/contact?package=${trip.slug}`}>Ask GIH to confirm the rate</Link></p></div>
  }

  if (!authChecked) return <div className="booking-notice">Checking your GIH account…</div>
  if (!customer) {
    return <div className="booking-notice"><strong>Sign in to continue with a booking.</strong><br />Your booking and payment details will be available in your account. <div className="auth-actions"><Link href={`/login?next=${next}`} className="button button-primary">Sign in</Link><Link href={`/register?next=${next}`} className="button button-outline">Create account</Link></div></div>
  }

  return (
    <div className="booking-form-area">
      <form className="form-card" action={submit}>
        <div className="form-grid">
          <div className="form-field"><label htmlFor="booking-date">Preferred travel date</label><input id="booking-date" name="travelDate" type="date" required min={todayInBhutan()} /></div>
          <div className="form-field"><label htmlFor="booking-travelers">Number of travelers</label><input id="booking-travelers" name="travelers" type="number" min="1" max="99" value={travelers} onChange={(event) => setTravelers(Math.max(1, Math.min(99, Number(event.target.value))))} required /></div>
        </div>
        <div className="form-field"><label htmlFor="booking-requests">Anything else you’d like us to know?</label><textarea id="booking-requests" name="specialRequests" maxLength={3000} /></div>
        {trip.addOns.length ? <div className="booking-notice"><strong>Optional extras</strong><br />Your package lists optional extras whose current prices have not been confirmed. These are not included in the payment total. Contact GIH if you would like to add one.</div> : null}
        <label className="consent-row"><input type="checkbox" name="termsAccepted" required /><span>I have read the <Link href="/terms" target="_blank">Terms of Service</Link> and <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>.</span></label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="button button-primary" disabled={busy}>{busy ? 'Preparing secure checkout…' : 'Continue to secure payment'}</button>
        <p className="stripe-notice">Payment is securely processed by Stripe. Your preferred date is a request; GIH will confirm availability and trip details after payment.</p>
      </form>
      <aside className="booking-summary"><h2>{trip.title}</h2><p>{trip.durationLabel}</p><p>{formatPrice(perTraveler)} per traveler</p><div className="booking-summary-total"><span>Estimated total</span><strong>{formatPrice(total)}</strong></div><p>Final booking is subject to availability and GIH confirmation.</p></aside>
    </div>
  )
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 }).format(amount)
}
