import { ForgotPasswordForm } from '@/components/auth-forms'
import { Container, Eyebrow } from '@/components/ui'

export const metadata = { title: 'Reset your password | GIH Tour and Travel' }

export default function ForgotPasswordPage() {
  return <Container><section className="form-shell"><Eyebrow>Account access</Eyebrow><h1>Reset your password.</h1><p className="form-intro">Enter the email address for your account. If it matches, we’ll send a reset link.</p><ForgotPasswordForm /></section></Container>
}
