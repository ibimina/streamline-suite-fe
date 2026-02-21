import { baseApi } from './baseApi'
import { PORTAL_BASE_PATH } from '@/contants'
import { AnalyticsResponse, AnalyticsQueryParams } from '@/types/analytics.type'

// Analytics API endpoints using RTK Query
export const analyticsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get analytics data
    getAnalytics: builder.query<AnalyticsResponse, AnalyticsQueryParams | void>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params && typeof params === 'object') {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value))
            }
          })
        }
        const queryString = queryParams.toString()
        return `${PORTAL_BASE_PATH}/analytics${queryString ? `?${queryString}` : ''}`
      },
      providesTags: ['Analytics'],
    }),

    // Get revenue breakdown by category/service
    getRevenueBreakdown: builder.query<
      { payload: { categories: Array<{ name: string; amount: number }> } },
      void
    >({
      query: () => `${PORTAL_BASE_PATH}/analytics/revenue-breakdown`,
      providesTags: ['Analytics'],
    }),

    // Get top customers by revenue
    getTopCustomers: builder.query<
      { payload: { customers: Array<{ name: string; revenue: number }> } },
      { limit?: number }
    >({
      query: ({ limit = 10 } = {}) => `${PORTAL_BASE_PATH}/analytics/top-customers?limit=${limit}`,
      providesTags: ['Analytics'],
    }),

    // Get sales trend over time
    getSalesTrend: builder.query<
      { payload: { trend: Array<{ period: string; revenue: number; profit: number }> } },
      { period?: 'daily' | 'weekly' | 'monthly' | 'yearly' }
    >({
      query: ({ period = 'monthly' } = {}) =>
        `${PORTAL_BASE_PATH}/analytics/sales-trend?period=${period}`,
      providesTags: ['Analytics'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetAnalyticsQuery,
  useLazyGetAnalyticsQuery,
  useGetRevenueBreakdownQuery,
  useLazyGetRevenueBreakdownQuery,
  useGetTopCustomersQuery,
  useLazyGetTopCustomersQuery,
  useGetSalesTrendQuery,
  useLazyGetSalesTrendQuery,
} = analyticsApi
