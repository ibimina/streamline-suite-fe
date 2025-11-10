'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Invoice, InvoiceStatus } from '../types'
import {
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DotsVerticalIcon,
  PlusIcon,
  CheckCircleIcon,
} from './Icons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setInvoices, updateInvoiceStatus } from '@/store/slices/invoiceSlice'
import { useRouter } from 'next/navigation'
import DeleteConfirmationModal from './shared/DeleteConfirmationModal'
import PdfPreviewModal from './templates/PdfPreviewModal'
import useGeneratePdf from '@/hooks/useGeneratePdf'

export const defaultTerms = `1. Payment is due within 30 days of the invoice date.
2. Late payments are subject to a 1.5% monthly interest charge.
3. Please make all checks payable to Your Company Name.`
// --- END MOCK DATA ---

const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block'
  const statusClasses = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
    Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
}

const Invoices = () => {
  const route = useRouter()
  const { generatePdf } = useGeneratePdf()

  const { invoices } = useAppSelector(state => state.invoice)
  const [searchTerm, setSearchTerm] = useState('')
  const [isViewModalOpen, setViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()

  const filteredInvoices = invoices.filter(
    i =>
      i?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      i?.customerName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  )

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

  const confirmDelete = () => {
    if (selectedInvoice) {
      dispatch(setInvoices(invoices.filter(i => i.id !== selectedInvoice.id)))
      setDeleteModalOpen(false)
      setSelectedInvoice(null)
    }
  }

  const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>, invoice?: Invoice) => {
    setSelectedInvoice(invoice || null)
    setter(true)
    setActiveDropdown(null)
  }

  const downloadPdf = async (invoice: Invoice) => {
    await generatePdf(invoice, `REQUEST FOR INVOICE`, 'INVOICE')
    setActiveDropdown(null)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Invoices</h1>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          Manage, track, and send customer invoices.
        </p>
      </div>
      <div className='flex justify-between items-center'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full max-w-xs pl-4 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500'
        />
        <button
          onClick={() => route.push('/invoices/create')}
          className='flex items-center bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors'
        >
          <PlusIcon className='w-5 h-5 mr-0 sm:mr-2' />
          <span className='hidden sm:inline'>Create New Invoice</span>
          <span className='inline sm:hidden'>Add Invoice</span>
        </button>
      </div>
      <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>ID</th>
              <th className='px-6 py-3'>Customer</th>
              <th className='px-6 py-3 hidden md:table-cell'>Due Date</th>
              <th className='px-6 py-3'>Total</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(i => (
              <tr
                key={i.id}
                className='border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                <td className='px-6 py-4 font-medium'>
                  {i?.id}
                  {i?.quotationId && (
                    <span className='block text-xs text-gray-500'>From {i?.quotationId}</span>
                  )}
                </td>
                <td className='px-6 py-4'>{i?.customerName}</td>
                <td className='px-6 py-4 hidden md:table-cell'>{i?.dueDate}</td>
                <td className='px-6 py-4 font-semibold'>
                  ${i?.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className='px-6 py-4'>
                  <StatusBadge status={i.status} />
                </td>
                <td className='px-6 py-4 text-center'>
                  <div
                    className='relative inline-block text-left'
                    ref={activeDropdown === i.id ? dropdownRef : null}
                  >
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === i.id ? null : i.id)}
                      className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                    >
                      <DotsVerticalIcon className='w-5 h-5' />
                    </button>
                    {activeDropdown === i.id && (
                      <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
                        <div className='py-1'>
                          <button
                            onClick={() => openModal(setViewModalOpen, i)}
                            className='w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          >
                            <EyeIcon className='w-5 h-5 mr-3' />
                            View
                          </button>
                          {i.status === 'Draft' && (
                            <button
                              onClick={() => route.push(`/invoices/${i.id}`)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            >
                              <PencilIcon className='w-5 h-5 mr-3' />
                              Edit
                            </button>
                          )}
                          {(i.status === 'Sent' || i.status === 'Overdue') && (
                            <button
                              onClick={() =>
                                dispatch(updateInvoiceStatus({ invoiceId: i.id, status: 'Paid' }))
                              }
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            >
                              <CheckCircleIcon className='w-5 h-5 mr-3' />
                              Mark as Paid
                            </button>
                          )}
                          <button
                            onClick={() => downloadPdf(i)}
                            className='w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          >
                            <DownloadIcon className='w-5 h-5 mr-3' />
                            Download PDF
                          </button>
                          <button
                            onClick={() => handleDelete(i)}
                            className='w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700'
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
            ))}
          </tbody>
        </table>
      </div>

      {isViewModalOpen && selectedInvoice && (
        <PdfPreviewModal
          pdfData={selectedInvoice}
          onClose={() => setViewModalOpen(false)}
          documentTitle={`Invoice ${selectedInvoice.id}`}
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
