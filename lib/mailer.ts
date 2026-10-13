import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

/**
 * Gmail SMTP mailer (Nodemailer).
 *
 * The site owner sends and receives as gihbucketlist@gmail.com using a Google
 * App Password (16 characters) — see README "MANUAL SETUP" Phase 7.
 *
 * Failure policy: the inquiry document is always saved to Sanity first; if
 * anything below throws, callers log and swallow. A traveller must NEVER see
 * an error because email delivery failed.
 */

export type InquiryMailPayload = {
  fullName: string
  email: string
  phone?: string
  country?: string
  subject?: string
  message: string
  tourTitle?: string
  travelDate?: string
  groupSize?: number
  submittedAt: string
}

let cachedTransporter: Transporter | null = null

function getTransporter(): Transporter | null {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass || pass === 'your-16-char-app-password-here') {
    return null // SMTP not configured — callers degrade gracefully.
  }
  if (cachedTransporter) return cachedTransporter

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? 'true') === 'true',
    auth: { user, pass },
  })
  return cachedTransporter
}

function fromAddress(): string {
  return process.env.SMTP_FROM ?? 'GIH Tour and Travel <gihbucketlist@gmail.com>'
}

function inquiryDetailsHtml(p: InquiryMailPayload): string {
  const rows: [string, string][] = [
    ['Name', p.fullName],
    ['Email', p.email],
    ['Phone', p.phone || '—'],
    ['Country', p.country || '—'],
    ['Tour of interest', p.tourTitle || '—'],
    ['Preferred travel date', p.travelDate || '—'],
    ['Group size', p.groupSize ? String(p.groupSize) : '—'],
    ['Subject', p.subject || '—'],
    ['Submitted', p.submittedAt],
  ]
  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#1B3A5C;vertical-align:top">${k}</td><td style="padding:6px 12px;color:#22201C">${v}</td></tr>`,
    )
    .join('')
  return `
    <div style="font-family:Georgia,serif;color:#22201C;max-width:640px">
      <h2 style="color:#1B3A5C;margin:0 0 4px">New trip enquiry</h2>
      <p style="margin:0 0 16px;color:#6B6459">Received via gihtourtravel.vercel.app</p>
      <table style="border-collapse:collapse;background:#FAF7F2;border-radius:8px">${rowsHtml}</table>
      <h3 style="color:#1B3A5C;margin:20px 0 8px">Message</h3>
      <p style="white-space:pre-wrap;line-height:1.6">${p.message}</p>
    </div>`
}

function acknowledgementHtml(p: InquiryMailPayload): string {
  return `
    <div style="font-family:Georgia,serif;color:#22201C;max-width:640px">
      <h2 style="color:#1B3A5C;margin:0 0 12px">Thank you for reaching out 🙏</h2>
      <p>Dear ${p.fullName},</p>
      <p>We have received your enquiry and one of our Bhutan travel specialists will reply within <strong>24–48 hours</strong>.</p>
      <p>In the meantime, feel free to explore our journeys or reply to this email with any details you would like to add.</p>
      <p style="margin:24px 0 8px">Warm regards,</p>
      <p style="margin:0"><strong>GIH Tour and Travel</strong><br/>Expand Your Comfort Zone<br/>Paro, Bhutan<br/>+975 17901780 · gihbucketlist@gmail.com</p>
    </div>`
}

/** Send the internal notification. Throws if SMTP is configured but fails. */
export async function sendInquiryNotification(p: InquiryMailPayload): Promise<void> {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('[mailer] SMTP not configured — skipping notification email.')
    return
  }
  const to = process.env.SMTP_USER ?? 'gihbucketlist@gmail.com'
  await transporter.sendMail({
    from: fromAddress(),
    to,
    replyTo: p.email,
    subject: `New enquiry from ${p.fullName}${p.tourTitle ? ` — ${p.tourTitle}` : ''}`,
    html: inquiryDetailsHtml(p),
    text: `New enquiry from ${p.fullName} <${p.email}>\n\n${p.message}`,
  })
}

/** Send the traveller auto-acknowledgement (reply-to the office inbox). */
export async function sendInquiryAcknowledgement(p: InquiryMailPayload): Promise<void> {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('[mailer] SMTP not configured — skipping acknowledgement email.')
    return
  }
  await transporter.sendMail({
    from: fromAddress(),
    to: p.email,
    replyTo: 'gihbucketlist@gmail.com',
    subject: 'We received your Bhutan enquiry — GIH Tour and Travel',
    html: acknowledgementHtml(p),
    text: `Dear ${p.fullName},\n\nWe have received your enquiry and will reply within 24–48 hours.\n\nWarm regards,\nGIH Tour and Travel\nParo, Bhutan\n+975 17901780`,
  })
}
