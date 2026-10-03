import { NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { getSiteSettings } from '@/lib/cms'
import { readBodyWithinLimit } from '@/lib/http'

export const runtime = 'nodejs'

const escapeHTML = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 12000) return NextResponse.json({ error: 'Your message is too large. Please shorten it and try again.' }, { status: 413 })
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() || ''
  if (contentType !== 'application/json' && !contentType.endsWith('+json')) return NextResponse.json({ error: 'Please check the details and try again.' }, { status: 400 })
  const origin = request.headers.get('origin')
  const currentHost = (request.headers.get('x-forwarded-host') || request.headers.get('host'))?.split(',')[0].trim().toLowerCase()
  if (origin && currentHost) {
    try { if (new URL(origin).host.toLowerCase() !== currentHost) return NextResponse.json({ error: 'This form can only be sent from the GIH website.' }, { status: 403 }) }
    catch { return NextResponse.json({ error: 'The form origin could not be verified.' }, { status: 403 }) }
  }
  let rawBody: string | null
  try { rawBody = await readBodyWithinLimit(request, 12000) } catch { return NextResponse.json({ error: 'Please check the details and try again.' }, { status: 400 }) }
  if (rawBody === null) return NextResponse.json({ error: 'Your message is too large. Please shorten it and try again.' }, { status: 413 })
  let parsedBody: unknown
  try { parsedBody = JSON.parse(rawBody) } catch { return NextResponse.json({ error: 'Please check the details and try again.' }, { status: 400 }) }
  if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) return NextResponse.json({ error: 'Please check the details and try again.' }, { status: 400 })
  const body = parsedBody as Record<string, unknown>
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim().replace(/[\r\n\t]+/g, ' ') : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const company = typeof body.company === 'string' ? body.company.trim() : ''
  if (company) return NextResponse.json({ message: 'Thanks for writing. Our team will get back to you soon.' })
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !subject || subject.length > 180 || message.length < 10 || message.length > 6000) {
    return NextResponse.json({ error: 'Please enter a valid name, email, subject and message.' }, { status: 400 })
  }
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'The contact form is not connected yet. Please email us directly.' }, { status: 503 })

  const settings = await getSiteSettings()
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `${settings.name} <${settings.email}>`,
      to: [settings.email],
      replyTo: email,
      subject: `Website inquiry: ${subject}`,
      html: `<h2>New website inquiry</h2><p><strong>Name:</strong> ${escapeHTML(name)}</p><p><strong>Email:</strong> ${escapeHTML(email)}</p><p><strong>Subject:</strong> ${escapeHTML(subject)}</p><p>${escapeHTML(message).replace(/\r?\n/g, '<br>')}</p>`,
      text: `New website inquiry\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    })
    if (error) throw new Error(error.message)
    return NextResponse.json({ message: 'Thanks for writing. Our team will get back to you soon.' })
  } catch (error) {
    console.error('Unable to send contact inquiry', error)
    return NextResponse.json({ error: 'We could not send your message right now. Please try again or email us directly.' }, { status: 502 })
  }
}
