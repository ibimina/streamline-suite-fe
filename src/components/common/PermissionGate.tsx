'use client'

import React, { ReactNode } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { PermissionName } from '@/contants/permissions'
import { RoleName } from '@/contants/roles'

interface PermissionGateProps {
  /**
   * Required permissions - user must have ALL permissions to see children
   */
  permissions?: PermissionName[]

  /**
   * Alternative: User must have ANY of these permissions
   */
  anyPermissions?: PermissionName[]

  /**
   * Alternative: User must have any of these roles
   */
  roles?: RoleName[]

  /**
   * Content to render when user has permission
   */
  children: ReactNode

  /**
   * Optional: Content to render when user doesn't have permission
   * Defaults to null (nothing rendered)
   */
  fallback?: ReactNode

  /**
   * If true, hides the element instead of not rendering it
   * Useful for maintaining layout when permission is denied
   */
  hideInsteadOfRemove?: boolean
}

/**
 * Component to conditionally render content based on user permissions
 *
 * Usage examples:
 * ```tsx
 * // Require specific permission
 * <PermissionGate permissions={[PermissionName.MANAGE_USERS]}>
 *   <AdminPanel />
 * </PermissionGate>
 *
 * // Require any of multiple permissions
 * <PermissionGate anyPermissions={[PermissionName.CREATE_INVOICES, PermissionName.APPROVE_INVOICES]}>
 *   <InvoiceActions />
 * </PermissionGate>
 *
 * // Require specific roles
 * <PermissionGate roles={[RoleName.Admin, RoleName.Manager]}>
 *   <ManagerView />
 * </PermissionGate>
 *
 * // With fallback content
 * <PermissionGate
 *   permissions={[PermissionName.MANAGE_FINANCES]}
 *   fallback={<p>You don&apos;t have access to this feature</p>}
 * >
 *   <FinancePanel />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  permissions,
  anyPermissions,
  roles,
  children,
  fallback = null,
  hideInsteadOfRemove = false,
}: PermissionGateProps) {
  const { hasAllPermissions, hasAnyPermission, hasAnyRole } = usePermissions()

  // Check permissions
  let hasAccess = true

  if (permissions && permissions.length > 0) {
    hasAccess = hasAccess && hasAllPermissions(permissions)
  }

  if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAccess && hasAnyPermission(anyPermissions)
  }

  if (roles && roles.length > 0) {
    hasAccess = hasAccess && hasAnyRole(roles)
  }

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>
  }

  // If hideInsteadOfRemove is true, render an invisible wrapper
  if (hideInsteadOfRemove) {
    return <div style={{ display: 'none' }}>{children}</div>
  }

  // Otherwise, render fallback (or nothing)
  return <>{fallback}</>
}

/**
 * HOC version for wrapping entire components/pages
 *
 * Usage:
 * ```tsx
 * const ProtectedComponent = withPermission(MyComponent, {
 *   permissions: [PermissionName.MANAGE_USERS],
 * })
 * ```
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  gateProps: Omit<PermissionGateProps, 'children'>
) {
  const WithPermissionComponent = (props: P) => (
    <PermissionGate {...gateProps}>
      <WrappedComponent {...props} />
    </PermissionGate>
  )

  WithPermissionComponent.displayName = `WithPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithPermissionComponent
}

export default PermissionGate
