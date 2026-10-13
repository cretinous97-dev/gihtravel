import { NextResponse, type NextRequest } from 'next/server'
import { inquirySchema, type InquiryResponse } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import { sendInquiryAcknowledgement, sendInquiryNotification } from '@/lib/mailer'
import { isSanityWriteConfigured, writeClient } from '@/sanity/lib/client'

/**
 * POST /api/inquiry
 *
 * 1. Honeypot + Zod validation (server-side — never trust the client)
 * 2. Rate limit per client IP (best-effort in serverless; see lib/rate-limit)
 * 3. Save the inquiry document to Sanity (source of truth)
 * 4. Email the office + auto-acknowledge the traveller via Gmail SMTP
 *
 * Failure policy: if email fails the inquiry is still saved and the
 * traveller sees success. Email problems are logged, never surfaced.
 */

export const runtime = 'nodejs'

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: NextRequest) {
  // 1. Rate limit
  const limit = rateLimit(`inquiry:${clientIp(request)}`, 5, 60_000)
  if (!limit.allowed) {
    const body: InquiryResponse = {
      ok: false,
      message: 'You have sent several messages in a row. Please wait a minute and try again.',
    }
    return NextResponse.json(body, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } })
  }

  // 2. Parse + validate
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, message: 'We could not read that request. Please try again.' } satisfies InquiryResponse,
      { status: 400 },
    )
  }

  const parsed = inquirySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Please check the highlighted fields and try again.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      } satisfies InquiryResponse,
      { status: 400 },
    )
  }

  const values = parsed.data

  // 3. Honeypot — silently accept and drop bot submissions
  if (values.website) {
    return NextResponse.json({ ok: true, message: 'Thank you.' } satisfies InquiryResponse)
  }

  const submittedAt = new Date().toISOString()

  // Resolve the tour reference (when the enquiry came from a tour page)
  let tourRef: { _type: 'reference'; _ref: string } | undefined
  if (values.tourSlug && isSanityWriteConfigured()) {
    try {
      const tour = await writeClient.fetch<{ _id: string }>(
        `*[_type == "tour" && slug.current == $slug][0]{ _id }`,
        { slug: values.tourSlug },
      )
      if (tour?._id) tourRef = { _type: 'reference', _ref: tour._id }
    } catch (error) {
      console.error('[inquiry] could not resolve tour reference:', error)
    }
  }

  // 4. Save to Sanity (source of truth — must not fail silently)
  if (isSanityWriteConfigured()) {
    try {
      await writeClient.create({
        _type: 'inquiry',
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || undefined,
        country: values.country || undefined,
        subject: values.subject || undefined,
        message: values.message,
        tour: tourRef,
        travelDate: values.travelDate || undefined,
        groupSize: values.groupSize ?? undefined,
        status: 'New',
        submittedAt,
      })
    } catch (error) {
      console.error('[inquiry] failed to save to Sanity:', error)
      return NextResponse.json(
        {
          ok: false,
          message:
            'We could not save your enquiry just now. Please try again, or email us directly at gihbucketlist@gmail.com.',
        } satisfies InquiryResponse,
        { status: 500 },
      )
    }
  } else {
    // Local demo mode (Sanity not configured yet): log so nothing is lost.
    console.warn('[inquiry] Sanity not configured — enquiry logged only:', JSON.stringify({ ...values, submittedAt }))
  }

  // 5. Emails — failures are logged, never shown to the traveller
  const mailPayload = {
    fullName: values.fullName,
    email: values.email,
    phone: values.phone || undefined,
    country: values.country || undefined,
    subject: values.subject || undefined,
    message: values.message,
    tourTitle: values.tourSlug || undefined,
    travelDate: values.travelDate || undefined,
    groupSize: values.groupSize ?? undefined,
    submittedAt,
  }

  try {
    await sendInquiryNotification(mailPayload)
  } catch (error) {
    console.error('[inquiry] notification email failed (inquiry is still saved):', error)
  }

  try {
    await sendInquiryAcknowledgement(mailPayload)
  } catch (error) {
    console.error('[inquiry] acknowledgement email failed (inquiry is still saved):', error)
  }

  return NextResponse.json(
    { ok: true, message: 'Thank you! Your enquiry has been received — we will reply within 24–48 hours.' } satisfies InquiryResponse,
    { status: 201 },
  )
}

/** No other methods. */
export async function GET() {
  return NextResponse.json({ ok: false, message: 'Method not allowed.' } satisfies InquiryResponse, { status: 405 })
}
