export interface User {
  _id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'manager'
  account: {
    _id: string
    logoUrl: string
    name: string
  }
  firstName: string
  lastName: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  token: string | null
  refreshToken: string | null
  expiresIn: number | null
}
export type LoginPayload = {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}
