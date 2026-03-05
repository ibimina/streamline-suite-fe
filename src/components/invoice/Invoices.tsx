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
import { Paginator } from '../ui/pagination'
import {
  useGetInvoicesQuery,
  useDeleteInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useGetInvoiceStatsQuery,
  useGetCustomersQuery,
} from '@/store/api'
import { Invoice, InvoiceStatus } from '@/types/invoice.type'
import { useCurrency } from '@/hooks/useCurrency'
import LoadingSpinner from '../shared/LoadingSpinner'
import { FilterBar, FilterOption } from '../shared/FilterBar'
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
} from 'lucide-react'

export const defaultTerms = `1. Payment is due within 30 days of the invoice date.
2. Late payments are subject to a 1.5% monthly interest charge.
3. Please make all checks payable to Your Company Name.`

const StatusBadge: React.FC<{ status: string; interactive?: boolean; onClick?: () => void }> = ({
  status,
  interactive = false,
  onClick,
}) => {
  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    draft: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      dot: 'bg-gray-500',
    },
    sent: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500',
    },
    paid: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
    },
    partial: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    partially_paid: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    overdue: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      dot: 'bg-red-500',
    },
    cancelled: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-500 dark:text-gray-400',
      dot: 'bg-gray-400',
    },
  }

  const config = statusConfig[status.toLowerCase()] || statusConfig.draft

  return (
    <button
      onClick={onClick}
      disabled={!interactive}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${
        interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      <span className='capitalize'>{status.replace('_', ' ')}</span>
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
  onStatusChange: (status: string) => void
  isUpdating: boolean
}> = ({ currentStatus, onStatusChange, isUpdating }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const statuses: { value: string; label: string; icon: string }[] = [
    { value: 'Draft', label: 'Draft', icon: '📝' },
    { value: 'Sent', label: 'Sent', icon: '📤' },
    { value: 'Paid', label: 'Paid', icon: '✅' },
    { value: 'Partially_paid', label: 'Partial', icon: '💰' },
    { value: 'Overdue', label: 'Overdue', icon: '⏰' },
    { value: 'Cancelled', label: 'Cancelled', icon: '❌' },
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
                if (value.toLowerCase() !== currentStatus.toLowerCase()) {
                  onStatusChange(value)
                }
                setIsOpen(false)
              }}
              disabled={isUpdating}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2 transition-colors ${
                value.toLowerCase() === currentStatus.toLowerCase() ? 'bg-muted font-medium' : ''
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{icon}</span>
              <span>{label}</span>
              {value.toLowerCase() === currentStatus.toLowerCase() && (
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

  // Stats filter state
  const [statsDateRange, setStatsDateRange] = useState<DateRange | undefined>()
  const [statsCustomerId, setStatsCustomerId] = useState<string>('all')

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

  // Invoice stats with filters
  const { data: statsData, isLoading: isStatsLoading } = useGetInvoiceStatsQuery({
    startDate: statsDateRange?.from?.toISOString(),
    endDate: statsDateRange?.to?.toISOString(),
    customerId: statsCustomerId !== 'all' ? statsCustomerId : undefined,
  })
  const stats = statsData?.payload

  // Customers for stats filter dropdown
  const { data: customersData } = useGetCustomersQuery()
  const customerFilterOptions: FilterOption[] = useMemo(() => {
    const customers = customersData?.payload?.customers || []
    return customers.map(c => ({
      value: c._id,
      label: c.companyName || c.fullName,
    }))
  }, [customersData])

  const [deleteInvoice] = useDeleteInvoiceMutation()
  const [updateInvoiceStatus, { isLoading: isUpdatingStatus }] = useUpdateInvoiceStatusMutation()

  const [isViewModalOpen, setViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const invoices = invoicesData?.payload?.data || []

  // Format currency
  const { formatCurrency } = useCurrency()

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

  const handleInvoiceStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      await updateInvoiceStatus({
        id: invoiceId,
        status: newStatus as InvoiceStatus,
      }).unwrap()
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

      {/* Stats Filter */}
      <div className='bg-card p-4 rounded-xl shadow-sm border border-border'>
        <div className='flex items-center gap-2 mb-3'>
          <TrendingUp className='w-4 h-4 text-muted-foreground' />
          <h3 className='text-sm font-medium text-muted-foreground'>Filter Statistics</h3>
        </div>
        <FilterBar
          showSearch={false}
          showStatus={false}
          dateRange={statsDateRange}
          onDateRangeChange={setStatsDateRange}
          showDateRange={true}
          secondaryValue={statsCustomerId}
          onSecondaryChange={setStatsCustomerId}
          secondaryOptions={customerFilterOptions}
          secondaryPlaceholder='All Customers'
          showSecondary={true}
          onReset={() => {
            setStatsDateRange(undefined)
            setStatsCustomerId('all')
          }}
        />
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
        <StatsCard
          title='Gross Profit'
          value={isStatsLoading ? '...' : formatCurrency(stats?.totalGrossProfit ?? 0)}
          subtitle={
            isStatsLoading
              ? ''
              : `${stats?.totalValue ? (((stats.totalGrossProfit ?? 0) / stats.totalValue) * 100).toFixed(1) : '0.0'}% margin`
          }
          icon={<TrendingUp className='w-6 h-6' />}
          color='green'
        />
        <StatsCard
          title='Net Profit'
          value={isStatsLoading ? '...' : formatCurrency(stats?.totalNetProfit ?? 0)}
          subtitle={
            isStatsLoading
              ? ''
              : `${stats?.totalValue ? (((stats.totalNetProfit ?? 0) / stats.totalValue) * 100).toFixed(1) : '0.0'}% margin`
          }
          icon={<DollarSign className='w-6 h-6' />}
          color='blue'
        />
      </div>

      {/* Charts */}
      {!isStatsLoading && stats && stats.total > 0 && (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
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
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {statusChartData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} invoices (${formatCurrency((props.payload as { amount: number }).amount)})`,
                    name,
                  ]}
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
                  formatter={value => formatCurrency(Number(value))}
                  labelStyle={{ color: '#1F2937' }}
                />
                <Legend />
                <Bar dataKey='amount' name='Amount' fill='#2563eb' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Customers Card */}
          {stats?.topCustomers && stats.topCustomers.length > 0 && (
            <div className='bg-card p-6 rounded-xl shadow-lg border border-border'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Top Customers</h3>
              <div className='space-y-3'>
                {stats.topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={customer.customerId} className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <span className='w-7 h-7 flex items-center justify-center bg-primary/10 text-primary rounded-full text-sm font-semibold'>
                        {index + 1}
                      </span>
                      <div>
                        <p className='font-medium text-foreground text-sm'>
                          {customer.companyName}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {customer.invoiceCount} invoices
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-foreground'>
                        {formatCurrency(customer.totalRevenue)}
                      </p>
                      {customer.outstandingAmount > 0 && (
                        <p className='text-xs text-amber-600'>
                          {formatCurrency(customer.outstandingAmount)} due
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <th className='px-6 py-3 hidden lg:table-cell'>Gross Profit</th>
              <th className='px-6 py-3 hidden lg:table-cell'>Net Profit</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className='px-6 py-12 text-center text-muted-foreground'>
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
                  <td className='px-6 py-4 hidden lg:table-cell'>
                    <span
                      className={
                        invoice.totalGrossProfit && invoice.totalGrossProfit > 0
                          ? 'text-green-600'
                          : 'text-red-500'
                      }
                    >
                      $
                      {(invoice.totalGrossProfit ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className='px-6 py-4 hidden lg:table-cell'>
                    <span
                      className={
                        invoice.totalNetProfit && invoice.totalNetProfit > 0
                          ? 'text-green-600'
                          : 'text-red-500'
                      }
                    >
                      $
                      {(invoice.totalNetProfit ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <StatusDropdown
                      currentStatus={invoice.status}
                      onStatusChange={status => handleInvoiceStatusChange(invoice._id, status)}
                      isUpdating={isUpdatingStatus}
                    />
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
                        <div className='absolute right-0 top-full mt-1 w-52 bg-card rounded-lg shadow-lg border border-border py-1 z-20'>
                          {/* View Section */}
                          <div className='px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase'>
                            View
                          </div>
                          <button
                            onClick={() => openModal(setViewModalOpen, invoice)}
                            className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted transition-colors'
                          >
                            <EyeIcon className='w-4 h-4' />
                            Preview PDF
                          </button>
                          <button
                            onClick={() => downloadPdf(invoice)}
                            className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted transition-colors'
                          >
                            <DownloadIcon className='w-4 h-4' />
                            Download PDF
                          </button>
                          <button
                            onClick={() => {
                              route.push(`/invoices/${invoice._id}`)
                              setActiveDropdown(null)
                            }}
                            className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted transition-colors'
                          >
                            <EyeIcon className='w-4 h-4' />
                            View Invoice
                          </button>

                          <hr className='my-1 border-border' />

                          {/* Edit Section */}
                          <div className='px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase'>
                            Edit
                          </div>
                          {invoice.status === 'Draft' && (
                            <button
                              onClick={() => {
                                route.push(`/invoices/edit/${invoice._id}`)
                                setActiveDropdown(null)
                              }}
                              className='w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-foreground hover:bg-muted transition-colors'
                            >
                              <PencilIcon className='w-4 h-4' />
                              Edit Invoice
                            </button>
                          )}

                          <hr className='my-1 border-border' />

                          {/* Danger Zone */}
                          <button
                            onClick={() => handleDelete(invoice)}
                            className='w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
                          >
                            <TrashIcon className='w-4 h-4' />
                            Delete
                          </button>
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
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-border'>
            <p className='text-sm text-muted-foreground'>
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, invoicesData.payload.total)} of {invoicesData.payload.total}{' '}
              invoices
            </p>
            <Paginator
              currentPage={page}
              totalPages={Math.ceil(invoicesData.payload.total / limit)}
              onPageChange={setPage}
            />
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
          open={isDeleteModalOpen}
        />
      )}
    </div>
  )
}

export default Invoices
