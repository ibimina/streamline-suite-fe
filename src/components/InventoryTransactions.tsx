'use client'
import React, { useState, useEffect } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from './Icons'

export interface InventoryTransaction {
  id?: string
  product: string // Product ID
  productName?: string // For display
  status: 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'TRANSFER' | 'RETURN'
  quantity: number
  unitCost?: number
  reference: string
  referenceId?: string
  warehouse?: string
  expiryDate?: string
  serialNumbers: string[]
  notes: string
  createdBy?: string
  companyId?: string
  totalValue?: number
  runningStock?: number
  createdAt?: string
  updatedAt?: string
}

interface InventoryTransactionFormProps {
  transaction: Partial<InventoryTransaction> | null
  onSave: (transaction: InventoryTransaction) => void
  onCancel: () => void
}

const InventoryTransactionForm: React.FC<InventoryTransactionFormProps> = ({
  transaction,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<InventoryTransaction>({
    product: transaction?.product || '',
    productName: transaction?.productName || '',
    status: transaction?.status || 'PURCHASE',
    quantity: transaction?.quantity || 0,
    unitCost: transaction?.unitCost || 0,
    reference: transaction?.reference || '',
    referenceId: transaction?.referenceId || '',
    warehouse: transaction?.warehouse || '',
    expiryDate: transaction?.expiryDate || '',
    serialNumbers: transaction?.serialNumbers || [],
    notes: transaction?.notes || '',
  })

  const [serialNumberInput, setSerialNumberInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sample products - replace with API call
  const sampleProducts = [
    { id: '1', name: 'Dell Laptop Inspiron 15', sku: 'LAPTOP-001' },
    { id: '2', name: 'Security Camera ProView', sku: 'CAM-001' },
    { id: '3', name: 'Ethernet Cable Cat6', sku: 'CBL-001' },
  ]

  const transactionStatuses = [
    { value: 'PURCHASE', label: 'Purchase', color: 'bg-green-100 text-green-800' },
    { value: 'SALE', label: 'Sale', color: 'bg-blue-100 text-blue-800' },
    { value: 'ADJUSTMENT', label: 'Adjustment', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'TRANSFER', label: 'Transfer', color: 'bg-purple-100 text-purple-800' },
    { value: 'RETURN', label: 'Return', color: 'bg-red-100 text-red-800' },
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.product) newErrors.product = 'Product is required'
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0'
    if (!formData.reference.trim()) newErrors.reference = 'Reference is required'
    if (formData.unitCost !== undefined && formData.unitCost < 0) {
      newErrors.unitCost = 'Unit cost cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Calculate total value
      const totalValue = (formData.unitCost || 0) * formData.quantity

      onSave({
        ...formData,
        id: transaction?.id,
        totalValue,
        productName: sampleProducts.find(p => p.id === formData.product)?.name || '',
      })
    }
  }

  const addSerialNumber = () => {
    if (serialNumberInput.trim() && !formData.serialNumbers.includes(serialNumberInput.trim())) {
      setFormData(prev => ({
        ...prev,
        serialNumbers: [...prev.serialNumbers, serialNumberInput.trim()],
      }))
      setSerialNumberInput('')
    }
  }

  const removeSerialNumber = (serialToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      serialNumbers: prev.serialNumbers.filter(serial => serial !== serialToRemove),
    }))
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
          {transaction?.id ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Product */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Product *
              </label>
              <select
                value={formData.product}
                onChange={e => setFormData(prev => ({ ...prev, product: e.target.value }))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              >
                <option value=''>Select a product</option>
                {sampleProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
              {errors.product && <p className='text-red-500 text-sm mt-1'>{errors.product}</p>}
            </div>

            {/* Status */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Transaction Type *
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              >
                {transactionStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Quantity *
              </label>
              <input
                type='number'
                min='1'
                value={formData.quantity}
                onChange={e =>
                  setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='1'
              />
              {errors.quantity && <p className='text-red-500 text-sm mt-1'>{errors.quantity}</p>}
            </div>

            {/* Unit Cost */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Unit Cost
              </label>
              <input
                type='number'
                min='0'
                step='0.01'
                value={formData.unitCost}
                onChange={e =>
                  setFormData(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='0.00'
              />
              {errors.unitCost && <p className='text-red-500 text-sm mt-1'>{errors.unitCost}</p>}
            </div>

            {/* Reference */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Reference *
              </label>
              <input
                type='text'
                value={formData.reference}
                onChange={e => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='e.g., PO-001, INV-005, ADJ-001'
              />
              {errors.reference && <p className='text-red-500 text-sm mt-1'>{errors.reference}</p>}
            </div>

            {/* Expiry Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Expiry Date
              </label>
              <input
                type='date'
                value={formData.expiryDate}
                onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
          </div>

          {/* Serial Numbers */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Serial Numbers
            </label>
            <div className='flex gap-2 mb-2'>
              <input
                type='text'
                value={serialNumberInput}
                onChange={e => setSerialNumberInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSerialNumber())}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Enter serial number'
              />
              <button
                type='button'
                onClick={addSerialNumber}
                className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
              >
                Add
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {formData.serialNumbers.map((serial, index) => (
                <span
                  key={serial}
                  className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                >
                  {serial}
                  <button
                    type='button'
                    onClick={() => removeSerialNumber(serial)}
                    className='ml-2 hover:text-teal-600'
                  >
                    <TrashIcon className='w-3 h-3' />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              rows={3}
              placeholder='Additional notes about this transaction'
            />
          </div>

          {/* Total Value Display */}
          {formData?.unitCost && formData.unitCost > 0 && formData.quantity > 0 && (
            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-md'>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                Total Value:{' '}
                <span className='font-semibold text-gray-900 dark:text-white'>
                  ${(formData?.unitCost * formData.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className='flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600'>
            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
            >
              {transaction?.id ? 'Update Transaction' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface InventoryTransactionsProps {
  // Add any props if needed
}

const InventoryTransactions: React.FC<InventoryTransactionsProps> = () => {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<InventoryTransaction[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'TRANSFER' | 'RETURN'
  >('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<InventoryTransaction | null>(null)
  const [loading, setLoading] = useState(true)

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleTransactions: InventoryTransaction[] = [
        {
          id: '1',
          product: '1',
          productName: 'Dell Laptop Inspiron 15',
          status: 'PURCHASE',
          quantity: 10,
          unitCost: 800,
          reference: 'PO-001',
          warehouse: 'Main Warehouse',
          serialNumbers: ['DL001', 'DL002'],
          notes: 'Initial stock purchase',
          totalValue: 8000,
          runningStock: 25,
          createdAt: '2023-11-01',
        },
        {
          id: '2',
          product: '1',
          productName: 'Dell Laptop Inspiron 15',
          status: 'SALE',
          quantity: 2,
          unitCost: 800,
          reference: 'INV-001',
          serialNumbers: ['DL001', 'DL002'],
          notes: 'Sale to Tech Solutions',
          totalValue: 1600,
          runningStock: 23,
          createdAt: '2023-11-15',
        },
        {
          id: '3',
          product: '2',
          productName: 'Security Camera ProView',
          status: 'ADJUSTMENT',
          quantity: -2,
          unitCost: 150,
          reference: 'ADJ-001',
          notes: 'Damaged items adjustment',
          totalValue: -300,
          runningStock: 3,
          createdAt: '2023-11-20',
          serialNumbers: [],
        },
      ]
      setTransactions(sampleTransactions)
      setFilteredTransactions(sampleTransactions)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter transactions
  useEffect(() => {
    const filtered = transactions.filter(transaction => {
      const matchesSearch =
        transaction.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.notes.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // setFilteredTransactions(filtered)
  }, [searchTerm, statusFilter, transactions])

  const handleSaveTransaction = (transactionData: InventoryTransaction) => {
    if (transactionData.id) {
      // Update existing transaction
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === transactionData.id
            ? { ...transactionData, updatedAt: new Date().toISOString() }
            : transaction
        )
      )
    } else {
      // Add new transaction
      const newTransaction: InventoryTransaction = {
        ...transactionData,
        id: `transaction-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setTransactions(prev => [...prev, newTransaction])
    }

    setShowForm(false)
    setEditingTransaction(null)
  }

  const handleEditTransaction = (transaction: InventoryTransaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId))
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      PURCHASE: {
        icon: ArrowDownIcon,
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
      SALE: {
        icon: ArrowUpIcon,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      },
      ADJUSTMENT: {
        icon: PencilIcon,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      },
      TRANSFER: {
        icon: ArrowUpIcon,
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      },
      RETURN: {
        icon: ArrowDownIcon,
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      },
    }
    return configs[status as keyof typeof configs] || configs.PURCHASE
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Inventory Transactions</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
        >
          <PlusIcon className='w-5 h-5' />
          <span>Add Transaction</span>
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
              placeholder='Search transactions...'
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
              onChange={e => setStatusFilter(e.target.value as any)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            >
              <option value='all'>All Types</option>
              <option value='PURCHASE'>Purchase</option>
              <option value='SALE'>Sale</option>
              <option value='ADJUSTMENT'>Adjustment</option>
              <option value='TRANSFER'>Transfer</option>
              <option value='RETURN'>Return</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto'></div>
            <p className='mt-2 text-gray-500 dark:text-gray-400'>Loading transactions...</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Date & Reference
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Quantity
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Value
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredTransactions.map(transaction => {
                  const statusConfig = getStatusConfig(transaction.status)
                  const IconComponent = statusConfig.icon

                  return (
                    <tr key={transaction.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {new Date(transaction.createdAt!).toLocaleDateString()}
                          </div>
                          <div className='text-sm text-gray-500 dark:text-gray-400'>
                            {transaction.reference}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {transaction.productName}
                          </div>
                          {transaction.notes && (
                            <div className='text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate'>
                              {transaction.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${statusConfig.color}`}
                        >
                          <IconComponent className='w-3 h-3 mr-1' />
                          {transaction.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div
                          className={`text-sm font-medium ${
                            transaction.quantity > 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {transaction.quantity > 0 ? '+' : ''}
                          {transaction.quantity}
                        </div>
                        {transaction.runningStock !== undefined && (
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            Stock: {transaction.runningStock}
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {transaction.totalValue !== undefined && (
                          <div
                            className={`text-sm ${
                              transaction.totalValue >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            ${Math.abs(transaction.totalValue).toLocaleString()}
                          </div>
                        )}
                        {transaction.unitCost && (
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            @ ${transaction.unitCost.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className='text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300'
                          >
                            <PencilIcon className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id!)}
                            className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                          >
                            <TrashIcon className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-500 dark:text-gray-400'>No transactions found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <InventoryTransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={() => {
            setShowForm(false)
            setEditingTransaction(null)
          }}
        />
      )}
    </div>
  )
}

export default InventoryTransactions
