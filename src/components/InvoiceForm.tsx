'use client'
import React, { useState, useMemo } from 'react'
import {
  Invoice,
  InvoiceStatus,
  InvoiceLineItem,
  Template,
  AccentColor,
  CustomTemplate,
} from '@/types'
import { defaultTerms } from './Invoices'
import { Customer } from './customer/Customers'
import { Product } from './Products'
import { PlusIcon, TrashIcon } from './Icons'

interface InvoiceItem {
  product?: string // Product ID
  productName?: string // Product name for display
  description: string
  quantity: number
  unitPrice: number
  discountPercent?: number
  vatRate: number
  subjectToWHT?: boolean
  whtRate?: number
  unitCost: number
}

interface InvoiceFormData {
  quotation?: string // Quotation ID if converted
  customer: string // Customer ID (required)
  customerData?: Customer // Full customer data for display
  items: InvoiceItem[]
  status?: InvoiceStatus
  dueDate?: string
  notes?: string
  terms?: string
  template?: string
  templateId?: string
  accentColor?: string
}

interface InvoiceFormProps {
  invoice: Partial<Invoice> | null
  templateConfig?: {
    template: Template
    accentColor: AccentColor
    customTemplate?: CustomTemplate
  }
  onSave: (invoice: Invoice) => void
  onCancel: () => void
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  templateConfig,
  onSave,
  onCancel,
}) => {
  const now = new Date()

  // Sample data - replace with API calls
  const [customers] = useState<Customer[]>([
    // {
    //   id: '1',
    //   name: 'Tech Solutions Inc.',
    //   email: 'contact@techsolutions.com',
    //   phone: '+1 555-123-4567',
    //   address: '123 Business St',
    //   taxId: 'TAX123',
    //   creditLimit: 50000,
    //   tags: ['VIP'],
    //   isActive: true
    // },
    // {
    //   id: '2',
    //   name: 'Global Corp',
    //   email: 'admin@globalcorp.com',
    //   phone: '+1 555-987-6543',
    //   address: '456 Corporate Ave',
    //   taxId: 'TAX789',
    //   creditLimit: 75000,
    //   tags: ['Regular'],
    //   isActive: true
    // },
  ])

  const [products] = useState<Product[]>([
    {
      id: '1',
      sku: 'LAPTOP-001',
      name: 'Dell Laptop Inspiron 15',
      description: 'High-performance laptop',
      type: 'product',
      trackInventory: true,
      costPrice: 800,
      sellingPrice: 1200,
      unit: 'pcs',
      currentStock: 25,
      minStock: 5,
      lowStockAlert: 10,
      isActive: true,
      trackSerialNumber: false,
      trackExpiryDate: false,
      barcode: '',
    },
    {
      id: '2',
      sku: 'SERV-001',
      name: 'IT Consultation Service',
      description: 'Professional IT consultation',
      type: 'service',
      trackInventory: false,
      costPrice: 0,
      sellingPrice: 150,
      unit: 'hour',
      currentStock: 0,
      minStock: 0,
      lowStockAlert: 0,
      isActive: true,
      trackSerialNumber: false,
      trackExpiryDate: false,
      barcode: '',
    },
  ])
  const [customerMode, setCustomerMode] = useState<'select' | 'create' | 'manual'>('select')
  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  })
  const [manualCustomer, setManualCustomer] = useState({
    name: '',
    address: '',
    email: '',
  })

  const [formData, setFormData] = useState<InvoiceFormData>({
    quotation: invoice?.quotationId,
    customer: invoice?.clientName || '',
    customerData: undefined,
    items: invoice?.items
      ? invoice.items.map(item => ({
          product: undefined,
          productName: undefined,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountPercent: 0,
          vatRate: 7.5,
          subjectToWHT: false,
          whtRate: 0,
          unitCost: 0,
        }))
      : [
          {
            description: '',
            quantity: 1,
            unitPrice: 0,
            vatRate: 7.5,
            unitCost: 0,
          },
        ],
    status: invoice?.status || 'Draft',
    dueDate:
      invoice?.dueDate ||
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: invoice?.terms || '',
    terms: invoice?.terms || defaultTerms,
    template: invoice?.template || templateConfig?.template,
    templateId: invoice?.templateId || templateConfig?.customTemplate?.id,
    accentColor: invoice?.accentColor || templateConfig?.accentColor,
  })

  // Calculate totals
  const calculatedValues = useMemo(() => {
    const totals = {
      subtotal: 0,
      totalVat: 0,
      totalWht: 0,
    }

    const calculatedItems = formData.items.map(item => {
      const lineTotal = item.quantity * item.unitPrice
      const discountAmount = lineTotal * ((item.discountPercent || 0) / 100)
      const lineTotalAfterDiscount = lineTotal - discountAmount
      const vatAmount = lineTotalAfterDiscount * (item.vatRate / 100)
      const whtAmount =
        item.subjectToWHT && item.whtRate ? lineTotalAfterDiscount * (item.whtRate / 100) : 0

      totals.subtotal += lineTotalAfterDiscount
      totals.totalVat += vatAmount
      totals.totalWht += whtAmount

      return {
        ...item,
        lineTotal: lineTotalAfterDiscount,
        vatAmount,
        whtAmount,
      }
    })

    const grandTotal = totals.subtotal + totals.totalVat - totals.totalWht

    return {
      items: calculatedItems,
      subtotal: totals.subtotal,
      totalVat: totals.totalVat,
      totalWht: totals.totalWht,
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
        productName: product.name,
        description: product.description || product.name,
        unitPrice: product.sellingPrice,
        unitCost: product.costPrice,
      }
      setFormData(prev => ({ ...prev, items: newItems }))
    }
  }

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number | boolean
  ) => {
    const newItems = [...formData.items]
    const item = newItems[index]

    if (field === 'description' || field === 'productName') {
      ;(item as any)[field] = value as string
    } else if (field === 'subjectToWHT') {
      ;(item as any)[field] = value as boolean
    } else {
      ;(item as any)[field] = Number(value) || 0
    }

    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
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
    const invoiceData = {
      quotation: formData.quotation,
      customer: formData.customer,
      items: formData.items.map(item => ({
        product: item.product,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent || 0,
        vatRate: item.vatRate,
        subjectToWHT: item.subjectToWHT || false,
        whtRate: item.whtRate || 0,
        unitCost: item.unitCost,
      })),
      status: formData.status,
      dueDate: formData.dueDate,
      notes: formData.notes,
      terms: formData.terms,
      template: formData.template,
      templateId: formData.templateId,
      accentColor: formData.accentColor,
    }

    onSave(invoiceData as any)
  }

  const filteredCustomers: any = []
  // customers.filter(customer =>
  // customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
  // customer?.email.toLowerCase().includes(customerSearch.toLowerCase())
  // )

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
              {/* Customer Mode Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Customer *
                </label>
                <div className='flex gap-2 mb-3'>
                  <button
                    type='button'
                    onClick={() => setCustomerMode('select')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      customerMode === 'select'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Select Existing
                  </button>
                  <button
                    type='button'
                    onClick={() => setCustomerMode('create')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      customerMode === 'create'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Create New Customer
                  </button>
                  <button
                    type='button'
                    onClick={() => setCustomerMode('manual')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      customerMode === 'manual'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Manual Entry
                  </button>
                </div>

                {/* Select Existing Customer */}
                {customerMode === 'select' && (
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
                        {filteredCustomers.map((customer: any) => (
                          <div
                            key={customer.id}
                            onClick={() => customer.id && handleCustomerSelect(customer.id)}
                            className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'
                          >
                            {/* <div className="font-medium text-gray-900 dark:text-gray-100">
                              {customer.name}
                            </div> */}
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                              {customer.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {formData.customerData && (
                      <div className='mt-2 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg'>
                        {/* <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formData.customerData.name}
                        </div> */}
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          {formData.customerData.email}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          {formData.customerData.address}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Create New Customer */}
                {customerMode === 'create' && (
                  <div className='space-y-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700'>
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        type='text'
                        placeholder='Customer Name *'
                        value={newCustomer.name}
                        onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      />
                      <input
                        type='email'
                        placeholder='Email *'
                        value={newCustomer.email}
                        onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        type='tel'
                        placeholder='Phone'
                        value={newCustomer.phone}
                        onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      />
                      <input
                        type='text'
                        placeholder='Tax ID'
                        value={newCustomer.taxId}
                        onChange={e => setNewCustomer({ ...newCustomer, taxId: e.target.value })}
                        className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      />
                    </div>
                    <textarea
                      placeholder='Address *'
                      value={newCustomer.address}
                      onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      rows={2}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        // Handle create customer logic here

                        // After successful creation, switch back to select mode
                        setCustomerMode('select')
                      }}
                      className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm'
                    >
                      Create Customer
                    </button>
                  </div>
                )}

                {/* Manual Entry */}
                {customerMode === 'manual' && (
                  <div className='space-y-3'>
                    <input
                      type='text'
                      placeholder='Customer Name *'
                      value={manualCustomer.name}
                      onChange={e => setManualCustomer({ ...manualCustomer, name: e.target.value })}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    />
                    <input
                      type='email'
                      placeholder='Email'
                      value={manualCustomer.email}
                      onChange={e =>
                        setManualCustomer({ ...manualCustomer, email: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    />
                    <textarea
                      placeholder='Address *'
                      value={manualCustomer.address}
                      onChange={e =>
                        setManualCustomer({ ...manualCustomer, address: e.target.value })
                      }
                      rows={2}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    />
                  </div>
                )}
              </div>

              {/* Quotation Reference (Optional) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Quotation Reference (Optional)
                </label>
                <input
                  type='text'
                  value={formData.quotation || ''}
                  onChange={e => setFormData({ ...formData, quotation: e.target.value })}
                  placeholder='Quote reference or ID'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Invoice Details
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={e =>
                    setFormData({ ...formData, status: e.target.value as InvoiceStatus })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                >
                  <option value='Draft'>Draft</option>
                  <option value='Sent'>Sent</option>
                  <option value='Paid'>Paid</option>
                  <option value='Overdue'>Overdue</option>
                  <option value='Cancelled'>Cancelled</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Due Date
                </label>
                <input
                  type='date'
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Template
                </label>
                <input
                  type='text'
                  value={formData.template}
                  onChange={e => setFormData({ ...formData, template: e.target.value })}
                  placeholder='Invoice template'
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
                    WHT
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
                  const itemKey = item.product || `item-${index}-${item.description.slice(0, 10)}`
                  return (
                    <tr key={itemKey} className='bg-white dark:bg-gray-800'>
                      <td className='px-4 py-3'>
                        <div className='space-y-2'>
                          {/* Product Selection */}
                          <div className='flex gap-1'>
                            <select
                              value={item.product || ''}
                              onChange={e => handleProductSelect(index, e.target.value)}
                              className='flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                            >
                              <option value=''>Select Product (Optional)</option>
                              {products.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.name} - ${product.sellingPrice}
                                </option>
                              ))}
                            </select>
                            <button
                              type='button'
                              onClick={() => {
                                // Handle create new product logic
                              }}
                              className='px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700'
                              title='Create New Product'
                            >
                              +
                            </button>
                          </div>
                          {/* Description */}
                          <input
                            type='text'
                            value={item.description}
                            onChange={e => handleItemChange(index, 'description', e.target.value)}
                            className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                            placeholder='Product name or description'
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
                        <div className='space-y-1'>
                          <label className='flex items-center text-xs'>
                            <input
                              type='checkbox'
                              checked={item.subjectToWHT || false}
                              onChange={e =>
                                handleItemChange(index, 'subjectToWHT', e.target.checked)
                              }
                              className='mr-1'
                            />
                            Subject to WHT
                          </label>
                          {item.subjectToWHT && (
                            <input
                              type='number'
                              value={item.whtRate || 0}
                              onChange={e => handleItemChange(index, 'whtRate', e.target.value)}
                              className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                              min='0'
                              max='100'
                              step='0.01'
                              placeholder='WHT %'
                            />
                          )}
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
              Invoice Summary
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-700 dark:text-gray-300'>Subtotal:</span>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  ${calculatedValues.subtotal.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-700 dark:text-gray-300'>VAT Total:</span>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  ${calculatedValues.totalVat.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-700 dark:text-gray-300'>WHT Total:</span>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  -${calculatedValues.totalWht.toFixed(2)}
                </span>
              </div>
              <div className='border-t border-gray-300 dark:border-gray-600 pt-2'>
                <div className='flex justify-between text-lg font-semibold'>
                  <span className='text-gray-900 dark:text-white'>Grand Total:</span>
                  <span className='text-gray-900 dark:text-white'>
                    ${calculatedValues.grandTotal.toFixed(2)}
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
              placeholder='Additional notes for the invoice...'
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
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  )
}
