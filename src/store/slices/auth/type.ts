export interface Account {
  _id: string
  name: string
  address: string
  logoUrl?: string
  phone?: string
  email?: string
  tagline?: string
  industry?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  website?: string
  taxNumber?: string
  taxId?: string
  registrationNumber?: string
  currency?: string
  fiscalYearStart?: string
  defaultVatRate?: number
  defaultWithholdingTaxRate?: number
  settings?: {
    currency: string
    timezone: string
    dateFormat: string
    language: string
  }
}

export interface User {
  _id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'manager'
  account: Account
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
