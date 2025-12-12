'use client'
import React from 'react'
import { useState } from 'react'
import CustomerForm from './CustomerForm'

const customer = {
  id: 'cust_001',
  fullName: 'John Doe',
  companyName: 'Doe Enterprises',
  email: 'john.doe@doeenterprises.com',
  phone: '+1 (555) 123-4567',
  currency: 'USD',
  status: 'active',
  address: '123 Main St, San Francisco, CA 94105',
  billingAddress: {
    street: '123 Billing St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'USA',
  },
  shippingAddress: {
    street: '456 Shipping Ave',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'USA',
  },
  contacts: [
    {
      name: 'Jane Smith',
      email: 'jane.smith@doeenterprises.com',
      phone: '+1 (555) 987-6543',
      role: 'Account Manager',
      primary: true,
    },
  ],
  tags: ['VIP', 'Newsletter Subscriber'],
  notes: 'This is a valued customer who prefers email communication.',
  createdAt: '2023-01-15T10:00:00Z',
  updatedAt: '2023-06-20T15:30:00Z',
  taxId: 'TAX123456',
  creditLimit: 5000,
  language: 'English',
}

const CustomerDetails = () => {
  const [showForm, setShowForm] = useState(false)
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this customer?')) {
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4'>
        <button
          // onClick={onBack}
          className='text-gray-400 mb-2 hover:text-gray-600 dark:hover:text-gray-300 flex items-center'
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
        </button>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div className='flex items-center space-x-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {customer.fullName}
              </h1>
              {customer.companyName && (
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  {customer.companyName}
                </p>
              )}
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                customer.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : customer.status === 'inactive'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {customer.status?.charAt(0).toUpperCase() + customer.status?.slice(1)}
            </span>
            <button
              // onClick={() => onEdit(customer)}
              className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
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
          <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Basic Information
            </h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Full Name
                </label>
                <p className='text-gray-900 dark:text-white'>{customer.fullName}</p>
              </div>
              {customer.companyName && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Company Name
                  </label>
                  <p className='text-gray-900 dark:text-white'>{customer.companyName}</p>
                </div>
              )}
              {customer.email && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Email
                  </label>
                  <a
                    href={`mailto:${customer.email}`}
                    className='text-teal-600 hover:text-teal-800 dark:text-teal-400'
                  >
                    {customer.email}
                  </a>
                </div>
              )}
              {customer.phone && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Phone
                  </label>
                  <a
                    href={`tel:${customer.phone}`}
                    className='text-teal-600 hover:text-teal-800 dark:text-teal-400'
                  >
                    {customer.phone}
                  </a>
                </div>
              )}
              {customer.currency && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Preferred Currency
                  </label>
                  <p className='text-gray-900 dark:text-white'>{customer.currency}</p>
                </div>
              )}
              {customer.language && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Language
                  </label>
                  <p className='text-gray-900 dark:text-white'>{customer.language}</p>
                </div>
              )}
              {customer.taxId && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Tax ID
                  </label>
                  <p className='text-gray-900 dark:text-white'>{customer.taxId}</p>
                </div>
              )}
              {customer.creditLimit && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Credit Limit
                  </label>
                  <p className='text-gray-900 dark:text-white'>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: customer.currency || 'USD',
                    }).format(customer.creditLimit)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className='space-y-6'>
            {/* Primary Address */}
            {customer.address && (
              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Primary Address
                </h3>
                <p className='text-gray-900 dark:text-white'>{customer.address}</p>
              </div>
            )}

            {/* Billing Address */}
            {customer.billingAddress && (
              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Billing Address
                </h3>
                <div className='space-y-1 text-gray-900 dark:text-white'>
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
              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Shipping Address
                </h3>
                <div className='space-y-1 text-gray-900 dark:text-white'>
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
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Contact Persons
              </h3>
              <div className='space-y-4'>
                {customer.contacts.map((contact, index) => (
                  <div key={contact.email} className='border-l-4 border-teal-500 pl-4'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-gray-900 dark:text-white'>{contact.name}</p>
                      {contact.primary && (
                        <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full'>
                          Primary
                        </span>
                      )}
                    </div>
                    {contact.role && (
                      <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                        {contact.role}
                      </p>
                    )}
                    <div className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
                      {contact.email && (
                        <p>
                          <a
                            href={`mailto:${contact.email}`}
                            className='text-teal-600 hover:text-teal-800 dark:text-teal-400'
                          >
                            {contact.email}
                          </a>
                        </p>
                      )}
                      {contact.phone && (
                        <p>
                          <a
                            href={`tel:${contact.phone}`}
                            className='text-teal-600 hover:text-teal-800 dark:text-teal-400'
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
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Tags</h3>
              <div className='flex flex-wrap gap-2'>
                {customer.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className='px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100 rounded-full text-sm'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 lg:col-span-2'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Notes</h3>
              <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>{customer.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 lg:col-span-2'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Record Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              {customer.createdAt && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Created
                  </label>
                  <p className='text-gray-900 dark:text-white'>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {customer.updatedAt && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Last Updated
                  </label>
                  <p className='text-gray-900 dark:text-white'>
                    {new Date(customer.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {customer.id && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Customer ID
                  </label>
                  <p className='text-gray-900 dark:text-white font-mono text-xs'>{customer.id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className='mt-8 flex items-center justify-between p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-lg'>
        <button
          onClick={handleDelete}
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          Delete Customer
        </button>
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          Last updated:{' '}
          {customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : 'Never'}
        </div>
      </div>
      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customer={customer as any}
          onSave={() => {
            setShowForm(false)
          }}
          onCancel={() => {
            setShowForm(false)
          }}
          open={showForm}
        />
      )}
    </div>
  )
}

export default CustomerDetails
