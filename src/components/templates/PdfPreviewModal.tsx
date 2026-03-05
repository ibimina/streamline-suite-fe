import { useAppSelector } from '@/store/hooks'
import { AccentColor, CompanyDetails } from '@/types'
import { XIcon } from '../Icons'
import CustomTemplatePDFPreview from './CustomTemplatePDFPreview'
import Image from 'next/image'
import { Invoice } from '@/types/invoice.type'
import { Quotation } from '@/types/quotation.type'
import { ACCENT_COLORS } from '@/contants'

const PdfPreviewModal: React.FC<{
  pdfData: Invoice | Quotation
  onClose: () => void
  documentTitle: string
  documentType: 'INVOICE' | 'QUOTATION'
  title: string
}> = ({ pdfData, documentTitle, onClose, documentType, title }) => {
  const account = useAppSelector(state => state.authReducer.user?.account)

  // Map account data to CompanyDetails format
  const companyDetails: CompanyDetails = {
    name: account?.name || '',
    address: account?.address || '',
    contact: [account?.phone, account?.email].filter(Boolean).join(' | '),
    logoUrl: account?.logoUrl || '',
    tagline: account?.tagline || '',
  }
  // Support both preset AccentColor names and custom hex values
  const accentColor = pdfData?.accentColor?.startsWith('#')
    ? pdfData.accentColor
    : (ACCENT_COLORS[pdfData?.accentColor as AccentColor] ?? ACCENT_COLORS['blue'])

  // Check if any item has a non-empty SKU
  const hasAnySku = pdfData.items.some(item => item.sku && item.sku.trim() !== '')

  const renderContent = () => {
    const commonTable = (
      <>
        <table className='w-full text-sm text-left mb-8'>
          <thead style={{ backgroundColor: accentColor }} className='text-xs text-white uppercase'>
            <tr>
              <th className='px-6 py-3'>#</th>
              <th className='px-6 py-3'>Description</th>
              <th className='px-6 py-3 text-right'>Quantity</th>
              {hasAnySku && <th className='px-6 py-3 text-right'>SKU</th>}
              <th className='px-6 py-3 text-right'>Unit Price</th>
              <th className='px-6 py-3 text-right'>Total</th>
            </tr>
          </thead>
          <tbody>
            {pdfData.items.map((item, index) => (
              <tr key={item.id} className='border-b border-border'>
                <td className='px-6 py-4'>{index + 1}</td>
                <td className='px-6 py-4'>{item.description}</td>
                <td className='px-6 py-4 text-right'>{item.quantity}</td>
                {hasAnySku && <td className='px-6 py-4 text-right'>{item.sku}</td>}
                <td className='px-6 py-4 text-right'>
                  {item.unitPrice.toLocaleString('en-US', {
                    style: 'currency',
                    currency: account?.currency || 'NGN',
                  })}
                </td>
                <td className='px-6 py-4 text-right'>
                  {(item.quantity * item.unitPrice).toLocaleString('en-US', {
                    style: 'currency',
                    currency: account?.currency || 'NGN',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex justify-end mb-8'>
          <div className='w-64 text-right'>
            <p className='flex justify-between'>
              <span className='text-muted-foreground'>Subtotal:</span>
              <span>
                {pdfData.subtotal.toLocaleString('en-US', {
                  style: 'currency',
                  currency: account?.currency || 'NGN',
                })}
              </span>
            </p>
            <p className='flex justify-between'>
              <span className='text-muted-foreground'>VAT {pdfData?.vatRate}%:</span>
              <span>
                {pdfData?.totalVat.toLocaleString('en-US', {
                  style: 'currency',
                  currency: account?.currency || 'NGN',
                })}
              </span>
            </p>
            <div className='w-full h-px bg-muted  my-2'></div>
            <p className='flex justify-between font-bold text-lg mt-1'>
              <span>Total Due:</span>
              <span>
                {pdfData.grandTotal.toLocaleString('en-US', {
                  style: 'currency',
                  currency: account?.currency || 'NGN',
                })}
              </span>
            </p>
          </div>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Payment Terms</h3>
          <p className='text-xs text-muted-foreground whitespace-pre-wrap'>{pdfData.terms}</p>
        </div>
        <div className='mt-8 text-sm text-muted-foreground'>
          <p>Thank you for your business!</p>
          <p className='mt-2'>Yours faithfully,</p>
          <p className='font-semibold text-foreground'>{companyDetails.name}</p>
        </div>
      </>
    )

    // Determine effective template - fall back to classic if custom template data is missing
    const effectiveTemplate =
      pdfData.templateName === 'custom' && !pdfData.template?.imageUrl
        ? 'classic'
        : pdfData.templateName

    switch (effectiveTemplate) {
      case 'custom':
        return (
          <CustomTemplatePDFPreview pdfData={pdfData} documentType={documentType} title={title} />
        )
      case 'modern':
        return (
          <div className='bg-card'>
            <div style={{ backgroundColor: accentColor }} className='p-8 text-white'>
              <div className='flex justify-between items-start'>
                {companyDetails.logoUrl && (
                  <Image src={companyDetails.logoUrl} alt='Company Logo' width={48} height={48} />
                )}
                <h2 className='text-4xl font-bold'>{documentType}</h2>
              </div>
            </div>
            <div className='p-8'>
              <div className='flex justify-between mb-8'>
                <div>
                  <h3 className='font-semibold text-muted-foreground'>Bill To</h3>
                  <p>{pdfData?.customer?.companyName}</p>
                  <p>{pdfData?.customer?.billingAddress?.street}</p>
                  <p>
                    {pdfData?.customer?.billingAddress?.city},{' '}
                    {pdfData?.customer?.billingAddress?.state}{' '}
                    {pdfData?.customer?.billingAddress?.zipCode}
                  </p>
                  <p>{pdfData?.customer?.billingAddress?.country}</p>
                </div>
                <div className='text-right'>
                  <p>
                    <span className='font-semibold'>{documentType} ID: </span>
                    {pdfData?.uniqueId}
                  </p>
                  <p>
                    <span className='font-semibold'>Date: </span>
                    {new Date(pdfData.issuedDate).toLocaleDateString()}
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
          <div className='flex bg-card'>
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
              <h2 className='text-4xl font-bold text-muted-foreground tracking-widest text-right mb-8'>
                {documentType}
              </h2>
              <div className='flex justify-between mb-8'>
                <div>
                  <h3 className='font-semibold text-muted-foreground'>Bill To</h3>
                  <p>{pdfData.customer.companyName}</p>
                  <p>{pdfData.customer.billingAddress.street}</p>
                  <p>
                    {pdfData.customer.billingAddress.city}, {pdfData.customer.billingAddress.state}{' '}
                    {pdfData.customer.billingAddress.zipCode}
                  </p>
                  <p>{pdfData.customer.billingAddress.country}</p>
                </div>
                <div className='text-right'>
                  <p>
                    <span className='font-semibold'>{documentType} ID: </span>
                    {pdfData.uniqueId}
                  </p>
                  <p>
                    <span className='font-semibold'>Date: </span>
                    {new Date(pdfData.issuedDate).toLocaleDateString()}
                  </p>
                  {/* <p className='font-bold'>
                    <span className='font-semibold'>Due Date: </span>
                    {new Date(pdfData.dueDate).toLocaleDateString()}
                  </p> */}
                </div>
              </div>
              {commonTable}
            </div>
          </div>
        )
      case 'classic':
        return (
          <div className='bg-card'>
            {/* Classic header with accent bar */}
            <div
              className='flex justify-between items-center p-6 border-b-4'
              style={{ borderColor: accentColor }}
            >
              <div className='flex items-center gap-4'>
                {companyDetails.logoUrl && (
                  <Image src={companyDetails.logoUrl} alt='Company Logo' width={80} height={80} />
                )}
                <div>
                  <h2 className='text-2xl font-bold text-foreground'>{companyDetails.name}</h2>
                  <p className='text-sm text-muted-foreground'>{companyDetails.address}</p>
                  <p className='text-sm text-muted-foreground'>{companyDetails.contact}</p>
                </div>
              </div>
              <div className='text-right'>
                <h2 className='text-3xl font-bold' style={{ color: accentColor }}>
                  {documentType}
                </h2>
                <p className='text-lg font-semibold mt-1'>{pdfData.uniqueId}</p>
              </div>
            </div>
            <div className='p-6'>
              <div className='flex justify-between mb-8'>
                <div className='bg-muted/50 p-4 rounded-lg'>
                  <h3 className='font-semibold text-muted-foreground mb-2'>Bill To</h3>
                  <p className='font-medium'>{pdfData.customer.companyName}</p>
                  <p className='text-sm'>{pdfData.customer.billingAddress.street}</p>
                  <p className='text-sm'>
                    {pdfData.customer.billingAddress.city}, {pdfData.customer.billingAddress.state}{' '}
                    {pdfData.customer.billingAddress.zipCode}
                  </p>
                  <p className='text-sm'>{pdfData.customer.billingAddress.country}</p>
                </div>
                <div className='text-right'>
                  <div className='bg-muted/50 p-4 rounded-lg'>
                    <p className='mb-1'>
                      <span className='text-muted-foreground'>Date: </span>
                      <span className='font-medium'>
                        {new Date(pdfData.issuedDate).toLocaleDateString()}
                      </span>
                    </p>
                    {'dueDate' in pdfData && pdfData.dueDate && (
                      <p>
                        <span className='text-muted-foreground'>Due Date: </span>
                        <span className='font-medium'>
                          {new Date(pdfData.dueDate).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                    {'validUntil' in pdfData && pdfData.validUntil && (
                      <p>
                        <span className='text-muted-foreground'>Valid Until: </span>
                        <span className='font-medium'>
                          {new Date(pdfData.validUntil).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {commonTable}
            </div>
          </div>
        )
      case 'minimalist':
        return (
          <div className='p-10 bg-card'>
            {/* Minimalist: Clean, lots of whitespace, thin lines */}
            <div className='flex justify-between items-start mb-12'>
              <div>
                <h2 className='text-xl font-light tracking-wide text-foreground'>
                  {companyDetails.name}
                </h2>
                <p className='text-xs text-muted-foreground mt-1'>{companyDetails.address}</p>
              </div>
              <div className='text-right'>
                <h2
                  className='text-2xl font-light tracking-widest uppercase'
                  style={{ color: accentColor }}
                >
                  {documentType}
                </h2>
                <p className='text-xs text-muted-foreground mt-2'>{pdfData.uniqueId}</p>
              </div>
            </div>

            <div className='w-full h-px bg-border mb-12'></div>

            <div className='flex justify-between mb-12'>
              <div>
                <p className='text-xs text-muted-foreground uppercase tracking-wider mb-2'>
                  Bill To
                </p>
                <p className='font-light'>{pdfData.customer.companyName}</p>
                <p className='text-sm text-muted-foreground'>
                  {pdfData.customer.billingAddress.street}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {pdfData.customer.billingAddress.city}, {pdfData.customer.billingAddress.state}{' '}
                  {pdfData.customer.billingAddress.zipCode}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-xs text-muted-foreground uppercase tracking-wider mb-2'>
                  Details
                </p>
                <p className='text-sm'>
                  <span className='text-muted-foreground'>Date: </span>
                  {new Date(pdfData.issuedDate).toLocaleDateString()}
                </p>
                {'dueDate' in pdfData && pdfData.dueDate && (
                  <p className='text-sm'>
                    <span className='text-muted-foreground'>Due: </span>
                    {new Date(pdfData.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {commonTable}
          </div>
        )
      case 'creative':
      default:
        return (
          <div className='p-8 bg-card relative overflow-hidden'>
            {/* Creative: Large watermark + bold styling */}
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
              <h1 className='text-8xl font-bold text-muted-foreground dark:text-secondary-foreground opacity-[0.08] transform -rotate-45 select-none whitespace-nowrap'>
                {companyDetails.name}
              </h1>
            </div>
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
                <h2 className='text-2xl font-bold text-foreground'>{companyDetails.name}</h2>
                <p className='text-sm text-muted-foreground'>{companyDetails.address}</p>
              </div>
              <div className='text-right'>
                <h2 className='text-4xl font-bold tracking-widest' style={{ color: accentColor }}>
                  {documentType}
                </h2>
                <div
                  className='mt-2 px-3 py-1 rounded-full inline-block'
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  {pdfData.uniqueId}
                </div>
              </div>
            </div>
            <div
              className='w-full h-1 mb-8 rounded-full'
              style={{ backgroundColor: accentColor }}
            ></div>
            <div className='flex justify-between mb-8 relative'>
              <div className='border-l-4 pl-4' style={{ borderColor: accentColor }}>
                <h3 className='font-semibold text-muted-foreground mb-1'>Bill To</h3>
                <p className='font-medium'>{pdfData.customer.companyName}</p>
                <p>{pdfData.customer.billingAddress.street}</p>
                <p>
                  {pdfData.customer.billingAddress.city}, {pdfData.customer.billingAddress.state}{' '}
                  {pdfData.customer.billingAddress.zipCode}
                </p>
                <p>{pdfData.customer.billingAddress.country}</p>
              </div>
              <div className='text-right'>
                <p>
                  <span className='font-semibold'>Date: </span>
                  {new Date(pdfData.issuedDate).toLocaleDateString()}
                </p>
                {'dueDate' in pdfData && pdfData.dueDate && (
                  <p>
                    <span className='font-semibold'>Due Date: </span>
                    {new Date(pdfData.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {commonTable}
          </div>
        )
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative'>
        <button
          onClick={onClose}
          className='p-2 rounded-full hover:bg-muted  absolute top-4 right-4 z-10'
        >
          <XIcon className='w-6 h-6' />
        </button>
        {renderContent()}
      </div>
    </div>
  )
}
export default PdfPreviewModal
