import { useAppSelector } from '@/store/hooks'
import { AccentColor, Invoice, Quotation } from '@/types'
import { XIcon } from '../Icons'
import CustomTemplatePDFPreview from './CustomTemplatePDFPreview'
import Image from 'next/image'

const ACCENT_COLORS: Record<AccentColor, string> = {
  teal: '#14B8A6',
  blue: '#3B82F6',
  crimson: '#DC2626',
  slate: '#64748B',
}
const VAT_RATE = 0.075 // 7.5%

const PdfPreviewModal: React.FC<{
  pdfData: Invoice | Quotation
  onClose: () => void
  documentTitle: string
  documentType: string
  title: string
}> = ({ pdfData, documentTitle, onClose, documentType, title }) => {
  const companyDetails = useAppSelector(state => state.company.details)
  const accentColor = ACCENT_COLORS[pdfData.accentColor]

  const renderContent = () => {
    const commonTable = (
      <>
        <table className='w-full text-sm text-left mb-8'>
          <thead style={{ backgroundColor: accentColor }} className='text-xs text-white uppercase'>
            <tr>
              <th className='px-6 py-3'>#</th>
              <th className='px-6 py-3'>Description</th>
              <th className='px-6 py-3 text-right'>Quantity</th>
              <th className='px-6 py-3 text-right'>SKU</th>

              <th className='px-6 py-3 text-right'>Unit Price</th>
              <th className='px-6 py-3 text-right'>Total</th>
            </tr>
          </thead>
          <tbody>
            {pdfData.items.map((item, index) => (
              <tr key={item.id} className='border-b dark:border-gray-700'>
                <td className='px-6 py-4'>{index + 1}</td>
                <td className='px-6 py-4'>{item.description}</td>
                <td className='px-6 py-4 text-right'>{item.quantity}</td>
                <td className='px-6 py-4 text-right'>{item.sku}</td>
                <td className='px-6 py-4 text-right'>${item.unitPrice.toFixed(2)}</td>
                <td className='px-6 py-4 text-right'>
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex justify-end mb-8'>
          <div className='w-64 text-right'>
            <p className='flex justify-between'>
              <span className='text-gray-500 dark:text-gray-400'>Subtotal:</span>
              <span>${pdfData.subtotal.toFixed(2)}</span>
            </p>
            <p className='flex justify-between'>
              <span className='text-gray-500 dark:text-gray-400'>
                VAT ({(VAT_RATE * 100).toFixed(1)}%):
              </span>
              <span>${pdfData.vat.toFixed(2)}</span>
            </p>
            <div className='w-full h-px bg-gray-300 dark:bg-gray-600 my-2'></div>
            <p className='flex justify-between font-bold text-lg mt-1'>
              <span>Total Due:</span>
              <span>${pdfData.total.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Payment Terms</h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap'>
            {pdfData.terms}
          </p>
        </div>
      </>
    )

    switch (pdfData.template) {
      case 'custom':
        return (
          <CustomTemplatePDFPreview pdfData={pdfData} documentType={documentType} title={title} />
        )
      case 'modern':
        return (
          <div className='bg-white dark:bg-gray-800'>
            <div style={{ backgroundColor: accentColor }} className='p-8 text-white'>
              <div className='flex justify-between items-start'>
                {companyDetails.logoUrl && (
                  <Image src={companyDetails.logoUrl} alt='Company Logo' width={48} height={48} />
                )}
                <h2 className='text-4xl font-bold'>{documentTitle}</h2>
              </div>
            </div>
            <div className='p-8'>
              <div className='flex justify-between mb-8'>
                <div>
                  <h3 className='font-semibold text-gray-600 dark:text-gray-300'>Bill To</h3>
                  <p>{pdfData.customerName}</p>
                  <p>{pdfData.customerAddress}</p>
                </div>
                <div className='text-right'>
                  <p>
                    <span className='font-semibold'>
                      {documentTitle === 'INVOICE' ? 'Invoice' : 'Quotation'} ID:{' '}
                    </span>
                    {pdfData.id}
                  </p>
                  <p>
                    <span className='font-semibold'>Date: </span>
                    {pdfData.date}
                  </p>
                  {/* <p className='font-bold'>
                    <span className='font-semibold'>Due Date: </span>
                    {pdfData.dueDate}
                  </p> */}
                </div>
              </div>
              {commonTable}
            </div>
          </div>
        )
      case 'corporate':
        return (
          <div className='flex bg-white dark:bg-gray-800'>
            <div style={{ backgroundColor: accentColor }} className='w-1/4 p-8 text-white'>
              {companyDetails.logoUrl && (
                <Image
                  src={companyDetails.logoUrl}
                  alt='Company Logo'
                  className=' mb-4'
                  width={80}
                  height={48}
                />
              )}
              <h2 className='text-2xl font-bold mb-2'>{companyDetails.name}</h2>
            </div>
            <div className='w-3/4 p-8'>
              <h2 className='text-4xl font-bold text-gray-400 dark:text-gray-500 tracking-widest text-right mb-8'>
                {documentTitle}
              </h2>
              <div className='flex justify-between mb-8'>
                <div>
                  <h3 className='font-semibold text-gray-600 dark:text-gray-300'>Bill To</h3>
                  <p>{pdfData.customerName}</p>
                  <p>{pdfData.customerAddress}</p>
                </div>
                <div className='text-right'>
                  <p>
                    <span className='font-semibold'>
                      {documentTitle === 'INVOICE' ? 'Invoice' : 'Quotation'} ID:{' '}
                    </span>
                    {pdfData.id}
                  </p>
                  <p>
                    <span className='font-semibold'>Date: </span>
                    {pdfData.date}
                  </p>
                  {/* <p className='font-bold'>
                    <span className='font-semibold'>Due Date: </span>
                    {pdfData.dueDate}
                  </p> */}
                </div>
              </div>
              {commonTable}
            </div>
          </div>
        )
      case 'creative':
      case 'minimalist':
      case 'classic':
      default:
        return (
          <div className='p-8 bg-white dark:bg-gray-800 relative'>
            {pdfData.template === 'creative' && (
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <h1 className='text-8xl font-bold text-gray-200 dark:text-gray-700 opacity-50 transform -rotate-45 select-none'>
                  {companyDetails.name}
                </h1>
              </div>
            )}
            <div className='flex justify-between items-start mb-6 relative'>
              <div>
                {companyDetails.logoUrl && (
                  <Image
                    src={companyDetails.logoUrl}
                    alt='Company Logo'
                    className='mb-2'
                    width={120}
                    height={40}
                  />
                )}
                <h2
                  className={`text-2xl font-bold ${pdfData.template === 'minimalist' ? '' : 'text-gray-900 dark:text-white'}`}
                >
                  {companyDetails.name}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{companyDetails.address}</p>
              </div>
              <h2 className='text-4xl font-bold tracking-widest' style={{ color: accentColor }}>
                {documentTitle}
              </h2>
            </div>
            <div
              className={`w-full h-px mb-8 ${pdfData.template === 'minimalist' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            ></div>
            <div className='flex justify-between mb-8 relative'>
              <div>
                <h3 className='font-semibold text-gray-600 dark:text-gray-300'>Bill To</h3>
                <p>{pdfData.customerName}</p>
                <p>{pdfData.customerAddress}</p>
              </div>
              <div className='text-right'>
                <p>
                  <span className='font-semibold'>
                    {documentTitle === 'INVOICE' ? 'Invoice' : 'Quotation'} ID:{' '}
                  </span>
                  {pdfData.id}
                </p>
                <p>
                  <span className='font-semibold'>Date: </span>
                  {pdfData.date}
                </p>
                {/* <p className='font-bold'>
                  <span className='font-semibold'>Due Date: </span>
                  {pdfData.dueDate}
                </p> */}
              </div>
            </div>
            {commonTable}
          </div>
        )
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative'>
        <button
          onClick={onClose}
          className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 absolute top-4 right-4 z-10'
        >
          <XIcon className='w-6 h-6' />
        </button>
        {renderContent()}
      </div>
    </div>
  )
}
export default PdfPreviewModal
