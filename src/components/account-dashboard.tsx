'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate, formatUSD } from '@/lib/format'

type Customer = { id: number | string; email: string; fullName?: string; phone?: string; country?: string }
type Booking = { id: number | string; bookingReference: string; packageTitle: string; travelDate: string; travelers: number; totalUsd: number; status: string; createdAt: string }

export function AccountDashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const response = await fetch('/api/customers/me?depth=0', { credentials: 'same-origin', cache: 'no-store' })
        const data = await response.json() as { user?: Customer | null }
        if (!data.user) { router.replace('/login'); return }
        if (!alive) return
        setCustomer(data.user)
        const bookingResponse = await fetch('/api/bookings?limit=100&sort=-createdAt', { credentials: 'same-origin', cache: 'no-store' })
        const bookingData = await bookingResponse.json() as { docs?: Booking[] }
        if (alive) setBookings(bookingData.docs ?? [])
      } catch {
        if (alive) setError('Your account details could not be loaded. Please sign in again.')
      } finally { if (alive) setLoading(false) }
    }
    void load()
    return () => { alive = false }
  }, [router])

  async function updateProfile(formData: FormData) {
    if (!customer) return
    setBusy(true); setMessage(''); setError('')
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: formData.get('fullName'), phone: formData.get('phone'), country: formData.get('country') }),
      })
      const result = await response.json() as { doc?: Customer; errors?: Array<{ message?: string }> }
      if (!response.ok) throw new Error(result.errors?.[0]?.message || 'Your profile could not be updated.')
      setCustomer((current) => current ? { ...current, ...(result.doc ?? {}) } : current)
      setMessage('Your profile has been updated.')
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Your profile could not be updated.') }
    finally { setBusy(false) }
  }

  async function logout() {
    await fetch('/api/customers/logout', { method: 'POST', credentials: 'same-origin' })
    router.push('/'); router.refresh()
  }

  if (loading) return <div className="form-card"><p>Loading your account…</p></div>
  if (!customer) return <div className="form-card"><p>Sign in to see your bookings.</p><Link href="/login" className="button button-primary">Sign in</Link></div>

  return (
    <div className="account-layout">
      <nav className="account-nav" aria-label="Account navigation"><a href="#bookings">My bookings</a><a href="#profile">Profile details</a><Link href="/forgot-password">Reset password</Link><button className="account-logout" onClick={logout}>Sign out</button></nav>
      <div>
        <section id="bookings" className="account-section"><h2>Your trips</h2>{bookings.length ? bookings.map((booking) => <article className="account-booking" key={booking.id}><div><h3>{booking.packageTitle}</h3><p>{booking.bookingReference} · {formatDate(booking.travelDate)} · {booking.travelers} traveler{booking.travelers === 1 ? '' : 's'}</p></div><div style={{ textAlign: 'right' }}><span className="status-pill">{booking.status.replaceAll('_', ' ')}</span><p>{formatUSD(booking.totalUsd)}</p></div></article>) : <div className="empty-state account-empty"><h2>No bookings yet.</h2><p>Once you choose a journey, you’ll find its details here.</p><Link href="/packages" className="button button-primary">Explore journeys</Link></div>}</section>
        <section id="profile" className="account-profile"><h2>Your details</h2><form className="form-card" action={updateProfile} key={`${customer.id}-${customer.fullName ?? ''}-${customer.phone ?? ''}-${customer.country ?? ''}`}><div className="form-grid"><div className="form-field"><label htmlFor="profile-name">Full name</label><input id="profile-name" name="fullName" defaultValue={customer.fullName ?? ''} required /></div><div className="form-field"><label htmlFor="profile-country">Country</label><input id="profile-country" name="country" defaultValue={customer.country ?? ''} /></div></div><div className="form-field"><label htmlFor="profile-email">Email address</label><input id="profile-email" type="email" value={customer.email} disabled /></div><div className="form-field"><label htmlFor="profile-phone">Phone</label><input id="profile-phone" name="phone" defaultValue={customer.phone ?? ''} /></div>{message ? <p className="form-status">{message}</p> : null}{error ? <p className="form-error">{error}</p> : null}<button className="button button-primary" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button></form></section>
      </div>
    </div>
  )
}
