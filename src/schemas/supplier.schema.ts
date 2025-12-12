import { z } from 'zod'

export const supplierSchema = z.object({
  name: z
    .string()
    .min(2, 'Supplier name must be at least 2 characters')
    .max(100, 'Supplier name must be less than 100 characters')
    .trim(),
  contacts: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, 'Contact name must be at least 2 characters')
          .max(100, 'Contact name must be less than 100 characters')
          .trim(),
        email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
        phone: z.string().optional(),
        role: z.string().optional(),
        primary: z.boolean().optional(),
      })
    )
    .default([]),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z
    .string()
    .optional()
    .refine(
      val => {
        if (!val) return true // Optional field
        // Basic phone validation
        return /^[\+]?[\d\s\-\(\)]+$/.test(val)
      },
      {
        message: 'Please enter a valid phone number',
      }
    ),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  paymentTerms: z
    .string()
    .max(50, 'Payment terms must be less than 50 characters')
    .default('Net 30')
    .optional(),
  taxId: z.string().max(50, 'Tax ID must be less than 50 characters').optional(),
  isActive: z.boolean().default(true).optional(),
})
