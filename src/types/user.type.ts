// User type definitions for admin user management
import { PermissionName } from '@/contants/permissions'

export type PermissionMode = 'inherit' | 'custom'

export type UserRole =
  | 'Admin'
  | 'Manager'
  | 'Staff'
  | 'Accountant'
  | 'Sale'
  | 'Procurement'
  | 'BusinessOwner'
  | 'Warehouse'

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
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  permissionMode?: PermissionMode
  permissions?: PermissionName[]
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  password?: string
  permissionMode?: PermissionMode
  permissions?: PermissionName[]
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
