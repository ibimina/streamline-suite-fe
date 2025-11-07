// Used in companySlice, Settings
export interface CompanyDetails {
  name: string
  address: string
  contact: string
  logoUrl: string
  tagline: string
}

// Used in Invoices, Quotations, TemplateSelectionModal
export type Template =
  | 'classic'
  | 'modern'
  | 'minimalist'
  | 'corporate'
  | 'creative'
  | 'professional'
export type AccentColor = 'teal' | 'blue' | 'crimson' | 'slate'

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

export interface Quotation {
  id: string
  customerName: string
  customerAddress: string
  date: string
  status: QuotationStatus
  items: LineItem[]
  // Dynamic tax rates
  vatRate: number
  whtRate: number
  // Calculated totals
  subtotal: number
  vat: number
  total: number
  terms: string
  template: Template
  accentColor: AccentColor
}

// --- Invoice Types ---
export type InvoiceStatus = 'Paid' | 'Sent' | 'Draft' | 'Overdue'
export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  sku?: string // Stock Keeping Unit
}
export interface Invoice {
  id: string
  customerName: string
  customerAddress: string
  date: string
  dueDate: string
  status: InvoiceStatus
  items: InvoiceLineItem[]
  subtotal: number
  vat: number
  total: number
  terms: string
  quotationId?: string
  template: Template
  accentColor: AccentColor
}

// --- User & Staff Types ---
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
  'Rent',
  'Utilities',
  'Salaries',
  'Marketing',
  'Supplies',
  'Travel',
  'Delivery',
  'Other',
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
