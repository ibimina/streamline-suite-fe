'use client'
import React, { useState, useRef } from 'react'
import { SaveIcon } from '../Icons'
import { useAppSelector } from '../../store/hooks'
import { useUpdateAccountMutation, useUploadAccountLogoMutation } from '@/store/api'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { usePermissions } from '@/hooks/usePermissions'
import { PermissionName } from '@/contants/permissions'

interface LocalAccountDetails {
  name: string
  address: string
  phone: string
  email: string
  logoUrl: string
  currency: string
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
]

// Permission groups for display
const PERMISSION_GROUPS: Record<string, string[]> = {
  Dashboard: ['view_dashboard'],
  Users: ['manage_users'],
  Reports: ['view_reports'],
  Inventory: ['manage_inventory', 'view_inventory'],
  Products: ['manage_products', 'view_products'],
  Suppliers: ['manage_suppliers', 'view_suppliers'],
  Invoices: ['create_invoices', 'view_invoices', 'approve_invoices', 'process_orders'],
  Quotations: ['create_quotations', 'view_quotations'],
  Customers: ['manage_customers', 'view_customers'],
  Finances: ['manage_finances', 'view_finances'],
  Expenses: ['submit_expenses', 'approve_expenses', 'view_expenses'],
  Payroll: ['manage_payroll', 'view_payroll'],
  Taxes: ['manage_taxes', 'view_taxes'],
  Settings: ['manage_settings'],
}

const Settings: React.FC = () => {
  const account = useAppSelector(state => state.authReducer.user?.account)
  const { userPermissions, userRole, hasPermission } = usePermissions()
  const canManageSettings = hasPermission(PermissionName.MANAGE_SETTINGS)
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation()
  const [uploadLogo, { isLoading: isUploadingLogo }] = useUploadAccountLogoMutation()

  const getAccountDetails = (acc: typeof account): LocalAccountDetails => ({
    name: acc?.name || '',
    address: acc?.address || '',
    phone: acc?.phone || '',
    email: acc?.email || '',
    logoUrl: acc?.logoUrl || '',
    currency: acc?.currency || 'NGN',
  })

  const [localDetails, setLocalDetails] = useState<LocalAccountDetails>(() =>
    getAccountDetails(account)
  )
  const [isSaved, setIsSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingLogoFile, setPendingLogoFile] = useState<string | null>(null)

  // Sync local state with account data (render-time pattern, avoids setState in effect)
  const [prevAccount, setPrevAccount] = useState(account)
  if (account !== prevAccount) {
    setPrevAccount(account)
    setLocalDetails(getAccountDetails(account))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = event => {
        if (event.target?.result) {
          const base64 = event.target.result as string
          setLocalDetails(prev => ({ ...prev, logoUrl: base64 }))
          setPendingLogoFile(base64)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Upload logo if changed
      if (pendingLogoFile) {
        await uploadLogo({ file: pendingLogoFile }).unwrap()
        setPendingLogoFile(null)
      }

      // Update account details
      await updateAccount({
        name: localDetails.name,
        address: localDetails.address,
        phone: localDetails.phone,
        email: localDetails.email,
        currency: localDetails.currency,
      }).unwrap()

      setIsSaved(true)
      toast.success('Settings saved successfully!')
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Failed to update account:', error)
    }
  }

  const isLoading = isUpdating || isUploadingLogo

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Settings</h1>
        <p className='text-muted-foreground mt-1'>View your permissions and manage settings.</p>
      </div>

      <div className='max-w-2xl'>
        {/* My Permissions Section - visible to all */}
        <div className='bg-card p-6 rounded-xl shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>My Permissions</h2>
          <p className='text-sm text-muted-foreground mb-4'>
            Your current role: <span className='font-medium text-foreground'>{userRole}</span>
          </p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
              const granted = perms.filter(p => userPermissions.includes(p as any))
              if (granted.length === 0) return null
              return (
                <div key={group} className='border border-border rounded-lg p-3'>
                  <h3 className='font-medium text-sm mb-2 text-foreground'>{group}</h3>
                  {granted.map(p => (
                    <div key={p} className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <span className='text-green-500'>✓</span>
                      <span className='capitalize'>{p.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          {userPermissions.length === 0 && (
            <p className='text-sm text-muted-foreground'>No permissions assigned.</p>
          )}
        </div>

        {/* Company Details - only for users with MANAGE_SETTINGS */}
        {canManageSettings && (
          <form onSubmit={handleSubmit} className='bg-card p-6 rounded-xl shadow-lg mt-6'>
            <h2 className='text-xl font-semibold mb-4'>Company Details</h2>
            <p className='text-sm text-muted-foreground mb-6'>
              This information will appear on your quotations and invoices.
            </p>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-secondary-foreground'
                >
                  Company Name
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  value={localDetails.name}
                  onChange={handleChange}
                  className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card'
                />
              </div>
              <div>
                <label
                  htmlFor='address'
                  className='block text-sm font-medium text-secondary-foreground'
                >
                  Address
                </label>
                <input
                  type='text'
                  name='address'
                  id='address'
                  value={localDetails.address}
                  onChange={handleChange}
                  className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card'
                />
              </div>
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-secondary-foreground'
                >
                  Phone
                </label>
                <input
                  type='text'
                  name='phone'
                  id='phone'
                  value={localDetails.phone}
                  onChange={handleChange}
                  className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card'
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-secondary-foreground'
                >
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  value={localDetails.email}
                  onChange={handleChange}
                  className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card'
                />
              </div>
              <div>
                <label
                  htmlFor='currency'
                  className='block text-sm font-medium text-secondary-foreground'
                >
                  Currency
                </label>
                <select
                  name='currency'
                  id='currency'
                  value={localDetails.currency}
                  onChange={e => setLocalDetails(prev => ({ ...prev, currency: e.target.value }))}
                  className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card'
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol}) - {currency.name}
                    </option>
                  ))}
                </select>
                <p className='mt-1 text-xs text-muted-foreground'>
                  This currency will be used on your invoices and quotations.
                </p>
              </div>

              {/* Logo Upload Section */}
              <div className='pt-2'>
                <label className='block text-sm font-medium text-secondary-foreground'>
                  Company Logo
                </label>
                <div className='mt-2 flex items-center'>
                  <span className=' h-12 w-32 rounded-md overflow-hidden bg-muted  flex items-center justify-center'>
                    {localDetails.logoUrl ? (
                      <Image
                        src={localDetails.logoUrl}
                        alt='Logo Preview'
                        width={128}
                        height={48}
                        className='h-full w-full object-contain'
                      />
                    ) : (
                      <span className='text-xs text-muted-foreground'>No Logo</span>
                    )}
                  </span>
                  <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept='image/*'
                    className='hidden'
                  />
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='ml-5 bg-card py-2 px-3 border border-border rounded-md shadow-sm text-sm leading-4 font-medium text-foreground hover:bg-muted  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                  >
                    Change Logo
                  </button>
                </div>
              </div>
            </div>
            <div className='flex justify-end items-center pt-6'>
              {isSaved && (
                <span className='text-sm text-green-600 dark:text-green-400 mr-4'>
                  Changes saved successfully!
                </span>
              )}
              <button
                type='submit'
                disabled={isLoading}
                className='inline-flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <SaveIcon className='w-5 h-5 mr-2' />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Settings
