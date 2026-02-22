'use client'
import React, { useState } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, SearchIcon, FilterIcon } from '../Icons'
import CustomerForm from './CustomerForm'
import Link from 'next/link'
import { useDeleteCustomerMutation, useGetCustomersQuery } from '@/store/api'
import { Customer } from '@/interface/customer.interface'
import LoadingSpinner from '../shared/LoadingSpinner'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'

const Customers = () => {
  const { data, isLoading: loading } = useGetCustomersQuery()

  const [deleteCustomer] = useDeleteCustomerMutation()

  const customers = data?.payload?.customers ?? []
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>(
    'all'
  )
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null)
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const confirmDeleteCustomer = async () => {
    try {
      if (!deletingCustomerId) return

      await deleteCustomer(deletingCustomerId).unwrap()
    } catch (error: any) {
      alert(error?.data?.message || 'Failed to delete customer')
    }
  }

  const handleDeleteCustomer = (customerId: string) => {
    setDeletingCustomerId(customerId)
    setShowDeleteModal(true)
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-foreground'>Customers</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary'
        >
          <PlusIcon className='w-5 h-5' />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className='bg-card p-4 rounded-lg shadow-sm'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search customers...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
            />
          </div>

          {/* Status Filter */}
          <div className='flex items-center space-x-2'>
            <FilterIcon className='w-5 h-5 text-muted-foreground' />
            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')
              }
              className='px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
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
      <div className='bg-card rounded-lg shadow-sm overflow-hidden'>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-border'>
              <thead className='bg-muted'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Customer
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Contact
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Currency
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-card divide-y divide-border'>
                {customers.map(customer => (
                  <tr key={customer._id} className='hover:bg-muted '>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div>
                        <div className='text-sm font-medium text-foreground'>
                          {customer.fullName}
                        </div>
                        {customer.companyName && (
                          <div className='text-sm text-muted-foreground'>
                            {customer.companyName}
                          </div>
                        )}
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {customer.tags?.map(tag => (
                            <span
                              key={tag}
                              className='inline-flex px-2 py-1 text-xs rounded-full bg-primary-light text-primary dark:bg-primary/20 dark:text-primary-foreground'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-foreground'>{customer.email}</div>
                      <div className='text-sm text-muted-foreground'>{customer.phone}</div>
                      <div className='text-sm text-muted-foreground max-w-xs truncate'>
                        {customer.address}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-foreground'>
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
                          href={`/customers/${customer._id}`}
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
                          className='text-primary hover:text-primary-hover dark:text-primary dark:hover:text-primary'
                          title='Edit Customer'
                        >
                          <PencilIcon className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer._id!)}
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

            {customers.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-muted-foreground'>No customers found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onCancel={() => {
            setShowForm(false)
            setEditingCustomer(null)
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

export default Customers
