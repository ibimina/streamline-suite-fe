'use client'
import { useState, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import QuotationForm from '@/components/quotation/QuotationForm'
import { TemplateSelectionModal } from '@/components/TemplateSelectionModal'
import { Template, AccentColor, CustomTemplate } from '@/types'
import { useGetQuotationByIdQuery } from '@/store/api'
import { Quotation } from '@/types/quotation.type'

function CreateQuotationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const duplicateId = searchParams.get('duplicate')

  // Fetch the quotation to duplicate if duplicateId exists
  const { data: duplicateData, isLoading: isDuplicateLoading } = useGetQuotationByIdQuery(
    duplicateId || '',
    { skip: !duplicateId }
  )

  const [showTemplateSelection, setShowTemplateSelection] = useState(!duplicateId)
  const [templateConfig, setTemplateConfig] = useState<{
    template: Template
    accentColor: AccentColor
    customTemplate?: CustomTemplate
  } | null>({
    template: 'classic',
    accentColor: 'teal',
  })

  // Store the current timestamp in state to safely access during render
  const [timestamp] = useState<number>(() => Date.now())

  // Derive duplicated quotation data from fetched data (without _id and with reset status)
  const duplicatedQuotation = useMemo<Partial<Quotation> | null>(() => {
    if (!duplicateData?.payload) return null

    const source = duplicateData.payload

    // Create a copy without _id and reset status to draft
    return {
      ...source,
      _id: undefined,
      uniqueId: undefined, // Will be auto-generated
      status: 'Draft' as const,
      issuedDate: new Date(timestamp).toISOString(),
      validUntil: new Date(timestamp + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      createdAt: undefined,
      updatedAt: undefined,
      // Keep customer and items
      items: source.items?.map(item => ({
        ...item,
        _id: undefined, // Remove item IDs
      })),
    }
  }, [duplicateData, timestamp])

  // Derive template config from duplicated quotation
  const effectiveTemplateConfig = useMemo(() => {
    if (duplicateData?.payload) {
      const source = duplicateData.payload
      if (source.template || source.accentColor) {
        return {
          template: (source.template as Template) || 'classic',
          accentColor: (source.accentColor as AccentColor) || 'teal',
        }
      }
    }
    return templateConfig
  }, [duplicateData, templateConfig])

  const handleTemplateSelected = (
    template: Template,
    accentColor: AccentColor,
    customTemplate?: CustomTemplate
  ) => {
    setTemplateConfig({ template, accentColor, customTemplate })
    setShowTemplateSelection(false)
  }

  const handleCancel = () => {
    router.push('/quotations')
  }

  // Show loading state when fetching quotation to duplicate
  if (duplicateId && isDuplicateLoading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading quotation data...</p>
        </div>
      </div>
    )
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
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            {duplicateId ? 'Duplicate Quotation' : 'Create New Quotation'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            {duplicateId && duplicateData?.payload?.uniqueId && (
              <span className='mr-2'>
                Duplicating from:{' '}
                <span className='font-medium'>{duplicateData.payload.uniqueId}</span> •
              </span>
            )}
            Selected template:{' '}
            <span className='font-medium'>
              {effectiveTemplateConfig?.template === 'custom' &&
              effectiveTemplateConfig.customTemplate
                ? effectiveTemplateConfig.customTemplate.name
                : effectiveTemplateConfig?.template || 'Classic'}
            </span>
          </p>
        </div>

        {effectiveTemplateConfig && (
          <QuotationForm
            quotation={duplicatedQuotation as Quotation | undefined}
            templateConfig={effectiveTemplateConfig}
            isDuplicate={!!duplicateId}
          />
        )}
      </div>
    </div>
  )
}

export default function CreateQuotationPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading...</p>
          </div>
        </div>
      }
    >
      <CreateQuotationContent />
    </Suspense>
  )
}
