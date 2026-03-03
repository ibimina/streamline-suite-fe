// Used in companySlice, Settings
export interface CompanyDetails {
  name: string
  address: string
  contact: string
  logoUrl: string
  tagline: string
  customTemplates?: CustomTemplate[]
}

// Used in Invoices, Quotations, TemplateSelectionModal
export type Template = 'classic' | 'modern' | 'minimalist' | 'corporate' | 'creative' | 'custom'

// Custom template system
export interface TemplatePlaceholder {
  id: string
  type: 'text' | 'image' | 'table' | 'currency' | 'date'
  x: number
  y: number
  width?: number
  height?: number
  fontSize?: number
  fontColor?: string
  fontWeight?: 'normal' | 'bold'
  align?: 'left' | 'center' | 'right'
  maxLines?: number
  format?: string // For dates and currency
}

export interface CustomTemplate {
  id?: string
  name: string
  description?: string
  thumbnailUrl?: string
  imageUrl?: string
  templateFile?: File | string // Image file or base64
}

export interface TemplateMapping {
  // Company placeholders
  // companyName: string
  // companyAddress: string
  // companyContact: string
  // companyLogo: string
  // companyTagline?: string

  // Document placeholders
  documentType: string // 'QUOTATION' or 'INVOICE'
  documentNumber: string
  documentDate: string

  // Customer placeholders
  customerName: string
  customerAddress: string

  // Items table placeholder
  itemsTable: string

  // Totals placeholders
  subtotal: string
  vat: string
  vatRate: string
  total: string

  // Additional placeholders
  terms: string
  notes?: string
  watermark?: string
}
export type AccentColor =
  | 'teal'
  | 'blue'
  | 'crimson'
  | 'slate'
  | 'purple'
  | 'emerald'
  | 'orange'
  | 'pink'
  | 'indigo'
  | 'amber'

export interface LineItem {
  id: string
  description: string
  quantity: number
  // --- Advanced Pricing Fields ---
  costPrice: number // The price the item was bought for.
  sellingPricePercentage: number // Markup percentage.
  // unitPrice is the calculated selling price for one unit.
  unitPrice: number
  sku?: string // Stock Keeping Unit
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected'

export type InvoiceStatus = 'Paid' | 'Sent' | 'Draft' | 'Overdue'

export const ROLES = ['Admin', 'Manager', 'Accountant', 'Sales Rep', 'Technician'] as const
export type Role = (typeof ROLES)[number]

export interface StaffMember {
  id: string
  name: string
  role: Role
  email: string
  phone: string
  salary: number
  hireDate: string
  avatarUrl: string
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  lastLogin: string
  password?: string
}

// --- Other Module Types ---
export interface PayrollRun {
  id: string
  payPeriodStart: string
  payPeriodEnd: string
  totalAmount: number
  status: 'Completed' | 'Pending'
}

export interface TaxReport {
  id: string
  period: string
  type: 'Sales Tax' | 'Purchase Tax'
  amount: number
  status: 'Filed' | 'Due'
}

export const EXPENSE_CATEGORIES = [
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
] as const
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export interface Expense {
  id: string
  date: string
  category: ExpenseCategory
  description: string
  amount: number
}

export interface InventoryItem {
  id: string
  sku: string
  description: string
  quantity: number
  unitCost: number
}

export type LogType = 'Checkout' | 'Return'

export interface InventoryLog {
  id: string
  itemId: string
  itemDescription: string
  staffName: string
  type: LogType
  quantity: number
  purpose: string
  date: string
}

// Re-export types from type files
export type { Quotation } from './types/quotation.type'
export type { Invoice } from './types/invoice.type'
