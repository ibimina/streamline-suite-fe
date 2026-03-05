import { z } from 'zod'

export const customerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  companyName: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  currency: z.string().optional().or(z.literal('')),
  email: z.email('Please enter a valid email address').trim().optional().or(z.literal('')),
  language: z.string().optional().or(z.literal('')),
  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      val => {
        if (!val) return true // Optional field
        // Basic E.164 format validation (starts with +, followed by 1-15 digits)
        return /^\+[1-9]\d{1,14}$/.test(val)
      },
      {
        message: 'Please enter a valid phone number with country code',
      }
    ),
  address: z.string().optional().or(z.literal('')),
  billingAddress: z
    .object({
      street: z.string().optional().or(z.literal('')),
      city: z.string().optional().or(z.literal('')),
      state: z.string().optional().or(z.literal('')),
      postalCode: z.string().optional().or(z.literal('')),
      country: z.string().optional().or(z.literal('')),
    })
    .optional(),
  shippingAddress: z
    .object({
      street: z.string().optional().or(z.literal('')),
      city: z.string().optional().or(z.literal('')),
      state: z.string().optional().or(z.literal('')),
      postalCode: z.string().optional().or(z.literal('')),
      country: z.string().optional().or(z.literal('')),
    })
    .optional(),
  contacts: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, 'Contact name must be at least 2 characters')
          .max(100, 'Contact name must be less than 100 characters')
          .trim(),
        email: z
          .string()
          .email('Please enter a valid email address')
          .trim()
          .optional()
          .or(z.literal('')),
        phone: z.string().optional().or(z.literal('')),
        role: z.string().optional().or(z.literal('')),
        primary: z.boolean().optional(),
      })
    )
    .optional(),

  taxId: z.string().optional().or(z.literal('')),
  creditLimit: z.number().min(0, 'Credit limit cannot be negative').optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  notes: z.string().optional().or(z.literal('')),
})

export type CustomerFormData = z.infer<typeof customerSchema>
