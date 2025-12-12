'use client'
import React from 'react'
import { useState } from 'react'
import SupplierForm from './SupplierForm'

const supplier = {
  id: 'supp_001',
  name: 'Tech Solutions Ltd',
  contact: 'John Manager',
  email: 'contact@techsolutions.com',
  phone: '+1 (555) 234-5678',
  address: '456 Business Ave, Tech City, TC 12345',
  paymentTerms: 'Net 30',
  taxId: 'SUPP789012',
  isActive: true,
  contacts: [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techsolutions.com',
      phone: '+1 (555) 876-5432',
      role: 'Purchasing Manager',
      primary: true,
    },
    {
      name: 'Mike Chen',
      email: 'mike.chen@techsolutions.com',
      phone: '+1 (555) 654-3210',
      role: 'Account Executive',
      primary: false,
    },
  ],
  createdAt: '2023-02-10T09:00:00Z',
  updatedAt: '2023-07-15T14:20:00Z',
}

const SupplierDetails = () => {
  const [showForm, setShowForm] = useState(false)

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      // Handle deletion logic here
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
          Back to Suppliers
        </button>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div className='flex items-center space-x-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{supplier.name}</h1>
              {supplier.contact && (
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Primary Contact: {supplier.contact}
                </p>
              )}
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                supplier.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}
            >
              {supplier.isActive ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
            >
              Edit Supplier
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
                  Supplier Name
                </label>
                <p className='text-gray-900 dark:text-white'>{supplier.name}</p>
              </div>
              {supplier.contact && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Primary Contact
                  </label>
                  <p className='text-gray-900 dark:text-white'>{supplier.contact}</p>
                </div>
              )}
              {supplier.email && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Email
                  </label>
                  <a
                    href={`mailto:${supplier.email}`}
                    className='text-teal-600 hover:text-teal-800 dark:text-teal-400'
                  >
                    {supplier.email}
                  </a>
                </div>
              )}
              {supplier.phone && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Phone
                  </label>
                  <a
                    href={`tel:${supplier.phone}`}
                    className='text-teal-600 hover:text-teal-800 dark:text-teal-400'
                  >
                    {supplier.phone}
                  </a>
                </div>
              )}
              {supplier.paymentTerms && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Payment Terms
                  </label>
                  <p className='text-gray-900 dark:text-white'>{supplier.paymentTerms}</p>
                </div>
              )}
              {supplier.taxId && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Tax ID
                  </label>
                  <p className='text-gray-900 dark:text-white'>{supplier.taxId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className='space-y-6'>
            {/* Primary Address */}
            {supplier.address && (
              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Business Address
                </h3>
                <p className='text-gray-900 dark:text-white'>{supplier.address}</p>
              </div>
            )}
          </div>

          {/* Contact Persons */}
          {supplier.contacts && supplier.contacts.length > 0 && (
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Contact Persons
              </h3>
              <div className='space-y-4'>
                {supplier.contacts.map((contact, index) => (
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

          {/* Business Details */}
          <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Business Details
            </h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Status
                </label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    supplier.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {supplier.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {supplier.paymentTerms && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Payment Terms
                  </label>
                  <p className='text-gray-900 dark:text-white'>{supplier.paymentTerms}</p>
                </div>
              )}
              {supplier.taxId && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Tax Identification
                  </label>
                  <p className='text-gray-900 dark:text-white font-mono text-sm'>
                    {supplier.taxId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 lg:col-span-2'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Record Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              {supplier.createdAt && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Created
                  </label>
                  <p className='text-gray-900 dark:text-white'>
                    {new Date(supplier.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {supplier.updatedAt && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Last Updated
                  </label>
                  <p className='text-gray-900 dark:text-white'>
                    {new Date(supplier.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {supplier.id && (
                <div>
                  <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Supplier ID
                  </label>
                  <p className='text-gray-900 dark:text-white font-mono text-xs'>{supplier.id}</p>
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
          Delete Supplier
        </button>
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          Last updated:{' '}
          {supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleDateString() : 'Never'}
        </div>
      </div>

      {/* Supplier Form Modal */}
      {showForm && (
        <SupplierForm
          supplier={supplier as any}
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

export default SupplierDetails
