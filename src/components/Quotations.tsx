'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Quotation, QuotationStatus, LineItem, Template, AccentColor, Invoice } from '../types'
// Fix: Import `CheckCircleIcon` from `./Icons` to resolve reference error.
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
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { TemplateSelectionModal } from './TemplateSelectionModal'
import { setQuotations } from '@/store/slices/quotationSlice'
import { setInvoiceToCreate } from '@/store/slices/invoiceSlice'
import Image from 'next/image'
import { defaultTerms } from './Invoices'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ACCENT_COLORS: Record<AccentColor, string> = {
  teal: '#14B8A6',
  blue: '#3B82F6',
  crimson: '#DC2626',
  slate: '#64748B',
}

// Helper function to generate company initials
const getCompanyInitials = (name: string): string => {
  if (!name) return '..'
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length > 1) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }
  if (words[0]?.length > 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  if (words[0]?.length === 1) {
    return words[0][0].toUpperCase()
  }
  return '..'
}

// Helper function to add company logo or initials fallback
const addCompanyLogoOrInitials = (
  doc: jsPDF,
  companyDetails: any,
  x: number,
  y: number,
  width: number,
  height: number,
  backgroundColor: string = '#3B82F6'
) => {
  let logoAdded = false

  // Try to add logo first
  if (companyDetails.logoUrl && companyDetails.logoUrl.startsWith('http')) {
    try {
      doc.addImage(companyDetails.logoUrl, 'PNG', x, y, width, height)
      logoAdded = true
    } catch (logoError) {
      console.warn('Could not load company logo:', logoError)
    }
  }
}

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
  const dispatch = useAppDispatch()
  const companyDetails = useAppSelector(state => state.company.details)
  const [searchTerm, setSearchTerm] = useState('')
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isViewModalOpen, setViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [newQuotationConfig, setNewQuotationConfig] = useState<{
    template: Template
    accentColor: AccentColor
  } | null>(null)
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

  const handleStartNewQuotation = (template: Template, accentColor: AccentColor) => {
    setNewQuotationConfig({ template, accentColor })
    setTemplateModalOpen(false)
    setCreateModalOpen(true)
  }

  const handleSaveQuotation = (quotation: Quotation) => {
    const index = quotations.findIndex(q => q.id === quotation.id)
    if (index > -1) {
      setQuotations(quotations.map(q => (q.id === quotation.id ? quotation : q)))
    } else {
      setQuotations([quotation, ...quotations])
    }
    setCreateModalOpen(false)
  }

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

  const generatePdf = (quotation: Quotation) => {
    const doc = new jsPDF()
    const accentColor = ACCENT_COLORS[quotation.accentColor]
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Template-specific headers
    if (quotation.template === 'modern' || quotation.template === 'corporate') {
      doc.setFillColor(accentColor)
      if (quotation.template === 'modern') {
        doc.rect(0, 0, pageWidth, 40, 'F')
        addCompanyLogoOrInitials(doc, companyDetails, 15, 10, 20, 16, accentColor)
        doc.setFontSize(22)
        doc.setTextColor('#FFFFFF')
        doc.text('QUOTATION', pageWidth - 15, 25, { align: 'right' })
      } else {
        // Corporate
        doc.rect(0, 0, 45, pageHeight, 'F')
        addCompanyLogoOrInitials(doc, companyDetails, 10, 15, 25, 18, accentColor)
        doc.setFontSize(10)
        doc.setTextColor('#FFFFFF')
        doc.text(companyDetails.name, 22.5, 40, { align: 'center' })
        doc.text(companyDetails.address, 22.5, 45, { align: 'center', maxWidth: 40 })
      }
    } else {
      // Classic, Minimalist, Creative
      addCompanyLogoOrInitials(doc, companyDetails, 15, 15, 30, 20, accentColor)
      doc.setFontSize(22)
      doc.setTextColor(accentColor)
      doc.text('QUOTATION', pageWidth - 15, 25, { align: 'right' })
      if (quotation.template === 'minimalist') doc.line(15, 40, pageWidth - 15, 40)
    }

    const startX = quotation.template === 'corporate' ? 55 : 15

    // Creative template watermark
    if (quotation.template === 'creative') {
      let watermarkAdded = false

      if (companyDetails.logoUrl && companyDetails.logoUrl.startsWith('http')) {
        try {
          doc.saveGraphicsState()
          doc.setGState(new (doc as any).GState({ opacity: 0.1 }))
          doc.addImage(
            companyDetails.logoUrl,
            'PNG',
            pageWidth / 4,
            pageHeight / 3,
            pageWidth / 2,
            pageHeight / 3
          )
          doc.restoreGraphicsState()
          watermarkAdded = true
        } catch (logoError) {
          console.warn('Could not load watermark logo:', logoError)
        }
      }

      // Fallback to initials watermark
      if (!watermarkAdded) {
        const initials = getCompanyInitials(companyDetails.name || 'Company')
        doc.saveGraphicsState()
        doc.setGState(new (doc as any).GState({ opacity: 0.05 }))
        doc.setFontSize(120)
        doc.setTextColor(accentColor)
        doc.setFont('helvetica', 'bold')
        doc.text(initials, pageWidth / 2, pageHeight / 2, { align: 'center' })
        doc.restoreGraphicsState()
      }
    }

    // Company and Client Details
    doc.setFontSize(10)
    doc.setTextColor(100)

    const companyX =
      quotation.template === 'modern' || quotation.template === 'corporate' ? startX : 15
    const clientX = pageWidth - 15
    const detailsY = quotation.template === 'modern' ? 50 : 45

    doc.text(companyDetails.name, companyX, detailsY)
    doc.text(companyDetails.address, companyX, detailsY + 5)
    doc.text(companyDetails.contact, companyX, detailsY + 10)

    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', clientX, detailsY, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.text(quotation.customerName, clientX, detailsY + 5, { align: 'right' })
    doc.text(quotation.customerAddress, clientX, detailsY + 10, { align: 'right', maxWidth: 60 })

    doc.setFontSize(12)
    doc.text(`Quotation #: ${quotation.id}`, startX, detailsY + 25)
    doc.text(`Date: ${quotation.date}`, startX, detailsY + 32)

    // Table
    const tableBody = quotation.items.map(item => [
      item.description,
      item.quantity,
      `$${item.unitPrice.toFixed(2)}`,
      `$${(item.quantity * item.unitPrice).toFixed(2)}`,
    ])

    autoTable(doc, {
      startY: detailsY + 40,
      head: [['Description', 'Quantity', 'Unit Price', 'Total']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: accentColor },
      margin: { left: startX, right: 15 },
    })

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10
    const totalX = pageWidth - 15
    doc.setFontSize(10)
    doc.text('Subtotal:', totalX - 30, finalY, { align: 'right' })
    doc.text(`$${quotation.subtotal.toFixed(2)}`, totalX, finalY, { align: 'right' })
    doc.text(`VAT (${quotation.vatRate}%):`, totalX - 30, finalY + 7, { align: 'right' })
    doc.text(`$${quotation.vat.toFixed(2)}`, totalX, finalY + 7, { align: 'right' })
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Total:', totalX - 30, finalY + 14, { align: 'right' })
    doc.text(`$${quotation.total.toFixed(2)}`, totalX, finalY + 14, { align: 'right' })

    // Terms
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('Terms & Conditions', startX, finalY + 30)
    doc.setFont('helvetica', 'normal')
    doc.text(quotation.terms, startX, finalY + 35, { maxWidth: pageWidth - startX - 15 })

    doc.save(`Quotation-${quotation.id}.pdf`)
    setActiveDropdown(null)
  }

  const handleConvertToInvoice = (quotationId: string) => {
    const quotation = quotations.find(q => q.id === quotationId)
    if (quotation) {
      const currentDate = new Date()
      const dueDate = new Date(currentDate)
      dueDate.setDate(currentDate.getDate() + 30) // Default 30 days payment term

      const newInvoice: Partial<Invoice> = {
        id: `inv-${Date.now()}`,
        customerName: quotation.customerName,
        customerAddress: quotation.customerAddress,
        date: currentDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Draft' as any,
        items: quotation.items.map(item => ({
          id: `li-${Date.now()}-${Math.random()}`,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          sku: (item as any).sku, // Ensure SKU is carried over
        })),
        subtotal: quotation.subtotal,
        vat: quotation.vat,
        total: quotation.total,
        terms: quotation.terms,
        quotationId: quotation.id,
        template: quotation.template,
        accentColor: quotation.accentColor,
      }
      dispatch(setInvoiceToCreate(newInvoice))
      showToastMessage(`Quotation ${quotation.id} successfully converted to invoice!`)
      setActiveDropdown(null)
    }
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
          onClick={() => setTemplateModalOpen(true)}
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
                                onClick={() => openModal(setCreateModalOpen, q)}
                                className='w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                              >
                                <PencilIcon className='w-5 h-5 mr-3' />
                                Edit
                              </button>
                            )}
                            {q.status === 'Accepted' && (
                              <button
                                onClick={() => handleConvertToInvoice(q.id)}
                                className='w-full text-left flex items-center px-4 py-2 text-sm text-teal-600 dark:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold'
                              >
                                <CheckCircleIcon className='w-5 h-5 mr-3' />
                                Convert to Invoice
                              </button>
                            )}
                            <button
                              onClick={() => generatePdf(q)}
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

      {isTemplateModalOpen && (
        <TemplateSelectionModal
          onContinue={handleStartNewQuotation}
          onClose={() => setTemplateModalOpen(false)}
        />
      )}
      {isCreateModalOpen && (
        <NewQuotationModal
          quotation={selectedQuotation}
          newQuotationConfig={newQuotationConfig}
          onSave={handleSaveQuotation}
          onClose={() => {
            setCreateModalOpen(false)
            setSelectedQuotation(null)
          }}
        />
      )}
      {isViewModalOpen && selectedQuotation && (
        <QuotationPreviewModal
          quotation={selectedQuotation}
          companyDetails={companyDetails}
          onClose={() => setViewModalOpen(false)}
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

const NewQuotationModal: React.FC<{
  quotation: Quotation | null
  newQuotationConfig: { template: Template; accentColor: AccentColor } | null
  onSave: (q: Quotation) => void
  onClose: () => void
}> = ({ quotation, newQuotationConfig, onSave, onClose }) => {
  const now = new Date().getTime()

  // Separate base form data from calculated values
  const [baseFormData, setBaseFormData] = useState({
    id: quotation?.id || `q-${now}`,
    customerName: quotation?.customerName || '',
    customerAddress: quotation?.customerAddress || '',
    date: quotation?.date || new Date(now).toISOString().split('T')[0],
    status: quotation?.status || ('Draft' as QuotationStatus),
    items: quotation?.items || [
      {
        id: `li-${now}-0`,
        description: '',
        quantity: 1,
        sellingPricePercentage: 10,
        costPrice: 0,
        unitPrice: 0,
        sku: '',
      },
    ],
    terms: quotation?.terms || defaultTerms,
    vatRate: quotation?.vatRate || 7.5,
    whtRate: quotation?.whtRate || 5,
    template: quotation?.template || newQuotationConfig?.template || 'classic',
    accentColor: quotation?.accentColor || newQuotationConfig?.accentColor || 'teal',
  })

  // Calculate derived values using useMemo
  const calculatedValues = useMemo(() => {
    const newItems = baseFormData.items.map(item => {
      const sellingPrice = item.costPrice + item.costPrice * (item.sellingPricePercentage / 100)
      return { ...item, unitPrice: sellingPrice }
    })
    const subtotal = newItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
    const vat = subtotal * (baseFormData.vatRate / 100)
    const total = subtotal + vat
    return { items: newItems, subtotal, vat, total }
  }, [baseFormData.items, baseFormData.vatRate])

  // Combine base data with calculated values for the complete form data
  const formData = useMemo(
    () => ({
      ...baseFormData,
      ...calculatedValues,
    }),
    [baseFormData, calculatedValues]
  )

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...baseFormData.items]
    const item = newItems[index]
    ;(item as any)[field] = field === 'description' || field === 'sku' ? value : Number(value) || 0
    setBaseFormData({ ...baseFormData, items: newItems })
  }

  const addItem = () =>
    setBaseFormData({
      ...baseFormData,
      items: [
        ...baseFormData.items,
        {
          id: `li-${Date.now()}`,
          description: '',
          quantity: 1,
          sellingPricePercentage: 10,
          costPrice: 0,
          unitPrice: 0,
          sku: '',
        },
      ],
    })
  const removeItem = (index: number) =>
    setBaseFormData({ ...baseFormData, items: baseFormData.items.filter((_, i) => i !== index) })
  const totalProfit = formData.items.reduce((acc, item) => {
    const lineTotal = item.unitPrice * item.quantity
    const paymentAfterWHT = lineTotal * (1 - formData.whtRate / 100)
    const totalCost = item.costPrice * item.quantity
    const profit = paymentAfterWHT - totalCost
    return acc + profit
  }, 0)

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{quotation ? 'Edit' : 'Create New'} Quotation</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <input
            type='text'
            placeholder='Customer Name'
            value={formData.customerName}
            onChange={e => setBaseFormData({ ...baseFormData, customerName: e.target.value })}
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <input
            type='text'
            placeholder='Customer Address'
            value={formData.customerAddress}
            onChange={e => setBaseFormData({ ...baseFormData, customerAddress: e.target.value })}
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          <div>
            <label className='text-xs text-gray-500'>Date</label>
            <input
              type='date'
              value={formData.date}
              onChange={e => setBaseFormData({ ...baseFormData, date: e.target.value })}
              className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
          </div>
          <div>
            <label className='text-xs text-gray-500'>Status</label>
            <select
              value={formData.status}
              onChange={e =>
                setBaseFormData({ ...baseFormData, status: e.target.value as QuotationStatus })
              }
              className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            >
              {['Draft', 'Sent', 'Accepted', 'Rejected'].map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='text-xs text-gray-500'>VAT (%)</label>
            <input
              type='number'
              value={formData.vatRate}
              onChange={e => setBaseFormData({ ...baseFormData, vatRate: Number(e.target.value) })}
              className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
          </div>
          <div>
            <label className='text-xs text-gray-500'>WHT (%)</label>
            <input
              type='number'
              value={formData.whtRate}
              onChange={e => setBaseFormData({ ...baseFormData, whtRate: Number(e.target.value) })}
              className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
          </div>
        </div>
        {/* Line Items */}
        <div className='mb-4 space-y-4'>
          <h3 className='font-semibold text-gray-900 dark:text-white'>Line Items</h3>
          {formData.items.map((item, index) => {
            const lineTotal = item.unitPrice * item.quantity
            const paymentAfterWHT = lineTotal * (1 - formData.whtRate / 100)
            const totalCost = item.costPrice * item.quantity
            const profit = paymentAfterWHT - totalCost
            return (
              <div
                key={item.id}
                className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4 relative'
              >
                <button
                  onClick={() => removeItem(index)}
                  className='absolute top-2 right-2 text-red-500 hover:text-red-700'
                  title='Remove Item'
                >
                  <TrashIcon className='w-4 h-4' />
                </button>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                      Description
                    </label>
                    <input
                      type='text'
                      placeholder='Item description'
                      value={item.description}
                      onChange={e => handleItemChange(index, 'description', e.target.value)}
                      className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                      SKU (Optional)
                    </label>
                    <input
                      type='text'
                      placeholder='Item SKU'
                      value={item.sku}
                      onChange={e => handleItemChange(index, 'sku', e.target.value)}
                      className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                      Qty
                    </label>
                    <input
                      type='number'
                      value={item.quantity}
                      onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                      className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                      Cost Price (₦)
                    </label>
                    <input
                      type='number'
                      value={item.costPrice}
                      onChange={e => handleItemChange(index, 'costPrice', e.target.value)}
                      className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                      Markup (%)
                    </label>
                    <input
                      type='number'
                      value={item.sellingPricePercentage}
                      onChange={e =>
                        handleItemChange(index, 'sellingPricePercentage', e.target.value)
                      }
                      className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
                    />
                  </div>
                </div>
                <div className='text-xs mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1 text-gray-700 dark:text-gray-300'>
                  <div className='flex justify-between'>
                    <span className='font-semibold text-gray-500 dark:text-gray-400'>
                      Unit Selling Price:
                    </span>{' '}
                    <span>
                      ₦{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-semibold text-gray-500 dark:text-gray-400'>
                      Line Total:
                    </span>{' '}
                    <span className='font-bold'>
                      ₦{lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <hr className='border-gray-200 dark:border-gray-700' />
                  <div className='flex justify-between'>
                    <span className='font-semibold text-gray-500 dark:text-gray-400'>
                      Payment After WHT:
                    </span>{' '}
                    <span>
                      ₦{paymentAfterWHT.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-semibold text-gray-500 dark:text-gray-400'>
                      Profit on Line:
                    </span>{' '}
                    <span className={`font-bold ${profit < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ₦{profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          <button
            onClick={addItem}
            className='text-teal-500 font-semibold mt-2 hover:text-teal-600'
          >
            + Add Item
          </button>
        </div>
        <div className='flex justify-end mb-4'>
          <div className='w-full max-w-sm text-right space-y-1 text-gray-800 dark:text-gray-200'>
            <p className='flex justify-between'>
              <span className='text-gray-500 dark:text-gray-400'>Subtotal:</span>
              <span>
                ₦{formData.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </p>
            <p className='flex justify-between'>
              <span className='text-gray-500 dark:text-gray-400'>VAT ({formData.vatRate}%):</span>
              <span>₦{formData.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
            <div className='w-full h-px bg-gray-300 dark:bg-gray-600 my-2'></div>
            <p className='flex justify-between font-bold text-lg mt-1'>
              <span>Total:</span>
              <span>₦{formData.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
            <p className='flex justify-between font-bold text-teal-600 dark:text-teal-400 mt-1'>
              <span>Est. Total Profit:</span>
              <span>₦{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
          </div>
        </div>
        <textarea
          value={formData.terms}
          onChange={e => setBaseFormData({ ...baseFormData, terms: e.target.value })}
          rows={3}
          className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-4'
          placeholder='Terms & Conditions...'
        ></textarea>
        <div className='flex justify-end'>
          <button onClick={onClose} className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'>
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className='px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600'
          >
            Save Quotation
          </button>
        </div>
      </div>
    </div>
  )
}

const QuotationPreviewModal: React.FC<{
  quotation: Quotation
  companyDetails: any
  onClose: () => void
}> = ({ quotation, companyDetails, onClose }) => {
  const accentColor = ACCENT_COLORS[quotation.accentColor]
  const accentColorLight = {
    teal: 'bg-teal-50',
    blue: 'bg-blue-50',
    crimson: 'bg-red-50',
    slate: 'bg-slate-50',
  }[quotation.accentColor]
  const textColor = {
    teal: 'text-teal-600',
    blue: 'text-blue-600',
    crimson: 'text-red-600',
    slate: 'text-slate-600',
  }[quotation.accentColor]

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col'>
        <div className='p-4 border-b dark:border-gray-700 flex justify-between items-center'>
          <h2 className='text-xl font-bold'>Quotation Preview</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <div className='p-8 overflow-y-auto'>
          {/* Render different templates */}
          {quotation.template === 'modern' && (
            <div
              style={{ backgroundColor: accentColor }}
              className='p-8 text-white rounded-t-lg flex justify-between items-center'
            >
              {companyDetails.logoUrl && (
                <Image
                  src={companyDetails?.logoUrl}
                  alt='Company Logo'
                  className='h-16 w-auto'
                  width={40}
                  height={40}
                />
              )}
              <h1 className='text-4xl font-bold uppercase'>Quotation</h1>
            </div>
          )}
          <div className='p-8'>
            <div className='grid grid-cols-2 gap-8 mb-8'>
              <div>
                {quotation.template !== 'modern' && companyDetails?.logoUrl && (
                  <Image
                    src={companyDetails.logoUrl}
                    alt='Company Logo'
                    className='h-16 w-auto mb-4'
                    width={40}
                    height={40}
                  />
                )}
                <p className='font-bold'>{companyDetails.name}</p>
                <p>{companyDetails.address}</p>
                <p>{companyDetails.contact}</p>
              </div>
              <div className='text-right'>
                {quotation.template !== 'modern' && (
                  <h1 className='text-4xl font-bold uppercase mb-4' style={{ color: accentColor }}>
                    Quotation
                  </h1>
                )}
                <p>
                  <span className='font-bold'>Quotation #:</span> {quotation.id}
                </p>
                <p>
                  <span className='font-bold'>Date:</span> {quotation.date}
                </p>
                <div className='mt-4'>
                  <p className='font-bold'>Bill To:</p>
                  <p>{quotation.customerName}</p>
                  <p>{quotation.customerAddress}</p>
                </div>
              </div>
            </div>

            <table className='w-full text-left mb-8'>
              <thead>
                <tr style={{ backgroundColor: accentColor }} className='text-white'>
                  <th className='p-3'>Description</th>
                  <th className='p-3 text-right'>Quantity</th>
                  <th className='p-3 text-right'>Unit Price</th>
                  <th className='p-3 text-right'>Total</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map(item => (
                  <tr key={item.id} className='border-b dark:border-gray-700'>
                    <td className='p-3'>{item.description}</td>
                    <td className='p-3 text-right'>{item.quantity}</td>
                    <td className='p-3 text-right'>${item.unitPrice.toFixed(2)}</td>
                    <td className='p-3 text-right'>
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-end'>
              <div className='w-full max-w-xs space-y-2'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>${quotation.subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>VAT ({quotation.vatRate}%)</span>
                  <span>${quotation.vat.toFixed(2)}</span>
                </div>
                <div className='border-t dark:border-gray-600 my-2'></div>
                <div className='flex justify-between font-bold text-lg'>
                  <span style={{ color: accentColor }}>Total</span>
                  <span style={{ color: accentColor }}>${quotation.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className='mt-8'>
              <h4 className='font-bold text-lg mb-2' style={{ color: accentColor }}>
                Terms & Conditions
              </h4>
              <p className='text-xs whitespace-pre-line'>{quotation.terms}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm'>
        <h3 className='text-lg font-bold mb-2'>Confirm Deletion</h3>
        <p className='text-gray-600 dark:text-gray-400 mb-4'>
          Are you sure? This action cannot be undone.
        </p>
        <div className='flex justify-end'>
          <button
            onClick={onCancel}
            className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quotations
