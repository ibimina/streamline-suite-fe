export interface Customer {
  _id?: string
  id?: string
  uniqueId?: string
  fullName?: string
  companyName?: string
  email?: string
  phone?: string
  address?: string
  billingAddress?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    zipCode?: string
    country?: string
  }
  shippingAddress?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  contacts?: {
    name: string
    email?: string
    phone?: string
    role?: string
    primary?: boolean
  }[]
  branches?: {
    name: string
    code?: string
    address?: {
      street?: string
      city?: string
      state?: string
      postalCode?: string
      country?: string
    }
    contactPerson?: string
    contactEmail?: string
    contactPhone?: string
    notes?: string
    isActive?: boolean
  }[]
  tags?: string[]
  customFields?: Record<string, any>
  currency?: string
  language?: string
  status?: 'active' | 'inactive' | 'suspended'
  notes?: string
  accountId?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  taxId?: string
  creditLimit?: number
  isActive?: boolean
}
