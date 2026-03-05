import { z } from 'zod'
import { customerSchema } from '@/schemas/customer.schema'

export type CustomerFormData = z.infer<typeof customerSchema>

export interface CustomerResponse {
  success: boolean
  customer?: null
  message?: string
  errors?: Record<string, string[]>
}
