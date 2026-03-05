import { baseApi } from './baseApi'
import { DashboardPayload } from '../slices/dashboard/type'
import { PORTAL_BASE_PATH } from '@/contants'

// Dashboard API endpoints using RTK Query
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get dashboard stats
    getDashboardStats: builder.query<{ payload: DashboardPayload }, void>({
      query: () => `${PORTAL_BASE_PATH}/account/dashboard-stats`,
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const { useGetDashboardStatsQuery, useLazyGetDashboardStatsQuery } = dashboardApi
