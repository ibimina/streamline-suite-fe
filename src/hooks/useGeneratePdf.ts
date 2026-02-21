import { ACCENT_COLORS } from '@/contants'
import { useAppSelector } from '@/store/hooks'
import { addCompanyLogo, generateCustomTemplatePDF } from '@/utils/customTemplateProcessor'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Invoice } from '@/types/invoice.type'
import { Quotation } from '@/types/quotation.type'
import { AccentColor, CompanyDetails } from '@/types'

type TemplateRenderContext = {
  doc: jsPDF
  accentColor: string
  pageWidth: number
  pageHeight: number
  companyDetails: CompanyDetails
  pdfType: string
}

const renderModernHeader = (ctx: TemplateRenderContext) => {
  const { doc, accentColor, pageWidth, companyDetails } = ctx
  doc.setFillColor(accentColor)
  doc.rect(0, 0, pageWidth, 40, 'F')
  if (companyDetails.logoUrl) {
    addCompanyLogo(doc, companyDetails, 14, 15, 30, 10)
  }
  doc.setFontSize(22)
  doc.setTextColor('#FFFFFF')
  doc.setFont('helvetica', 'bold')
  doc.text('Quotation', pageWidth - 14, 25, { align: 'right' })
}

const renderCorporateHeader = (ctx: TemplateRenderContext) => {
  const { doc, accentColor, pageHeight, companyDetails } = ctx
  doc.setFillColor(accentColor)
  doc.rect(0, 0, 50, pageHeight, 'F')
  doc.setTextColor('#FFFFFF')
  if (companyDetails.logoUrl) {
    addCompanyLogo(doc, companyDetails, 14, 15, 22, 22)
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(companyDetails.name, 25, 45, { align: 'center', maxWidth: 40 })
  doc.setFont('helvetica', 'normal')
  const splitAddress = doc.splitTextToSize(companyDetails.address, 40)
  doc.text(splitAddress, 25, 55, { align: 'center' })
  const splitContact = doc.splitTextToSize(companyDetails.contact, 40)
  doc.text(splitContact, 25, 75, { align: 'center' })
}

const renderCreativeHeader = (ctx: TemplateRenderContext, drawWatermark: () => void) => {
  const { doc, accentColor, pageWidth, companyDetails, pdfType } = ctx
  drawWatermark()
  if (companyDetails.logoUrl) {
    addCompanyLogo(doc, companyDetails, 14, 15, 30, 10)
  }
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(accentColor)
  doc.text(pdfType, pageWidth - 14, 25, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setTextColor('#000000')
  doc.setFontSize(10)
  doc.text(companyDetails.name, 14, 32)
  doc.text(companyDetails.address, 14, 37)
}

const renderDefaultHeader = (ctx: TemplateRenderContext) => {
  const { doc, accentColor, pageWidth, companyDetails, pdfType } = ctx
  if (companyDetails.logoUrl) {
    addCompanyLogo(doc, companyDetails, 14, 15, 30, 10)
  }
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(accentColor)
  doc.text(pdfType, pageWidth - 14, 25, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setTextColor('#000000')
  doc.setFontSize(10)
  doc.text(companyDetails.name, 14, 32)
  doc.text(companyDetails.address, 14, 37)
}

const renderQuotationTable = (
  doc: jsPDF,
  data: Quotation | Invoice,
  accentColor: string,
  contentX: number
) => {
  const tableBody = data.items.map((item, index) => [
    index + 1,
    item.description,
    item.quantity,
    `$${item.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
    `$${(item.quantity * item.unitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
  ])

  autoTable(doc, {
    startY: 98,
    head: [['#', 'Description', 'Quantity', 'Unit Price', 'Total']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: accentColor },
    margin: { left: contentX, right: 15 },
  })
}

const renderInvoiceTable = (
  doc: jsPDF,
  data: Quotation | Invoice,
  accentColor: string,
  contentX: number,
  template: string | undefined
) => {
  const tableColumn = ['#', 'Description', 'Quantity', 'SKU', 'Unit Price', 'Total']
  const tableRows = data.items.map((item, index) => [
    index + 1,
    item.description ?? '',
    item.quantity ?? 0,
    item.sku ?? '',
    `$${(item.unitPrice ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
    `$${((item.quantity ?? 0) * (item.unitPrice ?? 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 98,
    theme: template === 'minimalist' ? 'grid' : 'striped',
    headStyles: { fillColor: accentColor },
    margin: { left: contentX },
  })
}

const renderTotalsAndTerms = (
  doc: jsPDF,
  data: Quotation | Invoice,
  pageWidth: number,
  contentX: number,
  contentWidth: number
) => {
  const finalY = (doc as any).lastAutoTable.finalY + 10
  const totalX = pageWidth - 15
  doc.setFontSize(10)
  doc.text('Subtotal:', totalX - 30, finalY, { align: 'right' })
  doc.text(
    `${data.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
    totalX,
    finalY,
    { align: 'right' }
  )

  doc.text(`VAT (${data.vatRate.toLocaleString()}%):`, totalX - 30, finalY + 7, { align: 'right' })
  doc.text(
    `${data.totalVat.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
    totalX,
    finalY + 7,
    { align: 'right' }
  )
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Total:', totalX - 30, finalY + 14, { align: 'right' })
  doc.text(
    `${data.grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
    totalX,
    finalY + 14,
    { align: 'right' }
  )

  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text('Terms & Conditions', contentX, finalY + 30)
  doc.setFont('helvetica', 'normal')
  const splitTerms = doc.splitTextToSize(data?.terms ?? '', contentWidth)
  doc.text(splitTerms, contentX, finalY + 35)
}

const useGeneratePdf = () => {
  const companyDetails = useAppSelector(state => state.company.details)

  const generatePdf = async (
    data: Quotation | Invoice,
    title: string,
    pdfType: 'INVOICE' | 'QUOTATION'
  ) => {
    const doc = new jsPDF()
    const accentColor = ACCENT_COLORS[data.accentColor as AccentColor] ?? ACCENT_COLORS['teal']
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()

    const drawWatermark = () => {
      doc.saveGraphicsState()
      doc.setFontSize(80)
      doc.setTextColor(150, 150, 150)
      const gState = new (doc as any).GState({ opacity: 0.08 })
      doc.setGState(gState)
      doc.text(companyDetails.name, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        baseline: 'middle',
        angle: -45,
      })
      doc.restoreGraphicsState()
    }

    const ctx: TemplateRenderContext = {
      doc,
      accentColor,
      pageWidth,
      pageHeight,
      companyDetails,
      pdfType,
    }

    // Header - handle custom template separately as it returns early
    if (data.template === 'custom') {
      const customTemplate = companyDetails?.customTemplates?.find(t => t.id === data.template)
      if (!customTemplate) {
        console.error(
          'Custom template not found, available templates:',
          companyDetails?.customTemplates?.map(t => ({ id: t.id, name: t.name }))
        )
        return
      }
      try {
        await generateCustomTemplatePDF(customTemplate, data, companyDetails, pdfType, title)
        return
      } catch (error) {
        console.error('Error generating custom template PDF:', error)
        return
      }
    }

    // Render header based on template
    const headerRenderers: Record<string, () => void> = {
      modern: () => renderModernHeader(ctx),
      corporate: () => renderCorporateHeader(ctx),
      creative: () => renderCreativeHeader(ctx, drawWatermark),
    }
    const renderHeader =
      data.template && data.template in headerRenderers
        ? headerRenderers[data.template]
        : () => renderDefaultHeader(ctx)
    renderHeader()
    const contentX = data.template === 'corporate' ? 60 : 14
    const contentWidth = data.template === 'corporate' ? pageWidth - 70 : pageWidth - 28

    // Company and Client Details
    doc.setFontSize(10)
    doc.setTextColor(100)

    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', contentX, 70)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customer.companyName, contentX, 75)
    doc.text(data.customer.billingAddress.street, contentX, 80)
    doc.text(
      `${data.customer.billingAddress.city}, ${data.customer.billingAddress.state} ${data.customer.billingAddress.zipCode}`,
      contentX,
      85
    )
    doc.text(data.customer.billingAddress.country, contentX, 90)

    doc.setFontSize(12)
    doc.text(`${pdfType} #: ${data.uniqueId}`, contentX + contentWidth, 70, { align: 'right' })
    doc.text(`Date: ${data.issuedDate}`, contentX + contentWidth, 75, { align: 'right' })

    // Table
    if (pdfType === 'QUOTATION') {
      renderQuotationTable(doc, data, accentColor, contentX)
    } else {
      renderInvoiceTable(doc, data, accentColor, contentX, data.template)
    }

    // Totals and Terms
    renderTotalsAndTerms(doc, data, pageWidth, contentX, contentWidth)

    doc.save(`${pdfType}-${data.uniqueId}.pdf`)
  }
  return { generatePdf }
}

export default useGeneratePdf
