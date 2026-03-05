import { baseApi } from './baseApi'
import {
  Expense,
  ExpenseFormData,
  ExpenseQueryParams,
  ExpenseResponse,
  ExpensesResponse,
  ExpenseStatsResponse,
  ExpenseStatus,
} from '@/types/expense.type'
import { PORTAL_BASE_PATH } from '@/contants'

// Expense API endpoints using RTK Query
export const expenseApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all expenses with pagination
    getExpenses: builder.query<ExpensesResponse, ExpenseQueryParams | void>({
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
        return `${PORTAL_BASE_PATH}/expenses${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result
          ? [
              ...result.payload.data.map(({ _id }) => ({
                type: 'Expense' as const,
                id: _id,
              })),
              { type: 'Expense', id: 'LIST' },
            ]
          : [{ type: 'Expense', id: 'LIST' }],
    }),

    // Get single expense by ID
    getExpenseById: builder.query<{ payload: Expense; message: string; status: number }, string>({
      query: expenseId => `${PORTAL_BASE_PATH}/expenses/${expenseId}`,
      providesTags: (result, error, expenseId) => [{ type: 'Expense', id: expenseId }],
    }),

    // Get expense statistics
    getExpenseStats: builder.query<ExpenseStatsResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/expenses/stats`,
      providesTags: [{ type: 'Expense', id: 'STATS' }],
    }),

    // Get expenses by category
    getExpensesByCategory: builder.query<
      ExpensesResponse,
      { category: string } & ExpenseQueryParams
    >({
      query: ({ category, ...params }) => {
        const queryParams = new URLSearchParams()
        if (params && typeof params === 'object') {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value))
            }
          })
        }
        const queryString = queryParams.toString()
        return `${PORTAL_BASE_PATH}/expenses/category/${category}${queryString ? `?${queryString}` : ''}`
      },
      providesTags: (result, error, { category }) => [
        { type: 'Expense', id: `CATEGORY_${category}` },
      ],
    }),

    // Create new expense
    createExpense: builder.mutation<
      { payload: Expense; message: string; status: number },
      ExpenseFormData
    >({
      query: data => {
        // If there's a receipt file, use FormData
        if (data.receipt) {
          const formData = new FormData()
          formData.append('receipt', data.receipt)

          // Append all other fields
          Object.entries(data).forEach(([key, value]) => {
            if (key === 'receipt') return // Skip the file, already added
            if (value === undefined || value === null) return

            if (key === 'items' && Array.isArray(value)) {
              formData.append(key, JSON.stringify(value))
            } else if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value))
            } else {
              formData.append(key, String(value))
            }
          })

          return {
            url: `${PORTAL_BASE_PATH}/expenses`,
            method: 'POST',
            body: formData,
            formData: true,
          }
        }

        // No file, use regular JSON body
        return {
          url: `${PORTAL_BASE_PATH}/expenses`,
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update expense
    updateExpense: builder.mutation<
      { payload: Expense; message: string; status: number },
      { expenseId: string; data: Partial<ExpenseFormData> }
    >({
      query: ({ expenseId, data }) => {
        // If there's a receipt file, use FormData
        if (data.receipt) {
          const formData = new FormData()
          formData.append('receipt', data.receipt)

          // Append all other fields
          Object.entries(data).forEach(([key, value]) => {
            if (key === 'receipt') return // Skip the file, already added
            if (value === undefined || value === null) return

            if (key === 'items' && Array.isArray(value)) {
              formData.append(key, JSON.stringify(value))
            } else if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value))
            } else {
              formData.append(key, String(value))
            }
          })

          return {
            url: `${PORTAL_BASE_PATH}/expenses/${expenseId}`,
            method: 'PATCH',
            body: formData,
            formData: true,
          }
        }

        // No file, use regular JSON body
        return {
          url: `${PORTAL_BASE_PATH}/expenses/${expenseId}`,
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, error, { expenseId }) => [
        { type: 'Expense', id: expenseId },
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update expense status
    updateExpenseStatus: builder.mutation<
      { message: string; status: number },
      { expenseId: string; status: ExpenseStatus }
    >({
      query: ({ expenseId, status }) => ({
        url: `${PORTAL_BASE_PATH}/expenses/${expenseId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { expenseId }) => [
        { type: 'Expense', id: expenseId },
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // Approve expense
    approveExpense: builder.mutation<{ message: string; status: number }, string>({
      query: expenseId => ({
        url: `${PORTAL_BASE_PATH}/expenses/${expenseId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, expenseId) => [
        { type: 'Expense', id: expenseId },
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'STATS' },
      ],
    }),

    // Reject expense
    rejectExpense: builder.mutation<
      { message: string; status: number },
      { expenseId: string; reason?: string }
    >({
      query: ({ expenseId, reason }) => ({
        url: `${PORTAL_BASE_PATH}/expenses/${expenseId}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (result, error, { expenseId }) => [
        { type: 'Expense', id: expenseId },
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'STATS' },
      ],
    }),

    // Delete expense
    deleteExpense: builder.mutation<{ message: string; status: number }, string>({
      query: expenseId => ({
        url: `${PORTAL_BASE_PATH}/expenses/${expenseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, expenseId) => [
        { type: 'Expense', id: expenseId },
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'STATS' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetExpensesQuery,
  useLazyGetExpensesQuery,
  useGetExpenseByIdQuery,
  useLazyGetExpenseByIdQuery,
  useGetExpenseStatsQuery,
  useGetExpensesByCategoryQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useUpdateExpenseStatusMutation,
  useApproveExpenseMutation,
  useRejectExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi
