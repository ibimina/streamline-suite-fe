import { z } from 'zod'

export const productSchema = z.object({
  sku: z.string().optional(),
  barcode: z.string().optional(),
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(255, 'Product name must be less than 255 characters'),
  description: z.string().optional(),
  type: z.enum(['product', 'service', 'consumable', 'digital']).default('product'),
  trackInventory: z.boolean().default(false),
  trackSerialNumber: z.boolean().default(false),
  trackExpiryDate: z.boolean().default(false),
  expiryDate: z.string().optional(),
  costPrice: z.number().min(0, 'Cost price must be 0 or greater').optional(),
  sellingPrice: z.number().min(0, 'Selling price must be 0 or greater'),
  wholesalePrice: z.number().min(0, 'Wholesale price must be 0 or greater').optional(),
  unit: z.string().optional(),
  lowStockAlert: z.number().min(0, 'Low stock alert must be 0 or greater').optional(),
  currentStock: z.number().min(0, 'Current stock must be 0 or greater').optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  supplier: z.string().optional(),
  alternativeSuppliers: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  salesTaxRate: z
    .number()
    .min(0, 'Sales tax rate must be 0 or greater')
    .max(100, 'Sales tax rate must be 100 or less')
    .optional(),
  purchaseTaxRate: z
    .number()
    .min(0, 'Purchase tax rate must be 0 or greater')
    .max(100, 'Purchase tax rate must be 100 or less')
    .optional(),
  isActive: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productSchema>
