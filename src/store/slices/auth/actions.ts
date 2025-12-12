import { createAsyncThunk } from '@reduxjs/toolkit'
import errorHandler from '@/utils/error-handler'
import { authenticationService } from './service'
import { SignupFormState } from '@/types/signup.types'
import { LoginFormData } from '@/types/login.types'

export const createNewAccountAction = createAsyncThunk(
  'auth/createAccount',
  async (payload: SignupFormState, { rejectWithValue }) => {
    try {
      const response = await authenticationService.createAccount(payload)
      if (response) {
        return { success: true, payload: response.payload }
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

//login
export const loginAction = createAsyncThunk(
  'auth/login',
  async (payload: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authenticationService.login(payload)
      if (response) {
        return { success: true, payload: response.payload }
      }
      return response
    } catch (error: any) {
      const errResponseObj = { success: false, data: error.response }
      errorHandler(errResponseObj)
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const logOutAction = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await authenticationService.logout()
    if (response) {
      return { success: true, payload: response.payload }
    }
    return response
  } catch (error: any) {
    const errResponseObj = { success: false, data: error.response }
    errorHandler(errResponseObj)
    if (!error.response) {
      throw error
    }
    return rejectWithValue(error.response.data)
  }
})

//refresh
export const refreshTokenAction = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await authenticationService.refreshToken(refreshToken)
      if (response) {
        return { success: true, payload: response.payload }
      }
      return response
    } catch (error: any) {
      const errResponseObj = { success: false, data: error.response }
      errorHandler(errResponseObj)
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
