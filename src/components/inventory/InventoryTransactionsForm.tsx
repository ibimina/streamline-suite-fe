'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from '../Icons'
import {
  useCreateInventoryTransactionMutation,
  useUpdateInventoryTransactionMutation,
  useGetProductsQuery,
} from '@/store/api'
import type { InventoryTransaction } from '@/types/inventory-transaction.type'
import {
  inventoryTransactionSchema,
  type InventoryTransactionFormData,
} from '@/schemas/inventory-transaction.schema'
import { toast } from 'react-toastify'

interface InventoryTransactionFormProps {
  onCancel: () => void
  transaction?: InventoryTransaction | null
}

const InventoryTransactionForm: React.FC<InventoryTransactionFormProps> = ({
  onCancel,
  transaction = null,
}) => {
  // Fetch products from API
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery()
  const products = productsData?.payload?.products || []
  const [createTransaction, { isLoading: isCreating }] = useCreateInventoryTransactionMutation()
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateInventoryTransactionMutation()

  const [serialNumberInput, setSerialNumberInput] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InventoryTransactionFormData>({
    resolver: zodResolver(inventoryTransactionSchema),
    defaultValues: {
      product:
        typeof transaction?.product === 'object'
          ? transaction.product._id
          : transaction?.product || '',
      status: transaction?.status || 'purchase',
      quantity: transaction?.quantity || 1,
      unitCost: transaction?.unitCost || 0,
      reference: transaction?.reference || '',
      warehouse: transaction?.warehouse || '',
      expiryDate: transaction?.expiryDate || '',
      serialNumbers: transaction?.serialNumbers || [],
      notes: transaction?.notes || '',
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form's watch is needed for reactive form values
  const serialNumbers = watch('serialNumbers') || []
  const unitCost = watch('unitCost') || 0
  const quantity = watch('quantity') || 0

  const transactionTypes = [
    { value: 'purchase', label: 'Purchase', color: 'bg-green-100 text-green-800' },
    { value: 'sale', label: 'Sale', color: 'bg-blue-100 text-blue-800' },
    {
      value: 'return_from_customer',
      label: 'Return from Customer',
      color: 'bg-teal-100 text-teal-800',
    },
    {
      value: 'return_to_supplier',
      label: 'Return to Supplier',
      color: 'bg-orange-100 text-orange-800',
    },
    { value: 'adjustment', label: 'Adjustment', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'transfer', label: 'Transfer', color: 'bg-purple-100 text-purple-800' },
    { value: 'production_in', label: 'Production In', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'production_out', label: 'Production Out', color: 'bg-rose-100 text-rose-800' },
  ]

  const onSubmit = async (data: InventoryTransactionFormData) => {
    try {
      if (transaction?._id) {
        await updateTransaction({
          transactionId: transaction._id,
          data: {
            status: 'completed',
            notes: data.notes,
          },
        }).unwrap()
        toast.success('Transaction updated successfully')
      } else {
        await createTransaction(data).unwrap()
        toast.success('Transaction created successfully')
      }
      onCancel()
    } catch (error) {
      toast.error('Failed to save transaction')
      console.error('Failed to save transaction:', error)
    }
  }

  const addSerialNumber = () => {
    if (serialNumberInput.trim() && !serialNumbers.includes(serialNumberInput.trim())) {
      setValue('serialNumbers', [...serialNumbers, serialNumberInput.trim()])
      setSerialNumberInput('')
    }
  }

  const removeSerialNumber = (serialToRemove: string) => {
    setValue(
      'serialNumbers',
      serialNumbers.filter(serial => serial !== serialToRemove)
    )
  }

  const isLoading = isCreating || isUpdating

  const getSubmitButtonText = () => {
    if (isLoading) return 'Saving...'
    if (transaction?._id) return 'Update Transaction'
    return 'Create Transaction'
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>
          {transaction?._id ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Product */}
            <div>
              <label
                htmlFor='product'
                className='block text-sm font-medium text-secondary-foreground mb-1'
              >
                Product *
              </label>
              <select
                id='product'
                {...register('product')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                disabled={isLoadingProducts}
              >
                <option value=''>
                  {isLoadingProducts ? 'Loading products...' : 'Select a product'}
                </option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.sku || 'No SKU'})
                  </option>
                ))}
              </select>
              {errors.product && (
                <p className='text-red-500 text-sm mt-1'>{errors.product.message}</p>
              )}
            </div>

            {/* Transaction Type */}
            <div>
              <label
                htmlFor='status'
                className='block text-sm font-medium text-secondary-foreground mb-1'
              >
                Transaction Type *
              </label>
              <select
                id='status'
                {...register('status')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
              >
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className='text-red-500 text-sm mt-1'>{errors.status.message}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor='quantity'
                className='block text-sm font-medium text-secondary-foreground mb-1'
              >
                Quantity *
              </label>
              <input
                id='quantity'
                type='number'
                min='1'
                {...register('quantity', { valueAsNumber: true })}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='1'
              />
              {errors.quantity && (
                <p className='text-red-500 text-sm mt-1'>{errors.quantity.message}</p>
              )}
            </div>

            {/* Unit Cost */}
            <div>
              <label
                htmlFor='unitCost'
                className='block text-sm font-medium text-secondary-foreground mb-1'
              >
                Unit Cost
              </label>
              <input
                id='unitCost'
                type='number'
                min='0'
                step='0.01'
                {...register('unitCost', { valueAsNumber: true })}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='0.00'
              />
              {errors.unitCost && (
                <p className='text-red-500 text-sm mt-1'>{errors.unitCost.message}</p>
              )}
            </div>

            {/* Reference */}
            <div>
              <label
                htmlFor='reference'
                className='block text-sm font-medium text-secondary-foreground mb-1'
              >
                Reference *
              </label>
              <input
                id='reference'
                type='text'
                {...register('reference')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='e.g., PO-001, INV-005, ADJ-001'
              />
              {errors.reference && (
                <p className='text-red-500 text-sm mt-1'>{errors.reference.message}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label
                htmlFor='expiryDate'
                className='block text-sm font-medium text-secondary-foreground mb-1'
              >
                Expiry Date
              </label>
              <input
                id='expiryDate'
                type='date'
                {...register('expiryDate')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
              />
              {errors.expiryDate && (
                <p className='text-red-500 text-sm mt-1'>{errors.expiryDate.message}</p>
              )}
            </div>
          </div>

          {/* Serial Numbers */}
          <div>
            <label
              htmlFor='serialNumberInput'
              className='block text-sm font-medium text-secondary-foreground mb-1'
            >
              Serial Numbers
            </label>
            <div className='flex gap-2 mb-2'>
              <input
                id='serialNumberInput'
                type='text'
                value={serialNumberInput}
                onChange={e => setSerialNumberInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSerialNumber()
                  }
                }}
                className='flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='Enter serial number'
              />
              <button
                type='button'
                onClick={addSerialNumber}
                className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary'
              >
                Add
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {serialNumbers.map(serial => (
                <span
                  key={serial}
                  className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-primary dark:bg-primary/20 dark:text-primary-foreground'
                >
                  {serial}
                  <button
                    type='button'
                    onClick={() => removeSerialNumber(serial)}
                    className='ml-2 hover:text-primary'
                  >
                    <TrashIcon className='w-3 h-3' />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor='notes'
              className='block text-sm font-medium text-secondary-foreground mb-1'
            >
              Notes
            </label>
            <textarea
              id='notes'
              {...register('notes')}
              className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
              rows={3}
              placeholder='Additional notes about this transaction'
            />
            {errors.notes && <p className='text-red-500 text-sm mt-1'>{errors.notes.message}</p>}
          </div>

          {/* Total Value Display */}
          {unitCost > 0 && quantity > 0 && (
            <div className='bg-muted p-4 rounded-md'>
              <div className='text-sm text-muted-foreground'>
                Total Value:{' '}
                <span className='font-semibold text-foreground'>
                  ${(unitCost * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className='flex justify-end space-x-4 pt-6 border-t border-border'>
            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 text-secondary-foreground bg-muted rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary   hover:bg-accent'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50'
              disabled={isLoading}
            >
              {getSubmitButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default InventoryTransactionForm
