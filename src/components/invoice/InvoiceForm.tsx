'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { PlusIcon, TrashIcon } from '../Icons'
import CustomerForm from '../customer/CustomerForm'
import ProductForm from '../product/ProductForm'
import { Customer } from '@/store/slices/customer/type'
import {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useGetCustomersQuery,
  useGetProductsQuery,
} from '@/store/api'
import { useGetAvailableQuotationsForInvoiceQuery } from '@/store/api/invoiceApi'
import { invoiceSchema, InvoiceFormData, InvoiceItemFormData } from '@/schemas/invoice.schema'
import { Template, AccentColor, CustomTemplate } from '@/types'
import { useRouter } from 'next/navigation'
import { Invoice } from '@/types/invoice.type'
import { Quotation } from '@/types/quotation.type'

// Icon components
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    />
  </svg>
)

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    />
  </svg>
)

const CubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    />
  </svg>
)

const CalculatorIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    />
  </svg>
)

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    />
  </svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
)

const LinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    />
  </svg>
)

interface InvoiceFormProps {
  invoice?: Invoice
  templateConfig?: {
    template: Template
    accentColor: AccentColor
    customTemplate?: CustomTemplate
  }
  isDuplicate?: boolean
}

const defaultTerms = `
1. Payment is due within 30 days from the invoice date.
2. Late payments may incur additional charges.
3. All prices are exclusive of VAT unless otherwise stated.
4. Please include the invoice number as payment reference.
`

const defaultItem: InvoiceItemFormData = {
  description: '',
  quantity: 1,
  unitPrice: 0,
  vatRate: 0,
  unitCost: 0,
  discountPercent: 0,
  product: '',
}

const normalizeStatus = (
  status?: string
): 'Draft' | 'Sent' | 'Paid' | 'Partial' | 'Overdue' | 'Cancelled' => {
  if (!status) return 'Draft'
  const statusMap: Record<string, 'Draft' | 'Sent' | 'Paid' | 'Partial' | 'Overdue' | 'Cancelled'> =
    {
      Draft: 'Draft',
      Sent: 'Sent',
      Paid: 'Paid',
      Partial: 'Partial',
      Overdue: 'Overdue',
      Cancelled: 'Cancelled',
    }
  return statusMap[status] || 'Draft'
}

export default function InvoiceForm({
  invoice,
  templateConfig,
  isDuplicate = false,
}: Readonly<InvoiceFormProps>) {
  const defaultDates = useMemo(() => {
    const today = new Date()
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + 30)
    return {
      issuedDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
    }
  }, [])

  const router = useRouter()

  const { data: customersData } = useGetCustomersQuery()
  const { data: productsData } = useGetProductsQuery()
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation()
  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation()
  const customers = useMemo(
    () => customersData?.payload?.customers || [],
    [customersData?.payload?.customers]
  )
  const products = useMemo(
    () => productsData?.payload?.products || [],
    [productsData?.payload?.products]
  )

  const isEditMode = !!invoice && !isDuplicate

  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    invoice?.customer ? (invoice.customer as unknown as Customer) : null
  )
  const [showForm, setShowForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [showQuotationSelector, setShowQuotationSelector] = useState(false)

  // Get available quotations for linking when customer is selected
  const { data: availableQuotationsData, isLoading: isLoadingQuotations } =
    useGetAvailableQuotationsForInvoiceQuery(selectedCustomer?._id, {
      skip: !selectedCustomer?._id || isEditMode,
    })
  const availableQuotations = useMemo(
    () => availableQuotationsData?.payload || [],
    [availableQuotationsData?.payload]
  )

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormData, unknown, InvoiceFormData>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      customer: '',
      items: [defaultItem],
      status: 'Draft',
      issuedDate: defaultDates.issuedDate,
      dueDate: defaultDates.dueDate,
      poNumber: '',
      notes: '',
      terms: defaultTerms,
      whtRate: 5,
      template: templateConfig?.template,
      accentColor: templateConfig?.accentColor,
    },
  })

  useEffect(() => {
    if (invoice && customers.length > 0) {
      const formatDate = (date: string | Date | undefined) => {
        if (!date) return ''
        return new Date(date).toISOString().split('T')[0]
      }

      const formItems = invoice.items?.map(item => ({
        product: item.product?._id,
        description: item.description || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        vatRate: item.vatRate ?? 0,
        unitCost: item.unitCost || 0,
        discountPercent: item.discountPercent || 0,
      })) || [defaultItem]

      reset({
        customer: invoice.customer._id,
        items: formItems,
        status: normalizeStatus(invoice.status),
        issuedDate: formatDate(invoice.issuedDate) || defaultDates.issuedDate,
        dueDate: formatDate(invoice.dueDate) || defaultDates.dueDate,
        poNumber: invoice.poNumber || '',
        notes: invoice.notes || '',
        terms: invoice.terms || defaultTerms,
        whtRate: invoice.whtRate ?? 0,
        template: templateConfig?.template || invoice.template,
        accentColor: templateConfig?.accentColor || invoice.accentColor,
      })
    }
  }, [invoice, customers, reset, templateConfig, defaultDates])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = useWatch({ control, name: 'items' })
  const watchedWhtRate = useWatch({ control, name: 'whtRate' }) ?? 0

  const calculatedValues = useMemo(() => {
    const totals = {
      subtotal: 0,
      totalDiscount: 0,
      netAmount: 0,
      totalVat: 0,
      totalWht: 0,
      totalCost: 0,
      totalGrossProfit: 0,
      totalNetProfit: 0,
    }

    const calculatedItems = (watchedItems || []).map(item => {
      const lineSubtotal = (item.quantity || 0) * (item.unitPrice || 0)
      const discountAmount = lineSubtotal * ((item.discountPercent || 0) / 100)
      const netAmount = lineSubtotal - discountAmount
      const vatAmount = netAmount * ((item.vatRate || 0) / 100)
      const whtAmount = netAmount * (watchedWhtRate / 100)
      const grossTotal = netAmount + vatAmount
      const netReceivable = grossTotal - whtAmount
      const lineCost = (item.quantity || 0) * (item.unitCost || 0)
      const grossProfit = netAmount - lineCost
      const netProfit = netReceivable - lineCost

      totals.subtotal += lineSubtotal
      totals.totalDiscount += discountAmount
      totals.netAmount += netAmount
      totals.totalVat += vatAmount
      totals.totalWht += whtAmount
      totals.totalCost += lineCost
      totals.totalGrossProfit += grossProfit
      totals.totalNetProfit += netProfit

      return {
        ...item,
        lineSubtotal,
        discountAmount,
        netAmount,
        vatAmount,
        whtAmount,
        grossTotal,
        netReceivable,
        lineCost,
        grossProfit,
        lineProfit: netProfit,
        lineTotal: netAmount,
        lineTotalInclVat: grossTotal,
      }
    })

    const grossTotal = totals.netAmount + totals.totalVat
    const netReceivable = grossTotal - totals.totalWht
    const effectiveVatRate = totals.netAmount > 0 ? (totals.totalVat / totals.netAmount) * 100 : 0

    return {
      items: calculatedItems,
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      netAmount: totals.netAmount,
      totalVat: totals.totalVat,
      vatRate: effectiveVatRate,
      totalWht: totals.totalWht,
      totalCost: totals.totalCost,
      grossTotal,
      netReceivable,
      totalGrossProfit: totals.totalGrossProfit,
      totalNetProfit: totals.totalNetProfit,
      grandTotal: grossTotal,
      netReceivableTotal: netReceivable,
      totalProfit: totals.totalNetProfit,
    }
  }, [watchedItems, watchedWhtRate])

  const handleCustomerSelect = (customerId: string) => {
    const customerData = customers.find(c => c._id === customerId || c.uniqueId === customerId)
    setValue('customer', customerId)
    setSelectedCustomer(customerData || null)
    setCustomerSearch('')
    // Reset quotation selection when customer changes
    setSelectedQuotation(null)
    setShowQuotationSelector(false)
  }

  const handleQuotationSelect = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setShowQuotationSelector(false)

    // Populate form items from quotation
    const quotationItems = quotation.items?.map(item => ({
      product: typeof item.product === 'object' ? item.product._id : item.product || '',
      description: item.description || '',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      vatRate: item.vatRate ?? 0,
      unitCost: item.unitCost || 0,
      discountPercent: item.discountPercent || 0,
    })) || [defaultItem]

    setValue('items', quotationItems)
    setValue('whtRate', quotation.whtRate || 0)
    if (quotation.notes) setValue('notes', quotation.notes)
    if (quotation.terms) setValue('terms', quotation.terms)
    if (quotation.template) setValue('template', quotation.template)
    if (quotation.accentColor) setValue('accentColor', quotation.accentColor)

    toast.success(`Linked to quotation ${quotation.uniqueId}`)
  }

  const handleClearQuotationLink = () => {
    setSelectedQuotation(null)
    toast.info('Quotation link removed')
  }

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p._id === productId)
    if (product) {
      setValue(`items.${index}.product`, productId)
      setValue(`items.${index}.description`, product.description || product.name)
      setValue(`items.${index}.unitPrice`, product.sellingPrice)
      setValue(`items.${index}.unitCost`, product?.costPrice ?? 0)
    }
  }

  const addItem = () => append(defaultItem)

  const removeItem = (index: number) => {
    if (fields.length > 1) remove(index)
  }

  const onSubmit = async (data: InvoiceFormData) => {
    const invoiceData: any = {
      customer: data.customer,
      quotationId: selectedQuotation?._id || undefined,
      items: data.items.map(item => ({
        product: item.product || undefined,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent || 0,
        vatRate: item.vatRate || 0,
        unitCost: item.unitCost || 0,
      })),
      status: data.status, // Convert to lowercase for backend enum
      dueDate: data.dueDate || defaultDates.dueDate,
      poNumber: data.poNumber || undefined,
      notes: data.notes || undefined,
      terms: data.terms || undefined,
      template: data.template || undefined,
      accentColor: data.accentColor || undefined,
      whtRate: data.whtRate || 0,
      issuedDate: data.issuedDate || defaultDates.issuedDate,
    }

    try {
      if (isEditMode && invoice?._id) {
        await updateInvoice({ id: invoice._id, data: invoiceData }).unwrap()
        toast.success('Invoice updated successfully!')
        router.push('/invoices')
      } else {
        await createInvoice(invoiceData).unwrap()
        toast.success('Invoice created successfully!')
        router.push('/invoices')
      }
    } catch (error: any) {
      console.error('Failed to save invoice:', error)
      toast.error(
        error?.data?.message ||
          error?.message ||
          `Failed to ${isEditMode ? 'update' : 'create'} invoice.`
      )
    }
  }

  const filteredCustomers = customers.filter(
    customer =>
      customer?.companyName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer?.email?.toLowerCase().includes(customerSearch.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Draft: 'bg-muted text-foreground  ',
      Sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      Cancelled: 'bg-muted text-foreground  ',
    }
    return colors[status] || colors.Draft
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Form-level errors */}
        {(errors.customer || errors.items) && (
          <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg'>
            <div className='flex items-center'>
              <svg className='h-5 w-5 text-red-500 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                {errors.customer && (
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    {errors.customer.message}
                  </p>
                )}
                {errors.items && (
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    {errors.items.message || errors.items.root?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Top Section - Customer & Invoice Details */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Customer Card */}
          <div className='lg:col-span-2 bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
            <div className='bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-white/20 rounded-lg'>
                  <UserIcon className='h-5 w-5 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-white'>Customer Information</h3>
              </div>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                <div className='flex gap-3'>
                  <div className='flex-1 relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <SearchIcon className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <input
                      type='text'
                      placeholder='Search customers by name or email...'
                      value={customerSearch}
                      onChange={e => setCustomerSearch(e.target.value)}
                      className='w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-card text-foreground transition-all'
                    />
                    {customerSearch && filteredCustomers.length > 0 && (
                      <div className='absolute z-20 w-full mt-2 bg-card border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto'>
                        {filteredCustomers.map(customer => (
                          <button
                            type='button'
                            key={customer._id}
                            onClick={() => handleCustomerSelect(customer._id)}
                            className='w-full text-left px-4 py-3 hover:bg-accent  cursor-pointer border-b border-border  last:border-b-0 transition-colors'
                          >
                            <div className='font-medium text-foreground'>
                              {customer.companyName || customer.fullName}
                            </div>
                            <div className='text-sm text-muted-foreground'>{customer.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowForm(true)}
                    className='px-5 py-3 bg-linear-to-r from-primary to-primary-hover text-white font-medium rounded-xl hover:from-primary hover:to-primary-hover transition-all shadow-sm flex items-center gap-2'
                  >
                    <PlusIcon className='h-4 w-4' />
                    <span className='hidden sm:inline'>New Customer</span>
                  </button>
                </div>

                {selectedCustomer && (
                  <div className='bg-linear-to-br from-muted to-accent rounded-xl p-4 border border-border'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                          {(selectedCustomer.companyName || selectedCustomer.fullName)
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className='font-semibold text-foreground'>
                            {selectedCustomer.companyName || selectedCustomer.fullName}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {selectedCustomer.email}
                          </div>
                          {selectedCustomer.address && (
                            <div className='text-sm text-muted-foreground mt-1'>
                              📍 {selectedCustomer.address}
                            </div>
                          )}
                        </div>
                      </div>
                      <CheckCircleIcon className='h-6 w-6 text-green-500' />
                    </div>
                  </div>
                )}

                {/* Quotation Linking Section */}
                {selectedCustomer && !isEditMode && (
                  <div className='mt-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='text-sm font-medium text-secondary-foreground'>
                        Link Quotation{' '}
                        <span className='text-muted-foreground font-normal'>(Optional)</span>
                      </label>
                    </div>

                    {selectedQuotation ? (
                      <div className='flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl'>
                        <LinkIcon className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                        <div className='flex-1'>
                          <span className='text-sm text-blue-800 dark:text-blue-200'>
                            Linked to: <strong>{selectedQuotation.uniqueId}</strong>
                            <span className='ml-2 text-blue-600 dark:text-blue-400'>
                              (₦{(selectedQuotation.grandTotal || 0).toLocaleString()})
                            </span>
                          </span>
                        </div>
                        <button
                          type='button'
                          onClick={handleClearQuotationLink}
                          className='px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors'
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type='button'
                        onClick={() => setShowQuotationSelector(!showQuotationSelector)}
                        disabled={isLoadingQuotations || availableQuotations.length === 0}
                        className='w-full text-left px-4 py-3 border border-border rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-accent dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <LinkIcon className='h-5 w-5 text-muted-foreground' />
                        <span className='text-muted-foreground'>
                          {isLoadingQuotations
                            ? 'Loading quotations...'
                            : availableQuotations.length === 0
                              ? 'No available quotations for this customer'
                              : `Link to existing quotation (${availableQuotations.length} available)`}
                        </span>
                      </button>
                    )}

                    {/* Quotation Selector Dropdown */}
                    {showQuotationSelector && availableQuotations.length > 0 && (
                      <div className='mt-2 border border-border rounded-xl bg-card shadow-lg max-h-60 overflow-y-auto'>
                        {availableQuotations.map(quotation => (
                          <button
                            type='button'
                            key={quotation._id}
                            onClick={() => handleQuotationSelect(quotation)}
                            className='w-full text-left px-4 py-3 hover:bg-accent  cursor-pointer border-b border-border  last:border-b-0 transition-colors'
                          >
                            <div className='flex items-center justify-between'>
                              <div>
                                <div className='font-medium text-foreground'>
                                  {quotation.uniqueId}
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  {quotation.items?.length || 0} items •{' '}
                                  {new Date(quotation.createdAt || '').toLocaleDateString()}
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='font-medium text-foreground'>
                                  ₦{(quotation.grandTotal || 0).toLocaleString()}
                                </div>
                                <div className='text-xs text-muted-foreground capitalize'>
                                  {quotation.status}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Details Card */}
          <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
            <div className='bg-linear-to-r from-purple-500 to-purple-600 px-6 py-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-white/20 rounded-lg'>
                  <DocumentIcon className='h-5 w-5 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-white'>Invoice Details</h3>
              </div>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label
                  htmlFor='status'
                  className='block text-sm font-medium text-secondary-foreground mb-2'
                >
                  Status
                </label>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id='status'
                      className={`w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500   font-medium ${getStatusColor(field.value || 'Draft')}`}
                    >
                      <option value='Draft'>📝 Draft</option>
                      <option value='Sent'>📤 Sent</option>
                      <option value='Paid'>✅ Paid</option>
                      <option value='Partial'>⏳ Partial</option>
                      <option value='Overdue'>⚠️ Overdue</option>
                      <option value='Cancelled'>❌ Cancelled</option>
                    </select>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor='poNumber'
                  className='block text-sm font-medium text-secondary-foreground mb-2'
                >
                  PO Number <span className='text-muted-foreground font-normal'>(Optional)</span>
                </label>
                <input
                  type='text'
                  id='poNumber'
                  {...register('poNumber')}
                  placeholder='e.g., PO-2024-001'
                  className='w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500  '
                />
              </div>
              <div>
                <label
                  htmlFor='issuedDate'
                  className='block text-sm font-medium text-secondary-foreground mb-2'
                >
                  Issue Date
                </label>
                <input
                  type='date'
                  id='issuedDate'
                  {...register('issuedDate')}
                  className='w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500  '
                />
              </div>
              <div>
                <label
                  htmlFor='dueDate'
                  className='block text-sm font-medium text-secondary-foreground mb-2'
                >
                  Due Date
                </label>
                <input
                  id='dueDate'
                  type='date'
                  {...register('dueDate')}
                  className='w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500  '
                />
              </div>
              <div>
                <label
                  htmlFor='template'
                  className='block text-sm font-medium text-secondary-foreground mb-2'
                >
                  Template
                </label>
                <input
                  type='text'
                  id='template'
                  {...register('template')}
                  placeholder='e.g., Professional, Modern'
                  className='w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500  '
                />
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Card */}
        <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
          <div className='bg-linear-to-r from-primary to-primary-hover px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-white/20 rounded-lg'>
                  <CubeIcon className='h-5 w-5 text-white' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-white'>Line Items</h3>
                  <p className='text-primary-foreground/80 text-sm'>
                    {fields.length} item{fields.length > 1 ? 's' : ''} added
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setShowProductForm(true)}
                  className='bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 font-medium border border-white/30'
                >
                  <PlusIcon className='h-4 w-4' />
                  New Product
                </button>
                <button
                  type='button'
                  onClick={addItem}
                  className='bg-white text-primary px-4 py-2 rounded-lg hover:bg-primary-light transition-colors flex items-center gap-2 font-medium shadow-sm'
                >
                  <PlusIcon className='h-4 w-4' />
                  Add Item
                </button>
              </div>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-muted/50'>
                <tr>
                  <th className='px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Product/Description
                  </th>
                  <th className='px-3 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20'>
                    Qty
                  </th>
                  <th className='px-3 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28'>
                    Unit Cost
                  </th>
                  <th className='px-3 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28'>
                    Unit Price
                  </th>
                  <th className='px-3 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20'>
                    Disc %
                  </th>
                  <th className='px-3 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20'>
                    VAT %
                  </th>
                  <th className='px-3 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28'>
                    Total
                  </th>
                  <th className='px-3 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28'>
                    Profit
                  </th>
                  <th className='px-3 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {fields.map((field, index) => {
                  const calculatedItem = calculatedValues.items[index]
                  return (
                    <tr key={field.id} className='bg-card hover:bg-muted  transition-colors'>
                      <td className='px-4 py-4'>
                        <Controller
                          name={`items.${index}.product`}
                          control={control}
                          render={({ field: productField }) => (
                            <select
                              {...productField}
                              value={productField.value || ''}
                              onChange={e => {
                                productField.onChange(e.target.value)
                                if (e.target.value) handleProductSelect(index, e.target.value)
                              }}
                              className='w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary   bg-muted'
                            >
                              <option value=''>Select Product (Optional)</option>
                              {products.map(product => (
                                <option key={product._id} value={product._id}>
                                  {product.name} - ₦{product.sellingPrice.toLocaleString()}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      </td>
                      <td className='px-3 py-4'>
                        <Controller
                          name={`items.${index}.quantity`}
                          control={control}
                          render={({ field: qtyField }) => (
                            <input
                              type='number'
                              {...qtyField}
                              onChange={e => qtyField.onChange(Number(e.target.value) || 0)}
                              className={`w-full px-2 py-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   ${errors.items?.[index]?.quantity ? 'border-red-500 bg-red-50' : 'border-border bg-muted'}`}
                              min='1'
                            />
                          )}
                        />
                      </td>
                      <td className='px-3 py-4'>
                        <Controller
                          name={`items.${index}.unitCost`}
                          control={control}
                          render={({ field: costField }) => (
                            <input
                              type='number'
                              {...costField}
                              onChange={e => costField.onChange(Number(e.target.value) || 0)}
                              className={`w-full px-2 py-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   ${errors.items?.[index]?.unitCost ? 'border-red-500 bg-red-50' : 'border-border bg-muted'}`}
                              min='0'
                              step='0.01'
                            />
                          )}
                        />
                      </td>
                      <td className='px-3 py-4'>
                        <Controller
                          name={`items.${index}.unitPrice`}
                          control={control}
                          render={({ field: priceField }) => (
                            <input
                              type='number'
                              {...priceField}
                              onChange={e => priceField.onChange(Number(e.target.value) || 0)}
                              className={`w-full px-2 py-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   ${errors.items?.[index]?.unitPrice ? 'border-red-500 bg-red-50' : 'border-border bg-muted'}`}
                              min='0'
                              step='0.01'
                            />
                          )}
                        />
                      </td>
                      <td className='px-3 py-4'>
                        <Controller
                          name={`items.${index}.discountPercent`}
                          control={control}
                          render={({ field: discountField }) => (
                            <input
                              type='number'
                              {...discountField}
                              value={discountField.value || 0}
                              onChange={e => discountField.onChange(Number(e.target.value) || 0)}
                              className='w-full px-2 py-2 text-sm text-center border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   bg-muted'
                              min='0'
                              max='100'
                              step='0.01'
                            />
                          )}
                        />
                      </td>
                      <td className='px-3 py-4'>
                        <Controller
                          name={`items.${index}.vatRate`}
                          control={control}
                          render={({ field: vatField }) => (
                            <input
                              type='number'
                              {...vatField}
                              onChange={e => vatField.onChange(Number(e.target.value) || 0)}
                              className={`w-full px-2 py-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   ${errors.items?.[index]?.vatRate ? 'border-red-500 bg-red-50' : 'border-border bg-muted'}`}
                              min='0'
                              max='100'
                              step='0.01'
                            />
                          )}
                        />
                      </td>
                      <td className='px-3 py-4 text-right'>
                        <span className='text-sm font-semibold text-foreground'>
                          ₦
                          {calculatedItem?.lineTotal?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          }) || '0.00'}
                        </span>
                      </td>
                      <td className='px-3 py-4 text-right'>
                        <span
                          className={`text-sm font-bold px-2 py-1 rounded-md ${(calculatedItem?.lineProfit || 0) >= 0 ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'}`}
                        >
                          ₦
                          {calculatedItem?.lineProfit?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || '0.00'}
                        </span>
                      </td>
                      <td className='px-3 py-4 text-center'>
                        <button
                          type='button'
                          onClick={() => removeItem(index)}
                          className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                          disabled={fields.length === 1}
                          title='Remove item'
                        >
                          <TrashIcon className='h-5 w-5' />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary Card */}
        <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
          <div className='bg-linear-to-r from-amber-500 to-amber-600 px-6 py-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <CalculatorIcon className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className='text-lg font-semibold text-white'>Invoice Summary</h3>
                <p className='text-amber-100 text-sm'>Financial breakdown & profit analysis</p>
              </div>
            </div>
          </div>

          <div className='p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Left column - Pricing */}
              <div className='space-y-4'>
                <h4 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                  Pricing Details
                </h4>
                <div className='bg-muted/50 rounded-xl p-5 space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Subtotal</span>
                    <span className='font-semibold text-foreground text-lg'>
                      ₦
                      {calculatedValues.subtotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-blue-500'></span>
                      VAT ({calculatedValues.vatRate.toFixed(1)}%)
                    </span>
                    <span className='font-medium text-blue-600 dark:text-blue-400'>
                      +₦
                      {calculatedValues.totalVat.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className='border-t border-border pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-foreground font-semibold text-lg'>Grand Total</span>
                      <span className='font-bold text-2xl text-foreground'>
                        ₦
                        {calculatedValues.grandTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - WHT & Profit */}
              <div className='space-y-4'>
                <h4 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                  Profit Analysis
                </h4>
                <div className='bg-muted/50 rounded-xl p-5 space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground flex items-center gap-2'>
                      WHT Rate
                      <Controller
                        name='whtRate'
                        control={control}
                        render={({ field }) => (
                          <input
                            type='number'
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            className='w-16 px-2 py-1 text-sm text-center border border-border  rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500  '
                            min='0'
                            max='100'
                            step='0.5'
                          />
                        )}
                      />
                      <span className='text-muted-foreground'>%</span>
                    </span>
                    <span className='font-medium text-red-600 dark:text-red-400 flex items-center gap-1'>
                      <span className='w-2 h-2 rounded-full bg-red-500'></span>
                      -₦
                      {calculatedValues.totalWht.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Net Receivable</span>
                    <span className='font-semibold text-foreground'>
                      ₦
                      {calculatedValues.netReceivableTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Total Cost</span>
                    <span className='font-medium text-secondary-foreground'>
                      ₦
                      {calculatedValues.totalCost.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className='border-t border-border pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-foreground font-semibold text-lg flex items-center gap-2'>
                        📈 Expected Profit
                      </span>
                      <span
                        className={`font-bold text-2xl px-4 py-1 rounded-lg ${calculatedValues.totalProfit >= 0 ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'}`}
                      >
                        ₦
                        {calculatedValues.totalProfit.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms Card */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
            <div className='bg-linear-to-r from-secondary to-muted px-5 py-3'>
              <div className='flex items-center gap-2'>
                <div className='p-1.5 bg-white/20 rounded-lg'>
                  <ClipboardIcon className='h-4 w-4 text-white' />
                </div>
                <h4 className='text-sm font-semibold text-white'>Notes</h4>
              </div>
            </div>
            <div className='p-4'>
              <textarea
                {...register('notes')}
                rows={4}
                className='w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-border   resize-none text-sm'
                placeholder='Add any additional notes for this invoice...'
              />
            </div>
          </div>

          <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
            <div className='bg-linear-to-r from-indigo-600 to-indigo-700 px-5 py-3'>
              <div className='flex items-center gap-2'>
                <div className='p-1.5 bg-white/20 rounded-lg'>
                  <DocumentIcon className='h-4 w-4 text-white' />
                </div>
                <h4 className='text-sm font-semibold text-white'>Terms & Conditions</h4>
              </div>
            </div>
            <div className='p-4'>
              <textarea
                {...register('terms')}
                rows={4}
                className='w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500   resize-none text-sm'
                placeholder='Enter terms and conditions for this invoice...'
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='bg-card rounded-xl shadow-sm border border-border px-6 py-5'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-muted-foreground'>
              {invoice
                ? 'Update the invoice details above'
                : 'Review all details before saving your invoice'}
            </p>
            <div className='flex gap-3'>
              <button
                type='button'
                onClick={() => router.back()}
                className='px-6 py-2.5 border-2 border-border text-secondary-foreground rounded-xl hover:bg-muted  transition-all font-medium'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isCreating || isUpdating}
                className='px-8 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isCreating || isUpdating ? (
                  <>
                    <svg
                      className='animate-spin h-5 w-5'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    {isEditMode ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className='h-5 w-5' />
                    {isEditMode ? 'Update Invoice' : 'Save Invoice'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {showForm && <CustomerForm customer={null} onCancel={() => setShowForm(false)} open={true} />}
      {showProductForm && (
        <ProductForm product={null} onCancel={() => setShowProductForm(false)} open={true} />
      )}
    </div>
  )
}
