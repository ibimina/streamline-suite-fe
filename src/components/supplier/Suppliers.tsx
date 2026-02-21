'use client'
import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { PlusIcon, TrashIcon, PencilIcon, SearchIcon, FilterIcon } from '../Icons'
import SupplierForm from './SupplierForm'
import Link from 'next/dist/client/link'
import { useGetSuppliersQuery, useDeleteSupplierMutation, Supplier } from '@/store/api/supplierApi'
import LoadingSpinner from '../shared/LoadingSpinner'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetSuppliersQuery()
  const [deleteSupplier] = useDeleteSupplierMutation()
  const suppliers = data?.payload?.suppliers || []

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [supplierId, setSupplierId] = useState<string | null>(null)

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setShowForm(true)
  }

  const handleDeleteSupplier = async (supplierId: string) => {
    setShowDeleteModal(true)
    setSupplierId(supplierId)
  }

  const confirmDeleteSupplier = async () => {
    if (!supplierId) return

    try {
      await deleteSupplier(supplierId).unwrap()
      toast.success('Supplier deleted successfully')
    } catch (error) {
      toast.error('Failed to delete supplier')
    } finally {
      setShowDeleteModal(false)
      setSupplierId(null)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingSupplier(null)
  }

  const loading = isLoading || isFetching

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Suppliers</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
        >
          <PlusIcon className='w-5 h-5' />
          <span>Add Supplier</span>
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
              placeholder='Search suppliers...'
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
              onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            >
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden'>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Supplier
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Contact
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Payment Terms
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
                {suppliers.map(supplier => (
                  <tr key={supplier.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          {supplier.name}
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                          {supplier.email}
                        </div>
                        {supplier.taxId && (
                          <div className='text-xs text-gray-400'>Tax ID: {supplier.taxId}</div>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 dark:text-white'>
                        {supplier.contact}
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {supplier.phone}
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate'>
                        {supplier.address}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                      <span className='inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                        {supplier.paymentTerms}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          supplier.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {supplier.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <Link
                          href={`/suppliers/${supplier._id}`}
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
                          onClick={() => handleEditSupplier(supplier)}
                          className='text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300'
                        >
                          <PencilIcon className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDeleteSupplier(supplier.id!)}
                          className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                        >
                          <TrashIcon className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {suppliers.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-500 dark:text-gray-400'>No suppliers found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Supplier Form Modal */}
      {showForm && (
        <SupplierForm supplier={editingSupplier} onCancel={handleFormClose} open={showForm} />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteSupplier}
        />
      )}
    </div>
  )
}

export default Suppliers
