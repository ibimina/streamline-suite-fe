import { useAppSelector } from '@/store/hooks'
import { Quotation, Invoice } from '@/types'
import { useState, useEffect } from 'react'

const CustomTemplatePDFPreview: React.FC<{
  pdfData: Quotation | Invoice
  documentType: 'QUOTATION' | 'INVOICE'
  title: string
}> = ({ pdfData, documentType, title }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const companyDetails = useAppSelector(state => state.company.details)

  useEffect(() => {
    let currentPdfUrl: string | null = null

    const generatePreviewPDF = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Find the custom template
        const customTemplate = companyDetails?.customTemplates?.find(
          (t: any) => t.id === pdfData.customTemplateId
        )

        if (!customTemplate) {
          setError('Custom template not found')
          return
        }

        // Import the custom template processor
        const { generateCustomTemplatePDFBlob } = await import(
          '../../utils/customTemplateProcessor'
        )

        // Generate PDF as blob instead of downloading
        const pdfBlob = await generateCustomTemplatePDFBlob(
          customTemplate,
          pdfData,
          companyDetails,
          documentType,
          title
        )

        // Create object URL for preview
        const url = URL.createObjectURL(pdfBlob)
        currentPdfUrl = url
        setPdfUrl(url)
      } catch (err) {
        console.error('Error generating PDF preview:', err)
        setError('Failed to generate PDF preview')
      } finally {
        setIsLoading(false)
      }
    }

    generatePreviewPDF()

    // Cleanup function to revoke object URL
    return () => {
      if (currentPdfUrl) {
        URL.revokeObjectURL(currentPdfUrl)
      }
    }
  }, [pdfData, companyDetails, documentType, title])

  if (isLoading) {
    return (
      <div className='text-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4'></div>
        <p className='text-gray-600 dark:text-gray-400'>Generating PDF preview...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='mb-4'>
          <svg
            className='w-16 h-16 mx-auto text-red-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold mb-2 text-red-600'>Preview Error</h3>
        <p className='text-gray-600 dark:text-gray-400 mb-4'>{error}</p>
        <p className='text-sm text-gray-500'>
          You can still download the PDF using the download button.
        </p>
      </div>
    )
  }

  return (
    <div className='w-full h-full'>
      <div className='mb-4 text-center'>
        <h3 className='text-lg font-semibold mb-2'>Custom Template Preview</h3>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Showing preview of quotation with custom template
        </p>
      </div>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width='100%'
          height='600px'
          style={{ border: 'none', borderRadius: '8px' }}
          title='PDF Preview'
        />
      )}
    </div>
  )
}
export default CustomTemplatePDFPreview
