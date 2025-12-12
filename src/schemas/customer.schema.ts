import { z } from 'zod'

export const customerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  currency: z.string().min(1, 'Please select a currency'),
  email: z.string().email('Please enter a valid email address').trim(),
  language: z.string().min(1, 'Please select a language').optional(),
  phone: z
    .string()
    .optional()
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
  address: z.string().min(5, 'Please enter a valid address'),
  billingAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Zip Code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Zip Code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  contacts: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, 'Contact name must be at least 2 characters')
          .max(100, 'Contact name must be less than 100 characters')
          .trim(),
        email: z.email('Please enter a valid email address').trim(),
        phone: z.string().optional(),
        role: z.string().optional(),
        primary: z.boolean().optional(),
      })
    )
    .optional(),

  taxId: z.string().optional(),
  creditLimit: z.number().min(0, 'Credit limit cannot be negative').optional(),
  tags: z.array(z.string()).optional(),
  status: z.boolean().optional(),
  notes: z.string().optional(),
})
