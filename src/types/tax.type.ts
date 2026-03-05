// Tax type definitions

export type TaxReportType = 'sales_tax' | 'purchase_tax' | 'income_tax' | 'vat' | 'withholding_tax'

export type TaxReportStatus = 'draft' | 'pending' | 'filed' | 'paid' | 'overdue'

export interface TaxReport {
  _id: string
  period: string
  type: TaxReportType
  amount: number
  status: TaxReportStatus
  dueDate?: string
  filedDate?: string
  paidDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TaxStats {
  totalSalesTaxCollected: number
  totalPurchaseTaxPaid: number
  netTaxLiability: number
  pendingFilings: number
  overdueFilings: number
}

export interface TaxQueryParams {
  page?: number
  limit?: number
  type?: TaxReportType
  status?: TaxReportStatus
  period?: string
  year?: number
}

export interface TaxReportsResponse {
  payload: {
    data: TaxReport[]
    total: number
    page: number
    limit: number
  }
  message: string
  status: number
}

export interface TaxStatsResponse {
  payload: TaxStats
  message: string
  status: number
}
