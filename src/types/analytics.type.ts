// Analytics types for the frontend

export interface KPIData {
  totalRevenue: number
  totalProfit: number
  averageSaleValue: number
  revenueChange: number
  profitChange: number
  avgSaleChange: number
}

export interface RevenueProfitData {
  month: string
  revenue: number
  profit: number
}

export interface SalesByServiceData {
  name: string
  sales: number
}

export interface TopCustomerData {
  name: string
  value: number
}

export interface AnalyticsData {
  kpis: KPIData
  revenueProfitTrend: RevenueProfitData[]
  salesByService: SalesByServiceData[]
  topCustomers: TopCustomerData[]
}

export interface AnalyticsQueryParams {
  startDate?: string
  endDate?: string
  period?: 'monthly' | 'weekly' | 'yearly'
}

export interface AnalyticsResponse {
  payload: AnalyticsData
}
