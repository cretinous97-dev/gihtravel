import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/auth-forms'
import { Container, Eyebrow } from '@/components/ui'

export const metadata = { title: 'Set a new password | GIH Tour and Travel' }

export default function ResetPasswordPage() {
  return <Container><section className="form-shell"><Eyebrow>Account access</Eyebrow><h1>Choose a new password.</h1><p className="form-intro">Use the secure link from your email to set a new password.</p><Suspense fallback={<p>Loading reset form…</p>}><ResetPasswordForm /></Suspense></section></Container>
}
