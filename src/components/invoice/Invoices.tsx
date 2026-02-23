'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { DateRange } from 'react-day-picker'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DotsVerticalIcon,
  PlusIcon,
  CheckCircleIcon,
} from '../Icons'
import { useRouter } from 'next/navigation'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'
import PdfPreviewModal from '../templates/PdfPreviewModal'
import useGeneratePdf from '@/hooks/useGeneratePdf'
import {
  useGetInvoicesQuery,
  useDeleteInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useGetInvoiceStatsQuery,
} from '@/store/api'
import { Invoice, InvoiceStatus } from '@/types/invoice.type'
import LoadingSpinner from '../shared/LoadingSpinner'
import { FilterBar, FilterOption } from '../shared/FilterBar'
import { FileText, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export const defaultTerms = `1. Payment is due within 30 days of the invoice date.
2. Late payments are subject to a 1.5% monthly interest charge.
3. Please make all checks payable to Your Company Name.`

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block capitalize'
  const statusClasses: Record<string, string> = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    draft: 'bg-muted text-foreground  ',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-muted text-foreground  ',
    partially_paid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }
  return (
    <span
      className={`${baseClasses} ${statusClasses[status.toLowerCase()] || statusClasses.draft}`}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

// Stats Card Component
const StatsCard: React.FC<{
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'yellow' | 'red' | 'slate'
}> = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    yellow: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
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

// Chart colors
const CHART_COLORS = {
  paid: '#10B981',
  sent: '#3B82F6',
  draft: '#94A3B8',
  overdue: '#EF4444',
  cancelled: '#6B7280',
  partially_paid: '#F59E0B',
}

// Status filter options
const STATUS_OPTIONS: FilterOption[] = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Sent', label: 'Sent' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Partially_paid', label: 'Partially Paid' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Cancelled', label: 'Cancelled' },
]

const Invoices = () => {
  const route = useRouter()
  const { generatePdf } = useGeneratePdf()

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const limit = 10

  // RTK Query hooks
  const {
    data: invoicesData,
    isLoading,
    isError,
    refetch,
  } = useGetInvoicesQuery({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? (statusFilter as InvoiceStatus) : undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  })

  // Invoice stats
  const { data: statsData, isLoading: isStatsLoading } = useGetInvoiceStatsQuery()
  const stats = statsData?.payload

  const [deleteInvoice] = useDeleteInvoiceMutation()
  const [updateInvoiceStatus, { isLoading: isUpdatingStatus }] = useUpdateInvoiceStatusMutation()

  const [isViewModalOpen, setViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const invoices = invoicesData?.payload?.data || []

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Prepare chart data
  const statusChartData = useMemo(() => {
    if (!stats) return []
    return [
      {
        name: 'Paid',
        value: stats.paid.count,
        amount: stats.paid.amount,
        color: CHART_COLORS.paid,
      },
      {
        name: 'Sent',
        value: stats.sent.count,
        amount: stats.sent.amount,
        color: CHART_COLORS.sent,
      },
      {
        name: 'Draft',
        value: stats.draft.count,
        amount: stats.draft.amount,
        color: CHART_COLORS.draft,
      },
      {
        name: 'Overdue',
        value: stats.overdue.count,
        amount: stats.overdue.amount,
        color: CHART_COLORS.overdue,
      },
    ].filter(item => item.value > 0)
  }, [stats])

  const barChartData = useMemo(() => {
    if (!stats) return []
    return [
      { name: 'Paid', count: stats.paid.count, amount: stats.paid.amount },
      { name: 'Sent', count: stats.sent.count, amount: stats.sent.amount },
      { name: 'Draft', count: stats.draft.count, amount: stats.draft.amount },
      { name: 'Overdue', count: stats.overdue.count, amount: stats.overdue.amount },
    ]
  }, [stats])

  // Wrapper handlers that reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    setPage(1)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDeleteModalOpen(true)
    setActiveDropdown(null)
  }

  const confirmDelete = async () => {
    if (selectedInvoice) {
      try {
        await deleteInvoice(selectedInvoice._id).unwrap()
        setDeleteModalOpen(false)
        setSelectedInvoice(null)
      } catch (error) {
        console.error('Failed to delete invoice:', error)
      }
    }
  }

  const handleMarkAsPaid = async (invoice: Invoice) => {
    try {
      await updateInvoiceStatus({
        id: invoice._id,
        status: 'Paid',
      }).unwrap()
      setActiveDropdown(null)
    } catch (error) {
      console.error('Failed to update invoice status:', error)
    }
  }

  const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>, invoice?: Invoice) => {
    setSelectedInvoice(invoice || null)
    setter(true)
    setActiveDropdown(null)
  }

  const downloadPdf = async (invoice: Invoice) => {
    // Transform to legacy format for PDF generation

    await generatePdf(invoice, `REQUEST FOR INVOICE`, 'INVOICE')
    setActiveDropdown(null)
  }

  const getCustomerName = (invoice: Invoice) => {
    if (typeof invoice.customer === 'object' && invoice.customer) {
      return invoice.customer.companyName
    }
    return 'Unknown Customer'
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 mb-4'>Failed to load invoices</p>
        <button
          onClick={() => refetch()}
          className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Invoices</h1>
          <p className='text-muted-foreground mt-1'>Manage, track, and send customer invoices.</p>
        </div>
        <button
          onClick={() => route.push('/invoices/create')}
          className='flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors'
        >
          <PlusIcon className='w-5 h-5 mr-0 sm:mr-2' />
          <span className='hidden sm:inline'>Create New Invoice</span>
          <span className='inline sm:hidden'>Add Invoice</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Invoices'
          value={isStatsLoading ? '...' : (stats?.total ?? 0)}
          subtitle={isStatsLoading ? '' : `${formatCurrency(stats?.totalValue ?? 0)} total value`}
          icon={<FileText className='w-6 h-6' />}
          color='blue'
        />
        <StatsCard
          title='Paid Invoices'
          value={isStatsLoading ? '...' : (stats?.paid.count ?? 0)}
          subtitle={isStatsLoading ? '' : formatCurrency(stats?.paid.amount ?? 0)}
          icon={<CheckCircle className='w-6 h-6' />}
          color='green'
        />
        <StatsCard
          title='Pending'
          value={isStatsLoading ? '...' : (stats?.sent.count ?? 0) + (stats?.draft.count ?? 0)}
          subtitle={
            isStatsLoading
              ? ''
              : formatCurrency((stats?.sent.amount ?? 0) + (stats?.draft.amount ?? 0))
          }
          icon={<Clock className='w-6 h-6' />}
          color='yellow'
        />
        <StatsCard
          title='Overdue'
          value={isStatsLoading ? '...' : (stats?.overdue.count ?? 0)}
          subtitle={isStatsLoading ? '' : formatCurrency(stats?.overdue.amount ?? 0)}
          icon={<AlertTriangle className='w-6 h-6' />}
          color='red'
        />
      </div>

      {/* Charts */}
      {!isStatsLoading && stats && stats.total > 0 && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Status Distribution Pie Chart */}
          <div className='bg-card p-6 rounded-xl shadow-lg border border-border'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              Invoice Status Distribution
            </h3>
            <ResponsiveContainer width='100%' height={250}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey='value'
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusChartData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(
                    value: number,
                    name: string,
                    props: { payload: { amount: number } }
                  ) => [`${value} invoices (${formatCurrency(props.payload.amount)})`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Amount by Status Bar Chart */}
          <div className='bg-card p-6 rounded-xl shadow-lg border border-border'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Amount by Status</h3>
            <ResponsiveContainer width='100%' height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
                <XAxis dataKey='name' tick={{ fill: '#6B7280' }} />
                <YAxis
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#1F2937' }}
                />
                <Legend />
                <Bar dataKey='amount' name='Amount' fill='#2563eb' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder='Search invoices...'
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        statusValue={statusFilter}
        onStatusChange={handleStatusChange}
        statusOptions={STATUS_OPTIONS}
        statusPlaceholder='All Status'
      />

      {/* Table */}
      <div className='bg-card p-4 rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-secondary-foreground uppercase bg-muted dark:text-muted-foreground'>
            <tr>
              <th className='px-6 py-3'>Invoice #</th>
              <th className='px-6 py-3'>Customer</th>
              <th className='px-6 py-3 hidden md:table-cell'>Due Date</th>
              <th className='px-6 py-3'>Total</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-12 text-center text-muted-foreground'>
                  No invoices found. Create your first invoice to get started.
                </td>
              </tr>
            ) : (
              invoices.map(invoice => (
                <tr key={invoice._id} className='border-b border-border hover:bg-muted '>
                  <td className='px-6 py-4 font-medium'>
                    {invoice.uniqueId}
                    {invoice.quotation && (
                      <span className='block text-xs text-muted-foreground'>From Quote</span>
                    )}
                  </td>
                  <td className='px-6 py-4'>{getCustomerName(invoice)}</td>
                  <td className='px-6 py-4 hidden md:table-cell'>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 font-semibold'>
                    ${invoice.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className='px-6 py-4'>
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <div
                      className='relative inline-block text-left'
                      ref={activeDropdown === invoice._id ? dropdownRef : null}
                    >
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === invoice._id ? null : invoice._id)
                        }
                        className='p-2 rounded-full hover:bg-muted '
                      >
                        <DotsVerticalIcon className='w-5 h-5' />
                      </button>
                      {activeDropdown === invoice._id && (
                        <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
                          <div className='py-1'>
                            <button
                              onClick={() => openModal(setViewModalOpen, invoice)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted '
                            >
                              <EyeIcon className='w-5 h-5 mr-3' />
                              Preview Pdf
                            </button>
                            {invoice.status === 'Draft' && (
                              <button
                                onClick={() => route.push(`/invoices/edit/${invoice._id}`)}
                                className='w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted '
                              >
                                <PencilIcon className='w-5 h-5 mr-3' />
                                Edit
                              </button>
                            )}
                            {(invoice.status === 'Sent' || invoice.status === 'Overdue') && (
                              <button
                                onClick={() => handleMarkAsPaid(invoice)}
                                disabled={isUpdatingStatus}
                                className='w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted  disabled:opacity-50'
                              >
                                <CheckCircleIcon className='w-5 h-5 mr-3' />
                                Mark as Paid
                              </button>
                            )}
                            <button
                              onClick={() => downloadPdf(invoice)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted '
                            >
                              <DownloadIcon className='w-5 h-5 mr-3' />
                              Download PDF
                            </button>
                            <button
                              onClick={() => handleDelete(invoice)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-muted '
                            >
                              <TrashIcon className='w-5 h-5 mr-3' />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {invoicesData?.payload?.total && invoicesData.payload.total > limit && (
          <div className='flex justify-between items-center mt-4 pt-4 border-t border-border'>
            <p className='text-sm text-muted-foreground'>
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, invoicesData.payload.total)} of {invoicesData.payload.total}{' '}
              invoices
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
                disabled={page * limit >= invoicesData.payload.total}
                className='px-3 py-1 rounded border  disabled:opacity-50'
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isViewModalOpen && selectedInvoice && (
        <PdfPreviewModal
          pdfData={selectedInvoice}
          onClose={() => setViewModalOpen(false)}
          documentTitle={`Invoice ${selectedInvoice.uniqueId}`}
          documentType='INVOICE'
          title='INVOICE PREVIEW'
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Invoices
