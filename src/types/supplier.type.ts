import { z } from 'zod'
import { supplierSchema } from '@/schemas/supplier.schema'

export type SupplierFormData = z.infer<typeof supplierSchema>

export interface SupplierResponse {
  success: boolean
  supplier?: null
  message?: string
  errors?: Record<string, string[]>
}

export interface Supplier {
  id?: string
  name: string
  contact?: string
  contacts?: {
    name: string
    email?: string
    phone?: string
    role?: string
    primary?: boolean
  }[]
  email?: string
  phone?: string
  address?: string
  paymentTerms?: string
  taxId?: string
  isActive?: boolean
  companyId?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}
