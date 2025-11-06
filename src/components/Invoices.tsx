'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Invoice, InvoiceStatus, InvoiceLineItem, Template, AccentColor } from '../types'
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
import { setInvoices, updateInvoiceStatus } from '@/store/slices/invoiceSlice'

// Fix: Add declaration for jsPDF on the window object to resolve TypeScript error.
declare global {
  interface Window {
    jspdf: any
  }
}

// --- MOCK DATA ---
// --- CONFIGURATION ---
const VAT_RATE = 0.075 // 7.5%
const ACCENT_COLORS: Record<AccentColor, string> = {
  teal: '#14B8A6',
  blue: '#3B82F6',
  crimson: '#DC2626',
  slate: '#64748B',
}
export const defaultTerms = `1. Payment is due within 30 days of the invoice date.
2. Late payments are subject to a 1.5% monthly interest charge.
3. Please make all checks payable to Your Company Name.`

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-2024-001',
    customerName: 'Tech Solutions',
    customerAddress: '123 Tech Avenue, Silicon Valley, CA 94043',
    date: '2024-07-29',
    dueDate: '2024-08-28',
    status: 'Paid',
    items: [
      {
        id: '1',
        description: 'Server Setup & Configuration',
        quantity: 1,
        unitPrice: 2500,
        sku: 'HW-SRV-001',
      },
    ],
    subtotal: 2500,
    vat: 187.5,
    total: 2687.5,
    terms: defaultTerms,
    quotationId: 'q-2024-001',
    template: 'classic',
    accentColor: 'teal',
  },
  {
    id: 'inv-2024-002',
    customerName: 'Global Corp',
    customerAddress: '456 Business Blvd, New York, NY 10001',
    date: '2024-07-26',
    dueDate: '2024-08-25',
    status: 'Sent',
    items: [
      { id: '1', description: 'Network Security Audit', quantity: 1, unitPrice: 4000, sku: '' },
    ],
    subtotal: 4000,
    vat: 300,
    total: 4300,
    terms: defaultTerms,
    quotationId: 'q-2024-002',
    template: 'modern',
    accentColor: 'blue',
  },
  {
    id: 'inv-2024-003',
    customerName: 'Innovate Inc.',
    customerAddress: '789 Innovation Drive, Austin, TX 78701',
    date: '2024-06-15',
    dueDate: '2024-07-15',
    status: 'Overdue',
    items: [
      { id: '1', description: 'Cloud Migration Service', quantity: 1, unitPrice: 6000, sku: '' },
    ],
    subtotal: 6000,
    vat: 450,
    total: 6450,
    terms: defaultTerms,
    template: 'minimalist',
    accentColor: 'slate',
  },
]
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
  const companyDetails = useAppSelector(state => state.company.details)
  const { invoices } = useAppSelector(state => state.invoice)
  const [searchTerm, setSearchTerm] = useState('')
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isViewModalOpen, setViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [newInvoiceConfig, setNewInvoiceConfig] = useState<{
    template: Template
    accentColor: AccentColor
  } | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [invoiceToCreate, setInvoiceToCreate] = useState<Partial<Invoice> | null>(null)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (invoiceToCreate) {
      // Defer state updates to the next tick to avoid synchronous state updates inside the effect
      const timeoutId = window.setTimeout(() => {
        setSelectedInvoice(null) // Ensure we are in create mode
        setCreateModalOpen(true)
      }, 0)
      return () => window.clearTimeout(timeoutId)
    }
  }, [invoiceToCreate])

  const filteredInvoices = invoices.filter(
    i =>
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.customerName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleStartNewInvoice = (template: Template, accentColor: AccentColor) => {
    setNewInvoiceConfig({ template, accentColor })
    setTemplateModalOpen(false)
    setCreateModalOpen(true)
  }

  const handleSaveInvoice = (invoice: Invoice) => {
    const index = invoices.findIndex(i => i.id === invoice.id)
    if (index > -1) {
      setInvoices(invoices.map(i => (i.id === invoice.id ? invoice : i)))
    } else {
      setInvoices([invoice, ...invoices])
    }
    setCreateModalOpen(false)
  }

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDeleteModalOpen(true)
    setActiveDropdown(null)
  }

  const confirmDelete = () => {
    if (selectedInvoice) {
      setInvoices(invoices.filter(i => i.id !== selectedInvoice.id))
      setDeleteModalOpen(false)
      setSelectedInvoice(null)
    }
  }

  const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>, invoice?: Invoice) => {
    setSelectedInvoice(invoice || null)
    setter(true)
    setActiveDropdown(null)
  }

  const handleModalClose = () => {
    setInvoiceToCreate(null)
    setSelectedInvoice(null)
    setCreateModalOpen(false)
  }

  const generatePdf = (invoice: Invoice) => {
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()
    const accentColor = ACCENT_COLORS[invoice.accentColor]
    const pageHeight = doc.internal.pageSize.height
    const pageWidth = doc.internal.pageSize.width

    const drawWatermark = () => {
      doc.saveGraphicsState()
      doc.setFontSize(80)
      doc.setTextColor(150, 150, 150)
      const gState = new doc.GState({ opacity: 0.08 })
      doc.setGState(gState)
      doc.text(companyDetails.name, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        baseline: 'middle',
        angle: -45,
      })
      doc.restoreGraphicsState()
    }

    // Header
    switch (invoice.template) {
      case 'modern':
        doc.setFillColor(accentColor)
        doc.rect(0, 0, pageWidth, 40, 'F')
        if (companyDetails.logoUrl) {
          doc.addImage(companyDetails.logoUrl, 'PNG', 14, 15, 30, 10)
        }
        doc.setFontSize(22)
        doc.setTextColor('#FFFFFF')
        doc.setFont('helvetica', 'bold')
        doc.text('INVOICE', pageWidth - 14, 25, { align: 'right' })
        break
      case 'corporate':
        doc.setFillColor(accentColor)
        doc.rect(0, 0, 50, pageHeight, 'F')
        doc.setTextColor('#FFFFFF')
        if (companyDetails.logoUrl) {
          doc.addImage(companyDetails.logoUrl, 'PNG', 14, 15, 22, 22)
        }
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(companyDetails.name, 25, 45, { align: 'center', maxWidth: 40 })
        doc.setFont('helvetica', 'normal')
        const splitAddress = doc.splitTextToSize(companyDetails.address, 40)
        doc.text(splitAddress, 25, 55, { align: 'center' })
        const splitContact = doc.splitTextToSize(companyDetails.contact, 40)
        doc.text(splitContact, 25, 75, { align: 'center' })
        break
      case 'creative':
        drawWatermark()
      // fallthrough for other elements
      default: // classic, minimalist
        if (companyDetails.logoUrl) {
          doc.addImage(companyDetails.logoUrl, 'PNG', 14, 15, 30, 10)
        }
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(accentColor)
        doc.text('INVOICE', pageWidth - 14, 25, { align: 'right' })
        doc.setFont('helvetica', 'normal')
        doc.setTextColor('#000000')
        doc.setFontSize(10)
        doc.text(companyDetails.name, 14, 32)
        doc.text(companyDetails.address, 14, 37)
        break
    }

    const contentX = invoice.template === 'corporate' ? 60 : 14
    const contentWidth = invoice.template === 'corporate' ? pageWidth - 70 : pageWidth - 28

    // Bill To and Invoice Details
    doc.setTextColor('#000000')
    doc.setFontSize(10)
    doc.text('Bill To:', contentX, 70)
    doc.text(invoice.customerName, contentX, 75)
    doc.text(invoice.customerAddress, contentX, 80)

    doc.text(`Invoice ID: ${invoice.id}`, contentX + contentWidth, 70, { align: 'right' })
    doc.text(`Date: ${invoice.date}`, contentX + contentWidth, 75, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.text(`Due Date: ${invoice.dueDate}`, contentX + contentWidth, 80, { align: 'right' })
    doc.setFont('helvetica', 'normal')

    const tableColumn = ['#', 'Description', 'Quantity', 'SKU', 'Unit Price', 'Total']
    const tableRows = invoice.items.map((item, index) => [
      index + 1,
      item.description,
      item.quantity,
      item.sku,
      `$${item.unitPrice.toFixed(2)}`,
      `$${(item.quantity * item.unitPrice).toFixed(2)}`,
    ])

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      theme: invoice.template === 'minimalist' ? 'grid' : 'striped',
      headStyles: { fillColor: accentColor },
      margin: { left: contentX },
    })

    const finalY = doc.autoTable.previous.finalY
    doc.setFontSize(10)
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, contentX + contentWidth, finalY + 10, {
      align: 'right',
    })
    doc.text(
      `VAT (${(VAT_RATE * 100).toFixed(1)}%): $${invoice.vat.toFixed(2)}`,
      contentX + contentWidth,
      finalY + 15,
      { align: 'right' }
    )
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Due: $${invoice.total.toFixed(2)}`, contentX + contentWidth, finalY + 22, {
      align: 'right',
    })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Payment Terms:', contentX, finalY + 30)
    const splitTerms = doc.splitTextToSize(invoice.terms, contentWidth)
    doc.text(splitTerms, contentX, finalY + 35)

    doc.save(`Invoice-${invoice.id}.pdf`)
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
          onClick={() => setTemplateModalOpen(true)}
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
                  {i.id}
                  {i.quotationId && (
                    <span className='block text-xs text-gray-500'>From {i.quotationId}</span>
                  )}
                </td>
                <td className='px-6 py-4'>{i.customerName}</td>
                <td className='px-6 py-4 hidden md:table-cell'>{i.dueDate}</td>
                <td className='px-6 py-4 font-semibold'>
                  ${i.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                              onClick={() => openModal(setCreateModalOpen, i)}
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
                            onClick={() => generatePdf(i)}
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

      {isTemplateModalOpen && (
        <TemplateSelectionModal
          onContinue={handleStartNewInvoice}
          onClose={() => setTemplateModalOpen(false)}
        />
      )}
      {isCreateModalOpen && (
        <NewInvoiceModal
          invoice={selectedInvoice}
          newInvoiceConfig={newInvoiceConfig}
          onSave={handleSaveInvoice}
          onClose={handleModalClose}
          invoiceToCreate={invoiceToCreate}
        />
      )}
      {isViewModalOpen && selectedInvoice && (
        <InvoicePreviewModal invoice={selectedInvoice} onClose={() => setViewModalOpen(false)} />
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

const NewInvoiceModal: React.FC<{
  invoice: Invoice | null
  newInvoiceConfig: { template: Template; accentColor: AccentColor } | null
  onSave: (q: Invoice) => void
  onClose: () => void
  invoiceToCreate: Partial<Invoice> | null
}> = ({ invoice, newInvoiceConfig, onSave, onClose, invoiceToCreate }) => {
  const [formData, setFormData] = useState<Invoice & { vatRate: number }>(() => {
    const base = invoice || invoiceToCreate || {}
    const vatRate = base.subtotal && base.vat ? (base.vat / base.subtotal) * 100 : 7.5
    return {
      id: base.id || `inv-${Date.now()}`,
      customerName: base.customerName || '',
      customerAddress: base.customerAddress || '',
      date: base.date || new Date().toISOString().split('T')[0],
      dueDate: base.dueDate || '',
      status: base.status || 'Draft',
      items: base.items || [
        { id: `li-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, sku: '' },
      ],
      terms: base.terms || defaultTerms,
      subtotal: base.subtotal || 0,
      vat: base.vat || 0,
      total: base.total || 0,
      vatRate,
      quotationId: base.quotationId,
      template: base.template || newInvoiceConfig?.template || 'classic',
      accentColor: base.accentColor || newInvoiceConfig?.accentColor || 'teal',
    }
  })

  const computedTotals = useMemo(() => {
    const subtotal = formData.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
    const vat = subtotal * (formData.vatRate / 100)
    const total = subtotal + vat
    return { subtotal, vat, total }
  }, [formData.items, formData.vatRate])

  const handleItemChange = (
    index: number,
    field: keyof InvoiceLineItem,
    value: string | number
  ) => {
    const newItems = [...formData.items]
    const item = newItems[index]
    ;(item as any)[field] = field === 'description' || field === 'sku' ? value : Number(value) || 0
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () =>
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { id: `li-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, sku: '' },
      ],
    })
  const removeItem = (index: number) =>
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) })

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{invoice ? 'Edit' : 'Create New'} Invoice</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <input
            type='text'
            placeholder='Customer Name'
            value={formData.customerName}
            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <input
            type='text'
            placeholder='Customer Address'
            value={formData.customerAddress}
            onChange={e => setFormData({ ...formData, customerAddress: e.target.value })}
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          <input
            type='date'
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <input
            type='date'
            value={formData.dueDate}
            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as InvoiceStatus })}
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          >
            {['Draft', 'Sent', 'Paid', 'Overdue'].map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type='number'
            value={formData.vatRate}
            onChange={e => setFormData({ ...formData, vatRate: Number(e.target.value) })}
            placeholder='VAT (%)'
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
        </div>
        <div className='mb-4 space-y-2'>
          {formData.items.map((item, index) => (
            <div
              key={item.id}
              className='grid grid-cols-1 md:grid-cols-[1fr,80px,120px,auto] gap-2 items-center'
            >
              <input
                type='text'
                placeholder='Item description'
                value={item.description}
                onChange={e => handleItemChange(index, 'description', e.target.value)}
                className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              <input
                type='text'
                placeholder='SKU'
                value={item.sku}
                onChange={e => handleItemChange(index, 'sku', e.target.value)}
                className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              <input
                type='number'
                placeholder='Qty'
                value={item.quantity}
                onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                className='w-20 p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              <input
                type='number'
                placeholder='Unit Price'
                value={item.unitPrice}
                onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                className='w-28 p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              <button onClick={() => removeItem(index)} className='text-red-500'>
                <TrashIcon className='w-5 h-5' />
              </button>
            </div>
          ))}
          <button onClick={addItem} className='text-teal-500 font-semibold mt-2'>
            + Add Item
          </button>
        </div>
        <div className='flex justify-end mb-4'>
          <div className='w-full max-w-xs text-right space-y-1'>
            <p className='flex justify-between'>
              <span>Subtotal:</span>
              <span>
                ${computedTotals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </p>
            <p className='flex justify-between'>
              <span>VAT ({formData.vatRate}%):</span>
              <span>
                ${computedTotals.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </p>
            <div className='w-full h-px bg-gray-300 dark:bg-gray-600 my-1'></div>
            <p className='flex justify-between font-bold text-lg'>
              <span>Total:</span>
              <span>
                ${computedTotals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </div>
        <textarea
          value={formData.terms}
          onChange={e => setFormData({ ...formData, terms: e.target.value })}
          rows={3}
          className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-4'
          placeholder='Terms & Conditions...'
        ></textarea>
        <div className='flex justify-end'>
          <button onClick={onClose} className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'>
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                ...formData,
                subtotal: computedTotals.subtotal,
                vat: computedTotals.vat,
                total: computedTotals.total,
              } as Invoice)
            }
            className='px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600'
          >
            Save Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

const InvoicePreviewModal: React.FC<{ invoice: Invoice; onClose: () => void }> = ({
  invoice,
  onClose,
}) => {
  const companyDetails = useAppSelector(state => state.company.details)
  const accentColor = ACCENT_COLORS[invoice.accentColor]

  const renderContent = () => {
    const commonTable = (
      <>
        <table className='w-full text-sm text-left mb-8'>
          <thead style={{ backgroundColor: accentColor }} className='text-xs text-white uppercase'>
            <tr>
              <th className='px-6 py-3'>#</th>
              <th className='px-6 py-3'>Description</th>
              <th className='px-6 py-3 text-right'>Quantity</th>
              <th className='px-6 py-3 text-right'>SKU</th>

              <th className='px-6 py-3 text-right'>Unit Price</th>
              <th className='px-6 py-3 text-right'>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className='border-b dark:border-gray-700'>
                <td className='px-6 py-4'>{index + 1}</td>
                <td className='px-6 py-4'>{item.description}</td>
                <td className='px-6 py-4 text-right'>{item.quantity}</td>
                <td className='px-6 py-4 text-right'>{item.sku}</td>
                <td className='px-6 py-4 text-right'>${item.unitPrice.toFixed(2)}</td>
                <td className='px-6 py-4 text-right'>
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex justify-end mb-8'>
          <div className='w-64 text-right'>
            <p className='flex justify-between'>
              <span className='text-gray-500 dark:text-gray-400'>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </p>
            <p className='flex justify-between'>
              <span className='text-gray-500 dark:text-gray-400'>
                VAT ({(VAT_RATE * 100).toFixed(1)}%):
              </span>
              <span>${invoice.vat.toFixed(2)}</span>
            </p>
            <div className='w-full h-px bg-gray-300 dark:bg-gray-600 my-2'></div>
            <p className='flex justify-between font-bold text-lg mt-1'>
              <span>Total Due:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Payment Terms</h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap'>
            {invoice.terms}
          </p>
        </div>
      </>
    )

    switch (invoice.template) {
      case 'modern':
        return (
          <div className='bg-white dark:bg-gray-800'>
            <div style={{ backgroundColor: accentColor }} className='p-8 text-white'>
              <div className='flex justify-between items-start'>
                {companyDetails.logoUrl && (
                  <Image src={companyDetails.logoUrl} alt='Company Logo' className='h-12' />
                )}
                <h2 className='text-4xl font-bold'>INVOICE</h2>
              </div>
            </div>
            <div className='p-8'>
              <div className='flex justify-between mb-8'>
                <div>
                  <h3 className='font-semibold text-gray-600 dark:text-gray-300'>Bill To</h3>
                  <p>{invoice.customerName}</p>
                  <p>{invoice.customerAddress}</p>
                </div>
                <div className='text-right'>
                  <p>
                    <span className='font-semibold'>Invoice ID: </span>
                    {invoice.id}
                  </p>
                  <p>
                    <span className='font-semibold'>Date: </span>
                    {invoice.date}
                  </p>
                  <p className='font-bold'>
                    <span className='font-semibold'>Due Date: </span>
                    {invoice.dueDate}
                  </p>
                </div>
              </div>
              {commonTable}
            </div>
          </div>
        )
      case 'corporate':
        return (
          <div className='flex bg-white dark:bg-gray-800'>
            <div style={{ backgroundColor: accentColor }} className='w-1/3 p-8 text-white'>
              {companyDetails.logoUrl && (
                <Image src={companyDetails.logoUrl} alt='Company Logo' className='h-12 mb-4' />
              )}
              <h2 className='text-2xl font-bold mb-2'>{companyDetails.name}</h2>
            </div>
            <div className='w-2/3 p-8'>
              <h2 className='text-4xl font-bold text-gray-400 dark:text-gray-500 tracking-widest text-right mb-8'>
                INVOICE
              </h2>
              <div className='flex justify-between mb-8'>
                <div>
                  <h3 className='font-semibold text-gray-600 dark:text-gray-300'>Bill To</h3>
                  <p>{invoice.customerName}</p>
                  <p>{invoice.customerAddress}</p>
                </div>
                <div className='text-right'>
                  <p>
                    <span className='font-semibold'>Invoice ID: </span>
                    {invoice.id}
                  </p>
                  <p>
                    <span className='font-semibold'>Date: </span>
                    {invoice.date}
                  </p>
                  <p className='font-bold'>
                    <span className='font-semibold'>Due Date: </span>
                    {invoice.dueDate}
                  </p>
                </div>
              </div>
              {commonTable}
            </div>
          </div>
        )
      case 'creative':
      case 'minimalist':
      case 'classic':
      default:
        return (
          <div className='p-8 bg-white dark:bg-gray-800 relative'>
            {invoice.template === 'creative' && (
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <h1 className='text-8xl font-bold text-gray-200 dark:text-gray-700 opacity-50 transform -rotate-45 select-none'>
                  {companyDetails.name}
                </h1>
              </div>
            )}
            <div className='flex justify-between items-start mb-6 relative'>
              <div>
                {companyDetails.logoUrl && (
                  <Image src={companyDetails.logoUrl} alt='Company Logo' className='h-10 mb-2' />
                )}
                <h2
                  className={`text-2xl font-bold ${invoice.template === 'minimalist' ? '' : 'text-gray-900 dark:text-white'}`}
                >
                  {companyDetails.name}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{companyDetails.address}</p>
              </div>
              <h2 className='text-4xl font-bold tracking-widest' style={{ color: accentColor }}>
                INVOICE
              </h2>
            </div>
            <div
              className={`w-full h-px mb-8 ${invoice.template === 'minimalist' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            ></div>
            <div className='flex justify-between mb-8 relative'>
              <div>
                <h3 className='font-semibold text-gray-600 dark:text-gray-300'>Bill To</h3>
                <p>{invoice.customerName}</p>
                <p>{invoice.customerAddress}</p>
              </div>
              <div className='text-right'>
                <p>
                  <span className='font-semibold'>Invoice ID: </span>
                  {invoice.id}
                </p>
                <p>
                  <span className='font-semibold'>Date: </span>
                  {invoice.date}
                </p>
                <p className='font-bold'>
                  <span className='font-semibold'>Due Date: </span>
                  {invoice.dueDate}
                </p>
              </div>
            </div>
            {commonTable}
          </div>
        )
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative'>
        <button
          onClick={onClose}
          className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 absolute top-4 right-4 z-10'
        >
          <XIcon className='w-6 h-6' />
        </button>
        {renderContent()}
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

export default Invoices
