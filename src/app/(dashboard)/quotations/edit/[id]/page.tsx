'use client'
import React, { Suspense, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useGetQuotationByIdQuery } from '@/store/api/quotationApi'
import QuotationForm from '@/components/quotation/QuotationForm'
import { TemplateSelectionModal } from '@/components/TemplateSelectionModal'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Template, AccentColor, CustomTemplate } from '@/types'

function EditQuotationContent() {
  const router = useRouter()
  const params = useParams()
  const quotationId = params.id as string

  const {
    data: quotationResponse,
    isLoading,
    error,
  } = useGetQuotationByIdQuery(quotationId, {
    skip: !quotationId,
  })

  const quotation = quotationResponse?.payload

  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateConfig, setTemplateConfig] = useState<{
    templateName: Template
    accentColor: AccentColor | string
    customTemplate?: CustomTemplate
  } | null>(null)

  const handleTemplateSelected = (
    template: Template,
    accentColor: AccentColor | string,
    customTemplate?: CustomTemplate
  ) => {
    setTemplateConfig({ templateName: template, accentColor, customTemplate })
    setShowTemplateModal(false)
  }

  const handleCancel = () => {
    router.push('/quotations')
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-muted  flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !quotation) {
    return (
      <div className='min-h-screen bg-muted  flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-foreground mb-4'>Quotation Not Found</h1>
          <p className='text-muted-foreground mb-6'>
            The quotation you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={handleCancel}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Back to Quotations
          </button>
        </div>
      </div>
    )
  }

  // Get current template info (from override or quotation)
  const currentTemplate =
    templateConfig?.templateName || (quotation?.templateName as Template) || 'classic'
  const currentAccentColor = templateConfig?.accentColor || quotation?.accentColor || 'teal'

  // Show template modal if user requested it
  if (showTemplateModal) {
    return (
      <div className='min-h-screen bg-muted '>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-6'>
            <button
              onClick={() => setShowTemplateModal(false)}
              className='text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground flex items-center gap-2'
            >
              ← Back to Edit Form
            </button>
          </div>

          <TemplateSelectionModal
            onContinue={handleTemplateSelected}
            onClose={() => setShowTemplateModal(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-muted '>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={handleCancel}
            className='text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground flex items-center gap-2 mb-4'
          >
            ← Back to Quotations
          </button>

          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>
                Edit Quotation #{quotation.uniqueId}
              </h1>
              <p className='text-muted-foreground mt-1'>
                Template: <span className='font-medium capitalize'>{currentTemplate}</span>
                {' • '}
                Color: <span className='font-medium capitalize'>{currentAccentColor}</span>
              </p>
            </div>

            <button
              onClick={() => setShowTemplateModal(true)}
              className='inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary dark:text-primary bg-primary-light dark:bg-primary/10 border border-primary/30 dark:border-primary/30 rounded-lg hover:bg-primary-light dark:hover:bg-primary/20 transition-colors'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                />
              </svg>
              Change Template
            </button>
          </div>
        </div>

        <QuotationForm quotation={quotation} templateConfig={templateConfig ?? undefined} />
      </div>
    </div>
  )
}

export default function EditQuotationPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditQuotationContent />
    </Suspense>
  )
}
