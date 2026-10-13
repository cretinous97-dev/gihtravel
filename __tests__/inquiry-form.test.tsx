import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InquiryForm } from '@/components/inquiry-form'

/**
 * Tests for the enquiry form: required-field validation, inline error
 * messages, honeypot handling, and the branded success state.
 */

const VALID = {
  fullName: 'Tenzin Dorji',
  email: 'tenzin@example.com',
  message: 'We would love to visit Bhutan in October with our two children.',
}

describe('InquiryForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders all primary fields and the submit button', () => {
    render(<InquiryForm />)
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send enquiry/i })).toBeInTheDocument()
  })

  it('shows inline validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    render(<InquiryForm />)

    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    const alerts = await screen.findAllByRole('alert')
    expect(alerts.length).toBeGreaterThanOrEqual(3)
    expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument()
    expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects an invalid email address', async () => {
    const user = userEvent.setup()
    render(<InquiryForm />)

    await user.type(screen.getByLabelText(/full name/i), VALID.fullName)
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/message/i), VALID.message)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('submits valid data and shows the branded success state', async () => {
    const user = userEvent.setup()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, message: 'Thank you!' }),
    })

    render(<InquiryForm />)
    await user.type(screen.getByLabelText(/full name/i), VALID.fullName)
    await user.type(screen.getByLabelText(/email/i), VALID.email)
    await user.type(screen.getByLabelText(/message/i), VALID.message)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    expect(await screen.findByText(/your journey starts here/i)).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledTimes(1)

    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body as string)
    expect(body.fullName).toBe(VALID.fullName)
    expect(body.email).toBe(VALID.email)
    expect(body.message).toBe(VALID.message)
  })

  it('surfaces a friendly server-side error without losing the form', async () => {
    const user = userEvent.setup()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, message: 'Please check the highlighted fields and try again.' }),
    })

    render(<InquiryForm />)
    await user.type(screen.getByLabelText(/full name/i), VALID.fullName)
    await user.type(screen.getByLabelText(/email/i), VALID.email)
    await user.type(screen.getByLabelText(/message/i), VALID.message)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/please check the highlighted fields/i)
    expect(screen.getByRole('button', { name: /send enquiry/i })).toBeInTheDocument()
  })

  it('pre-fills the subject for a specific tour', () => {
    render(<InquiryForm tourSlug="cultural-week" tourTitle="Cultural Week" />)
    expect(screen.getByLabelText(/subject/i)).toHaveValue('Enquiry about Cultural Week')
  })

  it('keeps the honeypot field out of the accessibility tree', () => {
    render(<InquiryForm />)
    const honeypot = document.getElementById('website')
    expect(honeypot).toBeInTheDocument()
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
