import { baseApi } from './baseApi'
import {
  Invoice,
  InvoiceFormData,
  InvoiceQueryParams,
  InvoicesResponse,
  InvoiceStatsResponse,
  InvoiceStatus,
} from '@/types/invoice.type'
import { Quotation } from '@/types/quotation.type'
import { PORTAL_BASE_PATH } from '@/contants'

// Available quotations for linking response type
interface AvailableQuotationsResponse {
  payload: Quotation[]
  message: string
  status: number
}

// Invoice API endpoints using RTK Query
export const invoiceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all invoices with pagination
    getInvoices: builder.query<InvoicesResponse, InvoiceQueryParams | void>({
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
        const baseUrl = `${PORTAL_BASE_PATH}/invoices`
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
      },
      providesTags: result =>
        result
          ? [
              ...result.payload.data.map(({ _id }) => ({
                type: 'Invoice' as const,
                id: _id,
              })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),

    // Get single invoice by ID
    getInvoiceById: builder.query<{ payload: Invoice; message: string; status: number }, string>({
      query: invoiceId => `${PORTAL_BASE_PATH}/invoices/${invoiceId}`,
      providesTags: (result, error, invoiceId) => [{ type: 'Invoice', id: invoiceId }],
    }),

    // Get invoice statistics
    getInvoiceStats: builder.query<InvoiceStatsResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/invoices/stats`,
      providesTags: [{ type: 'Invoice', id: 'STATS' }],
    }),

    // Get available quotations for linking to invoice
    getAvailableQuotationsForInvoice: builder.query<AvailableQuotationsResponse, string | void>({
      query: customerId => {
        const baseUrl = `${PORTAL_BASE_PATH}/invoices/available-quotations`
        return customerId ? `${baseUrl}?customerId=${customerId}` : baseUrl
      },
      providesTags: [{ type: 'Quotation', id: 'AVAILABLE' }],
    }),

    // Create new invoice
    createInvoice: builder.mutation<{ message: string; status: number }, InvoiceFormData>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/invoices`,
        method: 'POST',
        body: {
          ...data,
          quotation: data.quotationId, // Map quotationId to quotation for backend
        },
      }),
      invalidatesTags: [
        { type: 'Invoice', id: 'LIST' },
        { type: 'Invoice', id: 'STATS' },
        { type: 'Quotation', id: 'LIST' },
        { type: 'Quotation', id: 'AVAILABLE' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update invoice
    updateInvoice: builder.mutation<
      { message: string; status: number },
      { id: string; data: Partial<InvoiceFormData> }
    >({
      query: ({ id, data }) => ({
        url: `${PORTAL_BASE_PATH}/invoices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
        { type: 'Invoice', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update invoice status
    updateInvoiceStatus: builder.mutation<
      { message: string; status: number },
      { id: string; status: InvoiceStatus }
    >({
      query: ({ id, status }) => ({
        url: `${PORTAL_BASE_PATH}/invoices/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
        { type: 'Invoice', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Delete invoice
    deleteInvoice: builder.mutation<{ message: string; status: number }, string>({
      query: invoiceId => ({
        url: `${PORTAL_BASE_PATH}/invoices/${invoiceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, invoiceId) => [
        { type: 'Invoice', id: invoiceId },
        { type: 'Invoice', id: 'LIST' },
        { type: 'Invoice', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetInvoicesQuery,
  useLazyGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useLazyGetInvoiceByIdQuery,
  useGetInvoiceStatsQuery,
  useGetAvailableQuotationsForInvoiceQuery,
  useLazyGetAvailableQuotationsForInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
} = invoiceApi
