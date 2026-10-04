import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSiteSettings } from '@/lib/cms'
import { readBodyWithinLimit } from '@/lib/http'

export const runtime = 'nodejs'

const escapeHTML = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)

async function sendBookingNotice(email: string, reference: string, title: string, travelDate: string, siteUrl: string, apiKey: string, fromAddress: string) {
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: `GIH Tour and Travel <${fromAddress}>`,
    to: [email],
    subject: `Payment received for booking ${reference}`,
    html: `<p>Thank you for booking <strong>${escapeHTML(title)}</strong> with GIH Tour and Travel.</p><p>Your booking reference is <strong>${escapeHTML(reference)}</strong>.</p><p>Preferred travel date: ${escapeHTML(travelDate)}</p><p>Our team will confirm trip details and availability. <a href="${siteUrl}/account">View your GIH account</a>.</p>`,
    text: `Thank you for booking ${title} with GIH Tour and Travel.\n\nBooking reference: ${reference}\nPreferred travel date: ${travelDate}\n\nOur team will confirm trip details and availability. ${siteUrl}/account`,
  })
  if (error) throw new Error(error.message)
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const signature = request.headers.get('stripe-signature')
  if (!secret || !stripeKey || !/^sk_(?:test|live)_/.test(stripeKey)) return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 })
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 })

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 1_000_000) return NextResponse.json({ error: 'Stripe webhook payload is too large.' }, { status: 413 })
  let rawBody: string | null
  try { rawBody = await readBodyWithinLimit(request, 1_000_000) } catch { return NextResponse.json({ error: 'Stripe webhook payload could not be read.' }, { status: 400 }) }
  if (rawBody === null) return NextResponse.json({ error: 'Stripe webhook payload is too large.' }, { status: 413 })

  let event: Stripe.Event
  try {
    event = new Stripe(stripeKey).webhooks.constructEvent(rawBody, signature, secret)
  } catch (error) {
    console.error('Stripe webhook signature verification failed', error)
    return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  let eventRecordId: string | number | undefined
  try {
    const existing = await payload.find({
      collection: 'stripe-events',
      where: { stripeEventId: { equals: event.id } },
      limit: 1,
      overrideAccess: true,
    } as never) as unknown as { docs?: Array<{ id: string | number; status?: string }> }
    const eventRecord = existing.docs?.[0]
    if (eventRecord?.status === 'processed') return NextResponse.json({ received: true })
    if (eventRecord) eventRecordId = eventRecord.id
    else {
      const created = await payload.create({
        collection: 'stripe-events', overrideAccess: true,
        data: { stripeEventId: event.id, eventType: event.type, status: 'processing' },
      } as never) as unknown as { id: string | number }
      eventRecordId = created.id
    }

    const supported = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'checkout.session.expired'])
    if (supported.has(event.type)) {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId
      if (bookingId) {
        const booking = await payload.findByID({ collection: 'bookings', id: bookingId, depth: 0, overrideAccess: true } as never) as unknown as {
          id: string | number; bookingReference?: string; packageTitle?: string; guestEmail?: string; travelDate?: string; status?: string
        }
        if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
          if (session.payment_status === 'paid' && booking.status !== 'paid' && booking.status !== 'confirmed') {
            await payload.update({
              collection: 'bookings', id: booking.id, overrideAccess: true,
              data: { status: 'paid', stripeSessionId: session.id, stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id },
            } as never)
            const settings = await getSiteSettings()
            if (process.env.RESEND_API_KEY && booking.guestEmail) {
              try { await sendBookingNotice(booking.guestEmail, booking.bookingReference ?? '', booking.packageTitle ?? 'your Bhutan trip', booking.travelDate ?? '', process.env.NEXT_PUBLIC_SITE_URL ?? '', process.env.RESEND_API_KEY, settings.email) }
              catch (error) { console.error('Booking payment email could not be sent', error) }
            }
            if (settings.email && process.env.RESEND_API_KEY) {
              const resend = new Resend(process.env.RESEND_API_KEY)
              try {
                const { error } = await resend.emails.send({
                  from: `${settings.name} <${settings.email}>`, to: [settings.email],
                  subject: `Payment received for ${booking.bookingReference ?? 'a GIH booking'}`,
                  text: `A Stripe payment was received for ${booking.packageTitle ?? 'a trip'}. Booking ${booking.bookingReference ?? ''} is awaiting availability confirmation.`,
                })
                if (error) throw new Error(error.message)
              } catch (error) { console.error('Booking team notification could not be sent', error) }
            }
          }
        } else if (event.type === 'checkout.session.async_payment_failed' || event.type === 'checkout.session.expired') {
          if (booking.status === 'pending_payment') await payload.update({ collection: 'bookings', id: booking.id, overrideAccess: true, data: { status: 'cancelled' } } as never)
        }
      }
    }
    if (eventRecordId !== undefined) await payload.update({ collection: 'stripe-events', id: eventRecordId, overrideAccess: true, data: { status: 'processed', error: '' } } as never)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook could not process event', error)
    if (eventRecordId !== undefined) {
      try { await payload.update({ collection: 'stripe-events', id: eventRecordId, overrideAccess: true, data: { status: 'failed', error: error instanceof Error ? error.message.slice(0, 1000) : 'Unknown webhook processing error' } } as never) } catch { /* Stripe retry will attempt processing again. */ }
    }
    return NextResponse.json({ error: 'Webhook processing failed. Stripe may retry the event.' }, { status: 500 })
  }
}
