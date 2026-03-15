import { PermissionName } from './permissions'

/**
 * Route Permission Configuration
 * Maps frontend routes to required permissions
 *
 * If a route is not listed here, it's accessible to all authenticated users.
 * If a route has an empty array, it's accessible to all authenticated users.
 * If a route has permissions, user must have ANY of the listed permissions.
 */
export const ROUTE_PERMISSIONS: Record<string, PermissionName[]> = {
  // Dashboard - accessible to all (VIEW_DASHBOARD)
  '/dashboard': [PermissionName.VIEW_DASHBOARD],

  // Admin / User Management
  '/admin': [PermissionName.MANAGE_USERS],

  // Invoices
  '/invoices': [PermissionName.VIEW_INVOICES],
  '/invoices/create': [PermissionName.CREATE_INVOICES],
  '/invoices/edit': [PermissionName.CREATE_INVOICES],

  // Quotations
  '/quotations': [PermissionName.VIEW_QUOTATIONS],
  '/quotations/create': [PermissionName.CREATE_QUOTATIONS],
  '/quotations/edit': [PermissionName.CREATE_QUOTATIONS],

  // Products
  '/products': [PermissionName.VIEW_PRODUCTS],

  // Inventory
  '/inventory': [PermissionName.VIEW_INVENTORY],

  // Customers
  '/customers': [PermissionName.VIEW_CUSTOMERS],

  // Suppliers
  '/suppliers': [PermissionName.VIEW_SUPPLIERS],

  // Expenses
  '/expenses': [PermissionName.VIEW_EXPENSES],

  // Payroll
  '/payroll': [PermissionName.VIEW_PAYROLL],

  // Taxes
  '/taxes': [PermissionName.VIEW_TAXES],

  // Analytics / Reports
  '/analytics': [PermissionName.VIEW_REPORTS],

  // Settings - accessible to all authenticated users (to view their permissions)
  // Note: MANAGE_SETTINGS controls what can be edited, not access to the page
  '/settings': [],
}

/**
 * Check if a user can access a specific route
 * Returns true if route has no required permissions or user has any required permission
 */
export function canAccessRoute(pathname: string, userPermissions: PermissionName[]): boolean {
  // Normalize path - remove trailing slash and query params
  const normalizedPath = pathname.split('?')[0].replace(/\/$/, '') || '/'

  // Find matching route config (exact match first, then prefix match)
  let requiredPermissions = ROUTE_PERMISSIONS[normalizedPath]

  // If no exact match, try prefix matching for dynamic routes like /invoices/[id]
  if (!requiredPermissions) {
    const pathParts = normalizedPath.split('/')
    // Try progressively shorter paths
    for (let i = pathParts.length - 1; i > 0; i--) {
      const partialPath = pathParts.slice(0, i + 1).join('/')
      if (ROUTE_PERMISSIONS[partialPath]) {
        requiredPermissions = ROUTE_PERMISSIONS[partialPath]
        break
      }
    }
  }

  // If route has no permission requirements, allow access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }

  // Check if user has ANY of the required permissions
  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

/**
 * Get the redirect path when access is denied
 */
export function getAccessDeniedRedirect(): string {
  return '/dashboard'
}
