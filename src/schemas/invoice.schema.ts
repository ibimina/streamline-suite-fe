import { z } from 'zod'

/**
 * Invoice Item Schema
 * Matches backend ItemDto from create-invoice.dto.ts
 */
export const invoiceItemSchema = z.object({
  product: z.string().optional(), // Product ObjectId reference
  name: z.string().optional(), // Product name
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
  unitPrice: z.number().min(0, 'Unit price must be non-negative').default(0),
  discountPercent: z.number().min(0).max(100).default(0),
  vatRate: z.number().min(0).max(100).default(7.5),
  unitCost: z.number().min(0).default(0),
})

/**
 * Invoice Status Enum
 * Matches backend InvoiceStatus enum
 */
export const invoiceStatusEnum = z.enum([
  'Draft',
  'Pending',
  'Sent',
  'Viewed',
  'Paid',
  'Partially Paid',
  'Overdue',
  'Cancelled',
  'Refunded',
])

/**
 * Invoice Form Schema
 * Matches backend CreateInvoiceDto from create-invoice.dto.ts
 */
export const invoiceSchema = z.object({
  customer: z.string().min(1, 'Customer is required'), // Customer ObjectId reference (required)
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Partial', 'Overdue', 'Cancelled']).default('Draft'),
  issuedDate: z.string().optional(),
  dueDate: z.string().optional(),
  poNumber: z.string().optional(), // Purchase Order number
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
  template: z.string().optional(),
  accentColor: z.string().optional(),
  whtRate: z.number().min(0).max(100).default(5),
})

/**
 * Type inference for form data
 */
export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>
export type InvoiceStatus = z.infer<typeof invoiceStatusEnum>
