import errorHandler from '@/utils/error-handler'
import http from '@/utils/http'
import { createAccountUrl, loginUrl, logoutUrl } from '@/utils/url'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

class AuthService {
  constructor() {}

  async createAccount(data: any) {
    try {
      const response = await http.post({
        url: `${BASE_URL}/${createAccountUrl}`,
        body: data,
      })
      return response
    } catch (error) {
      errorHandler(error)
    }
  }

  //login
  async login(data: any) {
    try {
      const response = await http.post({
        url: `${BASE_URL}/${loginUrl}`,
        body: data,
      })

      return await response
    } catch (error) {
      errorHandler(error)
    }
  }

  //refresh token
  async refreshToken(refreshToken: string) {
    try {
      const response = await http.post({
        url: `${BASE_URL}/auth/refresh`,
        body: { refreshToken },
      })
      return response
    } catch (error) {
      errorHandler(error)
      throw error // Re-throw to handle in HTTP interceptor
    }
  }

  //logout
  async logout() {
    try {
      const response = await http.post({
        url: `${BASE_URL}/${logoutUrl}`,
      })
      return await response
    } catch (error) {
      errorHandler(error)
    }
  }
}

export const authenticationService = new AuthService()
