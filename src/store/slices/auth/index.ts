import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocalStorageManager } from '@/utils/localStorage'
import { Account, AuthState, LoginPayload, User } from './type'
import { isTokenExpired } from '@/utils/jwt'
import { authApi } from '@/store/api'
import { accountApi } from '@/store/api/accountApi'

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  // Check localStorage for existing session
  const token = LocalStorageManager.getAuthToken()
  const refreshToken = LocalStorageManager.getRefreshToken()
  const userSession = LocalStorageManager.getUserSession()
  const expiresIn = LocalStorageManager.getExpiresIn()

  return {
    user: userSession,
    isAuthenticated: Boolean(token && userSession),
    isLoading: false,
    error: null,
    token,
    refreshToken,
    expiresIn,
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // Clear error
    clearError: state => {
      state.error = null
    },

    // Session restore (called on app initialization)
    restoreSession: state => {
      const token = LocalStorageManager.getAuthToken()
      const userSession = LocalStorageManager.getItem<User>('streamline_user_session')

      if (token && userSession) {
        state.isAuthenticated = true
        state.user = userSession
        state.token = token
        state.refreshToken = LocalStorageManager.getRefreshToken()
      }
    },

    // Session timeout/invalid
    sessionExpired: state => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.refreshToken = null
      state.error = 'Session expired. Please log in again.'

      // Clear localStorage
      LocalStorageManager.clearAuthTokens()
    },

    // Token refresh success
    refreshTokenSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) => {
      state.token = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
      state.error = null

      // Update localStorage
      LocalStorageManager.setAuthToken(action.payload.accessToken)
      if (action.payload.refreshToken) {
        LocalStorageManager.setRefreshToken(action.payload.refreshToken)
      }
    },

    // Get token expiration info
    getTokenInfo: state => {
      if (state.token) {
        const isExpired = isTokenExpired(state.token)

        // If token is expired, trigger session expiry
        if (isExpired) {
          state.user = null
          state.isAuthenticated = false
          state.token = null
          state.refreshToken = null
          state.error = 'Session expired. Please log in again.'
          LocalStorageManager.clearAuthTokens()
        }
      }
    },

    // Reset auth state (for logout)
    resetAuth: state => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.refreshToken = null
      state.expiresIn = null
      state.error = null
      state.isLoading = false
    },

    // Update account in state (for local updates after API call)
    updateAccountInState: (state, action: PayloadAction<Partial<Account>>) => {
      if (state.user) {
        state.user.account = { ...state.user.account, ...action.payload }
        // Update localStorage
        LocalStorageManager.setUserSession(state.user)
      }
    },
  },
  extraReducers: builder => {
    // RTK Query matchers - sync local state with API responses

    // Login
    builder.addMatcher(authApi.endpoints.login.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<{ payload: LoginPayload }>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.payload.user
        state.token = action.payload.payload.accessToken
        state.refreshToken = action.payload.payload.refreshToken
        state.expiresIn = action.payload.payload.expiresIn
        state.error = null
      }
    )
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'Login failed'
    })

    // Create Account
    builder.addMatcher(authApi.endpoints.createAccount.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(
      authApi.endpoints.createAccount.matchFulfilled,
      (state, action: PayloadAction<{ payload: LoginPayload }>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.payload.user
        state.token = action.payload.payload.accessToken
        state.refreshToken = action.payload.payload.refreshToken
        state.expiresIn = action.payload.payload.expiresIn
        state.error = null
      }
    )
    builder.addMatcher(authApi.endpoints.createAccount.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'Account creation failed'
    })

    // Logout
    builder.addMatcher(authApi.endpoints.logout.matchPending, state => {
      state.isLoading = true
      state.error = null
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.refreshToken = null
    })
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, state => {
      state.isLoading = false
    })
    builder.addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'Logout failed'
    })

    // Refresh Token
    builder.addMatcher(authApi.endpoints.refreshToken.matchPending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, action: PayloadAction<{ payload: LoginPayload }>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.payload.user
        state.token = action.payload.payload.accessToken
        state.refreshToken = action.payload.payload.refreshToken
        state.expiresIn = action.payload.payload.expiresIn
        state.error = null
      }
    )
    builder.addMatcher(authApi.endpoints.refreshToken.matchRejected, (state, action) => {
      state.isLoading = false
      state.error =
        (action.payload as any)?.data?.message ?? action.error?.message ?? 'Token refresh failed'
    })

    // Update Account - sync account data in state
    builder.addMatcher(
      accountApi.endpoints.updateAccount.matchFulfilled,
      (state, action: PayloadAction<{ payload: Account }>) => {
        if (state.user) {
          state.user.account = action.payload.payload
          LocalStorageManager.setUserSession(state.user)
        }
      }
    )
  },
})

export const {
  clearError,
  restoreSession,
  sessionExpired,
  getTokenInfo,
  resetAuth,
  refreshTokenSuccess,
  updateAccountInState,
} = authSlice.actions

export default authSlice.reducer
