import { RegisterForm } from '@/components/auth-forms'
import { Container, Eyebrow } from '@/components/ui'

export const metadata = { title: 'Create an account | GIH Tour and Travel' }

export default function RegisterPage() {
  return <Container><section className="form-shell"><Eyebrow>Your GIH account</Eyebrow><h1>Keep your plans in one place.</h1><p className="form-intro">Create an account to keep track of your trip details and bookings.</p><RegisterForm /></section></Container>
}
