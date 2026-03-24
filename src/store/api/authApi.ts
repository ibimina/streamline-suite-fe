import { baseApi } from './baseApi'
import { LoginPayload, User } from '../slices/auth/type'
import { SignupFormState } from '@/types/signup.types'
import { LoginFormData } from '@/types/login.types'
import { LocalStorageManager } from '@/utils/localStorage'

// Auth API endpoints using RTK Query
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Login mutation
    login: builder.mutation<{ payload: LoginPayload }, LoginFormData>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Handle successful login - store tokens
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          LocalStorageManager.setAuthToken(data.payload.accessToken)
          LocalStorageManager.setRefreshToken(data.payload.refreshToken)
          LocalStorageManager.setUserSession(data.payload.user)
          LocalStorageManager.setExpiresIn(data.payload.expiresIn)
        } catch {
          // Error handled by RTK Query
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Create account mutation
    createAccount: builder.mutation<{ payload: LoginPayload }, SignupFormState>({
      query: data => ({
        url: '/auth/createAccount',
        method: 'POST',
        body: data,
      }),
      // Handle successful signup - store tokens
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          LocalStorageManager.setAuthToken(data.payload.accessToken)
          LocalStorageManager.setRefreshToken(data.payload.refreshToken)
          LocalStorageManager.setExpiresIn(data.payload.expiresIn)
        } catch {
          // Error handled by RTK Query
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Logout mutation
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/customer-portal/logout',
        method: 'POST',
      }),
      // Clear tokens on logout
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          // Always clear tokens, even if request fails
          LocalStorageManager.clearAuthTokens()
        }
      },
      invalidatesTags: [
        'Auth',
        'User',
        'Dashboard',
        'Customer',
        'Invoice',
        'Quotation',
        'Inventory',
      ],
    }),

    // Refresh token mutation
    refreshToken: builder.mutation<{ payload: LoginPayload }, string>({
      query: refreshToken => ({
        url: '/auth/refreshToken',
        method: 'POST',
        body: { refreshToken },
      }),
      // Handle successful refresh - update tokens
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          LocalStorageManager.setAuthToken(data.payload.accessToken)
          LocalStorageManager.setRefreshToken(data.payload.refreshToken)
          LocalStorageManager.setUserSession(data.payload.user)
          LocalStorageManager.setExpiresIn(data.payload.expiresIn)
        } catch {
          // Error handled by RTK Query
        }
      },
    }),

    // Get current user (optional - if you have this endpoint)
    getCurrentUser: builder.query<{ payload: User }, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Forgot password - request password reset email
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: data => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password - set new password with token
    resetPassword: builder.mutation<{ message: string }, { token: string; newPassword: string }>({
      query: data => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useLoginMutation,
  useCreateAccountMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi
