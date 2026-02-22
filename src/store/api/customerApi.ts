import { baseApi } from './baseApi'
import { Customer } from '../slices/customer/type'
import { CustomerFormData } from '@/schemas/customer.schema'
import { PORTAL_BASE_PATH } from '@/contants'

// Response types
interface CustomerResponse {
  payload: {
    customer: Customer
  }
}

interface CustomersResponse {
  payload: {
    customers: Customer[]
  }
}

// Customer API endpoints using RTK Query
export const customerApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all customers
    getCustomers: builder.query<CustomersResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/customers`,
      providesTags: result =>
        result
          ? [
              ...result.payload.customers.map(({ uniqueId }) => ({
                type: 'Customer' as const,
                id: uniqueId,
              })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),

    // Get single customer by ID
    getCustomerById: builder.query<{ payload: Customer }, string>({
      query: customerId => `${PORTAL_BASE_PATH}/customers/${customerId}`,
      providesTags: (result, error, customerId) => [{ type: 'Customer', id: customerId }],
    }),

    // Create new customer
    createCustomer: builder.mutation<CustomerResponse, CustomerFormData>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/customer`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),

    // Update customer
    updateCustomer: builder.mutation<
      CustomerResponse,
      { customerId: string; data: Partial<CustomerFormData> }
    >({
      query: ({ customerId, data }) => ({
        url: `${PORTAL_BASE_PATH}/customers/${customerId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: customerId },
        { type: 'Customer', id: 'LIST' },
      ],
    }),

    // Delete customer
    deleteCustomer: builder.mutation<void, string>({
      query: customerId => ({
        url: `${PORTAL_BASE_PATH}/customers/${customerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, customerId) => [
        { type: 'Customer', id: customerId },
        { type: 'Customer', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useGetCustomerByIdQuery,
  useLazyGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi
