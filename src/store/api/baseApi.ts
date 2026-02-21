import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { LocalStorageManager } from '@/utils/localStorage'
import { willTokenExpireSoon } from '@/utils/jwt'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Base query with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: headers => {
    const token = LocalStorageManager.getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Base query with token refresh logic
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Check if token needs refresh before making request
  const token = LocalStorageManager.getAuthToken()
  const refreshToken = LocalStorageManager.getRefreshToken()

  if (token && willTokenExpireSoon(token, 5)) {
    // Token will expire soon, try to refresh
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refreshToken',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      )

      if (refreshResult.data) {
        const data = refreshResult.data as {
          payload: {
            accessToken: string
            refreshToken: string
            expiresIn: number
          }
        }
        LocalStorageManager.setAuthToken(data.payload.accessToken)
        LocalStorageManager.setRefreshToken(data.payload.refreshToken)
        LocalStorageManager.setExpiresIn(data.payload.expiresIn)
      }
    }
  }

  let result = await baseQuery(args, api, extraOptions)

  // Handle 401 errors - try to refresh token
  if (result.error && result.error.status === 401) {
    const currentRefreshToken = LocalStorageManager.getRefreshToken()

    if (currentRefreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refreshToken',
          method: 'POST',
          body: { refreshToken: currentRefreshToken },
        },
        api,
        extraOptions
      )

      if (refreshResult.data) {
        const data = refreshResult.data as {
          payload: {
            accessToken: string
            refreshToken: string
            expiresIn: number
          }
        }
        // Store the new tokens
        LocalStorageManager.setAuthToken(data.payload.accessToken)
        LocalStorageManager.setRefreshToken(data.payload.refreshToken)
        LocalStorageManager.setExpiresIn(data.payload.expiresIn)

        // Retry the original request
        result = await baseQuery(args, api, extraOptions)
      } else {
        // Refresh failed, clear auth state
        LocalStorageManager.clearAuthTokens()
        // Optionally dispatch logout action here
      }
    } else {
      // No refresh token, clear auth state
      LocalStorageManager.clearAuthTokens()
    }
  }

  return result
}

// Create the base API - other API slices will inject endpoints into this
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Dashboard',
    'Customer',
    'Invoice',
    'Quotation',
    'Inventory',
    'Product',
    'Supplier',
    'Expense',
    'Payroll',
    'Staff',
    'Tax',
    'Analytics',
    'InventoryTransaction',
  ],
  endpoints: () => ({}),
})
