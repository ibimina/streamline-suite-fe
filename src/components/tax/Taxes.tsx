'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DownloadIcon, PlusIcon, XIcon } from '../Icons'
import {
  useGetTaxReportsQuery,
  useGetTaxStatsQuery,
  useGenerateTaxReportMutation,
  useLazyDownloadTaxReportQuery,
} from '@/store/api'
import { taxReportSchema, type TaxReportFormData } from '@/schemas/tax-report.schema'
import InputErrorWrapper from '../shared/InputErrorWrapper'
import { PermissionGate } from '../common/PermissionGate'
import { PermissionName } from '@/contants/permissions'

const StatCard: React.FC<{ title: string; value: string; isLoading?: boolean }> = ({
  title,
  value,
  isLoading,
}) => (
  <div className='bg-card p-6 rounded-xl shadow-lg'>
    <p className='text-muted-foreground font-medium'>{title}</p>
    {isLoading ? (
      <div className='h-9 mt-2 bg-muted animate-pulse rounded' />
    ) : (
      <p className='text-3xl font-bold text-foreground mt-2'>{value}</p>
    )}
  </div>
)

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block capitalize'
  const getStatusClasses = (s: string) => {
    switch (s.toLowerCase()) {
      case 'filed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
      case 'due':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-muted text-foreground  '
    }
  }
  return <span className={`${baseClasses} ${getStatusClasses(status)}`}>{status}</span>
}

const Taxes: React.FC = () => {
  const [page, setPage] = useState(1)
  const limit = 10
  const [isModalOpen, setModalOpen] = useState(false)

  // RTK Query hooks
  const { data: reportsData, isLoading, isError, refetch } = useGetTaxReportsQuery({ page, limit })
  const { data: statsData, isLoading: isLoadingStats } = useGetTaxStatsQuery()
  const [generateReport, { isLoading: isGenerating }] = useGenerateTaxReportMutation()
  const [downloadReport] = useLazyDownloadTaxReportQuery()

  const reports = reportsData?.payload?.data || []
  const stats = statsData?.payload

  const handleGenerateReport = async (period: string, type: string) => {
    try {
      await generateReport({ period, type }).unwrap()
      setModalOpen(false)
    } catch (error) {
      console.error('Failed to generate report:', error)
    }
  }

  const handleDownload = async (reportId: string) => {
    try {
      await downloadReport(reportId)
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 mb-4'>Failed to load tax reports</p>
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
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Tax Filing Support</h1>
        <p className='text-muted-foreground mt-1'>Generate reports and track tax filings.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <StatCard
          title='Total Sales Tax Collected (Current Qtr)'
          value={stats ? `$${stats.totalSalesTaxCollected.toLocaleString()}` : '$0'}
          isLoading={isLoadingStats}
        />
        <StatCard
          title='Total Purchase Tax Paid (Current Qtr)'
          value={stats ? `$${stats.totalPurchaseTaxPaid.toLocaleString()}` : '$0'}
          isLoading={isLoadingStats}
        />
      </div>

      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Tax Filing History</h2>
        <PermissionGate permissions={[PermissionName.MANAGE_TAXES]}>
          <button
            onClick={() => setModalOpen(true)}
            className='bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center'
          >
            <PlusIcon className='w-5 h-5 mr-2' />
            Generate New Report
          </button>
        </PermissionGate>
      </div>

      <div className='bg-card p-4 rounded-xl shadow-lg overflow-x-auto'>
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
          </div>
        ) : (
          <>
            <table className='w-full text-sm text-left'>
              <thead className='text-xs text-secondary-foreground uppercase bg-muted dark:text-muted-foreground'>
                <tr>
                  <th className='px-6 py-3'>Period</th>
                  <th className='px-6 py-3'>Report Type</th>
                  <th className='px-6 py-3'>Amount</th>
                  <th className='px-6 py-3'>Status</th>
                  <th className='px-6 py-3 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='px-6 py-12 text-center text-muted-foreground'>
                      No tax reports found. Generate your first report to get started.
                    </td>
                  </tr>
                ) : (
                  reports.map(report => (
                    <tr key={report._id} className='border-b border-border hover:bg-muted '>
                      <td className='px-6 py-4 font-medium'>{report.period}</td>
                      <td className='px-6 py-4 capitalize'>{report.type.replace('_', ' ')}</td>
                      <td className='px-6 py-4 font-semibold'>${report.amount.toLocaleString()}</td>
                      <td className='px-6 py-4'>
                        <StatusBadge status={report.status} />
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <button
                          onClick={() => handleDownload(report._id)}
                          className='text-primary dark:text-primary hover:underline'
                          title='Download Report'
                        >
                          <DownloadIcon className='w-5 h-5 inline-block' />
                          <span className='ml-1 sr-only'>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {reportsData?.payload?.total && reportsData.payload.total > limit && (
              <div className='flex justify-between items-center mt-4 pt-4 border-t border-border'>
                <p className='text-sm text-muted-foreground'>
                  Showing {(page - 1) * limit + 1} to{' '}
                  {Math.min(page * limit, reportsData.payload.total)} of {reportsData.payload.total}{' '}
                  reports
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
                    disabled={page * limit >= reportsData.payload.total}
                    className='px-3 py-1 rounded border  disabled:opacity-50'
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <GenerateReportModal
          onGenerate={handleGenerateReport}
          onClose={() => setModalOpen(false)}
          isLoading={isGenerating}
        />
      )}
    </div>
  )
}

const GenerateReportModal: React.FC<{
  onGenerate: (period: string, type: string) => void
  onClose: () => void
  isLoading?: boolean
}> = ({ onGenerate, onClose, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaxReportFormData>({
    resolver: zodResolver(taxReportSchema) as any,
    defaultValues: {
      period: '',
      type: 'sales_tax',
    },
  })

  const onSubmit = (data: TaxReportFormData) => {
    onGenerate(data.period, data.type)
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-card rounded-lg shadow-xl p-6 w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Generate Tax Report</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label htmlFor='period' className='block text-sm font-medium mb-1'>
              Period
            </label>
            <input
              id='period'
              type='text'
              {...register('period')}
              placeholder='e.g., Q1 2024'
              className='p-2 w-full border rounded  '
            />
            {errors.period && <InputErrorWrapper message={errors.period.message || ''} />}
          </div>
          <div>
            <label htmlFor='type' className='block text-sm font-medium mb-1'>
              Report Type
            </label>
            <select id='type' {...register('type')} className='p-2 w-full border rounded  '>
              <option value='sales_tax'>Sales Tax</option>
              <option value='purchase_tax'>Purchase Tax</option>
              <option value='vat'>VAT</option>
              <option value='withholding_tax'>Withholding Tax</option>
            </select>
            {errors.type && <InputErrorWrapper message={errors.type.message || ''} />}
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
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Taxes
