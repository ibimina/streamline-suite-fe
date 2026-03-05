import { z } from 'zod'

/**
 * Expense Category Enum
 * Matches backend categories
 */
export const expenseCategoryEnum = z.enum([
  'rent',
  'utilities',
  'salaries',
  'marketing',
  'supplies',
  'travel',
  'delivery',
  'equipment',
  'maintenance',
  'insurance',
  'taxes',
  'professional_services',
  'software',
  'other',
])

/**
 * Payment Method Enum
 */
export const paymentMethodEnum = z.enum([
  'cash',
  'bank_transfer',
  'credit_card',
  'debit_card',
  'cheque',
  'other',
])

/**
 * Expense Item Schema
 * For product line items on stock purchase expenses
 */
export const expenseItemSchema = z.object({
  product: z.string().optional().or(z.literal('')),
  description: z.string().min(1, 'Item description is required').max(200).trim(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitCost: z.number().min(0, 'Unit cost must be 0 or greater'),
})

export type ExpenseItemFormData = z.infer<typeof expenseItemSchema>

/**
 * Expense Form Schema
 * For creating/updating expenses
 */
export const expenseSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(
      val => {
        const date = new Date(val)
        return !Number.isNaN(date.getTime())
      },
      { message: 'Invalid date format' }
    ),
  category: expenseCategoryEnum,
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999999, 'Amount is too large'),
  paymentMethod: paymentMethodEnum.optional().default('cash'),
  vendor: z
    .string()
    .max(200, 'Vendor name must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  reference: z
    .string()
    .max(100, 'Reference must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().or(z.literal('')),
  receiptUrl: z
    .string()
    .refine(
      val => {
        if (!val) return true
        try {
          new URL(val)
          return true
        } catch {
          return false
        }
      },
      { message: 'Invalid URL' }
    )
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string()).optional().default([]),
  isRecurring: z.boolean().optional().default(false),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  items: z.array(expenseItemSchema).optional().default([]),
})

/**
 * Type inference for form data
 */
export type ExpenseFormData = z.infer<typeof expenseSchema>
export type ExpenseCategory = z.infer<typeof expenseCategoryEnum>
export type PaymentMethod = z.infer<typeof paymentMethodEnum>
