// Staff types for RTK Query API

export const STAFF_ROLES = [
  'Admin',
  'Sale',
  'Procurement',
  'Accountant',
  'BusinessOwner',
  'Staff',
  'Warehouse',
] as const
export type StaffRole = (typeof STAFF_ROLES)[number]

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern'

export type StaffStatus = 'active' | 'inactive' | 'on_leave' | 'terminated'

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface BankDetails {
  bankName: string
  accountNumber: string
  accountName: string
  sortCode?: string
  routingNumber?: string
}

export interface Staff {
  _id: string
  employeeId?: string
  companyId: string
  // Personal info
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  avatarUrl?: string
  // Employment info
  role: StaffRole
  department?: string
  position?: string
  employmentType: EmploymentType
  hireDate: string
  terminationDate?: string
  status: StaffStatus
  // Compensation
  salary: number
  salaryType: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual'
  currency?: string
  // Additional info
  bankDetails?: BankDetails
  emergencyContact?: EmergencyContact
  taxId?: string
  socialSecurityNumber?: string
  notes?: string
  // Access
  userId?: string // Link to user account if they have system access
  canAccessPortal?: boolean
  permissions?: string[]
  // Metadata
  createdBy?: string | UserRef
  createdAt: string
  updatedAt: string
}

interface UserRef {
  _id: string
  firstName: string
  lastName: string
  email: string
}

// Form data for creating/updating staff
export interface StaffFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  role: StaffRole
  department?: string
  position?: string
  employmentType: EmploymentType
  hireDate: string
  salary: number
  salaryType?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual'
  currency?: string
  bankDetails?: BankDetails
  emergencyContact?: EmergencyContact
  taxId?: string
  notes?: string
  canAccessPortal?: boolean
  password?: string
}

// Query params for staff list
export interface StaffQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  role?: StaffRole
  department?: string
  status?: StaffStatus
  employmentType?: EmploymentType
}

// Response types
export interface StaffResponse {
  payload: Staff
  message: string
  status: number
}

export interface StaffsResponse {
  payload: {
    data: Staff[]
    total: number
    page?: number
    limit?: number
    totalPages?: number
  }
  message: string
  status: number
}

export interface StaffStatsResponse {
  payload: {
    total: number
    active: number
    inactive: number
    onLeave: number
    byDepartment: {
      department: string
      count: number
    }[]
    byRole: {
      role: StaffRole
      count: number
    }[]
    totalPayroll: number
    averageSalary: number
  }
  message: string
  status: number
}
