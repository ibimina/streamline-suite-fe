'use client'
import React, { useState } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '../Icons'
import {
  useGetInventoryTransactionsQuery,
  useCreateInventoryTransactionMutation,
  useUpdateInventoryTransactionMutation,
  useDeleteInventoryTransactionMutation,
} from '@/store/api'
import type {
  InventoryTransaction,
  CreateInventoryTransactionData,
} from '@/types/inventory-transaction.type'
import { toast } from 'react-toastify'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'
import InventoryTransactionForm from './InventoryTransactionsForm'

const InventoryTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'stock_in' | 'stock_out' | 'adjustment' | 'transfer'
  >('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<InventoryTransaction | null>(null)
  const [page, setPage] = useState(1)
  const limit = 10

  // RTK Query hooks
  const { data, isLoading, isError, refetch } = useGetInventoryTransactionsQuery({
    page,
    limit,
    search: searchTerm || undefined,
    transactionType: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const [deleteTransaction] = useDeleteInventoryTransactionMutation()
  const [createTransaction] = useCreateInventoryTransactionMutation()
  const [updateTransaction] = useUpdateInventoryTransactionMutation()

  const transactions = data?.payload?.inventoryTransactions || []

  const handleSaveTransaction = async (transactionData: any) => {
    try {
      if (editingTransaction?._id) {
        // Update existing transaction
        await updateTransaction({
          transactionId: editingTransaction._id,
          data: {
            status: transactionData.status,
            notes: transactionData.notes,
          },
        }).unwrap()
      } else {
        // Create new transaction
        const createData: CreateInventoryTransactionData = {
          product: transactionData.product,
          transactionType: transactionData.transactionType || 'stock_in',
          quantity: transactionData.quantity,
          unitCost: transactionData.unitCost,
          reference: transactionData.reference,
          warehouse: transactionData.warehouse,
          serialNumbers: transactionData.serialNumbers,
          notes: transactionData.notes,
        }
        await createTransaction(createData).unwrap()
      }
      setShowForm(false)
      setEditingTransaction(null)
    } catch (error) {
      console.error('Failed to save transaction:', error)
    }
  }
  const [inventoryId, setInventoryId] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleEditTransaction = (transaction: InventoryTransaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    setInventoryId(transactionId)
    setShowDeleteModal(true)
    // if (confirm('Are you sure you want to delete this transaction?')) {
    //   try {
    //     await deleteTransaction(transactionId).unwrap()
    //   } catch (error) {
    //     console.error('Failed to delete transaction:', error)
    //   }
    // }
  }
  const handleConfirmDelete = async () => {
    try {
      await deleteTransaction(inventoryId).unwrap()
      setShowDeleteModal(false)
      toast.success('Transaction deleted successfully')
    } catch (error) {
      toast.error('Failed to delete transaction')
      console.error('Failed to delete transaction:', error)
    }
  }
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string }> = {
      stock_in: {
        icon: ArrowDownIcon,
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
      stock_out: {
        icon: ArrowUpIcon,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      },
      adjustment: {
        icon: PencilIcon,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      },
      transfer: {
        icon: ArrowUpIcon,
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      },
    }
    return configs[status as keyof typeof configs] || configs.PURCHASE
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-foreground'>Inventory Transactions</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary'
        >
          <PlusIcon className='w-5 h-5' />
          <span>Add Transaction</span>
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
              placeholder='Search transactions...'
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
              onChange={e => setStatusFilter(e.target.value as any)}
              className='px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
            >
              <option value='all'>All Types</option>
              <option value='stock_in'>Stock In</option>
              <option value='stock_out'>Stock Out</option>
              <option value='adjustment'>Adjustment</option>
              <option value='transfer'>Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center'>
          <p className='text-red-600 dark:text-red-400 mb-2'>Failed to load transactions</p>
          <button
            onClick={() => refetch()}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
          >
            Retry
          </button>
        </div>
      )}

      {/* Transactions Table */}
      <div className='bg-card rounded-lg shadow-sm overflow-hidden'>
        {isLoading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
            <p className='mt-2 text-muted-foreground'>Loading transactions...</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-border'>
              <thead className='bg-muted'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Date & Reference
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Quantity
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Value
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-card divide-y divide-border'>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='px-6 py-12 text-center text-muted-foreground'>
                      No transactions found. Create your first transaction to get started.
                    </td>
                  </tr>
                ) : (
                  transactions.map(transaction => {
                    const statusConfig = getStatusConfig(transaction.transactionType)
                    const IconComponent = statusConfig.icon

                    return (
                      <tr key={transaction._id} className='hover:bg-muted '>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div>
                            <div className='text-sm font-medium text-foreground'>
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              {transaction.reference}
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div>
                            <div className='text-sm font-medium text-foreground'>
                              {transaction.productName || transaction.product}
                            </div>
                            {transaction.notes && (
                              <div className='text-sm text-muted-foreground max-w-xs truncate'>
                                {transaction.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs rounded-full capitalize ${statusConfig.color}`}
                          >
                            <IconComponent className='w-3 h-3 mr-1' />
                            {transaction.transactionType.replace('_', ' ')}
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
                            <div className='text-xs text-muted-foreground'>
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
                            <div className='text-xs text-muted-foreground'>
                              @ ${transaction.unitCost.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className='text-primary hover:text-primary-hover dark:text-primary dark:hover:text-primary'
                            >
                              <PencilIcon className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction._id)}
                              className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                            >
                              <TrashIcon className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {data?.payload?.total && data.payload.total > limit && (
              <div className='flex justify-between items-center p-4 border-t border-border'>
                <p className='text-sm text-muted-foreground'>
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.payload.total)}{' '}
                  of {data.payload.total} transactions
                </p>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className='px-3 py-1 rounded border  disabled:opacity-50'
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= data.payload.total}
                    className='px-3 py-1 rounded border  disabled:opacity-50'
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <InventoryTransactionForm
          transaction={editingTransaction}
          onCancel={() => {
            setShowForm(false)
            setEditingTransaction(null)
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default InventoryTransactions
