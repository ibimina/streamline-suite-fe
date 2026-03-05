'use client'
import { useState, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import InvoiceForm from '@/components/invoice/InvoiceForm'
import { TemplateSelectionModal } from '@/components/TemplateSelectionModal'
import { Template, AccentColor, CustomTemplate } from '@/types'
import { useGetInvoiceByIdQuery } from '@/store/api'
import { Invoice } from '@/types/invoice.type'

function CreateInvoiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const duplicateId = searchParams.get('duplicate')

  const { data: duplicateData, isLoading: isDuplicateLoading } = useGetInvoiceByIdQuery(
    duplicateId || '',
    { skip: !duplicateId }
  )

  const [showTemplateSelection, setShowTemplateSelection] = useState(!duplicateId)
  const [templateConfig, setTemplateConfig] = useState<{
    templateName: Template
    accentColor: AccentColor | string
    customTemplate?: CustomTemplate
  } | null>({
    templateName: 'classic',
    accentColor: 'teal',
  })
  const [timestamp] = useState<number>(() => Date.now())

  const duplicatedInvoice = useMemo<Partial<Invoice> | null>(() => {
    if (!duplicateData?.payload) return null
    const source = duplicateData.payload

    return {
      ...source,
      _id: undefined,
      uniqueId: undefined, // Will be auto-generated
      status: 'Draft' as const,
      issuedDate: new Date(timestamp).toISOString(),
      dueDate: new Date(timestamp + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      createdAt: undefined,
      updatedAt: undefined,
      // Keep customer and items
      items: source.items?.map(item => ({
        ...item,
        _id: undefined, // Remove item IDs
      })),
    }
  }, [duplicateData, timestamp])

  const handleTemplateSelected = (
    template: Template,
    accentColor: AccentColor | string,
    customTemplate?: CustomTemplate
  ) => {
    setTemplateConfig({ templateName: template, accentColor, customTemplate })
    setShowTemplateSelection(false)
  }

  const handleCancel = () => {
    router.push('/invoices')
  }

  if (duplicateId && isDuplicateLoading) {
    return (
      <div className='min-h-screen bg-muted  flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Loading invoice data...</p>
        </div>
      </div>
    )
  }

  if (showTemplateSelection) {
    return (
      <div className='min-h-screen bg-muted '>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-6'>
            <button
              onClick={handleCancel}
              className='text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground flex items-center gap-2'
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
    <div className='min-h-screen bg-muted '>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={handleCancel}
            className='text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground flex items-center gap-2 mb-4'
          >
            ← Back to Invoices
          </button>
          <h1 className='text-3xl font-bold text-foreground'>
            {duplicateId ? 'Duplicate Invoice' : 'Create New Invoice'}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {duplicateId && duplicateData?.payload?.uniqueId && (
              <span className='mr-2'>
                Duplicating from:{' '}
                <span className='font-medium'>{duplicateData.payload.uniqueId}</span> •
              </span>
            )}
            Selected template:{' '}
            <span className='font-medium'>
              {templateConfig?.templateName === 'custom' && templateConfig.customTemplate
                ? templateConfig.customTemplate.name
                : templateConfig?.templateName || 'Classic'}
            </span>
          </p>
        </div>

        {templateConfig && (
          <InvoiceForm
            invoice={duplicatedInvoice as Invoice | undefined}
            templateConfig={templateConfig}
            isDuplicate={!!duplicateId}
          />
        )}
      </div>
    </div>
  )
}

export default function CreateInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-muted  flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-muted-foreground'>Loading...</p>
          </div>
        </div>
      }
    >
      <CreateInvoiceContent />
    </Suspense>
  )
}
