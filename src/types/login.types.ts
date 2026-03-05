import { z } from 'zod'
import { loginSchema } from '@/schemas/login.schema'

export type LoginFormData = z.infer<typeof loginSchema>

export interface LoginResponse {
  success: boolean
  user: {
    _id: string
    email: string
    firstName: string
    lastNmae: string
    role: string
    account?: string
  }
  token?: string
  message?: string
  errors?: Record<string, string[]>
}
