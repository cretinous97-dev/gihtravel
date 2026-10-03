'use client'

import { useState } from 'react'

export function ContactForm({ initialSubject = '' }: { initialSubject?: string }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [subject, setSubject] = useState(initialSubject)

  async function submit(formData: FormData) {
    setBusy(true)
    setMessage('')
    const values = Object.fromEntries(formData.entries())
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json() as { error?: string; message?: string }
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent just now.')
      setMessage(result.message || 'Thanks for writing. Our team will get back to you soon.')
      const form = document.getElementById('contact-form') as HTMLFormElement | null
      form?.reset()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Your message could not be sent just now.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form id="contact-form" className="form-card" action={submit}>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="contact-name">Full name</label><input id="contact-name" name="name" autoComplete="name" required /></div>
        <div className="form-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" required /></div>
      </div>
      <div className="form-field"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" value={subject} onChange={(event) => setSubject(event.target.value)} required /></div>
      <div className="form-field"><label htmlFor="contact-message">How can we help?</label><textarea id="contact-message" name="message" required minLength={10} /></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="contact-company">Company</label><input id="contact-company" name="company" tabIndex={-1} autoComplete="off" /></div>
      {message ? <p className={message.startsWith('Thanks') ? 'form-status' : 'form-error'} role="status">{message}</p> : null}
      <button className="button button-primary" disabled={busy}>{busy ? 'Sending…' : 'Send your message'}</button>
      <p className="form-small">By contacting us, you agree to our <a href="/privacy-policy">Privacy Policy</a>.</p>
    </form>
  )
}
