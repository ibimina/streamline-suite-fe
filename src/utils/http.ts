import axios from 'axios'
import queryString from 'query-string'
import { IPost, IPatch, IGet, IBaseUrl, IPut } from './axios.interface'
import { LocalStorageManager } from '@/utils/localStorage'
import { isTokenExpired, willTokenExpireSoon } from '@/utils/jwt'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

class HttpFacade {
  private http
  private isRefreshing = false
  private refreshSubscribers: Array<(token: string) => void> = []
  constructor() {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    })

    // Request interceptor - check token expiration and attach to requests
    this.http.interceptors.request.use(
      async config => {
        if (typeof window !== 'undefined') {
          let token = LocalStorageManager.getAuthToken()

          if (token) {
            // Check if token will expire soon (within 5 minutes)
            const willExpire = willTokenExpireSoon(token, 5)

            if (willExpire === true) {
              token = await this.refreshToken()
            } else if (willExpire === null || isTokenExpired(token)) {
              this.handleTokenExpiration()
              return Promise.reject(new Error('Token expired'))
            }

            if (token && config.headers) {
              config.headers.Authorization = `Bearer ${token}`
            }
          }
        }
        return config
      },
      error => Promise.reject(error)
    )

    // Response interceptor - handle 401 errors
    this.http.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config

        // Check if it's a 401 error and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          const token = LocalStorageManager.getAuthToken()

          // Only attempt refresh if we have a token and it's actually expired
          if (token && isTokenExpired(token)) {
            originalRequest._retry = true

            try {
              const newToken = await this.refreshToken()
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return this.http(originalRequest)
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError)
              this.handleTokenExpiration()
              return Promise.reject(refreshError)
            }
          } else {
            console.warn('401 error - likely permission issue, not token expiration')
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      // If refresh is already in progress, wait for it
      return new Promise(resolve => {
        this.refreshSubscribers.push((token: string) => resolve(token))
      })
    }

    this.isRefreshing = true

    try {
      const refreshToken = LocalStorageManager.getRefreshToken()
      console.warn('Attempting token refresh with refresh token:', refreshToken)
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      })
      console.warn('Refresh response data:', response)

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.payload

      // Update tokens in storage
      LocalStorageManager.setAuthToken(newAccessToken)
      if (newRefreshToken) {
        LocalStorageManager.setRefreshToken(newRefreshToken)
      }

      // Notify all waiting requests
      this.refreshSubscribers.forEach(callback => callback(newAccessToken))
      this.refreshSubscribers = []

      return newAccessToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.handleTokenExpiration()
      return null
    } finally {
      this.isRefreshing = false
    }
  }

  private handleTokenExpiration(): void {
    // Clear tokens and redirect to login
    LocalStorageManager.clearAuthTokens()

    // Only redirect if we're in the browser and not already on login page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
  }

  post = async ({ url, body }: IPost) => {
    const response = await this.http.post(url, body)
    return response.data
  }

  patch = async ({ url, body }: IPatch) => {
    const response = await this.http.patch(url, body)
    return response.data
  }

  get = async ({ url, query = {} }: IGet) => {
    const queryStringified = queryString.stringify(query)
    const response = await this.http.get(`${url}?${queryStringified}`)
    return response.data
  }

  delete = async ({ url }: IBaseUrl) => {
    const response = await this.http.delete(url)
    return response.data
  }

  put = async ({ url, body }: IPut) => {
    const response = await this.http.put(url, body)
    return response.data
  }
}

const httpFacade = new HttpFacade()
export default httpFacade
