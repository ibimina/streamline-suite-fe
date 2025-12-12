import errorHandler from '@/utils/error-handler'
import http from '@/utils/http'
import { getDashboardStatsUrl } from '@/utils/url'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

class DashboardStatService {
  constructor() {}

  async fetchDashboardStats() {
    try {
      const response = await http.get({
        url: `${BASE_URL}/${getDashboardStatsUrl}`,
      })
      return response
    } catch (error) {
      errorHandler(error)
    }
  }
}

export const dashboardStatService = new DashboardStatService()
