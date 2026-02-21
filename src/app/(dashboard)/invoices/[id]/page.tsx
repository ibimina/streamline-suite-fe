'use client'
import { useParams } from 'next/navigation'
import { useGetInvoiceByIdQuery } from '@/store/api/invoiceApi'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import InvoiceView from '@/components/invoice/InvoiceView'

export function InvoiceViewPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading, error } = useGetInvoiceByIdQuery(id, { skip: !id })

  const invoice = data?.payload

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !invoice) {
    return (
      <div className='max-w-2xl mx-auto mt-10'>
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center'>
          <h2 className='text-lg font-semibold text-red-700 dark:text-red-400'>
            Invoice Not Found
          </h2>
          <p className='text-sm text-red-600 dark:text-red-400 mt-2'>
            The invoice you are looking for does not exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  return <InvoiceView invoice={invoice} />
}
