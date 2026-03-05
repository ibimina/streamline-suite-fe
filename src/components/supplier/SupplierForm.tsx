'use client'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader } from '../ui/sheet'
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '../ui/select'
import { supplierSchema } from '@/schemas/supplier.schema'
import { Supplier, SupplierFormData } from '@/types/supplier.type'
import InputErrorWrapper from '../shared/InputErrorWrapper'
import { useCreateSupplierMutation, useUpdateSupplierMutation } from '@/store/api/supplierApi'

interface SupplierFormProps {
  supplier: Supplier | null
  onCancel: () => void
  open: boolean
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onCancel, open }) => {
  const [createSupplier] = useCreateSupplierMutation()
  const [updateSupplier] = useUpdateSupplierMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    control,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      name: supplier?.name || '',
      contacts: supplier?.contacts || [],
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
      paymentTerms: supplier?.paymentTerms || 'Net 30',
      taxId: supplier?.taxId || '',
      isActive: supplier?.isActive !== undefined ? supplier.isActive : true,
    },
  })

  // useFieldArray for managing dynamic contacts
  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: 'contacts',
  })

  // Local state for new contact input
  const [newContactName, setNewContactName] = useState('')
  const [newContactEmail, setNewContactEmail] = useState('')
  const [newContactPhone, setNewContactPhone] = useState('')
  const [newContactRole, setNewContactRole] = useState('')

  // Helper function to add contact
  const addContact = () => {
    if (newContactName.trim()) {
      appendContact({
        name: newContactName.trim(),
        email: newContactEmail.trim() || undefined,
        phone: newContactPhone.trim() || undefined,
        role: newContactRole.trim() || undefined,
        primary: false,
      })
      // Reset input fields
      setNewContactName('')
      setNewContactEmail('')
      setNewContactPhone('')
      setNewContactRole('')
    }
  }

  const paymentTermsOptions = [
    'Net 15',
    'Net 30',
    'Net 60',
    'Net 90',
    'Prepaid',
    'Cash on Delivery',
    'Due on Receipt',
  ]

  const onSubmit = async (data: SupplierFormData) => {
    try {
      if (supplier?._id) {
        await updateSupplier({ supplierId: supplier._id, data }).unwrap()
        toast.success('Supplier updated successfully')
      } else {
        await createSupplier(data).unwrap()
        toast.success('Supplier created successfully')
      }
      reset()
      onCancel()
    } catch (error: any) {
      console.error('Error saving supplier:', error)
      toast.error(error?.data?.message || 'Failed to save supplier')
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) {
          onCancel()
          reset()
        }
      }}
    >
      <SheetContent className='bg-white overflow-y-auto w-full lg:max-w-2xl '>
        <SheetHeader className='flex justify-end'>
          <h2 className='text-2xl font-bold text-foreground mb-2'>
            {supplier?._id ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <p className='text-sm text-muted-foreground mb-6'>
            Fields marked with <span className='text-red-500'>*</span> are required. Fields marked
            with <span className='text-muted-foreground'>(optional)</span> can be left blank.
          </p>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Supplier Name - Required */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Supplier Name <span className='text-red-500 text-sm'>*</span>
              </label>
              <input
                type='text'
                {...register('name')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='Supplier company name'
              />
              {errors.name && <InputErrorWrapper message={errors.name.message || ''} />}
            </div>

            {/* Email - Optional */}
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Email <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='email'
                {...register('email')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='contact@supplier.com'
              />
              {errors.email && <InputErrorWrapper message={errors.email.message || ''} />}
            </div>

            {/* Phone - Optional */}
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Phone <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='tel'
                {...register('phone')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='+1 (555) 123-4567'
              />
              {errors.phone && <InputErrorWrapper message={errors.phone.message || ''} />}
            </div>

            {/* Tax ID - Optional */}
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Tax ID <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='text'
                {...register('taxId')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='TAX123456789'
              />
              {errors.taxId && <InputErrorWrapper message={errors.taxId.message || ''} />}
            </div>
          </div>

          {/* Address - Optional */}
          <div>
            <label className='block text-sm font-medium text-secondary-foreground mb-1'>
              Address <span className='text-xs text-muted-foreground'>(optional)</span>
            </label>
            <textarea
              {...register('address')}
              className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
              placeholder='Full business address'
              rows={3}
            />
            {errors.address && <InputErrorWrapper message={errors.address.message || ''} />}
          </div>

          {/* Payment Terms - Optional */}
          <div>
            <label className='block text-sm font-medium text-secondary-foreground mb-1'>
              Payment Terms <span className='text-xs text-muted-foreground'>(optional)</span>
            </label>
            <Select
              // value={watch('paymentTerms')}
              onValueChange={value => setValue('paymentTerms', value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select payment terms' />
              </SelectTrigger>
              <SelectContent className='w-full z-50 bg-card'>
                {paymentTermsOptions.map(term => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentTerms && (
              <InputErrorWrapper message={errors.paymentTerms.message || ''} />
            )}
          </div>

          {/* Contacts Section */}
          <div className='mt-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Contact Persons <span className='text-sm text-muted-foreground'>(optional)</span>
              </h3>
              <button
                type='button'
                onClick={addContact}
                disabled={!newContactName.trim()}
                className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed'
              >
                Add Contact
              </button>
            </div>

            {/* Existing Contacts List */}
            {contactFields.length > 0 && (
              <div className='mb-4 space-y-2'>
                {contactFields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex items-center justify-between p-3 bg-muted rounded-md'
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-foreground'>{field.name}</span>
                        {field.primary && (
                          <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full'>
                            Primary
                          </span>
                        )}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {field.email && <span>{field.email}</span>}
                        {field.email && field.phone && <span> • </span>}
                        {field.phone && <span>{field.phone}</span>}
                        {field.role && (
                          <span className='ml-2 text-xs text-muted-foreground'>({field.role})</span>
                        )}
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeContact(index)}
                      className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Contact Form */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-border rounded-md'>
              <div>
                <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                  Name <span className='text-red-500 text-sm'>*</span>
                </label>
                <input
                  type='text'
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                  placeholder='Contact name'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                  Email <span className='text-xs text-muted-foreground'>(optional)</span>
                </label>
                <input
                  type='email'
                  value={newContactEmail}
                  onChange={e => setNewContactEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                  placeholder='contact@example.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                  Phone <span className='text-xs text-muted-foreground'>(optional)</span>
                </label>
                <input
                  type='tel'
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                  placeholder='+1 (555) 123-4567'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                  Role <span className='text-xs text-muted-foreground'>(optional)</span>
                </label>
                <input
                  type='text'
                  value={newContactRole}
                  onChange={e => setNewContactRole(e.target.value)}
                  className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                  placeholder='Sales Manager'
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                {...register('isActive')}
                className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
              />
              <span className='text-sm font-medium text-secondary-foreground'>Active Supplier</span>
            </label>
            <p className='text-xs text-muted-foreground mt-1'>
              Uncheck to deactivate this supplier
            </p>
          </div>

          {/* Submit Buttons */}
          <div className='flex justify-end space-x-4 mt-6'>
            <button
              type='button'
              onClick={() => {
                onCancel()
                reset()
              }}
              disabled={isSubmitting}
              className='px-4 py-2 border border-border text-secondary-foreground rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary   '
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Saving...' : supplier?._id ? 'Update Supplier' : 'Create Supplier'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default SupplierForm
