import { baseApi } from './baseApi'
import {
  PayrollRun,
  PayrollFormData,
  PayrollQueryParams,
  PayrollResponse,
  PayrollsResponse,
  PayrollStatsResponse,
  PayrollStatus,
} from '@/types/payroll.type'
import { PORTAL_BASE_PATH } from '@/contants'

// Payroll API endpoints using RTK Query
export const payrollApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all payroll runs with pagination
    getPayrolls: builder.query<PayrollsResponse, PayrollQueryParams | void>({
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
        return `${PORTAL_BASE_PATH}/payroll${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result
          ? [
              ...result.payload.data.map(({ _id }) => ({
                type: 'Payroll' as const,
                id: _id,
              })),
              { type: 'Payroll', id: 'LIST' },
            ]
          : [{ type: 'Payroll', id: 'LIST' }],
    }),

    // Get single payroll by ID
    getPayrollById: builder.query<{ payload: PayrollRun; message: string; status: number }, string>(
      {
        query: payrollId => `${PORTAL_BASE_PATH}/payroll/${payrollId}`,
        providesTags: (result, error, payrollId) => [{ type: 'Payroll', id: payrollId }],
      }
    ),

    // Get payroll statistics
    getPayrollStats: builder.query<PayrollStatsResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/payroll/stats`,
      providesTags: [{ type: 'Payroll', id: 'STATS' }],
    }),

    // Get payroll by period
    getPayrollByPeriod: builder.query<PayrollsResponse, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) =>
        `${PORTAL_BASE_PATH}/payroll/period?startDate=${startDate}&endDate=${endDate}`,
      providesTags: [{ type: 'Payroll', id: 'PERIOD' }],
    }),

    // Create new payroll run
    createPayroll: builder.mutation<
      { payload: PayrollRun; message: string; status: number },
      PayrollFormData
    >({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/payroll`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Payroll', id: 'LIST' },
        { type: 'Payroll', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update payroll
    updatePayroll: builder.mutation<
      { payload: PayrollRun; message: string; status: number },
      { payrollId: string; data: Partial<PayrollFormData> }
    >({
      query: ({ payrollId, data }) => ({
        url: `${PORTAL_BASE_PATH}/payroll/${payrollId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { payrollId }) => [
        { type: 'Payroll', id: payrollId },
        { type: 'Payroll', id: 'LIST' },
        { type: 'Payroll', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update payroll status
    updatePayrollStatus: builder.mutation<
      { message: string; status: number },
      { payrollId: string; status: PayrollStatus }
    >({
      query: ({ payrollId, status }) => ({
        url: `${PORTAL_BASE_PATH}/payroll/${payrollId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { payrollId }) => [
        { type: 'Payroll', id: payrollId },
        { type: 'Payroll', id: 'LIST' },
        { type: 'Payroll', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Approve payroll
    approvePayroll: builder.mutation<{ message: string; status: number }, string>({
      query: payrollId => ({
        url: `${PORTAL_BASE_PATH}/payroll/${payrollId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, payrollId) => [
        { type: 'Payroll', id: payrollId },
        { type: 'Payroll', id: 'LIST' },
        { type: 'Payroll', id: 'STATS' },
      ],
    }),

    // Process payroll (mark as processing/paid)
    processPayroll: builder.mutation<{ message: string; status: number }, string>({
      query: payrollId => ({
        url: `${PORTAL_BASE_PATH}/payroll/${payrollId}/process`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, payrollId) => [
        { type: 'Payroll', id: payrollId },
        { type: 'Payroll', id: 'LIST' },
        { type: 'Payroll', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Cancel payroll
    cancelPayroll: builder.mutation<
      { message: string; status: number },
      { payrollId: string; reason?: string }
    >({
      query: ({ payrollId, reason }) => ({
        url: `${PORTAL_BASE_PATH}/payroll/${payrollId}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (result, error, { payrollId }) => [
        { type: 'Payroll', id: payrollId },
        { type: 'Payroll', id: 'LIST' },
        { type: 'Payroll', id: 'STATS' },
      ],
    }),

    // Delete payroll
    deletePayroll: builder.mutation<{ message: string; status: number }, string>({
      query: payrollId => ({
        url: `${PORTAL_BASE_PATH}/payroll/${payrollId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, payrollId) => [
        { type: 'Payroll', id: payrollId },
        { type: 'Payroll', id: 'LIST' },
        { type: 'Payroll', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Generate payslip PDF
    generatePayslip: builder.query<
      { payload: { url: string }; message: string; status: number },
      { payrollId: string; staffId: string }
    >({
      query: ({ payrollId, staffId }) =>
        `${PORTAL_BASE_PATH}/payroll/${payrollId}/payslip/${staffId}`,
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetPayrollsQuery,
  useLazyGetPayrollsQuery,
  useGetPayrollByIdQuery,
  useLazyGetPayrollByIdQuery,
  useGetPayrollStatsQuery,
  useGetPayrollByPeriodQuery,
  useLazyGetPayrollByPeriodQuery,
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  useUpdatePayrollStatusMutation,
  useApprovePayrollMutation,
  useProcessPayrollMutation,
  useCancelPayrollMutation,
  useDeletePayrollMutation,
  useLazyGeneratePayslipQuery,
} = payrollApi
