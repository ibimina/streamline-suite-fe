import { baseApi } from './baseApi'
import {
  Quotation,
  QuotationFormData,
  QuotationQueryParams,
  QuotationResponse,
  QuotationsResponse,
  QuotationStatsResponse,
  QuotationStatus,
} from '@/types/quotation.type'
import { PORTAL_BASE_PATH } from '@/contants'

// Quotation API endpoints using RTK Query
export const quotationApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all quotations with pagination
    getQuotations: builder.query<QuotationsResponse, QuotationQueryParams | void>({
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
        return `${PORTAL_BASE_PATH}/quotations${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result
          ? [
              ...result.payload.data.map(({ _id }) => ({
                type: 'Quotation' as const,
                id: _id,
              })),
              { type: 'Quotation', id: 'LIST' },
            ]
          : [{ type: 'Quotation', id: 'LIST' }],
    }),

    // Get single quotation by ID
    getQuotationById: builder.query<
      { payload: Quotation; message: string; status: number },
      string
    >({
      query: quotationId => `${PORTAL_BASE_PATH}/quotations/${quotationId}`,
      providesTags: (result, error, quotationId) => [{ type: 'Quotation', id: quotationId }],
    }),

    // Get quotation statistics
    getQuotationStats: builder.query<QuotationStatsResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/quotations/stats`,
      providesTags: [{ type: 'Quotation', id: 'STATS' }],
    }),

    // Create new quotation
    createQuotation: builder.mutation<{ message: string; status: number }, QuotationFormData>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/quotations`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Quotation', id: 'LIST' },
        { type: 'Quotation', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update quotation
    updateQuotation: builder.mutation<
      { message: string; status: number },
      { id: string; data: Partial<QuotationFormData> }
    >({
      query: ({ id, data }) => ({
        url: `${PORTAL_BASE_PATH}/quotations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Quotation', id },
        { type: 'Quotation', id: 'LIST' },
        { type: 'Quotation', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update quotation status
    updateQuotationStatus: builder.mutation<
      { message: string; status: number },
      { quotationId: string; status: QuotationStatus }
    >({
      query: ({ quotationId, status }) => ({
        url: `${PORTAL_BASE_PATH}/quotations/${quotationId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { quotationId }) => [
        { type: 'Quotation', id: quotationId },
        { type: 'Quotation', id: 'LIST' },
        { type: 'Quotation', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Convert quotation to invoice
    convertQuotationToInvoice: builder.mutation<
      { payload: { invoiceId: string }; message: string; status: number },
      string
    >({
      query: quotationId => ({
        url: `${PORTAL_BASE_PATH}/quotations/${quotationId}/convert-to-invoice`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, quotationId) => [
        { type: 'Quotation', id: quotationId },
        { type: 'Quotation', id: 'LIST' },
        { type: 'Quotation', id: 'STATS' },
        { type: 'Invoice', id: 'LIST' },
        { type: 'Invoice', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Delete quotation
    deleteQuotation: builder.mutation<{ message: string; status: number }, string>({
      query: quotationId => ({
        url: `${PORTAL_BASE_PATH}/quotations/${quotationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, quotationId) => [
        { type: 'Quotation', id: quotationId },
        { type: 'Quotation', id: 'LIST' },
        { type: 'Quotation', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetQuotationsQuery,
  useLazyGetQuotationsQuery,
  useGetQuotationByIdQuery,
  useLazyGetQuotationByIdQuery,
  useGetQuotationStatsQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useUpdateQuotationStatusMutation,
  useConvertQuotationToInvoiceMutation,
  useDeleteQuotationMutation,
} = quotationApi
