'use client'
import React, { useState, useRef, useEffect } from 'react'
import { InvoiceStatus } from '../types'
import {
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DotsVerticalIcon,
  PlusIcon,
  CheckCircleIcon,
} from './Icons'
import { useRouter } from 'next/navigation'
import DeleteConfirmationModal from './shared/DeleteConfirmationModal'
import PdfPreviewModal from './templates/PdfPreviewModal'
import useGeneratePdf from '@/hooks/useGeneratePdf'
import {
  useGetInvoicesQuery,
  useDeleteInvoiceMutation,
  useUpdateInvoiceStatusMutation,
} from '@/store/api'
import { Invoice } from '@/types/invoice.type'
import { StatusBadge } from './shared/StatusBadge'
import { SkeletonTable } from './ui/skeleton'
import { EmptyInvoices } from './shared/EmptyState'
import { Button } from './ui/button'

export const defaultTerms = `1. Payment is due within 30 days of the invoice date.
2. Late payments are subject to a 1.5% monthly interest charge.
3. Please make all checks payable to Your Company Name.`

// Map invoice status to StatusBadge status prop
const mapInvoiceStatus = (
  status: string
): 'paid' | 'sent' | 'draft' | 'overdue' | 'cancelled' | 'partial' => {
  const statusMap: Record<string, 'paid' | 'sent' | 'draft' | 'overdue' | 'cancelled' | 'partial'> =
    {
      paid: 'paid',
      sent: 'sent',
      draft: 'draft',
      overdue: 'overdue',
      cancelled: 'cancelled',
      partially_paid: 'partial',
    }
  return statusMap[status.toLowerCase()] || 'draft'
}

const Invoices = () => {
  const route = useRouter()
  const { generatePdf } = useGeneratePdf()

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
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
  })
  const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation()
  const [updateInvoiceStatus, { isLoading: isUpdatingStatus }] = useUpdateInvoiceStatusMutation()

  const [isViewModalOpen, setViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const invoices = invoicesData?.payload?.data || []

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
    const legacyInvoice = {
      id: invoice._id,
      clientName: typeof invoice.customer === 'object' ? invoice.customer.companyName : '',
      clientAddress:
        typeof invoice.customer === 'object' && invoice.customer.billingAddress
          ? `${invoice.customer.billingAddress.street}, ${invoice.customer.billingAddress.city}`
          : '',
      issueDate: invoice.issuedDate,
      dueDate: invoice.dueDate,
      status: invoice.status as InvoiceStatus,
      items: invoice.items.map(item => ({
        id: item.id || '',
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice,
        sku: item.sku || '',
      })),
      subtotal: invoice.subtotal,
      vat: invoice.totalVat || 0,
      total: invoice.grandTotal,
      terms: invoice.terms || defaultTerms,
      quotationId: invoice.quotation,
      template: invoice.template || 'classic',
      accentColor: invoice.accentColor || 'teal',
    }
    await generatePdf(legacyInvoice as any, `REQUEST FOR INVOICE`, 'INVOICE')
    setActiveDropdown(null)
  }

  const getCustomerName = (invoice: Invoice) => {
    if (typeof invoice.customer === 'object' && invoice.customer) {
      return invoice.customer.companyName
    }
    return 'Unknown Customer'
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Invoices</h1>
          <p className='text-muted-foreground mt-1'>Manage, track, and send customer invoices.</p>
        </div>
        <div className='bg-card p-6 rounded-xl shadow-card border border-border'>
          <SkeletonTable rows={5} columns={6} />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-destructive mb-4'>Failed to load invoices</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Invoices</h1>
        <p className='text-muted-foreground mt-1'>Manage, track, and send customer invoices.</p>
      </div>
      <div className='flex justify-between items-center'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full max-w-xs pl-4 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
        />
        <Button onClick={() => route.push('/invoices/create')}>
          <PlusIcon className='w-5 h-5 mr-0 sm:mr-2' />
          <span className='hidden sm:inline'>Create New Invoice</span>
          <span className='inline sm:hidden'>Add</span>
        </Button>
      </div>
      <div className='bg-card p-4 rounded-xl shadow-card border border-border overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-muted-foreground uppercase bg-muted'>
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
                <td colSpan={6} className='px-6 py-4'>
                  <EmptyInvoices onAction={() => route.push('/invoices/create')} />
                </td>
              </tr>
            ) : (
              invoices.map(invoice => (
                <tr
                  key={invoice._id}
                  className='border-b border-border hover:bg-muted/50 transition-colors'
                >
                  <td className='px-6 py-4 font-medium text-foreground'>
                    {invoice.uniqueId || invoice._id}
                    {invoice.quotation && (
                      <span className='block text-xs text-muted-foreground'>From Quote</span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-foreground'>{getCustomerName(invoice)}</td>
                  <td className='px-6 py-4 hidden md:table-cell text-foreground'>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 font-semibold text-foreground'>
                    ${invoice.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className='px-6 py-4'>
                    <StatusBadge status={mapInvoiceStatus(invoice.status)} />
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
                        className='p-2 rounded-full hover:bg-accent transition-colors'
                      >
                        <DotsVerticalIcon className='w-5 h-5 text-muted-foreground' />
                      </button>
                      {activeDropdown === invoice._id && (
                        <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-dropdown bg-popover border border-border focus:outline-none z-10'>
                          <div className='py-1'>
                            <button
                              onClick={() => openModal(setViewModalOpen, invoice)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors'
                            >
                              <EyeIcon className='w-5 h-5 mr-3' />
                              View
                            </button>
                            {invoice.status === 'Draft' && (
                              <button
                                onClick={() => route.push(`/invoices/${invoice._id}`)}
                                className='w-full text-left flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors'
                              >
                                <PencilIcon className='w-5 h-5 mr-3' />
                                Edit
                              </button>
                            )}
                            {(invoice.status === 'Sent' || invoice.status === 'Overdue') && (
                              <button
                                onClick={() => handleMarkAsPaid(invoice)}
                                disabled={isUpdatingStatus}
                                className='w-full text-left flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors disabled:opacity-50'
                              >
                                <CheckCircleIcon className='w-5 h-5 mr-3' />
                                Mark as Paid
                              </button>
                            )}
                            <button
                              onClick={() => downloadPdf(invoice)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors'
                            >
                              <DownloadIcon className='w-5 h-5 mr-3' />
                              Download PDF
                            </button>
                            <button
                              onClick={() => handleDelete(invoice)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive-light transition-colors'
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
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= invoicesData.payload.total}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {isViewModalOpen && selectedInvoice && (
        <PdfPreviewModal
          pdfData={
            {
              id: selectedInvoice._id,
              clientName: getCustomerName(selectedInvoice),
              clientAddress:
                typeof selectedInvoice.customer === 'object' &&
                selectedInvoice.customer.billingAddress
                  ? `${selectedInvoice.customer.billingAddress.street}, ${selectedInvoice.customer.billingAddress.city}`
                  : '',
              issueDate: selectedInvoice.issuedDate,
              dueDate: selectedInvoice.dueDate,
              status: selectedInvoice.status as InvoiceStatus,
              items: selectedInvoice.items.map(item => ({
                id: item.id || '',
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.quantity * item.unitPrice,
                sku: item.sku || '',
              })),
              subtotal: selectedInvoice.subtotal,
              vat: selectedInvoice.totalVat || 0,
              total: selectedInvoice.grandTotal,
              terms: selectedInvoice.terms || defaultTerms,
              template:
                (selectedInvoice.template as
                  | 'classic'
                  | 'modern'
                  | 'minimalist'
                  | 'corporate'
                  | 'creative'
                  | 'custom') || 'classic',
              accentColor:
                (selectedInvoice.accentColor as 'teal' | 'blue' | 'crimson' | 'slate') || 'teal',
            } as any
          }
          onClose={() => setViewModalOpen(false)}
          documentTitle={`Invoice ${selectedInvoice.uniqueId || selectedInvoice._id}`}
          documentType='INVOICE'
          title=''
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
