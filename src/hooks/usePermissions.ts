'use client'

import { useAppSelector } from '@/store/hooks'
import { RoleName } from '@/contants/roles'
import {
  PermissionName,
  getUserPermissions,
  hasPermission as checkHasPermission,
  hasAllPermissions as checkHasAllPermissions,
  hasAnyPermission as checkHasAnyPermission,
} from '@/contants/permissions'
import { canAccessRoute, getAccessDeniedRedirect } from '@/contants/routePermissions'
import { useMemo } from 'react'

/**
 * Hook for checking user permissions throughout the application
 *
 * Usage:
 * ```tsx
 * const { hasPermission, canAccessPage, userRole } = usePermissions()
 *
 * if (hasPermission(PermissionName.MANAGE_USERS)) {
 *   // Show admin-only content
 * }
 * ```
 */
export function usePermissions() {
  const user = useAppSelector(state => state.authReducer.user)

  // Get user's role (default to Staff if no role)
  const userRole = useMemo(() => {
    if (!user?.role) return RoleName.Staff
    // Map role string to RoleName enum
    return (user.role as RoleName) || RoleName.Staff
  }, [user?.role])

  // Get user's permission mode (inherit from role or custom)
  const permissionMode = useMemo(() => {
    return (user as any)?.permissionMode || 'inherit'
  }, [user])

  // Get user's custom permissions from the user object (if any)
  // Only use custom permissions if permissionMode is 'custom'
  const customPermissions = useMemo(() => {
    if (permissionMode !== 'custom') return undefined
    return (user as any)?.permissions as PermissionName[] | undefined
  }, [user, permissionMode])

  // Get all permissions for the current user
  const userPermissions = useMemo(() => {
    return getUserPermissions(userRole, customPermissions)
  }, [userRole, customPermissions])

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: PermissionName): boolean => {
    return checkHasPermission(userRole, permission, customPermissions)
  }

  /**
   * Check if user has ALL of the specified permissions
   */
  const hasAllPermissions = (permissions: PermissionName[]): boolean => {
    return checkHasAllPermissions(userRole, permissions, customPermissions)
  }

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = (permissions: PermissionName[]): boolean => {
    return checkHasAnyPermission(userRole, permissions, customPermissions)
  }

  /**
   * Check if user can access a specific route/page
   */
  const canAccessPage = (pathname: string): boolean => {
    return canAccessRoute(pathname, userPermissions)
  }

  /**
   * Get redirect path when access is denied
   */
  const accessDeniedRedirect = getAccessDeniedRedirect()

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: RoleName): boolean => {
    return userRole === role
  }

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: RoleName[]): boolean => {
    return roles.includes(userRole)
  }

  /**
   * Check if user is an admin or business owner (full access)
   */
  const isAdmin = useMemo(() => {
    return userRole === RoleName.Admin || userRole === RoleName.BusinessOwner
  }, [userRole])

  return {
    // User info
    user,
    userRole,
    userPermissions,

    // Permission checks
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,

    // Route access
    canAccessPage,
    accessDeniedRedirect,

    // Role checks
    hasRole,
    hasAnyRole,
    isAdmin,
  }
}

export default usePermissions
