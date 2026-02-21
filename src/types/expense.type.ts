// Expense types for RTK Query API

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

export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled'

export type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'cheque'
  | 'other'

export interface Expense {
  _id: string
  expenseNumber?: string
  companyId: string
  category: ExpenseCategory
  description: string
  amount: number
  currency?: string
  date: string
  vendor?: string | VendorRef
  paymentMethod?: PaymentMethod
  reference?: string
  receiptUrl?: string
  status: ExpenseStatus
  notes?: string
  tags?: string[]
  isRecurring?: boolean
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  approvedBy?: string | UserRef
  approvedAt?: string
  createdBy?: string | UserRef
  createdAt: string
  updatedAt: string
}

interface VendorRef {
  _id: string
  name: string
  email?: string
}

interface UserRef {
  _id: string
  firstName: string
  lastName: string
  email: string
}

// Form data for creating/updating expense
export interface ExpenseFormData {
  category: ExpenseCategory
  description: string
  amount: number
  currency?: string
  date: string
  vendor?: string
  paymentMethod?: PaymentMethod
  reference?: string
  receiptUrl?: string
  notes?: string
  tags?: string[]
  isRecurring?: boolean
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

// Query params for expense list
export interface ExpenseQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  category?: ExpenseCategory
  status?: ExpenseStatus
  startDate?: string
  endDate?: string
  vendor?: string
}

// Response types
export interface ExpenseResponse {
  payload: Expense
  message: string
  status: number
}

export interface ExpensesResponse {
  payload: {
    data: Expense[]
    total: number
    page?: number
    limit?: number
    totalPages?: number
  }
  message: string
  status: number
}

export interface ExpenseStatsResponse {
  payload: {
    total: number
    totalAmount: number
    pending: { count: number; amount: number }
    approved: { count: number; amount: number }
    paid: { count: number; amount: number }
    rejected: { count: number; amount: number }
    byCategory: {
      category: ExpenseCategory
      count: number
      amount: number
    }[]
    monthlyTrend: {
      month: string
      amount: number
    }[]
  }
  message: string
  status: number
}
