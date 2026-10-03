'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type ApiResult = { errors?: Array<{ message?: string }>; error?: string; message?: string }

async function submitJSON(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
  const result = await response.json() as ApiResult
  if (!response.ok) throw new Error(result.errors?.[0]?.message || result.error || 'Something went wrong. Please try again.')
  return result
}

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(formData: FormData) {
    setBusy(true); setError('')
    try {
      await submitJSON('/api/customers/login', { email: formData.get('email'), password: formData.get('password') })
      const requestedNext = new URLSearchParams(window.location.search).get('next')
      const next = requestedNext?.startsWith('/') && !requestedNext.startsWith('//') && !requestedNext.includes('\\') ? requestedNext : '/account'
      router.push(next); router.refresh()
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'We could not sign you in.') }
    finally { setBusy(false) }
  }
  return <form className="form-card" action={submit}><div className="form-field"><label htmlFor="login-email">Email address</label><input id="login-email" type="email" name="email" autoComplete="email" required /></div><div className="form-field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" name="password" autoComplete="current-password" required /></div>{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button button-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button><p className="form-small"><Link href="/forgot-password">Forgot your password?</Link> <span>·</span> <Link href="/register">Create an account</Link></p></form>
}

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(formData: FormData) {
    setBusy(true); setError('')
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')
    try {
      await submitJSON('/api/customers', {
        email,
        password,
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        country: formData.get('country'),
      })
      await submitJSON('/api/customers/login', { email, password })
      const requestedNext = new URLSearchParams(window.location.search).get('next')
      const next = requestedNext?.startsWith('/') && !requestedNext.startsWith('//') && !requestedNext.includes('\\') ? requestedNext : '/account'
      router.push(next); router.refresh()
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Your account could not be created.') }
    finally { setBusy(false) }
  }
  return <form className="form-card" action={submit}><div className="form-grid"><div className="form-field"><label htmlFor="register-name">Full name</label><input id="register-name" name="fullName" autoComplete="name" required /></div><div className="form-field"><label htmlFor="register-country">Country</label><input id="register-country" name="country" autoComplete="country-name" /></div></div><div className="form-field"><label htmlFor="register-email">Email address</label><input id="register-email" name="email" type="email" autoComplete="email" required /></div><div className="form-field"><label htmlFor="register-phone">Phone</label><input id="register-phone" name="phone" type="tel" autoComplete="tel" /></div><div className="form-field"><label htmlFor="register-password">Password</label><input id="register-password" name="password" type="password" autoComplete="new-password" minLength={10} required /><span className="form-hint">Use at least 10 characters.</span></div>{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button button-primary" disabled={busy}>{busy ? 'Creating account…' : 'Create your account'}</button><p className="form-small">Already have an account? <Link href="/login">Sign in</Link>.</p></form>
}

export function ForgotPasswordForm() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(formData: FormData) {
    setBusy(true); setMessage(''); setError('')
    try {
      await submitJSON('/api/customers/forgot-password', { email: formData.get('email') })
      setMessage('If that address belongs to an account, a password reset link is on its way.')
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'We could not start a password reset.') }
    finally { setBusy(false) }
  }
  return <form className="form-card" action={submit}><div className="form-field"><label htmlFor="forgot-email">Email address</label><input id="forgot-email" name="email" type="email" autoComplete="email" required /></div>{message ? <p className="form-status" role="status">{message}</p> : null}{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button button-primary" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button><p className="form-small"><Link href="/login">Back to sign in</Link></p></form>
}

export function ResetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(formData: FormData) {
    setBusy(true); setMessage(''); setError('')
    try {
      await submitJSON('/api/customers/reset-password', { token, password: formData.get('password') })
      setMessage('Your password has been changed. You can sign in now.')
      setTimeout(() => router.push('/login'), 1200)
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The reset link could not be used.') }
    finally { setBusy(false) }
  }
  return <form className="form-card" action={submit}>{!token ? <p className="form-error">This reset link is missing its token. Request another link to continue.</p> : null}<div className="form-field"><label htmlFor="reset-password">New password</label><input id="reset-password" name="password" type="password" autoComplete="new-password" minLength={10} required /></div>{message ? <p className="form-status" role="status">{message}</p> : null}{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button button-primary" disabled={busy || !token}>{busy ? 'Updating…' : 'Set new password'}</button></form>
}
