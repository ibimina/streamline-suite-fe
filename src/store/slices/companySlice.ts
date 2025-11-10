import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CompanyDetails, CustomTemplate } from '../../types'

export const defaultCompanyDetails: CompanyDetails = {
  name: 'Coutvel',
  address: '123 Business Avenue, Suite 100',
  contact: 'contact@yourcompany.com | (555) 555-5555',
  tagline: 'Your trusted partner in business solutions.',
  logoUrl: '',
  customTemplates: [],
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
    addCustomTemplate: (state, action: PayloadAction<CustomTemplate>) => {
      if (!state.details.customTemplates) {
        state.details.customTemplates = []
      }
      state.details.customTemplates.push(action.payload)
      state.error = null

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('companyDetails', JSON.stringify(state.details))
        } catch (error) {
          console.error('Failed to save company details to localStorage', error)
          state.error = 'Failed to save custom template'
        }
      }
    },
    removeCustomTemplate: (state, action: PayloadAction<string>) => {
      if (state.details.customTemplates) {
        state.details.customTemplates = state.details.customTemplates.filter(
          template => template.id !== action.payload
        )
        state.error = null

        // Save to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('companyDetails', JSON.stringify(state.details))
          } catch (error) {
            console.error('Failed to save company details to localStorage', error)
            state.error = 'Failed to remove custom template'
          }
        }
      }
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
  addCustomTemplate,
  removeCustomTemplate,
} = companySlice.actions

export default companySlice.reducer
