'use client'
import React, { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, SearchIcon, FilterIcon } from '../Icons'
import SupplierForm from './SupplierForm'
import Link from 'next/dist/client/link'

export interface Supplier {
  id?: string
  name: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  paymentTerms?: string
  taxId?: string
  isActive?: boolean
  companyId?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'Office Supplies Co.',
          contact: 'John Manager',
          email: 'orders@officesupplies.com',
          phone: '+1 (555) 111-2222',
          address: '789 Supply St, Commerce City, CC 11111',
          paymentTerms: 'Net 30',
          taxId: 'SUPP123456',
          isActive: true,
          createdAt: '2023-01-10',
        },
        {
          id: '2',
          name: 'Tech Equipment Ltd.',
          contact: 'Sarah Sales',
          email: 'sales@techequipment.com',
          phone: '+1 (555) 333-4444',
          address: '321 Hardware Ave, Tech City, TC 22222',
          paymentTerms: 'Net 15',
          taxId: 'SUPP789012',
          isActive: true,
          createdAt: '2023-02-15',
        },
        {
          id: '3',
          name: 'Raw Materials Inc.',
          contact: 'Mike Procurement',
          email: 'mike@rawmaterials.com',
          phone: '+1 (555) 555-6666',
          address: '456 Industrial Blvd, Production City, PC 33333',
          paymentTerms: 'Net 60',
          taxId: 'SUPP345678',
          isActive: false,
          createdAt: '2023-03-20',
        },
      ]
      setSuppliers(sampleSuppliers)
      setFilteredSuppliers(sampleSuppliers)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter suppliers based on search and status
  useEffect(() => {
    const filtered = suppliers.filter(supplier => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.contact?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (supplier.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && supplier.isActive) ||
        (statusFilter === 'inactive' && !supplier.isActive)

      return matchesSearch && matchesStatus
    })

    // setFilteredSuppliers(filtered)
  }, [searchTerm, statusFilter, suppliers])

  const handleSaveSupplier = (supplierData: Supplier) => {
    if (supplierData.id) {
      // Update existing supplier
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === supplierData.id
            ? { ...supplierData, updatedAt: new Date().toISOString() }
            : supplier
        )
      )
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        ...supplierData,
        id: `supplier-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setSuppliers(prev => [...prev, newSupplier])
    }

    setShowForm(false)
    setEditingSupplier(null)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setShowForm(true)
  }

  const handleDeleteSupplier = (supplierId: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId))
    }
  }

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
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto'></div>
            <p className='mt-2 text-gray-500 dark:text-gray-400'>Loading suppliers...</p>
          </div>
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
                {filteredSuppliers.map(supplier => (
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
                          href={`/suppliers/${supplier.id}`}
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

            {filteredSuppliers.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-500 dark:text-gray-400'>No suppliers found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Supplier Form Modal */}
      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSaveSupplier}
          onCancel={() => {
            setShowForm(false)
            setEditingSupplier(null)
          }}
          open={showForm}
        />
      )}
    </div>
  )
}

export default Suppliers
