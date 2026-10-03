import { AccountDashboard } from '@/components/account-dashboard'
import { Container, Eyebrow } from '@/components/ui'

export const metadata = { title: 'My account | GIH Tour and Travel' }

export default function AccountPage() {
  return <Container><section className="form-shell" style={{ maxWidth: 1000 }}><Eyebrow>My GIH account</Eyebrow><h1>Your Bhutan plans.</h1><p className="form-intro">Review upcoming trips and keep your contact details current.</p><AccountDashboard /></section></Container>
}
