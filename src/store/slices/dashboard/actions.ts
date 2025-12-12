import { createAsyncThunk } from '@reduxjs/toolkit'
import errorHandler from '@/utils/error-handler'
import { dashboardStatService } from './service'

export const fetchDashboardStatsAction = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardStatService.fetchDashboardStats()
      if (response) {
        return { success: true, payload: response }
      }
      return response
    } catch (err: any) {
      const errResponseObj = { success: false, data: err.response }
      errorHandler(errResponseObj)
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  }
)
