import { z } from 'zod'

/**
 * Transaction Type Enum
 * Matches backend InventoryTransactionStatus values
 */
export const transactionTypeEnum = z.enum([
  'purchase',
  'sale',
  'return_from_customer',
  'return_to_supplier',
  'adjustment',
  'transfer',
  'production_in',
  'production_out',
  'completed',
])

/**
 * Inventory Transaction Form Schema
 * For creating new inventory transactions
 */
export const inventoryTransactionSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  status: transactionTypeEnum,
  quantity: z.number().min(1, 'Quantity must be at least 1').int('Quantity must be a whole number'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
  reference: z
    .string()
    .min(1, 'Reference is required')
    .max(100, 'Reference must be less than 100 characters')
    .trim(),
  warehouse: z.string().optional().or(z.literal('')),
  expiryDate: z
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
  serialNumbers: z.array(z.string()).optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().or(z.literal('')),
})

/**
 * Update Inventory Transaction Schema
 * Only allows updating status and notes
 */
export const updateInventoryTransactionSchema = z.object({
  status: z.string().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().or(z.literal('')),
})

/**
 * Type inference for form data
 */
export type InventoryTransactionFormData = z.infer<typeof inventoryTransactionSchema>
export type UpdateInventoryTransactionFormData = z.infer<typeof updateInventoryTransactionSchema>
export type TransactionType = z.infer<typeof transactionTypeEnum>
