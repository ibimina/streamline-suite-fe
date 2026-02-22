// User type definitions for admin user management

export type UserRole = 'admin' | 'manager' | 'staff' | 'accountant' | 'sales_rep'

export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  avatar?: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  password?: string
}

export interface UserQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  status?: UserStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UsersResponse {
  payload: {
    data: User[]
    total: number
    page: number
    limit: number
  }
  message: string
  status: number
}

export interface UserResponse {
  payload: User
  message: string
  status: number
}
