'use client'
import React, { useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setInvoices } from '@/store/slices/invoiceSlice'
import { InvoiceForm } from '@/components/InvoiceForm'
import { Invoice } from '@/types'

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useAppDispatch()
  const { invoices } = useAppSelector(state => state.invoice)
  const { details } = useAppSelector(state => state.company)

  const invoice = useMemo(() => {
    const id = params.id as string
    if (!id) return null
    return invoices.find(i => i.id === id) || null
  }, [params.id, invoices])

  React.useEffect(() => {
    if (params.id && !invoice) {
      // Invoice not found, redirect back
      router.push('/invoices')
    }
  }, [params.id, invoice, router])

  const handleSaveInvoice = (updatedInvoice: Invoice) => {
    const updatedInvoices = invoices.map(i => (i.id === updatedInvoice.id ? updatedInvoice : i))
    dispatch(setInvoices(updatedInvoices))
    router.push('/invoices')
  }

  const handleCancel = () => {
    router.push('/invoices')
  }

  if (!invoice) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            Invoice Not Found
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            The invoice you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={handleCancel}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Back to Invoices
          </button>
        </div>
      </div>
    )
  }

  // Get template config from the existing invoice
  const templateConfig = {
    template: invoice.template,
    accentColor: invoice.accentColor,
    customTemplate: invoice.customTemplateId
      ? details?.customTemplates?.find(t => t.id === invoice.customTemplateId)
      : undefined,
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={handleCancel}
            className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 mb-4'
          >
            ← Back to Invoices
          </button>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Edit Invoice #{invoice.id}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Template:{' '}
            <span className='font-medium'>
              {invoice.template === 'custom' && templateConfig.customTemplate
                ? templateConfig.customTemplate.name
                : invoice.template}
            </span>{' '}
            • Customer: <span className='font-medium'>{invoice.customerName}</span>
          </p>
        </div>

        <InvoiceForm
          invoice={invoice}
          templateConfig={templateConfig}
          onSave={handleSaveInvoice}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
