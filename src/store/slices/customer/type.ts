export interface Customer {
  _id: string
  fullName: string
  uniqueId: string
  companyName?: string
  phone?: string
  email?: string
  address?: string
  role?: string
  primary?: boolean
  createdAt: string
  tags?: string[]
  status?: 'active' | 'inactive' | 'suspended'
  currency?: string
  billingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  shippingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  contacts?: Array<{
    name: string
    email: string
    phone?: string
    role?: string
    primary?: boolean
  }>
  updatedAt: string
  language?: string
  taxId?: string
  creditLimit?: number
  customFields?: Record<string, any>
  notes?: string
  isActive?: boolean
}

export interface CustomerState {
  customer: Customer | null
  customers: Customer[]
  isLoading: boolean
  error: string | null
}

export interface CreateCustomerPayload {
  customer: Customer
}

export interface UpdateCustomerPayload {
  customer: Customer
}

export interface FetchCustomersPayload {
  customers: Customer[]
}
