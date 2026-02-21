import { z } from 'zod'

/**
 * Quotation Item Schema
 * Matches backend ItemDto from create-quotation.dto.ts
 */
export const quotationItemSchema = z.object({
  product: z.string(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  discountPercent: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%'),
  vatRate: z.number().min(0, 'VAT rate cannot be negative').max(100, 'VAT rate cannot exceed 100%'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
})

/**
 * Quotation Status Enum
 * Matches backend QuotationStatus enum
 */
export const quotationStatusEnum = z.enum([
  'Draft',
  'Sent',
  'Viewed',
  'Accepted',
  'Rejected',
  'Expired',
  'Converted',
])

/**
 * Quotation Form Schema
 * Matches backend CreateQuotationDto from create-quotation.dto.ts
 */
export const quotationSchema = z.object({
  customer: z.string().min(1, 'Customer is required'), // Customer ObjectId reference (required)
  items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
  status: quotationStatusEnum,
  issuedDate: z
    .string()
    .min(1, 'Issue date is required')
    .refine(
      val => {
        if (!val) return true
        const date = new Date(val)
        return !Number.isNaN(date.getTime())
      },
      { message: 'Invalid date format' }
    ),
  validUntil: z
    .string()
    .optional()
    .refine(
      val => {
        if (!val) return true
        const date = new Date(val)
        return !Number.isNaN(date.getTime())
      },
      { message: 'Invalid date format' }
    ),
  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  terms: z
    .string()
    .max(5000, 'Terms must be less than 5000 characters')
    .optional()
    .or(z.literal('')),
  whtRate: z
    .number()
    .min(0, 'WHT rate cannot be negative')
    .max(100, 'WHT rate cannot exceed 100%')
    .optional()
    .default(0),
  template: z.string().optional(),
  accentColor: z.string().optional(),
})

/**
 * Type inference for form data
 */
export type QuotationFormData = z.infer<typeof quotationSchema>
export type QuotationItemFormData = z.infer<typeof quotationItemSchema>
export type QuotationStatus = z.infer<typeof quotationStatusEnum>
