import { randomBytes } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTrip } from '@/lib/cms'
import { readBodyWithinLimit } from '@/lib/http'
import { todayInBhutan } from '@/lib/format'

export const runtime = 'nodejs'

const jsonError = (message: string, status: number) => NextResponse.json({ error: message }, { status })

export async function POST(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!stripeSecret || !/^sk_(?:test|live)_/.test(stripeSecret)) return jsonError('Set a valid Stripe secret key before enabling checkout.', 503)
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return jsonError('Booking storage is not configured yet.', 503)
  if (!process.env.NEXT_PUBLIC_SITE_URL) return jsonError('Set NEXT_PUBLIC_SITE_URL before enabling checkout.', 503)
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 10000) return jsonError('The booking request is too large.', 413)
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() || ''
  if (contentType !== 'application/json' && !contentType.endsWith('+json')) return jsonError('The booking request was not valid JSON.', 400)
  let siteUrl: string
  try {
    const configuredUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL)
    if (!['http:', 'https:'].includes(configuredUrl.protocol) || !configuredUrl.hostname || configuredUrl.username || configuredUrl.password) return jsonError('NEXT_PUBLIC_SITE_URL must be a valid absolute URL.', 503)
    siteUrl = configuredUrl.origin
  } catch { return jsonError('NEXT_PUBLIC_SITE_URL must be a valid absolute URL.', 503) }

  let rawBody: string | null
  try { rawBody = await readBodyWithinLimit(request, 10000) } catch { return jsonError('The booking request was not valid JSON.', 400) }
  if (rawBody === null) return jsonError('The booking request is too large.', 413)
  let parsedBody: unknown
  try { parsedBody = JSON.parse(rawBody) } catch { return jsonError('The booking request was not valid JSON.', 400) }
  if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) return jsonError('The booking request must be a JSON object.', 400)
  const body = parsedBody as { packageSlug?: unknown; travelDate?: unknown; travelers?: unknown; specialRequests?: unknown; termsAccepted?: unknown }
  const packageSlug = typeof body.packageSlug === 'string' ? body.packageSlug.trim() : ''
  const travelDate = typeof body.travelDate === 'string' ? body.travelDate : ''
  const travelers = typeof body.travelers === 'number' ? body.travelers : Number.NaN
  const specialRequests = typeof body.specialRequests === 'string' ? body.specialRequests.trim() : ''
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packageSlug) || packageSlug.length > 150 || !/^\d{4}-\d{2}-\d{2}$/.test(travelDate) || !Number.isInteger(travelers) || travelers < 1 || travelers > 99 || specialRequests.length > 3000 || body.termsAccepted !== true) {
    return jsonError('Check the travel date, group size and required agreement, then try again.', 400)
  }
  const date = new Date(`${travelDate}T00:00:00.000Z`)
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== travelDate || travelDate < todayInBhutan()) return jsonError('Choose a valid travel date that has not passed.', 400)

  const payload = await getPayload({ config })
  let auth: Awaited<ReturnType<typeof payload.auth>>
  try { auth = await payload.auth({ headers: request.headers }) } catch { return jsonError('Sign in to your GIH account before booking.', 401) }
  const customer = auth.user as (typeof auth.user & { collection?: string; fullName?: string; phone?: string }) | null
  if (!customer || customer.collection !== 'customers') return jsonError('Sign in to your GIH account before booking.', 401)
  if (!customer.email || !customer.fullName) return jsonError('Add your name and email to your account before booking.', 400)

  const trip = await getTrip(packageSlug)
  if (!trip || !trip.priceUsd || !trip.pricePerPerson) return jsonError('This trip is not ready for online checkout. Please contact GIH to confirm its current price.', 409)
  const amountPerTraveler = Math.round(trip.priceUsd * 100)
  const totalCents = amountPerTraveler * travelers
  if (!Number.isSafeInteger(amountPerTraveler) || amountPerTraveler < 50 || !Number.isSafeInteger(totalCents) || totalCents > 99999999) return jsonError('The confirmed trip price and group size are not valid for checkout.', 400)

  let packageId: string | number | undefined
  try {
    const result = await payload.find({
      collection: 'packages',
      where: { and: [{ slug: { equals: packageSlug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    } as never)
    const doc = (result as unknown as { docs?: Array<{ id: string | number }> }).docs?.[0]
    packageId = doc?.id
  } catch { /* The booking record can still retain the package slug if a relation is unavailable. */ }

  const reference = `GIH-${new Date().getUTCFullYear()}-${randomBytes(8).toString('hex').toUpperCase()}`
  let bookingId: string | number | undefined
  try {
    const booking = await payload.create({
      collection: 'bookings',
      overrideAccess: true,
      data: {
        bookingReference: reference,
        customer: customer.id,
        ...(packageId ? { package: packageId } : {}),
        packageTitle: trip.title,
        packageSlug: trip.slug,
        guestName: customer.fullName,
        guestEmail: customer.email,
        guestPhone: customer.phone || '',
        travelDate: date.toISOString(),
        travelers,
        addOns: [],
        totalUsd: totalCents / 100,
        currency: 'USD',
        status: 'pending_payment',
        specialRequests,
      },
    } as never)
    bookingId = (booking as unknown as { id: string | number }).id

    const stripe = new Stripe(stripeSecret)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer.email,
      client_reference_id: String(bookingId),
      line_items: [{
        quantity: travelers,
        price_data: {
          currency: 'usd',
          unit_amount: amountPerTraveler,
          product_data: { name: trip.title, description: `${trip.durationLabel} with GIH Tour and Travel` },
        },
      }],
      metadata: { bookingId: String(bookingId), bookingReference: reference, customerId: String(customer.id), packageSlug: trip.slug },
      payment_intent_data: { metadata: { bookingId: String(bookingId), bookingReference: reference } },
      success_url: `${siteUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/booking/cancel?package=${encodeURIComponent(trip.slug)}`,
    })
    if (!session.url) throw new Error('Stripe did not return a checkout URL.')
    await payload.update({ collection: 'bookings', id: bookingId, overrideAccess: true, data: { stripeSessionId: session.id } } as never)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    if (bookingId !== undefined) {
      try { await payload.update({ collection: 'bookings', id: bookingId, overrideAccess: true, data: { status: 'cancelled' } } as never) } catch { /* Keep the original checkout error. */ }
    }
    console.error('Unable to create Stripe checkout session', error)
    return jsonError('We could not start secure checkout. Please contact GIH or try again in a moment.', 502)
  }
}
