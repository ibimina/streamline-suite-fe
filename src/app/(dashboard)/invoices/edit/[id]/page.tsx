'use client'
import { useParams, useRouter } from 'next/navigation'
import { useGetInvoiceByIdQuery } from '@/store/api'
import InvoiceForm from '@/components/invoice/InvoiceForm'

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data, isLoading, error } = useGetInvoiceByIdQuery(id, { skip: !id })

  const invoice = data?.payload

  if (isLoading) {
    return (
      <div className='min-h-screen bg-muted  flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className='min-h-screen bg-muted '>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-2xl mx-auto mt-10'>
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center'>
              <h2 className='text-lg font-semibold text-red-700 dark:text-red-400'>
                Invoice Not Found
              </h2>
              <p className='text-sm text-red-600 dark:text-red-400 mt-2'>
                The invoice you are looking for does not exist or has been deleted.
              </p>
              <button
                onClick={() => router.push('/invoices')}
                className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Back to Invoices
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-muted '>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => router.push('/invoices')}
            className='text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground flex items-center gap-2 mb-4'
          >
            ← Back to Invoices
          </button>
          <h1 className='text-3xl font-bold text-foreground'>Edit Invoice</h1>
          <p className='text-muted-foreground mt-2'>
            Editing:{' '}
            <span className='font-medium'>{invoice.invoiceNumber || invoice.uniqueId}</span>
          </p>
        </div>

        <InvoiceForm invoice={invoice} />
      </div>
    </div>
  )
}
