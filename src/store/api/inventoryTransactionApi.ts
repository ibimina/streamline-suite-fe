import { baseApi } from './baseApi'
import { PORTAL_BASE_PATH } from '@/contants'
import {
  InventoryTransaction,
  InventoryTransactionQueryParams,
  InventoryTransactionsResponse,
  InventoryTransactionResponse,
  InventoryTransactionStatsResponse,
  CreateInventoryTransactionData,
  UpdateInventoryTransactionData,
} from '@/types/inventory-transaction.type'

// Inventory Transaction API endpoints using RTK Query
export const inventoryTransactionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all inventory transactions with pagination and filters
    getInventoryTransactions: builder.query<
      InventoryTransactionsResponse,
      InventoryTransactionQueryParams | void
    >({
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
        return `${PORTAL_BASE_PATH}/inventory-transactions${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result
          ? [
              ...result.payload?.inventoryTransactions.map(({ _id }) => ({
                type: 'InventoryTransaction' as const,
                id: _id,
              })),
              { type: 'InventoryTransaction', id: 'LIST' },
            ]
          : [{ type: 'InventoryTransaction', id: 'LIST' }],
    }),

    // Get single inventory transaction by ID
    getInventoryTransactionById: builder.query<InventoryTransactionResponse, string>({
      query: transactionId => `${PORTAL_BASE_PATH}/inventory-transactions/${transactionId}`,
      providesTags: (result, error, transactionId) => [
        { type: 'InventoryTransaction', id: transactionId },
      ],
    }),

    // Get inventory transaction statistics
    getInventoryTransactionStats: builder.query<InventoryTransactionStatsResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/inventory-transactions/stats`,
      providesTags: [{ type: 'InventoryTransaction', id: 'STATS' }],
    }),

    // Get transactions by product
    getTransactionsByProduct: builder.query<
      InventoryTransactionsResponse,
      { productId: string; page?: number; limit?: number }
    >({
      query: ({ productId, page = 1, limit = 10 }) =>
        `${PORTAL_BASE_PATH}/inventory-transactions/by-product/${productId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { productId }) => [
        { type: 'InventoryTransaction', id: `PRODUCT_${productId}` },
      ],
    }),

    // Create new inventory transaction
    createInventoryTransaction: builder.mutation<
      InventoryTransactionResponse,
      CreateInventoryTransactionData
    >({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/inventory-transactions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'InventoryTransaction', id: 'LIST' },
        { type: 'InventoryTransaction', id: 'STATS' },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // Update inventory transaction
    updateInventoryTransaction: builder.mutation<
      InventoryTransactionResponse,
      { transactionId: string; data: UpdateInventoryTransactionData }
    >({
      query: ({ transactionId, data }) => ({
        url: `${PORTAL_BASE_PATH}/inventory-transactions/${transactionId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { transactionId }) => [
        { type: 'InventoryTransaction', id: transactionId },
        { type: 'InventoryTransaction', id: 'LIST' },
        { type: 'InventoryTransaction', id: 'STATS' },
      ],
    }),

    // Cancel inventory transaction
    cancelInventoryTransaction: builder.mutation<InventoryTransactionResponse, string>({
      query: transactionId => ({
        url: `${PORTAL_BASE_PATH}/inventory-transactions/${transactionId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, transactionId) => [
        { type: 'InventoryTransaction', id: transactionId },
        { type: 'InventoryTransaction', id: 'LIST' },
        { type: 'InventoryTransaction', id: 'STATS' },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // Delete inventory transaction
    deleteInventoryTransaction: builder.mutation<void, string>({
      query: transactionId => ({
        url: `${PORTAL_BASE_PATH}/inventory-transactions/${transactionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, transactionId) => [
        { type: 'InventoryTransaction', id: transactionId },
        { type: 'InventoryTransaction', id: 'LIST' },
        { type: 'InventoryTransaction', id: 'STATS' },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetInventoryTransactionsQuery,
  useLazyGetInventoryTransactionsQuery,
  useGetInventoryTransactionByIdQuery,
  useLazyGetInventoryTransactionByIdQuery,
  useGetInventoryTransactionStatsQuery,
  useGetTransactionsByProductQuery,
  useLazyGetTransactionsByProductQuery,
  useCreateInventoryTransactionMutation,
  useUpdateInventoryTransactionMutation,
  useCancelInventoryTransactionMutation,
  useDeleteInventoryTransactionMutation,
} = inventoryTransactionApi
