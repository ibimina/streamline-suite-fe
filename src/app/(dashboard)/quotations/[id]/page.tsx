'use client'
import { useParams } from 'next/navigation'
import { useGetQuotationByIdQuery } from '@/store/api'
import QuotationView from '@/components/quotation/QuotationView'

export default function QuotationViewPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading, error } = useGetQuotationByIdQuery(id, {
    skip: !id,
  })

  const quotation = data?.payload

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  if (error || !quotation) {
    return (
      <div className='max-w-2xl mx-auto mt-10'>
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center'>
          <h2 className='text-lg font-semibold text-red-700 dark:text-red-400'>
            Quotation Not Found
          </h2>
          <p className='text-sm text-red-600 dark:text-red-400 mt-2'>
            The quotation you are looking for does not exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  return <QuotationView quotation={quotation} />
}
