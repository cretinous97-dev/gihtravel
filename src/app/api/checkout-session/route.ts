import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!stripeSecret || !/^sk_(?:test|live)_/.test(stripeSecret) || !process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ paid: false, error: 'Payment verification is not configured.' }, { status: 503 })
  }
  const sessionId = request.nextUrl.searchParams.get('session_id')
  if (!sessionId || !/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(sessionId)) return NextResponse.json({ paid: false, error: 'The checkout session could not be found.' }, { status: 400 })
  try {
    const stripe = new Stripe(stripeSecret)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.status !== 'complete' || session.payment_status !== 'paid' || !session.metadata?.bookingId) {
      return NextResponse.json({ paid: false, message: 'Payment is not marked as complete yet.' })
    }
    const payload = await getPayload({ config })
    const booking = await payload.findByID({ collection: 'bookings', id: session.metadata.bookingId, depth: 0, overrideAccess: true } as never) as unknown as { bookingReference?: string }
    return NextResponse.json({ paid: true, bookingReference: booking.bookingReference ?? session.metadata.bookingReference })
  } catch {
    return NextResponse.json({ paid: false, error: 'We could not verify this payment. Please check your account or contact GIH.' }, { status: 502 })
  }
}
