import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CompanyDetails } from '../../types'

export const defaultCompanyDetails: CompanyDetails = {
  name: 'Streamline Suite',
  address: '123 Business Avenue, Suite 100',
  contact: 'contact@yourcompany.com | (555) 555-5555',
  logoUrl:
    'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJsb2dvR3JhZGllbnQiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMTRCOEE2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMEQ5NDg4Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTE3IDVIOUE0ODE1MUM2Ljk2MzM2IDUgNC45MDM3NCA3LjA1OTYyIDQuOTAzNzQgOS41Nzc3N1Y5LjU3Nzc3QzQuOTAzNzQgMTIuMTMxNiA2Ljk2MzM2IDE0LjE5MTIgOS40ODE1MSAxNC4xOTEySDE3IiBzdHJva2U9InVybCgjbG9nb0dyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNNyAxOUwxNC41MTg1IDE5QzE3LjAzNjYgMTkgMTkuMDk2MyAxNi45NDA0IDE5LjA5NjMgMTQuNDIyMlYxNC40MjIyQzE5LjA5NjMgMTEuODY4NCAxNy4wMzY2IDkuODA4NzggMTQuNTE4NSA5LjgwODc4SDciIHN0cm9rZT0idXJsKCNsb2dvR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lYUpPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
}

interface CompanyState {
  details: CompanyDetails
  isLoading: boolean
  error: string | null
}

// Try to load from localStorage for initial state
const loadCompanyDetailsFromStorage = (): CompanyDetails => {
  if (typeof window === 'undefined') {
    return defaultCompanyDetails
  }

  try {
    const storedDetails = localStorage.getItem('companyDetails')
    return storedDetails ? JSON.parse(storedDetails) : defaultCompanyDetails
  } catch (error) {
    console.error('Failed to parse company details from localStorage', error)
    return defaultCompanyDetails
  }
}

const initialState: CompanyState = {
  details: loadCompanyDetailsFromStorage(),
  isLoading: false,
  error: null,
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyDetails: (state, action: PayloadAction<CompanyDetails>) => {
      state.details = action.payload
      state.error = null

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('companyDetails', JSON.stringify(action.payload))
        } catch (error) {
          console.error('Failed to save company details to localStorage', error)
          state.error = 'Failed to save company details'
        }
      }
    },
    updateCompanyDetails: (state, action: PayloadAction<Partial<CompanyDetails>>) => {
      state.details = { ...state.details, ...action.payload }
      state.error = null

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('companyDetails', JSON.stringify(state.details))
        } catch (error) {
          console.error('Failed to save company details to localStorage', error)
          state.error = 'Failed to save company details'
        }
      }
    },
    resetCompanyDetails: state => {
      state.details = defaultCompanyDetails
      state.error = null

      // Clear from localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('companyDetails')
        } catch (error) {
          console.error('Failed to remove company details from localStorage', error)
        }
      }
    },
    setCompanyLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCompanyError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearCompanyError: state => {
      state.error = null
    },
  },
})

export const {
  setCompanyDetails,
  updateCompanyDetails,
  resetCompanyDetails,
  setCompanyLoading,
  setCompanyError,
  clearCompanyError,
} = companySlice.actions

export default companySlice.reducer
