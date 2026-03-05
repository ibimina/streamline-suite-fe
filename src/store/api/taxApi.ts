import { baseApi } from './baseApi'
import { TaxReport, TaxQueryParams, TaxReportsResponse, TaxStatsResponse } from '@/types/tax.type'
import { PORTAL_BASE_PATH } from '@/contants'

// Tax API endpoints using RTK Query
export const taxApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all tax reports with pagination
    getTaxReports: builder.query<TaxReportsResponse, TaxQueryParams | void>({
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
        return `${PORTAL_BASE_PATH}/taxes${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result
          ? [
              ...result.payload.data.map(({ _id }) => ({
                type: 'Tax' as const,
                id: _id,
              })),
              { type: 'Tax', id: 'LIST' },
            ]
          : [{ type: 'Tax', id: 'LIST' }],
    }),

    // Get tax statistics
    getTaxStats: builder.query<TaxStatsResponse, { year?: number } | void>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params && typeof params === 'object' && params.year) {
          queryParams.append('year', String(params.year))
        }
        const queryString = queryParams.toString()
        return `${PORTAL_BASE_PATH}/taxes/stats${queryString ? `?${queryString}` : ''}`
      },
      providesTags: [{ type: 'Tax', id: 'STATS' }],
    }),

    // Generate tax report
    generateTaxReport: builder.mutation<
      { payload: TaxReport; message: string; status: number },
      { period: string; type: string }
    >({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/taxes/generate`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Tax', id: 'LIST' },
        { type: 'Tax', id: 'STATS' },
      ],
    }),

    // File tax report
    fileTaxReport: builder.mutation<
      { payload: TaxReport; message: string; status: number },
      string
    >({
      query: taxId => ({
        url: `${PORTAL_BASE_PATH}/taxes/${taxId}/file`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, taxId) => [
        { type: 'Tax', id: taxId },
        { type: 'Tax', id: 'LIST' },
        { type: 'Tax', id: 'STATS' },
      ],
    }),

    // Mark tax as paid
    markTaxPaid: builder.mutation<
      { payload: TaxReport; message: string; status: number },
      { taxId: string; paidDate?: string }
    >({
      query: ({ taxId, paidDate }) => ({
        url: `${PORTAL_BASE_PATH}/taxes/${taxId}/pay`,
        method: 'PATCH',
        body: { paidDate },
      }),
      invalidatesTags: (result, error, { taxId }) => [
        { type: 'Tax', id: taxId },
        { type: 'Tax', id: 'LIST' },
        { type: 'Tax', id: 'STATS' },
      ],
    }),

    // Download tax report
    downloadTaxReport: builder.query<Blob, string>({
      query: taxId => ({
        url: `${PORTAL_BASE_PATH}/taxes/${taxId}/download`,
        responseHandler: response => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetTaxReportsQuery,
  useLazyGetTaxReportsQuery,
  useGetTaxStatsQuery,
  useGenerateTaxReportMutation,
  useFileTaxReportMutation,
  useMarkTaxPaidMutation,
  useLazyDownloadTaxReportQuery,
} = taxApi
