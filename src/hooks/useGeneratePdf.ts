import { ACCENT_COLORS } from '@/contants'
import { useAppSelector } from '@/store/hooks'
import { generateCustomTemplatePDF } from '@/utils/customTemplateProcessor'
import {
  createPDFContext,
  addCompanyLogo,
  renderItemsTable,
  renderTotals,
  renderTerms,
  renderNotes,
  renderClosing,
  renderBillToSection,
  renderClassicBillToSection,
  renderMinimalistBillToSection,
  renderCreativeBillToSection,
  PDFContext,
} from '@/utils/pdfUtils'
import jsPDF from 'jspdf'
import { Invoice } from '@/types/invoice.type'
import { Quotation } from '@/types/quotation.type'
import { AccentColor, CompanyDetails } from '@/types'

// ========== TEMPLATE-SPECIFIC HEADERS ==========

const renderModernHeader = (
  ctx: PDFContext,
  companyDetails: CompanyDetails,
  accentColor: string,
  pdfType: string
): number => {
  const { doc, pageWidth } = ctx
  doc.setFillColor(accentColor)
  doc.rect(0, 0, pageWidth, 40, 'F')

  if (companyDetails.logoUrl) {
    addCompanyLogo(doc, companyDetails, 14, 15, 30, 10)
  }

  doc.setFontSize(22)
  doc.setTextColor('#FFFFFF')
  doc.setFont('helvetica', 'bold')
  doc.text(pdfType, pageWidth - 14, 25, { align: 'right' })

  return 50
}

const renderCorporateHeader = (
  ctx: PDFContext,
  companyDetails: CompanyDetails,
  accentColor: string,
  pdfType: string
): number => {
  const { doc, pageWidth, pageHeight } = ctx
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

  // Title on the right side (in content area)
  doc.setTextColor(100)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(pdfType, pageWidth - 14, 25, { align: 'right' })

  return 35
}

const renderCreativeHeader = (
  ctx: PDFContext,
  companyDetails: CompanyDetails,
  accentColor: string,
  pdfType: string,
  uniqueId: string
): number => {
  const { doc, pageWidth, pageHeight } = ctx

  // Draw watermark
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

  if (companyDetails.logoUrl) {
    addCompanyLogo(doc, companyDetails, 14, 15, 30, 10)
  }

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(accentColor)
  doc.text(pdfType, pageWidth - 14, 22, { align: 'right' })

  // Pill badge for ID
  const idText = uniqueId
  const idWidth = doc.getTextWidth(idText) + 10
  doc.setFillColor(accentColor)
  doc.setGState(new (doc as any).GState({ opacity: 0.15 }))
  doc.roundedRect(pageWidth - 14 - idWidth, 26, idWidth, 8, 2, 2, 'F')
  doc.setGState(new (doc as any).GState({ opacity: 1 }))
  doc.setFontSize(9)
  doc.setTextColor(accentColor)
  doc.text(idText, pageWidth - 14 - idWidth / 2, 31.5, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#000000')
  doc.setFontSize(12)
  doc.text(companyDetails.name, 14, 32)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(companyDetails.address, 14, 38)

  // Accent bar
  doc.setFillColor(accentColor)
  doc.roundedRect(14, 46, pageWidth - 28, 2.5, 1, 1, 'F')

  return 56
}

const renderDefaultHeader = (
  ctx: PDFContext,
  companyDetails: CompanyDetails,
  accentColor: string,
  pdfType: string
): number => {
  const { doc, pageWidth } = ctx

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

  return 50
}

const renderClassicHeader = (
  ctx: PDFContext,
  companyDetails: CompanyDetails,
  accentColor: string,
  pdfType: string,
  uniqueId: string
): number => {
  const { doc, pageWidth } = ctx

  // Logo and company info on the left
  let leftY = 15
  if (companyDetails.logoUrl) {
    addCompanyLogo(doc, companyDetails, 14, leftY, 25, 25)
    leftY = 15
  }

  // Company details next to logo
  const textX = companyDetails.logoUrl ? 45 : 14
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#000000')
  doc.text(companyDetails.name, textX, leftY + 8)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(companyDetails.address, textX, leftY + 14)
  if (companyDetails.contact) {
    doc.text(companyDetails.contact, textX, leftY + 19)
  }

  // Title and ID on the right
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(accentColor)
  doc.text(pdfType, pageWidth - 14, 20, { align: 'right' })

  doc.setFontSize(11)
  doc.setTextColor('#000000')
  doc.text(uniqueId, pageWidth - 14, 28, { align: 'right' })

  // Accent bar below header
  doc.setFillColor(accentColor)
  doc.rect(14, 42, pageWidth - 28, 2, 'F')

  return 52
}

const renderMinimalistHeader = (
  ctx: PDFContext,
  companyDetails: CompanyDetails,
  accentColor: string,
  pdfType: string,
  uniqueId: string
): number => {
  const { doc, pageWidth } = ctx

  // Company name - light font style (using normal instead of bold)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor('#000000')
  doc.text(companyDetails.name, 14, 20)

  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text(companyDetails.address, 14, 26)

  // Title - uppercase tracking on the right
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(accentColor)
  doc.text(pdfType.toUpperCase(), pageWidth - 14, 20, { align: 'right' })

  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text(uniqueId, pageWidth - 14, 27, { align: 'right' })

  // Thin divider line
  doc.setDrawColor(200)
  doc.setLineWidth(0.3)
  doc.line(14, 35, pageWidth - 14, 35)

  return 45
}

// ========== MAIN HOOK ==========

const useGeneratePdf = () => {
  const account = useAppSelector(state => state.authReducer.user?.account)

  // Map account data to CompanyDetails format
  const companyDetails: CompanyDetails = {
    name: account?.name || '',
    address: account?.address || '',
    contact: [account?.phone, account?.email].filter(Boolean).join(' | '),
    logoUrl: account?.logoUrl || '',
    tagline: account?.tagline || '',
  }

  const generatePdf = async (
    data: Quotation | Invoice,
    title: string,
    pdfType: 'INVOICE' | 'QUOTATION'
  ) => {
    // Support both preset AccentColor names and custom hex values
    const accentColor = data.accentColor?.startsWith('#')
      ? data.accentColor
      : (ACCENT_COLORS[data.accentColor as AccentColor] ?? ACCENT_COLORS['teal'])

    // Handle custom template
    if (data.template && typeof data.template === 'object' && 'imageUrl' in data.template) {
      const customTemplate = {
        id: data.template._id,
        name: data.templateName || 'Custom Template',
        imageUrl: data.template.imageUrl,
      }
      try {
        await generateCustomTemplatePDF(customTemplate, data, companyDetails, pdfType, title)
        return
      } catch (error) {
        console.error('Error generating custom template PDF:', error)
        return
      }
    }

    // Built-in templates
    const doc = new jsPDF()
    const templateName = data.templateName || 'classic'
    const isCorporate = templateName === 'corporate'

    // Adjust context for corporate template
    const margin = isCorporate ? 60 : 14
    const ctx = createPDFContext(doc, margin)
    const uniqueId = data.uniqueId || ''

    // Render header based on template
    let currentY: number
    switch (templateName) {
      case 'modern':
        currentY = renderModernHeader(ctx, companyDetails, accentColor, pdfType)
        break
      case 'corporate':
        currentY = renderCorporateHeader(ctx, companyDetails, accentColor, pdfType)
        break
      case 'creative':
        currentY = renderCreativeHeader(ctx, companyDetails, accentColor, pdfType, uniqueId)
        break
      case 'classic':
        currentY = renderClassicHeader(ctx, companyDetails, accentColor, pdfType, uniqueId)
        break
      case 'minimalist':
        currentY = renderMinimalistHeader(ctx, companyDetails, accentColor, pdfType, uniqueId)
        break
      default:
        currentY = renderDefaultHeader(ctx, companyDetails, accentColor, pdfType)
    }

    // Render bill-to section based on template
    switch (templateName) {
      case 'classic':
        currentY = renderClassicBillToSection(ctx, data, currentY + 10)
        break
      case 'minimalist':
        currentY = renderMinimalistBillToSection(ctx, data, currentY + 15)
        break
      case 'creative':
        currentY = renderCreativeBillToSection(ctx, data, currentY + 10, accentColor)
        break
      default:
        currentY = renderBillToSection(ctx, data, currentY + 20, pdfType)
    }

    // Render items table
    currentY = renderItemsTable(ctx, data, currentY, pdfType, accentColor)

    // Render totals
    currentY = renderTotals(ctx, data, currentY)

    // Render notes
    currentY = renderNotes(ctx, data.notes, currentY)

    // Render terms
    currentY = renderTerms(ctx, data.terms, currentY)

    // Render closing
    renderClosing(ctx, companyDetails.name, currentY)

    doc.save(`${pdfType}-${uniqueId}.pdf`)
  }

  return { generatePdf }
}

export default useGeneratePdf
