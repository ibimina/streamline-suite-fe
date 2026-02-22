'use client'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Sheet, SheetContent, SheetHeader } from '../ui/sheet'
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '../ui/select'
import { customerSchema } from '@/schemas/customer.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomerFormData } from '@/types/customer.type'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import InputErrorWrapper from '../shared/InputErrorWrapper'
import { Customer } from '@/interface/customer.interface'
import { CUSTOMER_STATUS } from '@/contants'
import { useCreateCustomerMutation, useUpdateCustomerMutation } from '@/store/api/customerApi'

interface CustomerFormProps {
  customer: Customer | null
  onCancel: () => void
  open: boolean
}

// Default values for a new customer
const defaultCustomerValues: CustomerFormData = {
  fullName: '',
  companyName: '',
  currency: 'USD',
  email: '',
  language: '',
  phone: '',
  address: '',
  billingAddress: {},
  shippingAddress: {},
  contacts: [],
  tags: [],
  status: CUSTOMER_STATUS.ACTIVE,
  notes: '',
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onCancel, open }) => {
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
    control,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: customer
      ? {
          fullName: customer.fullName ?? '',
          companyName: customer.companyName ?? '',
          currency: customer.currency ?? 'USD',
          email: customer.email ?? '',
          language: customer.language ?? '',
          phone: customer.phone ?? '',
          address: customer.address ?? '',
          billingAddress: customer.billingAddress ?? defaultCustomerValues.billingAddress,
          shippingAddress: customer.shippingAddress ?? defaultCustomerValues.shippingAddress,
          contacts: customer.contacts ?? [],
          taxId: customer.taxId ?? '',
          creditLimit: customer.creditLimit ?? 0,
          tags: customer.tags ?? [],
          status: customer.status ?? 'active',
          notes: customer.notes ?? '',
        }
      : defaultCustomerValues,
  })
  const [createCustomer] = useCreateCustomerMutation()
  const [updateCustomer] = useUpdateCustomerMutation()

  const { fields, remove, append } = useFieldArray({
    name: 'contacts',
    control,
  })

  const tags = useWatch({ control, name: 'tags' }) || []

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (customer?.id) {
        await updateCustomer({ data, customerId: customer.id }).unwrap()
        toast.success('Customer updated successfully')
      } else {
        await createCustomer(data).unwrap()
        toast.success('Customer created successfully')
      }
      onCancel() // Close the form on success
    } catch (error: any) {
      console.error('Error saving customer:', error)
      toast.error(error?.data?.message || error?.message || 'Failed to save customer')
    }
  }

  const onInvalid = (errors: any) => {
    console.warn('Validation errors:', errors)
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
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='space-y-4'>
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
              <label
                htmlFor='companyName'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Company Name <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                id='companyName'
                type='text'
                {...register('companyName')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Company legal name'
              />
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Email <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                id='email'
                type='email'
                {...register('email')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='customer@example.com'
              />
              {errors.email && <InputErrorWrapper message={errors.email.message || ''} />}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Phone <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                id='phone'
                type='tel'
                {...register('phone')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='+1 (555) 123-4567'
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor='address'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Address <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                id='address'
                type='text'
                {...register('address')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Primary address'
              />
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor='currency'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Currency <span className='text-xs text-gray-400'>(optional)</span>
              </label>
              <input
                id='currency'
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
                <label
                  htmlFor='billingAddress.street'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Street
                </label>
                <input
                  type='text'
                  id='billingAddress.street'
                  {...register('billingAddress.street')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='123 Main St'
                />
              </div>
              <div>
                <label
                  htmlFor='billingAddress.city'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  City
                </label>
                <input
                  id='billingAddress.city'
                  type='text'
                  {...register('billingAddress.city')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='San Francisco'
                />
              </div>
              <div>
                <label
                  htmlFor='billingAddress.state'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  State
                </label>
                <input
                  id='billingAddress.state'
                  type='text'
                  {...register('billingAddress.state')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='CA'
                />
              </div>
              <div>
                <label
                  htmlFor='billingAddress.postalCode'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Postal Code
                </label>
                <input
                  id='billingAddress.postalCode'
                  type='text'
                  {...register('billingAddress.postalCode')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='94105'
                />
              </div>
              <div>
                <label
                  htmlFor='billingAddress.country'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Country
                </label>
                <input
                  id='billingAddress.country'
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
                <label
                  htmlFor='contact.name'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
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
                <label
                  htmlFor='contact.email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
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
                <label
                  htmlFor='contact.phone'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Phone <span className='text-xs text-gray-400'>(optional)</span>
                </label>
                <input
                  type='tel'
                  id='contact.phone'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='+1 (555) 123-4567'
                  value={newContact.phone}
                  onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div>
                <label
                  htmlFor='contact.role'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
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
              disabled={isSubmitting}
              className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Saving...' : customer?.id ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
export default CustomerForm
