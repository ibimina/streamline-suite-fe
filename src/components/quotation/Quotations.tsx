'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DateRange } from 'react-day-picker'
import { toast } from 'react-toastify'
import { DownloadIcon, EyeIcon, PencilIcon, TrashIcon, DotsVerticalIcon, PlusIcon } from '../Icons'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'
import PdfPreviewModal from '../templates/PdfPreviewModal'
import useGeneratePdf from '@/hooks/useGeneratePdf'
import {
  useGetQuotationsQuery,
  useDeleteQuotationMutation,
  useUpdateQuotationStatusMutation,
  useConvertQuotationToInvoiceMutation,
} from '@/store/api'
import { Quotation, QuotationStatus } from '@/types/quotation.type'
import { useCurrency } from '@/hooks/useCurrency'
import LoadingSpinner from '../shared/LoadingSpinner'
import { FilterBar, FilterOption } from '../shared/FilterBar'
import { Paginator } from '../ui/pagination'
import { PermissionGate } from '../common/PermissionGate'
import { PermissionName } from '@/contants/permissions'

// Status filter options
const STATUS_OPTIONS: FilterOption[] = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Sent', label: 'Sent' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Expired', label: 'Expired' },
]

// Status Badge Component with dropdown capability
const StatusBadge: React.FC<{ status: string; interactive?: boolean; onClick?: () => void }> = ({
  status,
  interactive = false,
  onClick,
}) => {
  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    accepted: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500',
    },
    sent: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400',
      dot: 'bg-blue-500',
    },
    draft: {
      bg: 'bg-slate-100 dark:bg-slate-500/10',
      text: 'text-slate-600 dark:text-slate-400',
      dot: 'bg-slate-400',
    },
    rejected: {
      bg: 'bg-red-50 dark:bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      dot: 'bg-red-500',
    },
    expired: {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
    },
  }

  const config = statusConfig[status.toLowerCase()] || statusConfig.draft

  return (
    <button
      onClick={interactive ? onClick : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text} ${
        interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      }`}
      disabled={!interactive}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      <span className='capitalize'>{status}</span>
      {interactive && (
        <svg className='w-3 h-3 ml-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      )}
    </button>
  )
}

// Status Dropdown Component
const StatusDropdown: React.FC<{
  currentStatus: string
  onStatusChange: (status: QuotationStatus) => void
  isUpdating: boolean
  quotationId: string
}> = ({ currentStatus, onStatusChange, isUpdating, quotationId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const statuses: { value: QuotationStatus; label: string; icon: string }[] = [
    { value: 'Draft', label: 'Draft', icon: '📝' },
    { value: 'Sent', label: 'Sent', icon: '📤' },
    { value: 'Accepted', label: 'Accepted', icon: '✅' },
    { value: 'Rejected', label: 'Rejected', icon: '❌' },
    { value: 'Expired', label: 'Expired', icon: '⏰' },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative' ref={dropdownRef}>
      <StatusBadge
        status={currentStatus}
        interactive={!isUpdating}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className='absolute z-30 mt-1 left-0 w-40 bg-card rounded-lg shadow-lg border border-border py-1'>
          {statuses.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => {
                if (value !== currentStatus.toLowerCase()) {
                  onStatusChange(value)
                }
                setIsOpen(false)
              }}
              disabled={isUpdating}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-muted  flex items-center gap-2 transition-colors ${
                value === currentStatus.toLowerCase() ? 'bg-muted font-medium' : ''
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{icon}</span>
              <span>{label}</span>
              {value === currentStatus.toLowerCase() && (
                <svg
                  className='w-4 h-4 ml-auto text-primary'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Stats Card Component
const StatsCard: React.FC<{
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: 'teal' | 'blue' | 'amber' | 'emerald'
}> = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    teal: 'bg-primary-light text-primary dark:bg-primary/10 dark:text-primary',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  }

  return (
    <div className='bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='space-y-2'>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <p className='text-2xl font-bold text-foreground'>{value}</p>
          {subtitle && <p className='text-xs text-muted-foreground'>{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  )
}

// Empty State Component
const EmptyState: React.FC<{ onCreateNew: () => void }> = ({ onCreateNew }) => (
  <div className='flex flex-col items-center justify-center py-16 px-4'>
    <div className='w-20 h-20 bg-primary-light dark:bg-primary/10 rounded-full flex items-center justify-center mb-6'>
      <svg className='w-10 h-10 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
    </div>
    <h3 className='text-lg font-semibold text-foreground mb-2'>No quotations yet</h3>
    <p className='text-muted-foreground text-center mb-6 max-w-sm'>
      Get started by creating your first quotation. It only takes a few minutes.
    </p>
    <button
      onClick={onCreateNew}
      className='inline-flex items-center gap-2 bg-primary hover:bg-primary text-white font-medium px-5 py-2.5 rounded-lg transition-colors'
    >
      <PlusIcon className='w-5 h-5' />
      Create Quotation
    </button>
  </div>
)

const Quotations = () => {
  const router = useRouter()
  const { generatePdf } = useGeneratePdf()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const limit = 10

  // RTK Query hooks
  const {
    data: quotationsData,
    isLoading,
    isError,
    refetch,
  } = useGetQuotationsQuery({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? (statusFilter as QuotationStatus) : undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  })
  const [deleteQuotation] = useDeleteQuotationMutation()
  const [updateQuotationStatus, { isLoading: isUpdatingStatus }] =
    useUpdateQuotationStatusMutation()
  const [convertToInvoice, { isLoading: isConverting }] = useConvertQuotationToInvoiceMutation()

  const [isViewModalOpen, setViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [updatingQuotationId, setUpdatingQuotationId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const quotations = useMemo(
    () => quotationsData?.payload?.data ?? [],
    [quotationsData?.payload?.data]
  )
  const totalQuotations = quotationsData?.payload?.total ?? 0

  // Calculate stats
  const stats = useMemo(() => {
    const totalValue = quotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0)
    const totalProfit = quotations.reduce((sum, q) => sum + (q.expectedProfit || 0), 0)
    const acceptedCount = quotations.filter(q => q.status.toLowerCase() === 'accepted').length
    const pendingCount = quotations.filter(
      q => q.status.toLowerCase() === 'sent' || q.status.toLowerCase() === 'draft'
    ).length

    return { totalValue, totalProfit, acceptedCount, pendingCount }
  }, [quotations])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, dateRange])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle status change
  const handleStatusChange = async (quotationId: string, newStatus: QuotationStatus) => {
    setUpdatingQuotationId(quotationId)
    try {
      await updateQuotationStatus({ quotationId, status: newStatus }).unwrap()
      toast.success(`Status updated to ${newStatus}`)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingQuotationId(null)
    }
  }

  // Handle convert to invoice
  const handleConvertToInvoice = async (quotationId: string) => {
    try {
      const result = await convertToInvoice(quotationId).unwrap()
      toast.success('Quotation converted to invoice successfully!')
      router.push(`/invoices/${result.payload.invoiceId}`)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to convert to invoice')
    }
    setActiveDropdown(null)
  }

  // Handle duplicate (navigate to create with quotation ID)
  const handleDuplicate = (quotation: Quotation) => {
    router.push(`/quotations/create?duplicate=${quotation._id}`)
    setActiveDropdown(null)
  }

  // Handle send quotation
  const handleSendQuotation = async (quotationId: string) => {
    await handleStatusChange(quotationId, 'Sent')
    setActiveDropdown(null)
  }

  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setDeleteModalOpen(true)
    setActiveDropdown(null)
  }

  const confirmDelete = async () => {
    if (selectedQuotation) {
      try {
        await deleteQuotation(selectedQuotation._id).unwrap()
        toast.success('Quotation deleted successfully')
        setDeleteModalOpen(false)
        setSelectedQuotation(null)
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete quotation')
      }
    }
  }

  const openModal = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    quotation?: Quotation
  ) => {
    setSelectedQuotation(quotation || null)
    setter(true)
    setActiveDropdown(null)
  }

  const getCustomerName = (quotation: Quotation) => {
    if (typeof quotation.customer === 'object' && quotation.customer) {
      return quotation.customer.companyName
    }
    return 'Unknown Customer'
  }

  const downloadPdf = async (quotation: Quotation) => {
    await generatePdf(quotation, `REQUEST FOR QUOTATION`, 'QUOTATION')
    setActiveDropdown(null)
  }

  const { formatCurrency } = useCurrency()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Check if quotation can be edited
  const canEdit = (status: string) => {
    return ['draft', 'sent'].includes(status.toLowerCase())
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center py-16'>
        <div className='w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4'>
          <svg
            className='w-8 h-8 text-red-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-foreground mb-2'>Failed to load quotations</h3>
        <p className='text-muted-foreground mb-4'>Something went wrong. Please try again.</p>
        <button
          onClick={() => refetch()}
          className='inline-flex items-center gap-2 bg-primary hover:bg-primary text-white font-medium px-5 py-2.5 rounded-lg transition-colors'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            />
          </svg>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Quotations</h1>
          <p className='text-muted-foreground mt-1'>Create, manage, and track your quotations</p>
        </div>
        <PermissionGate permissions={[PermissionName.CREATE_QUOTATIONS]}>
          <button
            onClick={() => router.push('/quotations/create')}
            className='inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary text-white font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/25'
          >
            <PlusIcon className='w-5 h-5' />
            <span>New Quotation</span>
          </button>
        </PermissionGate>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Quotations'
          value={totalQuotations}
          subtitle='All time'
          color='teal'
          icon={
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          }
        />
        <StatsCard
          title='Total Value'
          value={formatCurrency(stats.totalValue)}
          subtitle='This page'
          color='blue'
          icon={
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          }
        />
        <StatsCard
          title='Expected Profit'
          value={formatCurrency(stats.totalProfit)}
          subtitle='This page'
          color='emerald'
          icon={
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
              />
            </svg>
          }
        />
        <StatsCard
          title='Accepted'
          value={stats.acceptedCount}
          subtitle={`${stats.pendingCount} pending`}
          color='amber'
          icon={
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          }
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder='Search quotations...'
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={STATUS_OPTIONS}
        statusPlaceholder='All Status'
      />

      {/* Table */}
      <div className='bg-card rounded-xl border border-border'>
        {quotations.length === 0 ? (
          <EmptyState onCreateNew={() => router.push('/quotations/create')} />
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border'>
                    <th className='text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4'>
                      Quote
                    </th>
                    <th className='text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4'>
                      Customer
                    </th>
                    <th className='text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell'>
                      Date
                    </th>
                    <th className='text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell'>
                      Cost
                    </th>
                    <th className='text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell'>
                      Profit
                    </th>
                    <th className='text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4'>
                      Total
                    </th>
                    <th className='text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4'>
                      Status
                    </th>
                    <th className='text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {quotations.map(q => {
                    const totalCost = q.totalCost || 0
                    const totalProfit = q.expectedProfit || 0
                    const isThisUpdating = updatingQuotationId === q._id

                    return (
                      <tr
                        key={q._id}
                        className='group hover:bg-muted /50 transition-colors cursor-pointer'
                        onClick={() => openModal(setViewModalOpen, q)}
                      >
                        <td className='px-6 py-4'>
                          <span className='font-semibold text-foreground'>{q.uniqueId}</span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-hover flex items-center justify-center text-white text-xs font-medium'>
                              {getCustomerName(q).charAt(0).toUpperCase()}
                            </div>
                            <span className='text-secondary-foreground font-medium'>
                              {getCustomerName(q)}
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 hidden md:table-cell'>
                          <span className='text-muted-foreground text-sm'>
                            {formatDate(q.issuedDate)}
                          </span>
                        </td>
                        <td className='px-6 py-4 hidden lg:table-cell text-right'>
                          <span className='text-muted-foreground text-sm'>
                            {formatCurrency(totalCost)}
                          </span>
                        </td>
                        <td className='px-6 py-4 hidden lg:table-cell text-right'>
                          <span
                            className={`text-sm font-medium ${totalProfit < 0 ? 'text-red-500' : 'text-emerald-500'}`}
                          >
                            {totalProfit >= 0 ? '+' : ''}
                            {formatCurrency(totalProfit)}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <span className='font-semibold text-foreground'>
                            {formatCurrency(q.grandTotal || 0)}
                          </span>
                        </td>
                        <td className='px-6 py-4' onClick={e => e.stopPropagation()}>
                          <StatusDropdown
                            currentStatus={q.status}
                            onStatusChange={status => handleStatusChange(q._id, status)}
                            isUpdating={isThisUpdating || isUpdatingStatus}
                            quotationId={q._id}
                          />
                        </td>
                        <td className='px-6 py-4' onClick={e => e.stopPropagation()}>
                          <div
                            className='relative flex justify-center'
                            ref={activeDropdown === q._id ? dropdownRef : null}
                          >
                            <button
                              onClick={() =>
                                setActiveDropdown(activeDropdown === q._id ? null : q._id)
                              }
                              className='p-2 rounded-lg hover:bg-muted  transition-colors'
                            >
                              <DotsVerticalIcon className='w-5 h-5 text-muted-foreground' />
                            </button>
                            {activeDropdown === q._id && (
                              <div className='absolute right-0 top-full mt-1 w-52 bg-card rounded-lg shadow-lg border border-border py-1 z-20'>
                                {/* View Section */}
                                <div className='px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase'>
                                  View
                                </div>
                                <button
                                  onClick={() => openModal(setViewModalOpen, q)}
                                  className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted  transition-colors'
                                >
                                  <EyeIcon className='w-4 h-4' />
                                  Preview PDF
                                </button>
                                <button
                                  onClick={() => downloadPdf(q)}
                                  className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted  transition-colors'
                                >
                                  <DownloadIcon className='w-4 h-4' />
                                  Download PDF
                                </button>
                                {/* button to view quotation
                                 <button
                                    onClick={() => {
                                      router.push(`/quotations/${q._id}`)
                                      setActiveDropdown(null)
                                    }}
                                    className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted  transition-colors'
                                  >
                                    <PencilIcon className='w-4 h-4' />
                                    View Quotation
                                  </button>
                                 */}
                                <button
                                  onClick={() => {
                                    router.push(`/quotations/${q._id}`)
                                    setActiveDropdown(null)
                                  }}
                                  className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted  transition-colors'
                                >
                                  <PencilIcon className='w-4 h-4' />
                                  View Quotation
                                </button>

                                <hr className='my-1 border-border' />

                                {/* Edit Section */}
                                <div className='px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase'>
                                  Edit
                                </div>
                                <PermissionGate permissions={[PermissionName.CREATE_QUOTATIONS]}>
                                  {canEdit(q.status) && (
                                    <button
                                      onClick={() => {
                                        router.push(`/quotations/edit/${q._id}`)
                                        setActiveDropdown(null)
                                      }}
                                      className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted  transition-colors'
                                    >
                                      <PencilIcon className='w-4 h-4' />
                                      Edit Quotation
                                    </button>
                                  )}
                                </PermissionGate>
                                <button
                                  onClick={() => handleDuplicate(q)}
                                  className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted  transition-colors'
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
                                      d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                                    />
                                  </svg>
                                  Duplicate
                                </button>

                                <hr className='my-1 border-border' />

                                {/* Actions Section */}
                                <div className='px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase'>
                                  Actions
                                </div>
                                {q.status.toLowerCase() === 'draft' && (
                                  <button
                                    onClick={() => handleSendQuotation(q._id)}
                                    disabled={isUpdatingStatus}
                                    className='w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-accent dark:hover:bg-accent0/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
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
                                        d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                                      />
                                    </svg>
                                    Send to Customer
                                  </button>
                                )}
                                {(q.status.toLowerCase() === 'accepted' ||
                                  q.status.toLowerCase() === 'sent') &&
                                  !q.convertedToInvoice && (
                                    <button
                                      onClick={() => handleConvertToInvoice(q._id)}
                                      disabled={isConverting}
                                      className='w-full flex items-center gap-3 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
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
                                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                        />
                                      </svg>
                                      {isConverting ? 'Converting...' : 'Convert to Invoice'}
                                    </button>
                                  )}

                                <hr className='my-1 border-border' />

                                {/* Danger Zone */}
                                <PermissionGate permissions={[PermissionName.CREATE_QUOTATIONS]}>
                                  <button
                                    onClick={() => handleDelete(q)}
                                    className='w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
                                  >
                                    <TrashIcon className='w-4 h-4' />
                                    Delete
                                  </button>
                                </PermissionGate>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalQuotations > limit && (
              <div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border'>
                <p className='text-sm text-muted-foreground'>
                  Showing{' '}
                  <span className='font-medium text-secondary-foreground'>
                    {(page - 1) * limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className='font-medium text-secondary-foreground'>
                    {Math.min(page * limit, totalQuotations)}
                  </span>{' '}
                  of{' '}
                  <span className='font-medium text-secondary-foreground'>{totalQuotations}</span>{' '}
                  quotations
                </p>
                <Paginator
                  currentPage={page}
                  totalPages={Math.ceil(totalQuotations / limit)}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedQuotation && (
        <PdfPreviewModal
          pdfData={selectedQuotation}
          onClose={() => setViewModalOpen(false)}
          documentTitle={`Quotation ${selectedQuotation.uniqueId}`}
          documentType='QUOTATION'
          title={`REQUEST FOR QUOTATION`}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          open={isDeleteModalOpen}
        />
      )}
    </div>
  )
}

export default Quotations
