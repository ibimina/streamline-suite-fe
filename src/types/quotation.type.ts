// Quotation types for RTK Query API

export interface QuotationLineItem {
  _id?: string
  id?: string
  product?: {
    _id: string
    name?: string
  } // Product ID reference
  description: string
  quantity: number
  unitCost?: number
  unitPrice: number
  amount?: number
  discountPercent: number
  vatRate: number
  discountType?: 'percentage' | 'fixed'
  sku?: string
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired'

export interface Quotation {
  _id: string
  uniqueId: string
  customer: {
    _id: string
    companyName: string
    fullName: string
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
  accountId: string
  issuedDate: string
  validUntil: string
  items: QuotationLineItem[]
  // Financial fields
  subtotal: number
  discountType?: 'percentage' | 'fixed'
  vatRate: number
  totalVat: number
  vatAmount: number
  whtRate: number
  whtAmount: number
  grandTotal: number
  totalCost?: number
  expectedProfit?: number
  profitMargin?: number
  // Status and dates
  status: QuotationStatus
  sentDate?: string
  acceptedDate?: string
  rejectedDate?: string
  // Conversion tracking
  convertedToInvoice: boolean
  invoiceId?: string
  // Additional fields
  notes?: string
  terms?: string
  template?: string
  accentColor?: string
  createdBy?: string | UserRef
  createdAt: string
  updatedAt: string
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
// Form data for creating/updating quotation
export interface QuotationFormData {
  customer: string
  items: Omit<LineItem, 'id'>[]
  discountType?: 'percentage' | 'fixed'
  vatRate?: number
  whtRate?: number
  issuedDate: string
  validUntil?: string
  notes?: string
  terms?: string
  template?: string
  accentColor?: string
}

// Query params for quotation list
export interface QuotationQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  status?: QuotationStatus
  startDate?: string
  endDate?: string
}

// Response types
export interface QuotationResponse {
  payload: Quotation
  message: string
  status: number
}

export interface QuotationsResponse {
  payload: {
    data: Quotation[]
    total: number
    page?: number
    limit?: number
    totalPages?: number
  }
  message: string
  status: number
}

export interface QuotationStatsResponse {
  payload: {
    total: number
    totalValue: number
    totalExpectedProfit: number
    draft: { count: number; amount: number; profit: number }
    sent: { count: number; amount: number; profit: number }
    accepted: { count: number; amount: number; profit: number }
    rejected: { count: number; amount: number; profit: number }
    expired: { count: number; amount: number; profit: number }
  }
  message: string
  status: number
}
