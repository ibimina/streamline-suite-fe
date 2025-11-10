'use client'
import React, { Suspense, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setQuotations } from '@/store/slices/quotationSlice'
import { QuotationForm } from '@/components/QuotationForm'
import { Quotation } from '@/types'

function EditQuotationContent() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useAppDispatch()
  const { quotations } = useAppSelector(state => state.quotation)
  const { details } = useAppSelector(state => state.company)

  const quotation = useMemo(() => {
    const id = params.id as string
    if (!id) return null
    return quotations.find(q => q.id === id) || null
  }, [params.id, quotations])

  React.useEffect(() => {
    if (params.id && !quotation) {
      // Quotation not found, redirect back
      router.push('/quotations')
    }
  }, [params.id, quotation, router])

  const handleSaveQuotation = (updatedQuotation: Quotation) => {
    const updatedQuotations = quotations.map(q =>
      q.id === updatedQuotation.id ? updatedQuotation : q
    )
    dispatch(setQuotations(updatedQuotations))
    router.push('/quotations')
  }

  const handleCancel = () => {
    router.push('/quotations')
  }

  if (!quotation) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            Quotation Not Found
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
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

  // Get template config from the existing quotation
  const templateConfig = {
    template: quotation.template,
    accentColor: quotation.accentColor,
    customTemplate: quotation.customTemplateId
      ? details?.customTemplates?.find(t => t.id === quotation.customTemplateId)
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
            ← Back to Quotations
          </button>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Edit Quotation #{quotation.id}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Template:{' '}
            <span className='font-medium'>
              {quotation.template === 'custom' && templateConfig.customTemplate
                ? templateConfig.customTemplate.name
                : quotation.template}
            </span>{' '}
            • Customer: <span className='font-medium'>{quotation.customerName}</span>
          </p>
        </div>

        <QuotationForm
          quotation={quotation}
          templateConfig={templateConfig}
          onSave={handleSaveQuotation}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default function EditQuotationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditQuotationContent />
    </Suspense>
  )
}
