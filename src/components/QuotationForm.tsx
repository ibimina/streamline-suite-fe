'use client'
import React, { useState, useMemo } from 'react'
import {
  Quotation,
  QuotationStatus,
  LineItem,
  Template,
  AccentColor,
  CustomTemplate,
} from '@/types'
import { PlusIcon, TrashIcon } from './Icons'
import { defaultTerms } from './Invoices'

interface QuotationFormProps {
  quotation: Quotation | null
  templateConfig?: {
    template: Template
    accentColor: AccentColor
    customTemplate?: CustomTemplate
  }
  onSave: (quotation: Quotation) => void
  onCancel: () => void
}

export const QuotationForm: React.FC<QuotationFormProps> = ({
  quotation,
  templateConfig,
  onSave,
  onCancel,
}) => {
  const now = new Date().getTime()

  // Separate base form data from calculated values
  const [baseFormData, setBaseFormData] = useState({
    id: quotation?.id || `q-${now}`,
    customerName: quotation?.customerName || '',
    customerAddress: quotation?.customerAddress || '',
    date: quotation?.date || new Date(now).toISOString().split('T')[0],
    status: quotation?.status || ('Draft' as QuotationStatus),
    items: quotation?.items || [
      {
        id: `li-${now}-0`,
        description: '',
        quantity: 1,
        sellingPricePercentage: 10,
        costPrice: 0,
        unitPrice: 0,
        sku: '',
      },
    ],
    terms: quotation?.terms || defaultTerms,
    vatRate: quotation?.vatRate || 7.5,
    whtRate: quotation?.whtRate || 5,
    template: quotation?.template || templateConfig?.template,
    accentColor: quotation?.accentColor || templateConfig?.accentColor,
    customTemplateId: quotation?.customTemplateId || templateConfig?.customTemplate?.id,
  })

  // Calculate derived values using useMemo
  const calculatedValues = useMemo(() => {
    const newItems = baseFormData.items.map(item => ({
      ...item,
      unitPrice: item.costPrice * (1 + item.sellingPricePercentage / 100),
    }))
    const subtotal = newItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
    const vat = subtotal * (baseFormData.vatRate / 100)
    const total = subtotal + vat
    return { items: newItems, subtotal, vat, total }
  }, [baseFormData.items, baseFormData.vatRate])

  // Combine base data with calculated values for the complete form data
  const formData = useMemo(
    () => ({
      ...baseFormData,
      ...calculatedValues,
    }),
    [baseFormData, calculatedValues]
  )

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...baseFormData.items]
    const item = newItems[index]
    ;(item as any)[field] = field === 'description' || field === 'sku' ? value : Number(value) || 0
    setBaseFormData({ ...baseFormData, items: newItems })
  }

  const addItem = () => {
    const newItem: LineItem = {
      id: `li-${Date.now()}-${Math.random()}`,
      description: '',
      quantity: 1,
      sellingPricePercentage: 10,
      costPrice: 0,
      unitPrice: 0,
      sku: '',
    }
    setBaseFormData({ ...baseFormData, items: [...baseFormData.items, newItem] })
  }

  const removeItem = (index: number) => {
    if (baseFormData.items.length > 1) {
      const newItems = baseFormData.items.filter((_, i) => i !== index)
      setBaseFormData({ ...baseFormData, items: newItems })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Quotation)
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
      <form onSubmit={handleSubmit} className='p-6'>
        {/* Customer Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Customer Information
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Customer Name *
                </label>
                <input
                  type='text'
                  value={baseFormData.customerName}
                  onChange={e => setBaseFormData({ ...baseFormData, customerName: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Customer Address *
                </label>
                <textarea
                  value={baseFormData.customerAddress}
                  onChange={e =>
                    setBaseFormData({ ...baseFormData, customerAddress: e.target.value })
                  }
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Quotation Details
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Quotation ID
                </label>
                <input
                  type='text'
                  value={baseFormData.id}
                  onChange={e => setBaseFormData({ ...baseFormData, id: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Date
                </label>
                <input
                  type='date'
                  value={baseFormData.date}
                  onChange={e => setBaseFormData({ ...baseFormData, date: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Status
                </label>
                <select
                  value={baseFormData.status}
                  onChange={e =>
                    setBaseFormData({ ...baseFormData, status: e.target.value as QuotationStatus })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                >
                  <option value='Draft'>Draft</option>
                  <option value='Sent'>Sent</option>
                  <option value='Accepted'>Accepted</option>
                  <option value='Rejected'>Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Line Items</h3>
            <button
              type='button'
              onClick={addItem}
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2'
            >
              <PlusIcon className='h-4 w-4' />
              Add Item
            </button>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full border border-gray-200 dark:border-gray-700 rounded-lg'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Description
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    SKU
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Qty
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Cost Price
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Markup %
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Unit Price
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Total
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {baseFormData.items.map((item, index) => {
                  const calculatedItem = calculatedValues.items[index]
                  return (
                    <tr key={item.id} className='bg-white dark:bg-gray-800'>
                      <td className='px-4 py-3'>
                        <input
                          type='text'
                          value={item.description}
                          onChange={e => handleItemChange(index, 'description', e.target.value)}
                          className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          placeholder='Item description'
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <input
                          type='text'
                          value={item.sku}
                          onChange={e => handleItemChange(index, 'sku', e.target.value)}
                          className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          placeholder='SKU'
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <input
                          type='number'
                          value={item.quantity}
                          onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                          className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          min='1'
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <input
                          type='number'
                          value={item.costPrice}
                          onChange={e => handleItemChange(index, 'costPrice', e.target.value)}
                          className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          min='0'
                          step='0.01'
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <input
                          type='number'
                          value={item.sellingPricePercentage}
                          onChange={e =>
                            handleItemChange(index, 'sellingPricePercentage', e.target.value)
                          }
                          className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          min='0'
                          step='0.1'
                        />
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900 dark:text-white'>
                        ${calculatedItem.unitPrice.toFixed(2)}
                      </td>
                      <td className='px-4 py-3 text-sm font-medium text-gray-900 dark:text-white'>
                        ${(calculatedItem.quantity * calculatedItem.unitPrice).toFixed(2)}
                      </td>
                      <td className='px-4 py-3'>
                        <button
                          type='button'
                          onClick={() => removeItem(index)}
                          disabled={baseFormData.items.length === 1}
                          className='text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed'
                        >
                          <TrashIcon className='h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Settings and Totals */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Tax Settings
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  VAT Rate (%)
                </label>
                <input
                  type='number'
                  value={baseFormData.vatRate}
                  onChange={e =>
                    setBaseFormData({ ...baseFormData, vatRate: Number(e.target.value) || 0 })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  min='0'
                  step='0.1'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  WHT Rate (%)
                </label>
                <input
                  type='number'
                  value={baseFormData.whtRate}
                  onChange={e =>
                    setBaseFormData({ ...baseFormData, whtRate: Number(e.target.value) || 0 })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  min='0'
                  step='0.1'
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Totals</h3>
            <div className='space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Subtotal:</span>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  ${formData.subtotal.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  VAT ({baseFormData.vatRate}%):
                </span>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  ${formData.vat.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3'>
                <span className='text-lg font-semibold text-gray-900 dark:text-white'>Total:</span>
                <span className='text-lg font-bold text-gray-900 dark:text-white'>
                  ${formData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className='mb-8'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Terms and Conditions
          </label>
          <textarea
            value={baseFormData.terms}
            onChange={e => setBaseFormData({ ...baseFormData, terms: e.target.value })}
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
          />
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-4'>
          <button
            type='button'
            onClick={onCancel}
            className='px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            {quotation ? 'Update Quotation' : 'Create Quotation'}
          </button>
        </div>
      </form>
    </div>
  )
}
