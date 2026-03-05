'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { PlusIcon, TrashIcon } from '../Icons'
import CustomerForm from '../customer/CustomerForm'
import ProductForm from '../product/ProductForm'
import { Customer } from '@/interface/customer.interface'
import {
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useGetCustomersQuery,
  useGetProductsQuery,
} from '@/store/api'
import {
  quotationSchema,
  QuotationFormData,
  QuotationItemFormData,
} from '@/schemas/quotation.schema'
import { DEFAULT_QUOTATION_TERMS } from '@/contants'
import { useCurrency } from '@/hooks/useCurrency'
import { Template, AccentColor, CustomTemplate } from '@/types'
import { useRouter } from 'next/navigation'
import { Quotation } from '@/types/quotation.type'

// Icon components for better UI
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

interface QuotationFormProps {
  quotation?: Quotation
  templateConfig?: {
    templateName: Template
    accentColor: AccentColor | string
    customTemplate?: CustomTemplate
  }
  isDuplicate?: boolean
}

// Move defaultItem outside the component to avoid useEffect dependency issues
const defaultItem: QuotationItemFormData = {
  description: '',
  quantity: 1,
  unitPrice: 0,
  vatRate: 7.5,
  unitCost: 0,
  discountPercent: 0,
  product: '',
}

// Helper to normalize status to form's expected format
const normalizeStatus = (
  status?: string
): 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted' => {
  if (!status) return 'Draft'
  const statusMap: Record<
    string,
    'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted'
  > = {
    draft: 'Draft',
    sent: 'Sent',
    viewed: 'Viewed',
    accepted: 'Accepted',
    rejected: 'Rejected',
    expired: 'Expired',
    converted: 'Converted',
    Draft: 'Draft',
    Sent: 'Sent',
    Viewed: 'Viewed',
    Accepted: 'Accepted',
    Rejected: 'Rejected',
    Expired: 'Expired',
    Converted: 'Converted',
  }
  return statusMap[status] || 'Draft'
}

export default function QuotationForm({
  quotation,
  templateConfig,
  isDuplicate = false,
}: Readonly<QuotationFormProps>) {
  // Calculate default dates once on component mount
  const defaultDates = useMemo(() => {
    const today = new Date()
    const validUntilDate = new Date(today)
    validUntilDate.setDate(validUntilDate.getDate() + 30)
    return {
      issuedDate: today.toISOString().split('T')[0],
      validUntil: validUntilDate.toISOString().split('T')[0],
    }
  }, [])
  const router = useRouter()
  const { formatCurrency } = useCurrency()

  // Fetch customers and products from API
  const { data: customersData } = useGetCustomersQuery()
  const { data: productsData } = useGetProductsQuery()
  const [createQuotation, { isLoading: isCreating }] = useCreateQuotationMutation()
  const [updateQuotation, { isLoading: isUpdating }] = useUpdateQuotationMutation()
  const customers = useMemo(
    () => customersData?.payload?.customers || [],
    [customersData?.payload?.customers]
  )
  const products = useMemo(
    () => productsData?.payload?.products || [],
    [productsData?.payload?.products]
  )

  const isEditMode = !!quotation && !isDuplicate

  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    quotation?.customer ? (quotation.customer as unknown as Customer) : null
  )
  const [showForm, setShowForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)

  // Initialize react-hook-form with Zod validation
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuotationFormData, unknown, QuotationFormData>({
    resolver: zodResolver(quotationSchema) as any,
    defaultValues: {
      customer: '',
      items: [defaultItem],
      status: 'Draft',
      issuedDate: defaultDates.issuedDate,
      validUntil: defaultDates.validUntil,
      notes: '',
      terms: DEFAULT_QUOTATION_TERMS,
      whtRate: 5,
      templateName: templateConfig?.templateName,
      accentColor: templateConfig?.accentColor,
    },
  })

  // Pre-populate form when quotation prop is provided (edit mode)
  useEffect(() => {
    if (quotation && customers.length > 0) {
      // Format dates for input fields
      const formatDate = (date: string | Date | undefined) => {
        if (!date) return ''
        return new Date(date).toISOString().split('T')[0]
      }

      // Map quotation items to form items
      const formItems = quotation.items?.map(item => ({
        product: item.product?._id,
        description: item.description || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        vatRate: item.vatRate ?? 0,
        unitCost: item.unitCost || 0,
        discountPercent: item.discountPercent || 0,
      })) || [defaultItem]

      // Reset form with quotation data
      reset({
        customer: quotation.customer._id,
        items: formItems,
        status: normalizeStatus(quotation.status),
        issuedDate: formatDate(quotation.issuedDate) || defaultDates.issuedDate,
        validUntil: formatDate(quotation.validUntil) || defaultDates.validUntil,

        notes: quotation.notes || '',
        terms: quotation.terms || DEFAULT_QUOTATION_TERMS,
        whtRate: quotation.whtRate ?? 5,
        templateName: templateConfig?.templateName || quotation.templateName,
        template: quotation?.template?._id || undefined,
        accentColor: templateConfig?.accentColor || quotation.accentColor,
      })
    }
  }, [quotation, customers, reset, templateConfig, defaultDates])

  // Update template fields when templateConfig changes (for new quotations)
  useEffect(() => {
    if (templateConfig?.templateName) {
      setValue('templateName', templateConfig.templateName)
      setValue('template', templateConfig.templateName)
    }
    if (templateConfig?.accentColor) {
      setValue('accentColor', templateConfig.accentColor)
    }
  }, [templateConfig, setValue])

  // useFieldArray for dynamic line items
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  // Watch items and whtRate for calculated totals - useWatch for reactive updates
  const watchedItems = useWatch({ control, name: 'items' })
  const watchedWhtRate = useWatch({ control, name: 'whtRate' }) ?? 0

  // Calculate totals - Industry standard calculation
  const calculatedValues = useMemo(() => {
    const totals = {
      subtotal: 0, // Sum of line subtotals
      totalDiscount: 0, // Sum of discounts
      netAmount: 0, // Subtotal - Discount (taxable amount)
      totalVat: 0,
      totalWht: 0,
      totalCost: 0,
      totalGrossProfit: 0,
      totalNetProfit: 0,
    }

    const calculatedItems = (watchedItems || []).map(item => {
      // Step 1-3: Calculate line amount after discount
      const lineSubtotal = (item.quantity || 0) * (item.unitPrice || 0)
      const discountAmount = lineSubtotal * ((item.discountPercent || 0) / 100)
      const netAmount = lineSubtotal - discountAmount // Taxable amount

      // Step 4: VAT on net amount
      const vatAmount = netAmount * ((item.vatRate || 0) / 100)

      // Step 5: WHT on net amount (BEFORE VAT - industry standard)
      const whtAmount = netAmount * (watchedWhtRate / 100)

      // Step 6-7: Totals
      const grossTotal = netAmount + vatAmount // What customer owes
      const netReceivable = grossTotal - whtAmount // What you receive

      // Cost and profit calculations
      const lineCost = (item.quantity || 0) * (item.unitCost || 0)
      const grossProfit = netAmount - lineCost // Profit before WHT
      const netProfit = netReceivable - lineCost // Profit after WHT

      // Aggregate totals
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
        lineProfit: netProfit, // For display
        // Legacy fields
        lineTotal: netAmount,
        lineTotalInclVat: grossTotal,
      }
    })

    const grossTotal = totals.netAmount + totals.totalVat
    const netReceivable = grossTotal - totals.totalWht

    // Calculate effective VAT rate from totals (for single value display)
    const effectiveVatRate = totals.netAmount > 0 ? (totals.totalVat / totals.netAmount) * 100 : 0

    // Industry standard margins (based on net amount/revenue)
    const grossProfitMargin =
      totals.netAmount > 0 ? (totals.totalGrossProfit / totals.netAmount) * 100 : 0
    const netProfitMargin =
      totals.netAmount > 0 ? (totals.totalNetProfit / totals.netAmount) * 100 : 0
    const markup = totals.totalCost > 0 ? (totals.totalGrossProfit / totals.totalCost) * 100 : 0

    return {
      items: calculatedItems,
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      netAmount: totals.netAmount,
      totalVat: totals.totalVat,
      vatRate: effectiveVatRate, // Effective VAT rate for display
      totalWht: totals.totalWht,
      totalCost: totals.totalCost,
      grossTotal,
      netReceivable,
      totalGrossProfit: totals.totalGrossProfit,
      totalNetProfit: totals.totalNetProfit,
      grossProfitMargin,
      netProfitMargin,
      markup,
      // Legacy fields for UI compatibility
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

  const addItem = () => {
    append(defaultItem)
  }

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const onSubmit = async (data: QuotationFormData) => {
    // Prepare data for backend
    const quotationData: any = {
      customer: data.customer,
      items: data.items.map(item => ({
        product: item.product,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent || 0,
        vatRate: item.vatRate,
        unitCost: item.unitCost,
      })),
      status: data.status,
      validUntil: data.validUntil,
      notes: data.notes,
      terms: data.terms,
      templateName: data.templateName,
      // Use new custom template if selected, otherwise preserve existing or use form value
      template: templateConfig?.customTemplate?.id || data.template || undefined,
      accentColor: data.accentColor,
      whtRate: data.whtRate,
      issuedDate: data.issuedDate || defaultDates.issuedDate,
    }

    try {
      if (isEditMode && quotation?._id) {
        await updateQuotation({ id: quotation._id, data: quotationData }).unwrap()
        toast.success('Quotation updated successfully!')
        router.push('/quotations')
      } else {
        await createQuotation(quotationData).unwrap()
        toast.success('Quotation created successfully!')
        router.push('/quotations')
      }
    } catch (error: any) {
      console.error('Failed to save quotation:', error)
      toast.error(
        error?.data?.message ||
          error?.message ||
          `Failed to ${isEditMode ? 'update' : 'create'} quotation. Please try again.`
      )
    }
  }

  const filteredCustomers = customers.filter(
    customer =>
      customer?.companyName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer?.email?.toLowerCase().includes(customerSearch.toLowerCase())
  )

  // Status badge colors
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Draft: 'bg-muted text-foreground  ',
      Sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Viewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      Accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      Expired: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      Converted: 'bg-primary-light text-primary dark:bg-primary/20 dark:text-primary-foreground',
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

        {/* Top Section - Customer & Quotation Details */}
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
              </div>
            </div>
          </div>

          {/* Quotation Details Card */}
          <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
            <div className='bg-linear-to-r from-purple-500 to-purple-600 px-6 py-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-white/20 rounded-lg'>
                  <DocumentIcon className='h-5 w-5 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-white'>Quotation Details</h3>
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
                      <option value='Viewed'>👁️ Viewed</option>
                      <option value='Accepted'>✅ Accepted</option>
                      <option value='Rejected'>❌ Rejected</option>
                      <option value='Expired'>⏰ Expired</option>
                      <option value='Converted'>🔄 Converted</option>
                    </select>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor='issuedDate'
                  className='block text-sm font-medium text-secondary-foreground mb-2'
                >
                  Issued Date
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
                  htmlFor='validUntil'
                  className='block text-sm font-medium text-secondary-foreground mb-2'
                >
                  Valid Until
                </label>
                <input
                  id='validUntil'
                  type='date'
                  {...register('validUntil')}
                  className='w-full px-4 py-3 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500  '
                />
              </div>
              <div>
                <label
                  htmlFor='templateName'
                  className='block text-sm font-medium text-secondary-foreground mb-2'
                >
                  Template
                </label>
                <input
                  type='text'
                  id='templateName'
                  {...register('templateName')}
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
                                if (e.target.value) {
                                  handleProductSelect(index, e.target.value)
                                }
                              }}
                              className='w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary   bg-muted'
                            >
                              <option value=''>Select Product (Optional)</option>
                              {products.map(product => (
                                <option key={product._id} value={product._id}>
                                  {product.name} - {formatCurrency(product.sellingPrice)}
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
                              className={`w-full px-2 py-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   ${
                                errors.items?.[index]?.quantity
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-border bg-muted'
                              }`}
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
                              className={`w-full px-2 py-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   ${
                                errors.items?.[index]?.unitCost
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-border bg-muted'
                              }`}
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
                              className={`w-full px-2 py-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   ${
                                errors.items?.[index]?.unitPrice
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-border bg-muted'
                              }`}
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
                              className={`w-full px-2 py-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary   ${
                                errors.items?.[index]?.vatRate
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-border bg-muted'
                              }`}
                              min='0'
                              max='100'
                              step='0.01'
                            />
                          )}
                        />
                      </td>
                      <td className='px-3 py-4 text-right'>
                        <span className='text-sm font-semibold text-foreground'>
                          {formatCurrency(calculatedItem?.lineTotal)}
                        </span>
                      </td>
                      <td className='px-3 py-4 text-right'>
                        <span
                          className={`text-sm font-bold px-2 py-1 rounded-md ${
                            (calculatedItem?.lineProfit || 0) >= 0
                              ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                              : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                          }`}
                        >
                          {formatCurrency(calculatedItem?.lineProfit)}
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

        {/* Quotation Summary Card */}
        <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
          <div className='bg-linear-to-r from-amber-500 to-amber-600 px-6 py-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <CalculatorIcon className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className='text-lg font-semibold text-white'>Quotation Summary</h3>
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
                      {formatCurrency(calculatedValues.subtotal)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-blue-500'></span>
                      VAT ({calculatedValues.vatRate.toFixed(1)}%)
                    </span>
                    <span className='font-medium text-blue-600 dark:text-blue-400'>
                      +{formatCurrency(calculatedValues.totalVat)}
                    </span>
                  </div>
                  <div className='border-t border-border pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-foreground font-semibold text-lg'>Grand Total</span>
                      <span className='font-bold text-2xl text-foreground'>
                        {formatCurrency(calculatedValues.grandTotal)}
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
                      <span className='w-2 h-2 rounded-full bg-red-500'></span>-
                      {formatCurrency(calculatedValues.totalWht)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Net Receivable</span>
                    <span className='font-semibold text-foreground'>
                      {formatCurrency(calculatedValues.netReceivableTotal)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Total Cost</span>
                    <span className='font-medium text-secondary-foreground'>
                      {formatCurrency(calculatedValues.totalCost)}
                    </span>
                  </div>
                  <div className='border-t border-border pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-foreground font-semibold text-lg flex items-center gap-2'>
                        📈 Expected Profit
                      </span>
                      <span
                        className={`font-bold text-2xl px-4 py-1 rounded-lg ${
                          calculatedValues.totalProfit >= 0
                            ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                            : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                        }`}
                      >
                        {formatCurrency(calculatedValues.totalProfit)}
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
                placeholder='Add any additional notes for this quotation...'
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
                placeholder='Enter terms and conditions that apply to this quotation...'
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='bg-card rounded-xl shadow-sm border border-border px-6 py-5'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-muted-foreground'>
              {quotation
                ? 'Update the quotation details above'
                : 'Review all details before saving your quotation'}
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
                    {isEditMode ? 'Update Quotation' : 'Save Quotation'}
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
