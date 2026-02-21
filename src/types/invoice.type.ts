// Invoice types for RTK Query API

export interface InvoiceLineItem {
  id?: string
  product?: {
    _id: string
    name: string
  } // Product ID reference
  description: string
  quantity: number
  unitPrice: number
  unitCost: number
  vatRate: number
  discountPercent: number
  discountType?: 'percentage' | 'fixed'
  sku?: string
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled' | 'Partially_paid'

export interface Invoice {
  _id: string
  poNumber: string
  customer: {
    _id: string
    companyName: string
    email?: string
    phone?: string
    billingAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  account: string
  items: InvoiceLineItem[]
  // Financial fields
  subtotal: number
  discountType?: 'percentage' | 'fixed'
  vatRate: number
  totalVat: number
  grandTotal: number
  amountPaid?: number
  balanceDue?: number
  uniqueId?: string // For display on PDF (can be invoiceNumber or custom ID)
  // Status and dates
  status: InvoiceStatus
  issuedDate: string
  dueDate: string
  paidDate?: string
  sentDate?: string
  whtRate: number
  // Additional fields
  notes?: string
  terms?: string
  template?: string
  accentColor?: string
  quotation?: string
  createdBy?: string | UserRef
  createdAt: string
  updatedAt: string
}

interface CustomerRef {
  _id: string
  companyName: string
  email?: string
  phone?: string
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface UserRef {
  _id: string
  firstName: string
  lastName: string
  email: string
}

export interface LineItem {
  id?: string
  product?: string
  description: string
  quantity: number
  unitCost?: number
  unitPrice: number
  amount?: number
  discountPercent: number
  vatRate: number
  sku?: string
}
// Form data for creating/updating invoice
export interface InvoiceFormData {
  customer: string
  items: Omit<LineItem, 'id'>[]
  discountType?: 'percentage' | 'fixed'
  taxRate?: number
  issuedDate: string
  dueDate: string
  notes?: string
  terms?: string
  template?: string
  accentColor?: string
  quotationId?: string
}

// Query params for invoice list
export interface InvoiceQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  status?: InvoiceStatus
  startDate?: string
  endDate?: string
}

// Response types
export interface InvoiceResponse {
  payload: Invoice
  message: string
  status: number
}

export interface InvoicesResponse {
  payload: {
    data: Invoice[]
    total: number
    page?: number
    limit?: number
    totalPages?: number
  }
  message: string
  status: number
}

export interface InvoiceStatsResponse {
  payload: {
    total: number
    totalValue: number
    draft: { count: number; amount: number }
    sent: { count: number; amount: number }
    paid: { count: number; amount: number }
    overdue: { count: number; amount: number }
    cancelled: { count: number; amount: number }
  }
  message: string
  status: number
}
