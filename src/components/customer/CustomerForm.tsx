'use client'
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader } from '../ui/sheet'
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '../ui/select'
import { customerSchema } from '@/schemas/customer.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomerFormData } from '@/types/customer.type'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import InputErrorWrapper from '../shared/InputErrorWrapper'

export interface Customer {
  id?: string
  fullName: string
  companyName?: string
  email?: string
  phone?: string
  address?: string
  billingAddress?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  shippingAddress?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  contacts?: {
    name: string
    email?: string
    phone?: string
    role?: string
    primary?: boolean
  }[]
  branches?: {
    name: string
    code?: string
    address?: {
      street?: string
      city?: string
      state?: string
      postalCode?: string
      country?: string
    }
    contactPerson?: string
    contactEmail?: string
    contactPhone?: string
    notes?: string
    isActive?: boolean
  }[]
  tags?: string[]
  customFields?: Record<string, any>
  currency?: string
  language?: string
  status?: 'active' | 'inactive' | 'suspended'
  notes?: string
  accountId?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  taxId?: string
  creditLimit?: number
  isActive?: boolean
}

interface CustomerFormProps {
  customer: Customer | null
  onSave: (customer: Customer) => void
  onCancel: () => void
  open: boolean
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onCancel, open }) => {
  const [newTag, setNewTag] = useState('')
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    primary: false,
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: { ...customerSchema.parse(customer || {}) },
  })

  const { fields, remove, append } = useFieldArray({
    name: 'contacts',
    control,
  })

  const tags = useWatch({ control, name: 'tags' }) || []

  const onSubmit = (data: CustomerFormData) => {
    try {
      // onSave({ ...data, id: customer?.id })
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onCancel()
      }}
    >
      <SheetContent className='bg-white overflow-y-auto w-full lg:max-w-3xl dark:bg-gray-800'>
        <SheetHeader className='flex justify-end'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
            {customer?.id ? 'Edit Customer' : 'Add New Customer'}
          </h2>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Full Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Full Name <span className='text-red-500 text-sm'>*</span>
              </label>
              <input
                type='text'
                {...register('fullName')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Customer full name'
              />
              {errors.fullName && <InputErrorWrapper message={errors.fullName.message || ''} />}
            </div>

            {/* Company Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Company Name <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                type='text'
                {...register('companyName')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Company legal name'
              />
            </div>
            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Email <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                type='email'
                {...register('email')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='customer@example.com'
              />
              {errors.email && <InputErrorWrapper message={errors.email.message || ''} />}
            </div>

            {/* Phone */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Phone <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                type='tel'
                {...register('phone')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='+1 (555) 123-4567'
              />
            </div>

            {/* Address */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Address <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                type='text'
                {...register('address')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Primary address'
              />
            </div>

            {/* Currency */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Currency <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                type='text'
                maxLength={3}
                {...register('currency')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='USD'
              />
              {errors.currency && <InputErrorWrapper message={errors.currency.message || ''} />}
            </div>
          </div>

          {/* Billing Address Section */}
          <div className='mt-6'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              Billing Address <span className='text-sm text-gray-400'>(optional)</span>
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Street
                </label>
                <input
                  type='text'
                  {...register('billingAddress.street')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='123 Main St'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  City
                </label>
                <input
                  type='text'
                  {...register('billingAddress.city')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='San Francisco'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  State
                </label>
                <input
                  type='text'
                  {...register('billingAddress.state')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='CA'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Postal Code
                </label>
                <input
                  type='text'
                  {...register('billingAddress.postalCode')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='94105'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Country
                </label>
                <input
                  type='text'
                  {...register('billingAddress.country')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='USA'
                />
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className='mt-6'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              Contact Persons <span className='text-sm text-gray-400'>(optional)</span>
            </h3>

            {/* Existing Contacts */}
            {fields && fields.length > 0 && (
              <div className='mb-4 space-y-2'>
                {fields.map((contact, index) => (
                  <div
                    key={contact.email}
                    className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md'
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-gray-900 dark:text-white'>
                          {contact.name}
                        </span>
                        {contact.primary && (
                          <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full'>
                            Primary
                          </span>
                        )}
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {contact.email && <span>{contact.email}</span>}
                        {contact.email && contact.phone && <span> • </span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.role && (
                          <span className='ml-2 text-xs text-gray-400'>({contact.role})</span>
                        )}
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={() => remove(index)}
                      className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Contact */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Name <span className='text-red-500 text-sm'>*</span>
                </label>
                <input
                  type='text'
                  value={newContact.name}
                  onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Contact name'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Email <span className='text-xs text-gray-400'>(optional)</span>
                </label>
                <input
                  type='email'
                  value={newContact.email}
                  onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='contact@example.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Phone <span className='text-xs text-gray-400'>(optional)</span>
                </label>
                <input
                  type='tel'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='+1 (555) 123-4567'
                  value={newContact.phone}
                  onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Role <span className='text-xs text-gray-400'>(optional)</span>
                </label>
                <input
                  type='text'
                  value={newContact.role}
                  onChange={e => setNewContact({ ...newContact, role: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Purchasing Manager'
                />
              </div>
              <div className='flex items-center'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={newContact.primary}
                    onChange={e => setNewContact({ ...newContact, primary: e.target.checked })}
                    className='mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                  />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Primary Contact
                  </span>
                </label>
              </div>
              <div className='flex items-end'>
                <button
                  type='button'
                  onClick={() => {
                    if (!newContact.name.trim()) {
                      alert('Contact name is required')
                      return
                    }
                    append(newContact)
                    setNewContact({ name: '', email: '', phone: '', role: '', primary: false })
                  }}
                  className='w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>

          {/* Branches Section */}
          {/* <div className="mt-6"> */}
          {/* <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Branches/Locations <span className="text-sm text-gray-400">(optional)</span>
                        </h3> */}

          {/* Existing Branches */}
          {/* {formData.branches && formData.branches.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {formData.branches.map((branch, index) => (
                                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 dark:text-white">{branch.name}</span>
                                                {branch.code && (
                                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded">
                                                        {branch.code}
                                                    </span>
                                                )}
                                                <span className={`px-2 py-1 text-xs rounded-full ${branch.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                    {branch.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeBranch(index)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        {branch.address && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                {branch.address.street}, {branch.address.city}, {branch.address.state} {branch.address.postalCode}, {branch.address.country})
                                            </div>
                                        )}
                                        {(branch.contactPerson || branch.contactEmail || branch.contactPhone) && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {branch.contactPerson && <span>{branch.contactPerson}</span>}
                                                {branch.contactPerson && (branch.contactEmail || branch.contactPhone) && <span> • </span>}
                                                {branch.contactEmail && <span>{branch.contactEmail}</span>}
                                                {(branch.contactEmail && branch.contactPhone) && <span> • </span>}
                                                {branch.contactPhone && <span>{branch.contactPhone}</span>}
                                            </div>
                                        )}

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={addBranch}
                                                className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            >
                                                Add Branch
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        )} */}
          {/* add new branch */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Branch Name <span className="text-red-500 text-sm">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newBranch.name}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Branch name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code <span className="text-xs text-gray-400">(optional)</span></label>
                                <input
                                    type="text"
                                    value={newBranch.code}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, code: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="BR-001"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address <span className="text-xs text-gray-400">(optional)</span></h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        value={newBranch.address.street}
                                        onChange={(e) => setNewBranch(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Street"
                                    />
                                    <input
                                        type="text"
                                        value={newBranch.address.city}
                                        onChange={(e) => setNewBranch(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="City"
                                    />
                                    <input
                                        type="text"
                                        value={newBranch.address.state}
                                        onChange={(e) => setNewBranch(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="State"
                                    />
                                    <input
                                        type="text"
                                        value={newBranch.address.postalCode}
                                        onChange={(e) => setNewBranch(prev => ({ ...prev, address: { ...prev.address, postalCode: e.target.value } }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Postal Code"
                                    />
                                    <input
                                        type="text"
                                        value={newBranch.address.country}
                                        onChange={(e) => setNewBranch(prev => ({ ...prev, address: { ...prev.address, country: e.target.value } }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Country"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person <span className="text-xs text-gray-400">(optional)</span></label>
                                <input
                                    type="text"
                                    value={newBranch.contactPerson}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, contactPerson: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Contact name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email <span className="text-xs text-gray-400">(optional)</span></label>
                                <input
                                    type="email"
                                    value={newBranch.contactEmail}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, contactEmail: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="contact@branch.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Phone <span className="text-xs text-gray-400">(optional)</span></label>
                                <input
                                    type="tel"
                                    value={newBranch.contactPhone}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, contactPhone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes <span className="text-xs text-gray-400">(optional)</span></label>
                                <textarea
                                    value={newBranch.notes}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Additional details about the branch"
                                    rows={2}
                                />
                            </div>

                            <div className="flex items-center gap-4 col-span-1 md:col-span-2 lg:col-span-1">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newBranch.isActive}
                                        onChange={(e) => setNewBranch(prev => ({ ...prev, isActive: e.target.checked }))}
                                        className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                                </label>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={addBranch}
                                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    Add Branch
                                </button>
                            </div>
                        </div> */}

          {/* </div> */}
          {/* Status and Language Section */}
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Status
              </label>
              <Select onValueChange={() => {}}>
                <SelectTrigger className='border-gray-300 shadow-none h-[41.6px] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'>
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent className='w-full z-50 bg-white'>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Language <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                type='text'
                {...register('language')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='en'
              />
            </div>
          </div>

          {/* Notes Section */}
          <div className='mt-6'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Notes <span className='text-xs text-gray-400'>(optional)</span>
            </label>
            <textarea
              {...register('notes')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              placeholder='Additional notes about this customer...'
              rows={3}
              maxLength={2000}
            />
          </div>

          {/* Tags */}
          <div className='mt-6'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Tags <span className='text-xs text-gray-400'>(optional)</span>
            </label>
            <div className='flex flex-wrap gap-2 mb-2'>
              {tags?.map((tag, index) => (
                <span
                  key={tag}
                  className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100'
                >
                  {tag}
                  <button
                    type='button'
                    onClick={() => {
                      const updatedTags = [...(tags || [])]
                      updatedTags.splice(index, 1)
                      setValue('tags', updatedTags)
                    }}
                    className='ml-2 text-teal-600 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-100'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className='flex gap-2'>
              <input
                type='text'
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Add a tag'
              />
              <button
                type='button'
                onClick={() => {
                  if (newTag.trim() === '') return
                  const updatedTags = [...(tags || []), newTag.trim()]
                  setValue('tags', updatedTags)
                  setNewTag('')
                }}
                className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className='flex justify-end space-x-4 mt-6'>
            <button
              type='button'
              onClick={onCancel}
              disabled={isSubmitting}
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
            >
              {customer?.id ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
export default CustomerForm
