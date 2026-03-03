import { baseApi } from './baseApi'
import { PORTAL_BASE_PATH } from '@/contants'
import { Account } from '../slices/auth/type'

export interface UpdateAccountDto {
  name?: string
  address?: string
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
  registrationNumber?: string
  currency?: string
  defaultVatRate?: number
  defaultWithholdingTaxRate?: number
  settings?: {
    currency?: string
    timezone?: string
    dateFormat?: string
    language?: string
  }
}

export interface UploadLogoDto {
  file: string // base64 encoded file
  fileName?: string
}

// Account API endpoints using RTK Query
export const accountApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Update account
    updateAccount: builder.mutation<{ payload: Account; message: string }, UpdateAccountDto>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/account`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Upload account logo
    uploadAccountLogo: builder.mutation<{ payload: any; message: string }, UploadLogoDto>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/account/logo`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete account logo
    deleteAccountLogo: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: `${PORTAL_BASE_PATH}/account`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useUpdateAccountMutation,
  useUploadAccountLogoMutation,
  useDeleteAccountLogoMutation,
} = accountApi
