/**
 * Role names matching backend enum
 * Keep in sync with: streamline-suite-api/src/models/enums/shared.enum.ts
 */
export enum RoleName {
  Admin = 'Admin',
  Sale = 'Sale',
  Procurement = 'Procurement',
  Accountant = 'Accountant',
  BusinessOwner = 'BusinessOwner',
  Staff = 'Staff',
  Warehouse = 'Warehouse',
  Manager = 'Manager',
}

/**
 * Role display names for UI
 */
export const ROLE_DISPLAY_NAMES: Record<RoleName, string> = {
  [RoleName.Admin]: 'Administrator',
  [RoleName.Sale]: 'Sales',
  [RoleName.Procurement]: 'Procurement',
  [RoleName.Accountant]: 'Accountant',
  [RoleName.BusinessOwner]: 'Business Owner',
  [RoleName.Staff]: 'Staff',
  [RoleName.Warehouse]: 'Warehouse',
  [RoleName.Manager]: 'Manager',
}

/**
 * List of all roles for dropdowns/selectors
 */
export const ALL_ROLES = Object.values(RoleName)
