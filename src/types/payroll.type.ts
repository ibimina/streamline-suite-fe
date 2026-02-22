// Payroll types for RTK Query API

export type PayrollStatus = 'draft' | 'pending' | 'approved' | 'processing' | 'paid' | 'cancelled'

export type PayFrequency = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'

export interface PayrollDeduction {
  id?: string
  type: 'tax' | 'pension' | 'health_insurance' | 'loan' | 'advance' | 'other'
  name: string
  amount: number
  isPercentage?: boolean
  percentage?: number
}

export interface PayrollAllowance {
  id?: string
  type: 'housing' | 'transport' | 'meal' | 'bonus' | 'overtime' | 'commission' | 'other'
  name: string
  amount: number
  isPercentage?: boolean
  percentage?: number
}

export interface PayrollItem {
  id?: string
  staff: string | StaffRef
  basicSalary: number
  allowances: PayrollAllowance[]
  totalAllowances: number
  deductions: PayrollDeduction[]
  totalDeductions: number
  grossPay: number
  netPay: number
  paymentDate?: string
  paymentMethod?: 'bank_transfer' | 'cash' | 'cheque'
  bankDetails?: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  status: 'pending' | 'paid'
}

export interface PayrollRun {
  _id: string
  payrollNumber?: string
  companyId: string
  payPeriodStart: string
  payPeriodEnd: string
  payDate: string
  payFrequency: PayFrequency
  items: PayrollItem[]
  totalGrossPay: number
  totalDeductions: number
  totalNetPay: number
  totalAllowances: number
  employeeCount: number
  status: PayrollStatus
  notes?: string
  approvedBy?: string | UserRef
  approvedAt?: string
  processedBy?: string | UserRef
  processedAt?: string
  createdBy?: string | UserRef
  createdAt: string
  updatedAt: string
}

interface StaffRef {
  _id: string
  firstName: string
  lastName: string
  email: string
  employeeId?: string
  department?: string
  position?: string
}

interface UserRef {
  _id: string
  firstName: string
  lastName: string
  email: string
}

// Form data for creating/updating payroll
export interface PayrollFormData {
  payPeriodStart: string
  payPeriodEnd: string
  payDate: string
  payFrequency: PayFrequency
  items: Omit<PayrollItem, 'id'>[]
  notes?: string
}

// Query params for payroll list
export interface PayrollQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  status?: PayrollStatus
  startDate?: string
  endDate?: string
  payFrequency?: PayFrequency
}

// Response types
export interface PayrollResponse {
  payload: PayrollRun
  message: string
  status: number
}

export interface PayrollsResponse {
  payload: {
    data: PayrollRun[]
    total: number
    page?: number
    limit?: number
    totalPages?: number
  }
  message: string
  status: number
}

export interface PayrollStatsResponse {
  payload: {
    total: number
    totalPaid: number
    pending: { count: number; amount: number }
    processing: { count: number; amount: number }
    paid: { count: number; amount: number }
    monthlyTrend: {
      month: string
      amount: number
      employeeCount: number
    }[]
    averagePayPerEmployee: number
  }
  message: string
  status: number
}
