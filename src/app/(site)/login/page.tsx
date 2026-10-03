import { LoginForm } from '@/components/auth-forms'
import { Container, Eyebrow } from '@/components/ui'

export const metadata = { title: 'Sign in | GIH Tour and Travel' }

export default function LoginPage() {
  return <Container><section className="form-shell"><Eyebrow>Your GIH account</Eyebrow><h1>Welcome back.</h1><p className="form-intro">Sign in to review your bookings or update your details.</p><LoginForm /></section></Container>
}
