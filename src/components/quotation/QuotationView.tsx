'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Quotation } from '@/types/quotation.type'
import { toast } from 'react-toastify'
import { useConvertQuotationToInvoiceMutation } from '@/store/api/quotationApi'
import { formatDate, getQuotationStatusConfig } from '@/contants'
import { useCurrency } from '@/hooks/useCurrency'

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

const PrinterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
    />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
    />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    />
  </svg>
)

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
    />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M14 5l7 7m0 0l-7 7m7-7H3'
    />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    />
  </svg>
)

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M10 19l-7-7m0 0l7-7m-7 7h18'
    />
  </svg>
)

interface QuotationViewProps {
  quotation: Quotation
  onConvertToInvoice?: (id: string) => void
  onSendEmail?: (id: string) => void
  onDownloadPdf?: (id: string) => void
}

export default function QuotationView({
  quotation,
  onConvertToInvoice,
  onSendEmail,
  onDownloadPdf,
}: Readonly<QuotationViewProps>) {
  const router = useRouter()
  const { formatCurrency } = useCurrency()
  const statusConfig = getQuotationStatusConfig(quotation.status)
  const [convertToInvoice, { isLoading: isConverting }] = useConvertQuotationToInvoiceMutation()

  // Calculate totals from items
  const calculations = React.useMemo(() => {
    const whtRate = quotation.whtRate ?? 0
    let subtotal = 0
    let totalDiscount = 0
    let totalVat = 0
    let totalCost = 0

    quotation.items?.forEach(item => {
      const lineSubtotal = (item.quantity || 0) * (item.unitPrice || 0)
      const discountAmount = lineSubtotal * ((item.discountPercent || 0) / 100)
      const netAmount = lineSubtotal - discountAmount
      const vatAmount = netAmount * ((item.vatRate || 0) / 100)
      const lineCost = (item.quantity || 0) * (item.unitCost || 0)

      subtotal += lineSubtotal
      totalDiscount += discountAmount
      totalVat += vatAmount
      totalCost += lineCost
    })

    const netAmount = subtotal - totalDiscount
    const grossTotal = netAmount + totalVat
    const totalWht = netAmount * (whtRate / 100)
    const netReceivable = grossTotal - totalWht
    const totalProfit = netReceivable - totalCost

    return {
      subtotal,
      totalDiscount,
      netAmount,
      totalVat,
      grossTotal,
      totalWht,
      netReceivable,
      totalCost,
      totalProfit,
    }
  }, [quotation])

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = () => {
    router.push(`/quotations/${quotation._id}/edit`)
  }

  const handleConvertToInvoice = async () => {
    if (onConvertToInvoice) {
      onConvertToInvoice(quotation._id)
      return
    }

    // Use the mutation hook directly if no callback provided
    try {
      const result = await convertToInvoice(quotation._id).unwrap()
      toast.success('Quotation converted to invoice successfully!')
      router.push(`/invoices/${result.payload.invoiceId}`)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to convert quotation to invoice')
    }
  }

  const handleSendEmail = () => {
    if (onSendEmail) {
      onSendEmail(quotation._id)
    } else {
      toast.info('Send email functionality coming soon')
    }
  }

  const handleDownloadPdf = () => {
    if (onDownloadPdf) {
      onDownloadPdf(quotation._id)
    } else {
      toast.info('Download PDF functionality coming soon')
    }
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header with Actions */}
      <div className='bg-card rounded-xl shadow-sm border border-border p-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => router.back()}
              className='p-2 hover:bg-muted  rounded-lg transition-colors'
            >
              <ArrowLeftIcon className='h-5 w-5 text-muted-foreground' />
            </button>
            <div>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-bold text-foreground'>
                  {quotation.uniqueId || 'Quotation'}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}
                >
                  {statusConfig.icon} {quotation.status || 'Draft'}
                </span>
              </div>
              <p className='text-sm text-muted-foreground mt-1'>
                Created on {formatDate(quotation.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={handlePrint}
              className='px-4 py-2 bg-muted  text-secondary-foreground rounded-lg hover:bg-muted  transition-colors flex items-center gap-2 text-sm font-medium'
            >
              <PrinterIcon className='h-4 w-4' />
              Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className='px-4 py-2 bg-muted  text-secondary-foreground rounded-lg hover:bg-muted  transition-colors flex items-center gap-2 text-sm font-medium'
            >
              <DownloadIcon className='h-4 w-4' />
              PDF
            </button>
            <button
              onClick={handleSendEmail}
              className='px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2 text-sm font-medium'
            >
              <MailIcon className='h-4 w-4' />
              Send
            </button>
            <button
              onClick={handleEdit}
              className='px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-2 text-sm font-medium'
            >
              <PencilIcon className='h-4 w-4' />
              Edit
            </button>
            {quotation.status?.toLowerCase() !== 'converted' && !quotation.convertedToInvoice && (
              <button
                onClick={handleConvertToInvoice}
                disabled={isConverting}
                className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <ArrowRightIcon className='h-4 w-4' />
                {isConverting ? 'Converting...' : 'Convert to Invoice'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Customer & Dates Column */}
        <div className='space-y-6'>
          {/* Customer Card */}
          <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
            <div className='bg-linear-to-r from-blue-500 to-blue-600 px-5 py-3'>
              <div className='flex items-center gap-2'>
                <UserIcon className='h-5 w-5 text-white' />
                <h3 className='text-sm font-semibold text-white'>Customer</h3>
              </div>
            </div>
            <div className='p-5'>
              <div className='flex items-start gap-3'>
                <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0'>
                  {(quotation.customer?.companyName || quotation.customer?.fullName)
                    ?.charAt(0)
                    .toUpperCase() || '?'}
                </div>
                <div className='min-w-0'>
                  <p className='font-semibold text-foreground truncate'>
                    {quotation.customer?.companyName ||
                      quotation.customer?.fullName ||
                      'Unknown Customer'}
                  </p>
                  <p className='text-sm text-muted-foreground truncate'>
                    {quotation.customer?.email || 'No email'}
                  </p>
                  {quotation.customer?.phone && (
                    <p className='text-sm text-muted-foreground'>📞 {quotation.customer.phone}</p>
                  )}
                  {quotation.customer?.billingAddress && (
                    <>
                      <p className='text-sm text-muted-foreground mt-1'>
                        📍 {quotation.customer.billingAddress.street}
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {quotation.customer.billingAddress.city},{' '}
                        {quotation.customer.billingAddress.state}
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        📍 {quotation.customer.billingAddress.country}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dates Card */}
          <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
            <div className='bg-linear-to-r from-purple-500 to-purple-600 px-5 py-3'>
              <div className='flex items-center gap-2'>
                <CalendarIcon className='h-5 w-5 text-white' />
                <h3 className='text-sm font-semibold text-white'>Dates</h3>
              </div>
            </div>
            <div className='p-5 space-y-4'>
              <div>
                <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                  Issued Date
                </p>
                <p className='font-medium text-foreground'>{formatDate(quotation.issuedDate)}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                  Valid Until
                </p>
                <p className='font-medium text-foreground'>{formatDate(quotation.validUntil)}</p>
              </div>
              {quotation.validUntil && new Date(quotation.validUntil) < new Date() && (
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3'>
                  <p className='text-sm text-red-700 dark:text-red-400 font-medium'>
                    ⚠️ This quotation has expired
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Column */}
        <div className='lg:col-span-2'>
          <div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
            <div className='bg-linear-to-r from-primary to-primary-hover px-5 py-3'>
              <div className='flex items-center gap-2'>
                <DocumentIcon className='h-5 w-5 text-white' />
                <h3 className='text-sm font-semibold text-white'>
                  Line Items ({quotation.items?.length || 0})
                </h3>
              </div>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-muted/50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase'>
                      Description
                    </th>
                    <th className='px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase'>
                      Qty
                    </th>
                    <th className='px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase'>
                      Unit Price
                    </th>
                    <th className='px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase'>
                      VAT %
                    </th>
                    <th className='px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase'>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {quotation.items?.map(item => {
                    const lineSubtotal = (item.quantity || 0) * (item.unitPrice || 0)
                    const discountAmount = lineSubtotal * ((item.discountPercent || 0) / 100)
                    const lineTotal = lineSubtotal - discountAmount
                    return (
                      <tr
                        key={
                          item._id ||
                          `item-${item.product?._id}-${item.description}-${item.quantity}`
                        }
                        className='hover:bg-muted '
                      >
                        <td className='px-4 py-4'>
                          <p className='font-medium text-foreground'>{item.product?.name}</p>
                          {item.description && (
                            <p className='text-sm text-muted-foreground'>{item.description}</p>
                          )}
                          {(item.discountPercent ?? 0) > 0 && (
                            <span className='text-xs text-green-600 dark:text-green-400'>
                              {item.discountPercent}% discount applied
                            </span>
                          )}
                        </td>
                        <td className='px-3 py-4 text-center text-secondary-foreground'>
                          {item.quantity}
                        </td>
                        <td className='px-3 py-4 text-right text-secondary-foreground'>
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className='px-3 py-4 text-center text-secondary-foreground'>
                          {item.vatRate ?? 0}%
                        </td>
                        <td className='px-3 py-4 text-right font-semibold text-foreground'>
                          {formatCurrency(lineTotal)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className='border-t border-border p-5 bg-muted/30'>
              <div className='max-w-xs ml-auto space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-medium text-foreground'>
                    {formatCurrency(calculations.subtotal)}
                  </span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Discount</span>
                    <span className='font-medium text-green-600 dark:text-green-400'>
                      -{formatCurrency(calculations.totalDiscount)}
                    </span>
                  </div>
                )}
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>VAT</span>
                  <span className='font-medium text-foreground'>
                    +{formatCurrency(calculations.totalVat)}
                  </span>
                </div>
                <div className='border-t border-border pt-2'>
                  <div className='flex justify-between'>
                    <span className='font-semibold text-foreground'>Grand Total</span>
                    <span className='font-bold text-xl text-foreground'>
                      {formatCurrency(calculations.grossTotal)}
                    </span>
                  </div>
                </div>
                {(quotation.whtRate ?? 0) > 0 && (
                  <>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>WHT ({quotation.whtRate}%)</span>
                      <span className='font-medium text-red-600 dark:text-red-400'>
                        -{formatCurrency(calculations.totalWht)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Net Receivable</span>
                      <span className='font-semibold text-foreground'>
                        {formatCurrency(calculations.netReceivable)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      {(quotation.notes || quotation.terms) && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {quotation.notes && (
            <div className='bg-card rounded-xl shadow-sm border border-border p-5'>
              <h4 className='text-sm font-semibold text-foreground mb-3'>📝 Notes</h4>
              <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{quotation.notes}</p>
            </div>
          )}
          {quotation.terms && (
            <div className='bg-card rounded-xl shadow-sm border border-border p-5'>
              <h4 className='text-sm font-semibold text-foreground mb-3'>📋 Terms & Conditions</h4>
              <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{quotation.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
