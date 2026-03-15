'use client'
import React, { useState } from 'react'
import { User, UserFormData, UserRole, PermissionMode } from '@/types/user.type'
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '../ui/dialog'
import { PermissionName, ROLE_PERMISSIONS } from '@/contants/permissions'
import { RoleName } from '@/contants/roles'

type RoleOption = { value: UserRole; label: string }

// Group permissions for better UX
const PERMISSION_GROUPS = {
  Dashboard: [PermissionName.VIEW_DASHBOARD],
  Users: [PermissionName.MANAGE_USERS],
  Reports: [PermissionName.VIEW_REPORTS],
  Inventory: [PermissionName.MANAGE_INVENTORY, PermissionName.VIEW_INVENTORY],
  Products: [PermissionName.MANAGE_PRODUCTS, PermissionName.VIEW_PRODUCTS],
  Suppliers: [PermissionName.MANAGE_SUPPLIERS, PermissionName.VIEW_SUPPLIERS],
  Invoices: [
    PermissionName.CREATE_INVOICES,
    PermissionName.VIEW_INVOICES,
    PermissionName.APPROVE_INVOICES,
    PermissionName.PROCESS_ORDERS,
  ],
  Quotations: [PermissionName.CREATE_QUOTATIONS, PermissionName.VIEW_QUOTATIONS],
  Customers: [PermissionName.MANAGE_CUSTOMERS, PermissionName.VIEW_CUSTOMERS],
  Finances: [PermissionName.MANAGE_FINANCES, PermissionName.VIEW_FINANCES],
  Expenses: [
    PermissionName.SUBMIT_EXPENSES,
    PermissionName.APPROVE_EXPENSES,
    PermissionName.VIEW_EXPENSES,
  ],
  Payroll: [PermissionName.MANAGE_PAYROLL, PermissionName.VIEW_PAYROLL],
  Taxes: [PermissionName.MANAGE_TAXES, PermissionName.VIEW_TAXES],
  Settings: [PermissionName.MANAGE_SETTINGS],
}

const UserModal: React.FC<{
  user: User | null
  onSave: (formData: UserFormData) => void
  onClose: () => void
  isLoading?: boolean
  isOpen: boolean
}> = ({ user, onSave, onClose, isLoading, isOpen }) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'Staff',
    password: '',
    permissionMode: user?.permissionMode || 'inherit',
    permissions: user?.permissions || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePermissionModeChange = (mode: PermissionMode) => {
    setFormData(prev => ({
      ...prev,
      permissionMode: mode,
      // When switching to inherit, clear custom permissions
      permissions: mode === 'inherit' ? [] : prev.permissions,
    }))
  }

  const handlePermissionToggle = (permission: PermissionName) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions?.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...(prev.permissions || []), permission],
    }))
  }

  const getRolePermissions = (role: UserRole): PermissionName[] => {
    return ROLE_PERMISSIONS[role as RoleName] || []
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = { ...formData }
    if (user && !formData.password) {
      delete dataToSave.password
    }
    onSave(dataToSave)
  }

  const roleOptions: RoleOption[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Accountant', label: 'Accountant' },
    { value: 'Sale', label: 'Sales Rep' },
    { value: 'Procurement', label: 'Procurement Rep' },
    { value: 'Warehouse', label: 'Warehouse Rep' },
  ]

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <h2 className='text-2xl font-bold'>{user ? 'Edit' : 'Add New'} User</h2>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground'>
                First Name
              </label>
              <input
                type='text'
                name='firstName'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleChange}
                required
                className='mt-1 p-2 w-full border rounded  '
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground'>
                Last Name
              </label>
              <input
                type='text'
                name='lastName'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleChange}
                required
                className='mt-1 p-2 w-full border rounded  '
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground'>Email</label>
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
                className='mt-1 p-2 w-full border rounded  '
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground'>Phone</label>
              <input
                type='tel'
                name='phone'
                placeholder='Phone'
                value={formData.phone}
                onChange={handleChange}
                className='mt-1 p-2 w-full border rounded  '
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-secondary-foreground'>Role</label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='mt-1 p-2 w-full border rounded  '
            >
              {roleOptions.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-secondary-foreground'>Password</label>
            <input
              type='password'
              name='password'
              placeholder={user ? 'Leave blank to keep unchanged' : 'Password'}
              value={formData.password}
              onChange={handleChange}
              required={!user}
              className='mt-1 p-2 w-full border rounded  '
            />
          </div>

          {/* Permission Mode Toggle */}
          <div className='border-t pt-4'>
            <label className='block text-sm font-medium text-secondary-foreground mb-2'>
              Permission Mode
            </label>
            <div className='flex gap-4'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='permissionMode'
                  checked={formData.permissionMode === 'inherit'}
                  onChange={() => handlePermissionModeChange('inherit')}
                  className='w-4 h-4'
                />
                <span className='text-sm'>Inherit from Role</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='permissionMode'
                  checked={formData.permissionMode === 'custom'}
                  onChange={() => handlePermissionModeChange('custom')}
                  className='w-4 h-4'
                />
                <span className='text-sm'>Custom Permissions</span>
              </label>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {formData.permissionMode === 'inherit'
                ? `User will have permissions based on their ${formData.role} role`
                : 'Select specific permissions for this user'}
            </p>
          </div>

          {/* Custom Permissions Selector */}
          {formData.permissionMode === 'custom' && (
            <div className='border rounded p-3 max-h-60 overflow-y-auto'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium'>Select Permissions</span>
                <button
                  type='button'
                  onClick={() =>
                    setFormData(prev => ({
                      ...prev,
                      permissions: getRolePermissions(formData.role),
                    }))
                  }
                  className='text-xs text-primary hover:underline'
                >
                  Copy from {formData.role} role
                </button>
              </div>
              <div className='space-y-3'>
                {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
                  <div key={group}>
                    <span className='text-xs font-semibold text-muted-foreground uppercase'>
                      {group}
                    </span>
                    <div className='grid grid-cols-2 gap-1 mt-1'>
                      {permissions.map(permission => (
                        <label
                          key={permission}
                          className='flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-1'
                        >
                          <input
                            type='checkbox'
                            checked={formData.permissions?.includes(permission) || false}
                            onChange={() => handlePermissionToggle(permission)}
                            className='w-3.5 h-3.5'
                          />
                          <span className='text-xs'>
                            {permission.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <div className='flex justify-end pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='mr-2 px-4 py-2 rounded bg-muted'
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 rounded bg-primary text-white hover:bg-primary disabled:opacity-50'
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save User'}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default UserModal
