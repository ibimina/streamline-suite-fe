'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DateRange } from 'react-day-picker'
import { DownloadIcon, XIcon, PlusIcon } from '../Icons'
import {
  useGetPayrollsQuery,
  useCreatePayrollMutation,
  useApprovePayrollMutation,
  useProcessPayrollMutation,
  useLazyGeneratePayslipQuery,
} from '@/store/api'
import { PayrollFormData, PayrollStatus } from '@/types/payroll.type'
import {
  payrollSchema,
  type PayrollFormData as PayrollSchemaFormData,
} from '@/schemas/payroll.schema'
import LoadingSpinner from '../shared/LoadingSpinner'
import InputErrorWrapper from '../shared/InputErrorWrapper'
import { FilterBar, FilterOption } from '../shared/FilterBar'
import { Paginator } from '../ui/pagination'
import { PermissionGate } from '../common/PermissionGate'
import { PermissionName } from '@/contants/permissions'

// Status filter options
const STATUS_OPTIONS: FilterOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'processed', label: 'Processed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block capitalize'
  const statusClasses: Record<string, string> = {
    draft: 'bg-muted text-foreground  ',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    processed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return (
    <span
      className={`${baseClasses} ${statusClasses[status.toLowerCase()] || statusClasses.pending}`}
    >
      {status}
    </span>
  )
}

const Payroll: React.FC = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState<PayrollStatus | 'all'>('all')
  const limit = 10

  // RTK Query hooks
  const {
    data: payrollData,
    isLoading,
    isError,
    refetch,
  } = useGetPayrollsQuery({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  })
  const [createPayroll, { isLoading: isCreating }] = useCreatePayrollMutation()
  const [approvePayroll, { isLoading: isApproving }] = useApprovePayrollMutation()
  const [processPayroll, { isLoading: isProcessing }] = useProcessPayrollMutation()
  const [generatePayslip] = useLazyGeneratePayslipQuery()

  const [isModalOpen, setModalOpen] = useState(false)

  const payrollRuns = payrollData?.payload?.data || []

  // Wrapper handlers that reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }
  const handleStatusChange = (value: string) => {
    setStatusFilter(value as PayrollStatus | 'all')
    setPage(1)
  }
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    setPage(1)
  }

  const handleRunPayroll = async (formData: PayrollFormData) => {
    try {
      await createPayroll(formData).unwrap()
      setModalOpen(false)
    } catch (error) {
      console.error('Failed to create payroll:', error)
    }
  }

  const handleApprove = async (payrollId: string) => {
    try {
      await approvePayroll(payrollId).unwrap()
    } catch (error) {
      console.error('Failed to approve payroll:', error)
    }
  }

  const handleProcess = async (payrollId: string) => {
    try {
      await processPayroll(payrollId).unwrap()
    } catch (error) {
      console.error('Failed to process payroll:', error)
    }
  }

  const handleDownloadPayslip = async (payrollId: string, staffId: string) => {
    try {
      await generatePayslip({ payrollId, staffId })
    } catch (error) {
      console.error('Failed to generate payslip:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 mb-4'>Failed to load payroll data</p>
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
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Salary Payments (Payroll)</h1>
          <p className='text-muted-foreground mt-1'>Manage and track all payroll history.</p>
        </div>
        <PermissionGate permissions={[PermissionName.MANAGE_PAYROLL]}>
          <button
            onClick={() => setModalOpen(true)}
            className='bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center'
          >
            <PlusIcon className='w-5 h-5 mr-2' />
            Run New Payroll
          </button>
        </PermissionGate>
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder='Search payroll...'
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        statusValue={statusFilter}
        onStatusChange={handleStatusChange}
        statusOptions={STATUS_OPTIONS}
        statusPlaceholder='All Status'
      />
      <div className='bg-card p-4 rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-secondary-foreground uppercase bg-muted dark:text-muted-foreground'>
            <tr>
              <th className='px-6 py-3'>Pay Period</th>
              <th className='px-6 py-3'>Employees</th>
              <th className='px-6 py-3'>Total Payroll</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrollRuns.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-6 py-12 text-center text-muted-foreground'>
                  No payroll runs found. Create your first payroll to get started.
                </td>
              </tr>
            ) : (
              payrollRuns.map(run => (
                <tr key={run._id} className='border-b border-border hover:bg-muted '>
                  <td className='px-6 py-4 font-medium'>
                    {new Date(run.payPeriodStart).toLocaleDateString()} -{' '}
                    {new Date(run.payPeriodEnd).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4'>{run.items?.length || 0} employees</td>
                  <td className='px-6 py-4 font-semibold'>
                    ${run.totalNetPay?.toLocaleString() || 0}
                  </td>
                  <td className='px-6 py-4'>
                    <StatusBadge status={run.status} />
                  </td>
                  <td className='px-6 py-4 text-center space-x-2'>
                    <PermissionGate permissions={[PermissionName.MANAGE_PAYROLL]}>
                      {run.status === 'draft' && (
                        <button
                          onClick={() => handleApprove(run._id)}
                          className='text-blue-600 dark:text-blue-400 hover:underline text-sm'
                          disabled={isApproving}
                        >
                          Approve
                        </button>
                      )}
                      {run.status === 'approved' && (
                        <button
                          onClick={() => handleProcess(run._id)}
                          className='text-green-600 dark:text-green-400 hover:underline text-sm'
                          disabled={isProcessing}
                        >
                          Process
                        </button>
                      )}
                    </PermissionGate>
                    {run.status === 'paid' && run.items?.[0] && (
                      <button
                        onClick={() =>
                          handleDownloadPayslip(
                            run._id,
                            typeof run.items[0].staff === 'object'
                              ? run.items[0].staff._id
                              : run.items[0].staff
                          )
                        }
                        className='text-primary dark:text-primary hover:underline'
                        title='Download Report'
                      >
                        <DownloadIcon className='w-5 h-5 inline-block' />
                        <span className='ml-1 sr-only'>Download</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {payrollData?.payload?.total && payrollData.payload.total > limit && (
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-border'>
            <p className='text-sm text-muted-foreground'>
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, payrollData.payload.total)} of {payrollData.payload.total}{' '}
              payroll runs
            </p>
            <Paginator
              currentPage={page}
              totalPages={Math.ceil(payrollData.payload.total / limit)}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <PayrollModal
          onSave={handleRunPayroll}
          onClose={() => setModalOpen(false)}
          isLoading={isCreating}
        />
      )}
    </div>
  )
}

const PayrollModal: React.FC<{
  onSave: (formData: PayrollFormData) => void
  onClose: () => void
  isLoading?: boolean
}> = ({ onSave, onClose, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PayrollSchemaFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      payPeriodStart: '',
      payPeriodEnd: '',
      paymentDate: '',
      notes: '',
    },
  })

  const onSubmit = (data: PayrollSchemaFormData) => {
    onSave(data as unknown as PayrollFormData)
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-card rounded-lg shadow-xl p-6 w-full max-w-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Run New Payroll</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='payPeriodStart' className='block text-sm font-medium mb-1'>
                Pay Period Start
              </label>
              <input
                id='payPeriodStart'
                type='date'
                {...register('payPeriodStart')}
                className='p-2 w-full border rounded  '
              />
              {errors.payPeriodStart && (
                <InputErrorWrapper message={errors.payPeriodStart.message || ''} />
              )}
            </div>
            <div>
              <label htmlFor='payPeriodEnd' className='block text-sm font-medium mb-1'>
                Pay Period End
              </label>
              <input
                id='payPeriodEnd'
                type='date'
                {...register('payPeriodEnd')}
                className='p-2 w-full border rounded  '
              />
              {errors.payPeriodEnd && (
                <InputErrorWrapper message={errors.payPeriodEnd.message || ''} />
              )}
            </div>
          </div>
          <div>
            <label htmlFor='paymentDate' className='block text-sm font-medium mb-1'>
              Payment Date
            </label>
            <input
              id='paymentDate'
              type='date'
              {...register('paymentDate')}
              className='p-2 w-full border rounded  '
            />
            {errors.paymentDate && <InputErrorWrapper message={errors.paymentDate.message || ''} />}
          </div>
          <div>
            <label htmlFor='notes' className='block text-sm font-medium mb-1'>
              Notes (Optional)
            </label>
            <textarea
              id='notes'
              {...register('notes')}
              rows={3}
              className='p-2 w-full border rounded  '
              placeholder='Any additional notes for this payroll run...'
            />
            {errors.notes && <InputErrorWrapper message={errors.notes.message || ''} />}
          </div>
          <div className='flex justify-end pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 px-4 py-2 rounded bg-muted'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-primary text-white hover:bg-primary disabled:opacity-50'
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Payroll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Payroll
