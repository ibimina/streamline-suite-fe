import { z } from 'zod'
import {
  companyInfoSchema,
  adminAccountSchema,
  securitySchema,
  signupSchema,
} from '@/schemas/signup.schema'
import { FormErrors } from './shared.types'

// Form data types
export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>
export type AdminAccountFormData = z.infer<typeof adminAccountSchema>
export type SecurityFormData = z.infer<typeof securitySchema>
export type SignupFormData = z.infer<typeof signupSchema>

// Step configuration
export interface StepConfig {
  title: string
  description: string
  component: React.ComponentType<{ formMethods: any }>
  schema: z.ZodSchema<any>
}

// API response types
export interface SignupResponse {
  success: boolean
  user?: {
    id: string
    email: string
    name: string
    role: string
    company?: string
  }
  token?: string
  message?: string
  errors?: Record<string, string[]>
}

// Form state types

export interface StepState {
  isValid: boolean
  isCompleted: boolean
  errors: FormErrors
}

export interface SignupFormState {
  firstName: string
  lastName: string
  email: string
  name: string
  phoneNumber: string
  address: string
  industry: string
  companySize: string
  country: string
  password: string
}
