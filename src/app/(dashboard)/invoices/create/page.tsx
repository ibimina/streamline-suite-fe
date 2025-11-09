'use client'
import React, { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setInvoices } from '@/store/slices/invoiceSlice'
import { InvoiceForm } from '@/components/InvoiceForm'
import { TemplateSelectionModal } from '@/components/TemplateSelectionModal'
import { Invoice, Template, AccentColor, CustomTemplate } from '@/types'

export default function CreateInvoicePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { invoices } = useAppSelector(state => state.invoice)

  const [showTemplateSelection, setShowTemplateSelection] = useState(true)
  const [templateConfig, setTemplateConfig] = useState<{
    template: Template
    accentColor: AccentColor
    customTemplate?: CustomTemplate
  } | null>(null)

  // Derive initial template config from invoiceToCreate
  // const initialTemplateConfig = useMemo(() => {
  //     if (invoiceToCreate) {
  //         return {
  //             template: invoiceToCreate.template || 'classic',
  //             accentColor: invoiceToCreate.accentColor || 'teal',
  //             customTemplate: undefined // TODO: Get from customTemplateId
  //         }
  //     }
  //     return null
  // }, [invoiceToCreate])

  // Set initial config if we have invoiceToCreate
  // React.useEffect(() => {
  //     if (initialTemplateConfig && !templateConfig) {
  //         setTemplateConfig(initialTemplateConfig)
  //         setShowTemplateSelection(false)
  //     }
  // }, [initialTemplateConfig, templateConfig])

  const handleTemplateSelected = (
    template: Template,
    accentColor: AccentColor,
    customTemplate?: CustomTemplate
  ) => {
    setTemplateConfig({ template, accentColor, customTemplate })
    setShowTemplateSelection(false)
  }

  const handleSaveInvoice = (invoice: Invoice) => {
    const updatedInvoices = [invoice, ...invoices]
    dispatch(setInvoices(updatedInvoices))
    router.push('/invoices')
  }

  const handleCancel = () => {
    router.push('/invoices')
  }

  if (showTemplateSelection) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-6'>
            <button
              onClick={handleCancel}
              className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2'
            >
              ← Back to Invoices
            </button>
          </div>

          <TemplateSelectionModal onContinue={handleTemplateSelected} onClose={handleCancel} />
        </div>
      </div>
    )
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
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Create New Invoice</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Selected template:{' '}
            <span className='font-medium'>
              {templateConfig?.template === 'custom' && templateConfig.customTemplate
                ? templateConfig.customTemplate.name
                : templateConfig?.template || 'Classic'}
            </span>
          </p>
        </div>

        {templateConfig && (
          <InvoiceForm
            invoice={null}
            templateConfig={templateConfig}
            onSave={handleSaveInvoice}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}
