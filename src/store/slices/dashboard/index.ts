import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardPayload, DashboardState } from './type'
import { dashboardApi } from '@/store/api'

// Initialize state from localStorage if available
const getInitialState = (): DashboardState => {
  return {
    isLoading: false,
    error: null,
    stats: null,
  }
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: getInitialState(),
  reducers: {
    // Clear error
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    // RTK Query matchers - sync local state with API responses
    builder.addMatcher(dashboardApi.endpoints.getDashboardStats.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(
      dashboardApi.endpoints.getDashboardStats.matchFulfilled,
      (state, action: PayloadAction<{ payload: DashboardPayload }>) => {
        state.isLoading = false
        state.error = null
        state.stats = action.payload.payload
      }
    )
    builder.addMatcher(dashboardApi.endpoints.getDashboardStats.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'An error occurred'
    })
  },
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer
