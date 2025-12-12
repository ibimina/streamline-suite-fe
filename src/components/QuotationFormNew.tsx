'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { PlusIcon, TrashIcon } from './Icons'

interface Customer {
  id: string
  name: string
  email: string
  address: string
}

interface Product {
  id: string
  name: string
  sellingPrice: number
  costPrice: number
  description?: string
}

interface QuotationItem {
  product?: string
  name?: string
  description: string
  quantity: number
  unitPrice: number
  discountPercent?: number
  vatRate: number
  unitCost: number
}

interface QuotationFormData {
  customer: string
  customerData?: Customer
  items: QuotationItem[]
  status?: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  validUntil?: string
  notes?: string
  terms?: string
  template?: string
  templateId?: string
  accentColor?: string
}

interface QuotationFormProps {
  quotation?: any
  onSave: (quotation: any) => void
}

const defaultTerms = `
1. This quotation is valid for 30 days from the date of issue.
2. Payment terms: Net 30 days.
3. All prices are exclusive of VAT unless otherwise stated.
4. Acceptance of this quotation constitutes agreement to our terms and conditions.
`

export default function QuotationForm({ quotation, onSave }: QuotationFormProps) {
  // Sample data - replace with API calls
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'ABC Company Ltd',
      email: 'contact@abc.com',
      address: '123 Business St, Lagos',
    },
    { id: '2', name: 'XYZ Corporation', email: 'info@xyz.com', address: '456 Trade Ave, Abuja' },
    {
      id: '3',
      name: 'Tech Solutions Inc',
      email: 'hello@techsol.com',
      address: '789 Innovation Blvd, Lagos',
    },
  ])
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Website Development',
      sellingPrice: 250000,
      costPrice: 150000,
      description: 'Custom website development',
    },
    {
      id: '2',
      name: 'Mobile App',
      sellingPrice: 500000,
      costPrice: 300000,
      description: 'Mobile application development',
    },
    {
      id: '3',
      name: 'Logo Design',
      sellingPrice: 50000,
      costPrice: 20000,
      description: 'Professional logo design',
    },
    {
      id: '4',
      name: 'SEO Package',
      sellingPrice: 100000,
      costPrice: 50000,
      description: 'Search engine optimization',
    },
  ])
  const [customerSearch, setCustomerSearch] = useState('')

  const [formData, setFormData] = useState<QuotationFormData>({
    customer: quotation?.customer || '',
    customerData: undefined,
    items: quotation?.items || [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        vatRate: 7.5,
        unitCost: 0,
      },
    ],
    status: quotation?.status || 'DRAFT',
    validUntil: quotation?.validUntil || '',
    notes: quotation?.notes || '',
    terms: quotation?.terms || defaultTerms,
    template: quotation?.template,
    templateId: quotation?.templateId,
    accentColor: quotation?.accentColor,
  })

  useEffect(() => {
    // Only compute the default validUntil on mount (or when provided quotation changes)
    if (!quotation?.validUntil) {
      const defaultValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      // setFormData(prev => ({ ...prev, validUntil: defaultValidUntil }))
    }
  }, [quotation])

  // Calculate totals
  const calculatedValues = useMemo(() => {
    const calculatedItems = formData.items.map(item => {
      const lineTotal = item.quantity * item.unitPrice
      const discountAmount = lineTotal * ((item.discountPercent || 0) / 100)
      const lineTotalAfterDiscount = lineTotal - discountAmount
      const vatAmount = lineTotalAfterDiscount * (item.vatRate / 100)

      return {
        ...item,
        lineTotal: lineTotalAfterDiscount,
        vatAmount,
      }
    })

    const { subtotal, totalVat } = calculatedItems.reduce(
      (acc, it) => {
        return {
          subtotal: acc.subtotal + it.lineTotal,
          totalVat: acc.totalVat + it.vatAmount,
        }
      },
      { subtotal: 0, totalVat: 0 }
    )

    const grandTotal = subtotal + totalVat

    return {
      items: calculatedItems,
      subtotal,
      totalVat,
      grandTotal,
    }
  }, [formData.items])

  const handleCustomerSelect = (customerId: string) => {
    const customerData = customers.find(c => c.id === customerId)
    setFormData(prev => ({
      ...prev,
      customer: customerId,
      customerData,
    }))
    setCustomerSearch('')
  }

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      const newItems = [...formData.items]
      newItems[index] = {
        ...newItems[index],
        product: productId,
        name: product.name,
        description: product.description || product.name,
        unitPrice: product.sellingPrice,
        unitCost: product.costPrice,
      }
      setFormData(prev => ({ ...prev, items: newItems }))
    }
  }

  const handleItemChange = (index: number, field: keyof QuotationItem, value: string | number) => {
    const newItems = [...formData.items]
    const item = newItems[index]

    if (field === 'description' || field === 'name') {
      ;(item as any)[field] = value as string
    } else {
      ;(item as any)[field] = Number(value) || 0
    }

    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    const newItem: QuotationItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 7.5,
      unitCost: 0,
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customer) {
      alert('Please select a customer')
      return
    }

    if (formData.items.length === 0) {
      alert('Please add at least one item')
      return
    }

    // Prepare data for backend
    const quotationData = {
      customer: formData.customer,
      items: formData.items.map(item => ({
        product: item.product,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent || 0,
        vatRate: item.vatRate,
        unitCost: item.unitCost,
      })),
      status: formData.status,
      validUntil: formData.validUntil,
      notes: formData.notes,
      terms: formData.terms,
      template: formData.template,
      templateId: formData.templateId,
      accentColor: formData.accentColor,
    }

    onSave(quotationData)
  }

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  )

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
              {/* Customer Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Customer *
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search customers...'
                    value={customerSearch}
                    onChange={e => setCustomerSearch(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  />
                  {customerSearch && filteredCustomers.length > 0 && (
                    <div className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                      {filteredCustomers.map(customer => (
                        <div
                          key={customer.id}
                          onClick={() => handleCustomerSelect(customer.id)}
                          className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'
                        >
                          <div className='font-medium text-gray-900 dark:text-gray-100'>
                            {customer.name}
                          </div>
                          <div className='text-sm text-gray-600 dark:text-gray-400'>
                            {customer.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.customerData && (
                  <div className='mt-2 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg'>
                    <div className='font-medium text-gray-900 dark:text-gray-100'>
                      {formData.customerData.name}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      {formData.customerData.email}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      {formData.customerData.address}
                    </div>
                  </div>
                )}
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
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | 'DRAFT'
                        | 'SENT'
                        | 'ACCEPTED'
                        | 'REJECTED'
                        | 'EXPIRED',
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                >
                  <option value='DRAFT'>Draft</option>
                  <option value='SENT'>Sent</option>
                  <option value='ACCEPTED'>Accepted</option>
                  <option value='REJECTED'>Rejected</option>
                  <option value='EXPIRED'>Expired</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Valid Until
                </label>
                <input
                  type='date'
                  value={formData.validUntil}
                  onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Template
                </label>
                <input
                  type='text'
                  value={formData.template || ''}
                  onChange={e => setFormData({ ...formData, template: e.target.value })}
                  placeholder='Quotation template'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
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
                    Product/Description
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Qty
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Unit Price
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Discount %
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
                    VAT %
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
                {formData.items.map((item, index) => {
                  const calculatedItem = calculatedValues.items[index]
                  return (
                    <tr key={item.product || index} className='bg-white dark:bg-gray-800'>
                      <td className='px-4 py-3'>
                        <div className='space-y-2'>
                          {/* Product Selection */}
                          <select
                            value={item.product || ''}
                            onChange={e => handleProductSelect(index, e.target.value)}
                            className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          >
                            <option value=''>Select Product (Optional)</option>
                            {products.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name} - ₦{product.sellingPrice.toLocaleString()}
                              </option>
                            ))}
                          </select>
                          {/* Description */}
                          <input
                            type='text'
                            value={item.description}
                            onChange={e => handleItemChange(index, 'description', e.target.value)}
                            className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                            placeholder='Item description'
                          />
                        </div>
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
                          value={item.unitPrice}
                          onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                          className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          min='0'
                          step='0.01'
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <input
                          type='number'
                          value={item.discountPercent || 0}
                          onChange={e => handleItemChange(index, 'discountPercent', e.target.value)}
                          className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          min='0'
                          max='100'
                          step='0.01'
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <input
                          type='number'
                          value={item.vatRate}
                          onChange={e => handleItemChange(index, 'vatRate', e.target.value)}
                          className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                          min='0'
                          max='100'
                          step='0.01'
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <div className='text-sm text-gray-900 dark:text-gray-100'>
                          ₦{calculatedItem?.lineTotal?.toLocaleString() || '0'}
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <button
                          type='button'
                          onClick={() => removeItem(index)}
                          className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                          disabled={formData.items.length === 1}
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

        {/* Totals Section */}
        <div className='mb-8'>
          <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Quotation Summary
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-700 dark:text-gray-300'>Subtotal:</span>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  ₦{calculatedValues.subtotal.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-700 dark:text-gray-300'>VAT Total:</span>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  ₦{calculatedValues.totalVat.toLocaleString()}
                </span>
              </div>
              <div className='border-t border-gray-300 dark:border-gray-600 pt-2'>
                <div className='flex justify-between text-lg font-semibold'>
                  <span className='text-gray-900 dark:text-white'>Grand Total:</span>
                  <span className='text-gray-900 dark:text-white'>
                    ₦{calculatedValues.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
              placeholder='Additional notes for the quotation...'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Terms & Conditions
            </label>
            <textarea
              value={formData.terms || ''}
              onChange={e => setFormData({ ...formData, terms: e.target.value })}
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
              placeholder='Terms and conditions...'
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={() => window.history.back()}
            className='px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Save Quotation
          </button>
        </div>
      </form>
    </div>
  )
}
