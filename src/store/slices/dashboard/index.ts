import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchDashboardStatsAction } from './actions'
import { DashboardPayload, DashboardState } from './type'

// Initialize state from localStorage if available
const getInitialState = (): DashboardState => {
  // Check localStorage for existing session

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
    // Additional async actions can be handled here

    builder.addCase(fetchDashboardStatsAction.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(
      fetchDashboardStatsAction.fulfilled,
      (state, action: PayloadAction<{ payload: DashboardPayload }>) => {
        state.isLoading = false
        state.error = null
        state.stats = action.payload.payload
      }
    )
    builder.addCase(fetchDashboardStatsAction.rejected, (state, action: any) => {
      state.isLoading = false
      state.error = (action.payload as string) ?? action.error?.message ?? 'An error occurred'
    })
  },
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer
