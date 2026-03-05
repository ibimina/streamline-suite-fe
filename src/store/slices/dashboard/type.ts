export interface DashboardPayload {
  // Overview metrics
  totalRevenueYTD: number
  totalProfitYTD: number
  totalInvoicesYTD: number
  totalCustomers: number
  profitMargin: number

  // Outstanding invoices
  outstandingInvoices: {
    total: number
    count: number
    overdue: number
    overdueAmount: number
  }

  // Weekly quotations with status breakdown
  weeklyQuotations: {
    total: {
      count: number
      value: number
    }
    [status: string]: {
      count: number
      value: number
    }
  }

  // Growth metrics
  growth: {
    revenueGrowthPercent: number
    currentMonthRevenue: number
    lastMonthRevenue: number
  }

  // Top products
  topProducts: Array<{
    id: string
    name: string
    sku?: string
    quantity: number
    revenue: number
  }>

  // Low stock products
  lowStockProducts: Array<{
    id: string
    name: string
    sku?: string
    currentStock: number
    lowStockAlert: number
    deficit: number
  }>

  // Recent activities
  recentActivities: Array<{
    id: string
    type: string
    text: string
    time: string
    description: string
    entityType: string
    entityId: string
    metadata?: any
    createdAt: string
    user?: {
      name: string
      email: string
    }
  }>

  // Sales trend data
  salesTrend: Array<{
    period: string
    revenue: number
    profit: number
    invoices: number
  }>
}

export interface DashboardState {
  isLoading: boolean
  error: string | null
  stats: DashboardPayload | null
}
