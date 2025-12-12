import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocalStorageManager } from '@/utils/localStorage'
import { createNewAccountAction, loginAction, logOutAction, refreshTokenAction } from './actions'
import { AuthState, LoginPayload, User } from './type'
import { isTokenExpired } from '@/utils/jwt'

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
        const expiration = LocalStorageManager.getItem<number>('streamline_token_expiration')
          ? new Date(LocalStorageManager.getItem<number>('streamline_token_expiration')! * 1000)
          : null

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
  },
  extraReducers: builder => {
    // Additional async actions can be handled here

    builder.addCase(createNewAccountAction.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(
      createNewAccountAction.fulfilled,
      (state, action: PayloadAction<{ payload: LoginPayload }>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.payload.user
        state.token = action.payload.payload.accessToken
        state.refreshToken = action.payload.payload.refreshToken
        state.expiresIn = action.payload.payload.expiresIn
        state.error = null
        LocalStorageManager.setAuthToken(action.payload.payload.accessToken)
        LocalStorageManager.setRefreshToken(action.payload.payload.refreshToken)
        // LocalStorageManager.setItem('streamline_user_session', action.payload.payload.user)
        LocalStorageManager.setExpiresIn(action.payload.payload.expiresIn)
      }
    )
    builder.addCase(createNewAccountAction.rejected, (state, action: any) => {
      state.isLoading = false
      state.error = (action.payload as string) ?? action.error?.message ?? 'An error occurred'
    })
    //login
    builder.addCase(loginAction.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(
      loginAction.fulfilled,
      (state, action: PayloadAction<{ payload: LoginPayload }>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.payload.user
        state.token = action.payload.payload.accessToken
        state.refreshToken = action.payload.payload.refreshToken
        state.error = null
        LocalStorageManager.setAuthToken(action.payload.payload.accessToken)
        LocalStorageManager.setRefreshToken(action.payload.payload.refreshToken)
        LocalStorageManager.setUserSession(action.payload.payload.user)
        LocalStorageManager.setExpiresIn(action.payload.payload.expiresIn)
      }
    )
    builder.addCase(loginAction.rejected, (state, action: any) => {
      state.isLoading = false
      state.error = (action.payload as string) ?? action.error?.message ?? 'An error occurred'
    })
    builder.addCase(logOutAction.pending, state => {
      state.isLoading = true
      state.error = null
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.refreshToken = null
      // state.refreshToken = null
    })
    builder.addCase(logOutAction.fulfilled, state => {
      state.isLoading = false
      LocalStorageManager.clearAuthTokens()

      // Clear localStorage
    })
    builder.addCase(logOutAction.rejected, (state, action: any) => {
      state.isLoading = false
      // If rejectWithValue was used, payload may be present; otherwise fall back to action.error.message
      state.error = (action.payload as string) ?? action.error?.message ?? 'An error occurred'
    })
    builder.addCase(refreshTokenAction.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(
      refreshTokenAction.fulfilled,
      (state, action: PayloadAction<{ payload: LoginPayload }>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.payload.user
        state.token = action.payload.payload.accessToken
        state.refreshToken = action.payload.payload.refreshToken
        state.error = null
        LocalStorageManager.setAuthToken(action.payload.payload.accessToken)
        LocalStorageManager.setRefreshToken(action.payload.payload.refreshToken)

        LocalStorageManager.setUserSession(action.payload.payload.user)
        LocalStorageManager.setExpiresIn(action.payload.payload.expiresIn)
      }
    )
    builder.addCase(refreshTokenAction.rejected, (state, action: any) => {
      state.isLoading = false
      state.error = (action.payload as string) ?? action.error?.message ?? 'An error occurred'
    })
  },
})

export const { clearError, restoreSession, sessionExpired, getTokenInfo } = authSlice.actions

export default authSlice.reducer
