import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Customer, CustomerState } from './type'
import { customerApi } from '@/store/api'

const initialState: CustomerState = {
  isLoading: false,
  customer: null,
  customers: [],
  error: null,
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // Clear error
    clearError: state => {
      state.error = null
    },
    // Clear current customer
    clearCustomer: state => {
      state.customer = null
    },
  },
  extraReducers: builder => {
    // RTK Query matchers - sync local state with API responses

    // Get customers
    builder.addMatcher(customerApi.endpoints.getCustomers.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(customerApi.endpoints.getCustomers.matchFulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
      state.customers = action.payload.payload.customers
    })
    builder.addMatcher(customerApi.endpoints.getCustomers.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'An error occurred'
    })

    // Get customer by ID
    builder.addMatcher(customerApi.endpoints.getCustomerById.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(
      customerApi.endpoints.getCustomerById.matchFulfilled,
      (state, action: PayloadAction<{ payload: Customer }>) => {
        state.isLoading = false
        state.customer = action.payload.payload
        state.error = null
      }
    )
    builder.addMatcher(customerApi.endpoints.getCustomerById.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'An error occurred'
    })

    // Create customer
    builder.addMatcher(customerApi.endpoints.createCustomer.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(customerApi.endpoints.createCustomer.matchFulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
    })
    builder.addMatcher(customerApi.endpoints.createCustomer.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'An error occurred'
    })

    // Update customer
    builder.addMatcher(customerApi.endpoints.updateCustomer.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(customerApi.endpoints.updateCustomer.matchFulfilled, (state, action) => {
      state.isLoading = false
      state.customer = action.payload.payload.customer
      state.error = null
    })
    builder.addMatcher(customerApi.endpoints.updateCustomer.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'An error occurred'
    })

    // Delete customer
    builder.addMatcher(customerApi.endpoints.deleteCustomer.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(customerApi.endpoints.deleteCustomer.matchFulfilled, state => {
      state.isLoading = false
      state.customer = null
      state.error = null
    })
    builder.addMatcher(customerApi.endpoints.deleteCustomer.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'An error occurred'
    })
  },
})

export const { clearError, clearCustomer } = customerSlice.actions

export default customerSlice.reducer
