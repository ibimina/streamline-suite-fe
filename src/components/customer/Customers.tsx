'use client'
import React, { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, SearchIcon, FilterIcon } from '../Icons'
import CustomerForm from './CustomerForm'
import Link from 'next/link'

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

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>(
    'all'
  )
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleCustomers: Customer[] = [
        {
          id: 'cust_001',
          fullName: 'John Doe',
          companyName: 'Doe Enterprises',
          email: 'john.doe@doeenterprises.com',
          phone: '+15551234567',
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
              phone: '+15559876543',
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
        },
        {
          id: '2',
          companyName: 'Global Corp',
          email: 'admin@globalcorp.com',
          fullName: 'Jane Smith',
          phone: '+15559876543',
          address: '456 Corporate Ave, Business City, BC 67890',
          taxId: 'TAX789012',
          creditLimit: 75000,
          tags: ['Wholesale', 'Regular'],
          isActive: true,
          createdAt: '2023-02-20',
        },
      ]
      setCustomers(sampleCustomers)
      setFilteredCustomers(sampleCustomers)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter customers based on search and status
  useEffect(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch =
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        false

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // setFilteredCustomers(filtered)
  }, [searchTerm, statusFilter, customers])

  const handleSaveCustomer = (customerData: Customer) => {
    if (customerData.id) {
      // Update existing customer
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === customerData.id
            ? { ...customerData, updatedAt: new Date().toISOString() }
            : customer
        )
      )
    } else {
      // Add new customer
      const newCustomer: Customer = {
        ...customerData,
        id: `customer-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setCustomers(prev => [...prev, newCustomer])
    }

    setShowForm(false)
    setEditingCustomer(null)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer)
  }

  const handleEditFromDetails = (customer: Customer) => {
    setViewingCustomer(null)
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== customerId))
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Customers</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
        >
          <PlusIcon className='w-5 h-5' />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search customers...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          {/* Status Filter */}
          <div className='flex items-center space-x-2'>
            <FilterIcon className='w-5 h-5 text-gray-400' />
            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')
              }
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            >
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='suspended'>Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto'></div>
            <p className='mt-2 text-gray-500 dark:text-gray-400'>Loading customers...</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Customer
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Contact
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Currency
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          {customer.fullName}
                        </div>
                        {customer.companyName && (
                          <div className='text-sm text-gray-500 dark:text-gray-400'>
                            {customer.companyName}
                          </div>
                        )}
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {customer.tags?.map(tag => (
                            <span
                              key={tag}
                              className='inline-flex px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 dark:text-white'>{customer.email}</div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {customer.phone}
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate'>
                        {customer.address}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                      {customer.currency || 'USD'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : customer.status === 'suspended'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {customer.status === 'active'
                          ? 'Active'
                          : customer.status === 'suspended'
                            ? 'Suspended'
                            : 'Inactive'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <Link
                          href={`/customers/${customer.id}`}
                          className='text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                          title='View Details'
                        >
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                            />
                          </svg>
                        </Link>

                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className='text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300'
                          title='Edit Customer'
                        >
                          <PencilIcon className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id!)}
                          className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                          title='Delete Customer'
                        >
                          <TrashIcon className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCustomers.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-500 dark:text-gray-400'>No customers found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => {
            setShowForm(false)
            setEditingCustomer(null)
          }}
          open={showForm}
        />
      )}
    </div>
  )
}

export default Customers
