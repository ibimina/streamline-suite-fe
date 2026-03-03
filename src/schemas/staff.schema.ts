import { z } from 'zod'

/**
 * Employment Type Enum
 * Matches backend EmploymentType enum
 */
export const employmentTypeEnum = z.enum(['full-time', 'part-time', 'contract', 'intern'])

/**
 * Role Name Enum
 * Matches backend RoleName enum
 */
export const roleNameEnum = z.enum([
  'Admin',
  'Sale',
  'Procurement',
  'Accountant',
  'BusinessOwner',
  'Staff',
  'Warehouse',
])

/**
 * Permission Name Enum
 * Matches backend PermissionName enum
 */
export const permissionNameEnum = z.enum([
  'view_dashboard',
  'manage_users',
  'view_reports',
  'manage_inventory',
  'process_orders',
  'manage_finances',
])

/**
 * Create Staff Form Schema
 * Matches backend CreateStaffDto
 */
export const createStaffSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .trim(),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address').trim(),
  phone: z.string().optional().or(z.literal('')),
  role: roleNameEnum.optional().default('Staff'),
  position: z
    .string()
    .max(100, 'Position must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .max(100, 'Department must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  employeeId: z
    .string()
    .max(50, 'Employee ID must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  salary: z.number().min(0, 'Salary cannot be negative').optional().default(0),
  employmentType: employmentTypeEnum.optional(),
  hireDate: z
    .string()
    .optional()
    .refine(
      val => {
        if (!val) return true
        const date = new Date(val)
        return !Number.isNaN(date.getTime())
      },
      { message: 'Invalid date format' }
    ),
  address: z
    .string()
    .max(500, 'Address must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  permissions: z.array(permissionNameEnum).optional(),
})

/**
 * Update Staff Form Schema
 * All fields optional except password which has separate validation
 */
export const updateStaffSchema = createStaffSchema.omit({ email: true })

/**
 * Type inference for form data
 */
export type CreateStaffFormData = z.infer<typeof createStaffSchema>
export type UpdateStaffFormData = z.infer<typeof updateStaffSchema>
export type EmploymentType = z.infer<typeof employmentTypeEnum>
export type RoleName = z.infer<typeof roleNameEnum>
export type PermissionName = z.infer<typeof permissionNameEnum>
