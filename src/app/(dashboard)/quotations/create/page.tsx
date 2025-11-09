'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setQuotations } from '@/store/slices/quotationSlice'
import { QuotationForm } from '@/components/QuotationForm'
import { TemplateSelectionModal } from '@/components/TemplateSelectionModal'
import { Quotation, Template, AccentColor, CustomTemplate } from '@/types'

export default function CreateQuotationPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { quotations } = useAppSelector(state => state.quotation)

  const [showTemplateSelection, setShowTemplateSelection] = useState(true)
  const [templateConfig, setTemplateConfig] = useState<{
    template: Template
    accentColor: AccentColor
    customTemplate?: CustomTemplate
  } | null>(null)

  const handleTemplateSelected = (
    template: Template,
    accentColor: AccentColor,
    customTemplate?: CustomTemplate
  ) => {
    setTemplateConfig({ template, accentColor, customTemplate })
    setShowTemplateSelection(false)
  }

  const handleSaveQuotation = (quotation: Quotation) => {
    const updatedQuotations = [quotation, ...quotations]
    dispatch(setQuotations(updatedQuotations))
    router.push('/quotations')
  }

  const handleCancel = () => {
    router.push('/quotations')
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
              ← Back to Quotations
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
            ← Back to Quotations
          </button>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Create New Quotation</h1>
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
          <QuotationForm
            quotation={null}
            templateConfig={templateConfig}
            onSave={handleSaveQuotation}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}
