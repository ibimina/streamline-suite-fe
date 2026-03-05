import { useAppSelector } from '@/store/hooks'
import { Quotation } from '@/types/quotation.type'
import { Invoice } from '@/types/invoice.type'
import { useState, useEffect, useMemo } from 'react'
import { CompanyDetails } from '@/types'

const CustomTemplatePDFPreview: React.FC<{
  pdfData: Quotation | Invoice
  documentType: 'QUOTATION' | 'INVOICE'
  title: string
}> = ({ pdfData, documentType, title }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const account = useAppSelector(state => state.authReducer.user?.account)

  // Map account data to CompanyDetails format
  const companyDetails = useMemo<CompanyDetails>(
    () => ({
      name: account?.name || '',
      address: account?.address || '',
      contact: [account?.phone, account?.email].filter(Boolean).join(' | '),
      logoUrl: account?.logoUrl || '',
      tagline: account?.tagline || '',
    }),
    [
      account?.name,
      account?.address,
      account?.phone,
      account?.email,
      account?.logoUrl,
      account?.tagline,
    ]
  )

  useEffect(() => {
    let currentPdfUrl: string | null = null

    const generatePreviewPDF = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if template exists on the document
        if (!pdfData.template?.imageUrl) {
          setError('Custom template not found')
          return
        }

        // Import the custom template processor
        const { generateCustomTemplatePDFBlob } =
          await import('../../utils/customTemplateProcessor')

        // Create a custom template object from the pdfData.template
        const customTemplate = {
          id: pdfData.template._id,
          name: pdfData.templateName || 'Custom Template',
          imageUrl: pdfData.template.imageUrl,
        }

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
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
        <p className='text-muted-foreground'>Generating PDF preview...</p>
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
        <p className='text-muted-foreground mb-4'>{error}</p>
        <p className='text-sm text-muted-foreground'>
          You can still download the PDF using the download button.
        </p>
      </div>
    )
  }

  return (
    <div className='w-full h-full'>
      <div className='mb-4 text-center'>
        <h3 className='text-lg font-semibold mb-2'>Custom Template Preview</h3>
        <p className='text-sm text-muted-foreground'>
          Showing preview of {documentType.toLowerCase()} with custom template
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
