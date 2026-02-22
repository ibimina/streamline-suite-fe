'use client'
import React from 'react'
import { useState } from 'react'
import CustomerForm from './CustomerForm'
import { useDeleteCustomerMutation, useGetCustomerByIdQuery } from '@/store/api/customerApi'
import { useParams } from 'next/navigation'
import LoadingSpinner from '../shared/LoadingSpinner'
import Link from 'next/link'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'
import { useRouter } from 'next/navigation'

const CustomerDetails = () => {
  const params = useParams()
  const router = useRouter()

  const id = params?.id as string
  const { data, isLoading: loading } = useGetCustomerByIdQuery(id, {
    skip: !id,
  })
  const [deleteCustomer] = useDeleteCustomerMutation()
  const customer = data?.payload ?? null

  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteCustomer = async () => {
    if (id) {
      try {
        await deleteCustomer(id).unwrap()
        // Optionally, redirect to customers list after deletion
        router.push('/customers')
      } catch (error: any) {
        alert(error?.data?.message || 'Failed to delete customer')
      }
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-muted '>
        <LoadingSpinner />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className='min-h-screen bg-muted '>
        {/* Header */}
        <div className='bg-card border-b border-border px-6 py-4'>
          <Link
            href={'/customers'}
            className='text-muted-foreground mb-2 hover:text-muted-foreground dark:hover:text-muted-foreground flex items-center'
          >
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to Customers
          </Link>
        </div>
        <div className='p-6'>Customer not found.</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-muted '>
      {/* Header */}
      <div className='bg-card border-b border-border px-6 py-4'>
        <Link
          href={'/customers'}
          className='text-muted-foreground mb-2 hover:text-muted-foreground dark:hover:text-muted-foreground flex items-center'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Back to Customers
        </Link>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div className='flex items-center space-x-4'>
            <div>
              <h1 className='text-2xl font-bold text-foreground'>{customer.fullName}</h1>
              {customer.companyName && (
                <p className='text-sm text-muted-foreground mt-1'>{customer.companyName}</p>
              )}
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                customer?.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : customer.status === 'inactive'
                    ? 'bg-muted text-foreground  '
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {customer?.status
                ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1)
                : 'Unknown'}
            </span>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary'
            >
              Edit Customer
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Basic Information */}
          <div className='bg-muted rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Basic Information</h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-muted-foreground'>Full Name</label>
                <p className='text-foreground'>{customer.fullName}</p>
              </div>
              {customer.companyName && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Company Name
                  </label>
                  <p className='text-foreground'>{customer.companyName}</p>
                </div>
              )}
              {customer.email && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>Email</label>
                  <a
                    href={`mailto:${customer.email}`}
                    className='text-primary hover:text-primary dark:text-primary'
                  >
                    {customer.email}
                  </a>
                </div>
              )}
              {customer.phone && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>Phone</label>
                  <a
                    href={`tel:${customer.phone}`}
                    className='text-primary hover:text-primary dark:text-primary'
                  >
                    {customer.phone}
                  </a>
                </div>
              )}
              {customer.currency && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Preferred Currency
                  </label>
                  <p className='text-foreground'>{customer.currency}</p>
                </div>
              )}
              {customer.language && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Language
                  </label>
                  <p className='text-foreground'>{customer.language}</p>
                </div>
              )}
              {customer?.taxId && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>Tax ID</label>
                  <p className='text-foreground'>{customer.taxId}</p>
                </div>
              )}
              {customer?.creditLimit && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Credit Limit
                  </label>
                  <p className='text-foreground'>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: customer.currency || 'USD',
                    }).format(customer?.creditLimit)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className='space-y-6'>
            {/* Primary Address */}
            {customer.address && (
              <div className='bg-muted rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-foreground mb-4'>Primary Address</h3>
                <p className='text-foreground'>{customer.address}</p>
              </div>
            )}

            {/* Billing Address */}
            {customer.billingAddress && (
              <div className='bg-muted rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-foreground mb-4'>Billing Address</h3>
                <div className='space-y-1 text-foreground'>
                  {customer.billingAddress.street && <p>{customer.billingAddress.street}</p>}
                  <p>
                    {[
                      customer.billingAddress.city,
                      customer.billingAddress.state,
                      customer.billingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {customer.billingAddress.country && <p>{customer.billingAddress.country}</p>}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {customer.shippingAddress && (
              <div className='bg-muted rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-foreground mb-4'>Shipping Address</h3>
                <div className='space-y-1 text-foreground'>
                  {customer.shippingAddress.street && <p>{customer.shippingAddress.street}</p>}
                  <p>
                    {[
                      customer.shippingAddress.city,
                      customer.shippingAddress.state,
                      customer.shippingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {customer.shippingAddress.country && <p>{customer.shippingAddress.country}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Contact Persons */}
          {customer.contacts && customer.contacts.length > 0 && (
            <div className='bg-muted rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Contact Persons</h3>
              <div className='space-y-4'>
                {customer.contacts.map((contact, index) => (
                  <div key={contact.email} className='border-l-4 border-primary pl-4'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-foreground'>{contact.name}</p>
                      {contact.primary && (
                        <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full'>
                          Primary
                        </span>
                      )}
                    </div>
                    {contact.role && (
                      <p className='text-sm text-muted-foreground mb-2'>{contact.role}</p>
                    )}
                    <div className='text-sm text-muted-foreground space-y-1'>
                      {contact.email && (
                        <p>
                          <a
                            href={`mailto:${contact.email}`}
                            className='text-primary hover:text-primary dark:text-primary'
                          >
                            {contact.email}
                          </a>
                        </p>
                      )}
                      {contact.phone && (
                        <p>
                          <a
                            href={`tel:${contact.phone}`}
                            className='text-primary hover:text-primary dark:text-primary'
                          >
                            {contact.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <div className='bg-muted rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Tags</h3>
              <div className='flex flex-wrap gap-2'>
                {customer.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className='px-3 py-1 bg-primary-light text-primary dark:bg-primary/30 dark:text-primary-foreground/80 rounded-full text-sm'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div className='bg-muted rounded-lg p-4 lg:col-span-2'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Notes</h3>
              <p className='text-foreground whitespace-pre-wrap'>{customer.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className='bg-muted rounded-lg p-4 lg:col-span-2'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Record Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              {customer.createdAt && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>Created</label>
                  <p className='text-foreground'>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {customer.updatedAt && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Last Updated
                  </label>
                  <p className='text-foreground'>
                    {new Date(customer.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {customer._id && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Customer ID
                  </label>
                  <p className='text-foreground font-mono text-xs'>{customer._id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className='mt-8 flex items-center justify-between p-6 bg-card border-t border-border rounded-lg'>
        <button
          onClick={handleDelete}
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          Delete Customer
        </button>
        <div className='text-sm text-muted-foreground'>
          Last updated:{' '}
          {customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : 'Never'}
        </div>
      </div>
      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customer={customer}
          onCancel={() => {
            setShowForm(false)
          }}
          open={showForm}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteCustomer}
        />
      )}
    </div>
  )
}

export default CustomerDetails
