'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Quotation, QuotationStatus } from '../types'
import {
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
  DotsVerticalIcon,
  PlusIcon,
  CheckCircleIcon,
} from './Icons'
import { useAppSelector } from '../store/hooks'
import { setQuotations } from '@/store/slices/quotationSlice'
import DeleteConfirmationModal from './shared/DeleteConfirmationModal'
import PdfPreviewModal from './templates/PdfPreviewModal'
import useGeneratePdf from '@/hooks/useGeneratePdf'

const StatusBadge: React.FC<{ status: QuotationStatus }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block'
  const statusClasses = {
    Accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
}

const Quotations = () => {
  const router = useRouter()
  const { generatePdf } = useGeneratePdf()
  const [searchTerm, setSearchTerm] = useState('')
  const [isViewModalOpen, setViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { quotations } = useAppSelector(state => state.quotation)
  const filteredQuotations = quotations.filter(
    q =>
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setDeleteModalOpen(true)
    setActiveDropdown(null)
  }

  const confirmDelete = () => {
    if (selectedQuotation) {
      setQuotations(quotations.filter(q => q.id !== selectedQuotation.id))
      setDeleteModalOpen(false)
      setSelectedQuotation(null)
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

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000) // Hide after 3 seconds
  }

  const downloadPdf = async (quotation: Quotation) => {
    await generatePdf(quotation, `REQUEST FOR QUOTATION`, 'QUOTATION')
    setActiveDropdown(null)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Quotations</h1>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>Create and manage your quotations.</p>
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
          onClick={() => router.push('/quotations/create')}
          className='flex items-center bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors'
        >
          <PlusIcon className='w-5 h-5 mr-0 sm:mr-2' />
          <span className='hidden sm:inline'>Create New Quotation</span>
          <span className='inline sm:hidden'>Add Quote</span>
        </button>
      </div>
      <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>ID</th>
              <th className='px-6 py-3'>Customer</th>
              <th className='px-6 py-3 hidden md:table-cell'>Date</th>
              <th className='px-6 py-3 hidden md:table-cell text-right'>Total Cost Price</th>
              <th className='px-6 py-3 hidden md:table-cell text-right'>Avg. Markup (%)</th>
              <th className='px-6 py-3 hidden md:table-cell text-right'>Est. Profit</th>
              <th className='px-6 py-3'>Total Sale</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.map(q => {
              const totalCost = q.items.reduce(
                (acc, item) => acc + item.costPrice * item.quantity,
                0
              )
              const overallMarkup = totalCost > 0 ? ((q.subtotal - totalCost) / totalCost) * 100 : 0
              const totalProfit = q.subtotal * (1 - q.whtRate / 100) - totalCost

              return (
                <tr
                  key={q.id}
                  className='border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <td className='px-6 py-4 font-medium'>{q.id}</td>
                  <td className='px-6 py-4'>{q.customerName}</td>
                  <td className='px-6 py-4 hidden md:table-cell'>{q.date}</td>
                  <td className='px-6 py-4 hidden md:table-cell text-right text-sm text-gray-500 dark:text-gray-400'>
                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className='px-6 py-4 hidden md:table-cell text-right text-sm text-gray-500 dark:text-gray-400'>
                    {overallMarkup.toFixed(1)}%
                  </td>
                  <td
                    className={`px-6 py-4 hidden md:table-cell text-right font-semibold ${totalProfit < 0 ? 'text-red-500' : 'text-green-500'}`}
                  >
                    ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className='px-6 py-4 font-semibold'>
                    ${q.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className='px-6 py-4'>
                    <StatusBadge status={q.status} />
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <div
                      className='relative inline-block text-left'
                      ref={activeDropdown === q.id ? dropdownRef : null}
                    >
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === q.id ? null : q.id)}
                        className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                      >
                        <DotsVerticalIcon className='w-5 h-5' />
                      </button>
                      {activeDropdown === q.id && (
                        <div className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
                          <div className='py-1'>
                            <button
                              onClick={() => openModal(setViewModalOpen, q)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            >
                              <EyeIcon className='w-5 h-5 mr-3' />
                              View
                            </button>
                            {(q.status === 'Draft' || q.status === 'Sent') && (
                              <button
                                onClick={() => router.push(`/quotations/edit/${q.id}`)}
                                className='w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                              >
                                <PencilIcon className='w-5 h-5 mr-3' />
                                Edit
                              </button>
                            )}
                            {q.status === 'Accepted' && (
                              <button
                                // onClick={() => handleConvertToInvoice(q.id)}
                                className='w-full text-left flex items-center px-4 py-2 text-sm text-teal-600 dark:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold'
                              >
                                <CheckCircleIcon className='w-5 h-5 mr-3' />
                                Convert to Invoice
                              </button>
                            )}
                            <button
                              onClick={() => downloadPdf(q)}
                              className='w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            >
                              <DownloadIcon className='w-5 h-5 mr-3' />
                              Download PDF
                            </button>
                            <div className='border-t border-gray-100 dark:border-gray-700 my-1'></div>
                            <button
                              onClick={() => handleDelete(q)}
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
              )
            })}
          </tbody>
        </table>
      </div>

      {isViewModalOpen && selectedQuotation && (
        <PdfPreviewModal
          pdfData={selectedQuotation}
          onClose={() => setViewModalOpen(false)}
          documentTitle={`Quotation ${selectedQuotation.id}`}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className='fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ease-in-out transform animate-pulse'>
          <CheckCircleIcon className='w-5 h-5' />
          <span className='font-medium'>{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className='ml-2 text-white hover:text-gray-200 transition-colors'
          >
            <XIcon className='w-4 h-4' />
          </button>
        </div>
      )}
    </div>
  )
}

export default Quotations
