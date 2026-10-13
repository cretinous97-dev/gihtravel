import { z } from 'zod'

/**
 * Zod schemas shared by the client-side inquiry form (React Hook Form) and the
 * server-side /api/inquiry route. Never trust the client alone — always
 * validate again on the server.
 */

export const inquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(120, 'Name must be 120 characters or fewer.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address, e.g. name@example.com.')
    .max(200, 'Email must be 200 characters or fewer.'),
  phone: z
    .string()
    .trim()
    .max(40, 'Phone number must be 40 characters or fewer.')
    .optional()
    .or(z.literal('')),
  country: z.string().trim().max(80, 'Country must be 80 characters or fewer.').optional().or(z.literal('')),
  subject: z.string().trim().max(200, 'Subject must be 200 characters or fewer.').optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more (at least 10 characters).')
    .max(5000, 'Message must be 5000 characters or fewer.'),
  tourSlug: z.string().trim().max(200).optional().or(z.literal('')),
  travelDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please use the date picker (YYYY-MM-DD).')
    .optional()
    .or(z.literal('')),
  groupSize: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v === undefined || v === null ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 1 && v <= 100), {
      message: 'Group size must be a whole number between 1 and 100.',
    }),
  // Honeypot — real users never fill this hidden field. Filled values are
  // silently dropped by the API route (no feedback to bots).
  website: z.string().max(2000).optional().or(z.literal('')),
})

export type InquiryInput = z.input<typeof inquirySchema>
export type InquiryValues = z.output<typeof inquirySchema>

/** Result shape returned by POST /api/inquiry. */
export type InquiryResponse =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> }
