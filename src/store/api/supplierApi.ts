import { PORTAL_BASE_PATH } from '@/contants'
import { baseApi } from './baseApi'

// Supplier interface
export interface Supplier {
  id?: string
  name: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  paymentTerms?: string
  taxId?: string
  isActive?: boolean
  companyId?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

// Form data for creating/updating supplier
export interface SupplierFormData {
  name: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  paymentTerms?: string
  taxId?: string
  isActive?: boolean
}

// Query params for suppliers list
interface SupplierQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Response types
interface SupplierResponse {
  payload: {
    supplier: Supplier
  }
}

interface SuppliersResponse {
  payload: {
    suppliers: Supplier[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface SupplierStatsResponse {
  payload: {
    total: number
    active: number
    inactive: number
  }
}

// Supplier API endpoints using RTK Query
export const supplierApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all suppliers with pagination
    getSuppliers: builder.query<SuppliersResponse, SupplierQueryParams | void>({
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
        return `${PORTAL_BASE_PATH}/suppliers${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result
          ? [
              ...result.payload.suppliers.map(({ id }) => ({
                type: 'Supplier' as const,
                id,
              })),
              { type: 'Supplier', id: 'LIST' },
            ]
          : [{ type: 'Supplier', id: 'LIST' }],
    }),

    // Get single supplier by ID
    getSupplierById: builder.query<SupplierResponse, string>({
      query: supplierId => `${PORTAL_BASE_PATH}/suppliers/${supplierId}`,
      providesTags: (result, error, supplierId) => [{ type: 'Supplier', id: supplierId }],
    }),

    // Get supplier statistics
    getSupplierStats: builder.query<SupplierStatsResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/suppliers/stats`,
      providesTags: [{ type: 'Supplier', id: 'STATS' }],
    }),

    // Get active suppliers (for dropdowns)
    getActiveSuppliers: builder.query<{ payload: { suppliers: Supplier[] } }, void>({
      query: () => `${PORTAL_BASE_PATH}/suppliers/active`,
      providesTags: [{ type: 'Supplier', id: 'ACTIVE' }],
    }),

    // Create new supplier
    createSupplier: builder.mutation<SupplierResponse, SupplierFormData>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/suppliers`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Supplier', id: 'LIST' },
        { type: 'Supplier', id: 'STATS' },
        { type: 'Supplier', id: 'ACTIVE' },
      ],
    }),

    // Update supplier
    updateSupplier: builder.mutation<
      SupplierResponse,
      { supplierId: string; data: Partial<SupplierFormData> }
    >({
      query: ({ supplierId, data }) => ({
        url: `${PORTAL_BASE_PATH}/suppliers/${supplierId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { supplierId }) => [
        { type: 'Supplier', id: supplierId },
        { type: 'Supplier', id: 'LIST' },
        { type: 'Supplier', id: 'STATS' },
        { type: 'Supplier', id: 'ACTIVE' },
      ],
    }),

    // Delete supplier
    deleteSupplier: builder.mutation<void, string>({
      query: supplierId => ({
        url: `${PORTAL_BASE_PATH}/suppliers/${supplierId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, supplierId) => [
        { type: 'Supplier', id: supplierId },
        { type: 'Supplier', id: 'LIST' },
        { type: 'Supplier', id: 'STATS' },
        { type: 'Supplier', id: 'ACTIVE' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetSuppliersQuery,
  useLazyGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useLazyGetSupplierByIdQuery,
  useGetSupplierStatsQuery,
  useGetActiveSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi
