import { jsPDF } from 'jspdf'
import { CustomTemplate, TemplateMapping, Quotation, Invoice, CompanyDetails } from '../types'
import {
  createPDFContext,
  loadBackgroundImage,
  addBackgroundImage,
  renderCustomerSection,
  renderItemsTable,
  renderTotals,
  renderTerms,
  renderClosing,
  checkPageBreak,
  PDFContext,
} from './pdfUtils'

export class CustomTemplateProcessor {
  private doc: jsPDF
  private template: CustomTemplate
  private mapping!: TemplateMapping

  constructor(template: CustomTemplate) {
    this.template = template
    this.doc = new jsPDF({
      unit: 'pt',
    })
  }

  async generatePDF(
    quotationOrInvoice: Quotation | Invoice,
    companyDetails: CompanyDetails,
    documentType: 'Quotation' | 'Invoice'
  ): Promise<void> {
    try {
      // First, load the base template as background
      await this.loadBaseTemplate()

      // Create mapping data
      this.mapping = this.createMapping(quotationOrInvoice, companyDetails, documentType)
    } catch (error) {
      console.error('Error generating custom template PDF:', error)
      throw error
    }
  }

  private async loadBaseTemplate(): Promise<void> {
    try {
      if (this.template.templateFile instanceof File) {
        // Check if it's a PDF file - jsPDF addImage doesn't support PDF files
        if (this.template.templateFile.type === 'application/pdf') {
          console.warn(
            'PDF files cannot be used as backgrounds with jsPDF addImage. Skipping background.'
          )
          return
        }

        // Convert File to base64 and add as background
        const base64 = await this.fileToBase64(this.template.templateFile)

        // Determine image format from file type
        let format = 'PNG'
        if (
          this.template.templateFile.type.includes('jpeg') ||
          this.template.templateFile.type.includes('jpg')
        ) {
          format = 'JPEG'
        }
      } else if (typeof this.template.templateFile === 'string') {
        // Check if it's a PDF data URL
        if (this.template.templateFile.startsWith('data:application/pdf')) {
          console.warn(
            'PDF files cannot be used as backgrounds with jsPDF addImage. Skipping background.'
          )
          return
        }

        // Determine format from data URL
        let format = 'PNG'
        if (
          this.template.templateFile.includes('data:image/jpeg') ||
          this.template.templateFile.includes('data:image/jpg')
        ) {
          format = 'JPEG'
        }
      }
    } catch (error) {
      console.warn('Could not load base template as background:', error)
      // Continue without background - just use placeholders
    }
  }

  private createMapping(
    document: Quotation | Invoice,
    companyDetails: CompanyDetails,
    documentType: string
  ): TemplateMapping {
    const customerName = typeof document.customer === 'object' ? document.customer.companyName : ''
    const customerAddress =
      typeof document.customer === 'object' && document.customer.billingAddress
        ? `${document.customer.billingAddress.street}, ${document.customer.billingAddress.city}`
        : ''

    return {
      documentNumber: document._id || '',
      documentDate: document.issuedDate,
      documentType,
      customerName,
      customerAddress,

      itemsTable: '', // Handled specially
      subtotal: document.subtotal.toString(),
      vat: (document.totalVat || 0).toString(),
      vatRate: (document.vatRate || 10).toString(), // Default or calculate from document
      total: document.grandTotal.toString(),

      terms: document.terms || '',
      notes: '',
      watermark: companyDetails.name,
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  public save(filename: string): void {
    this.doc.save(filename)
  }

  public getDoc(): jsPDF {
    return this.doc
  }
}

// Helper function to generate PDF with custom template
export const generateCustomTemplatePDF = async (
  template: CustomTemplate,
  document: Quotation | Invoice,
  companyDetails: CompanyDetails,
  documentType: 'QUOTATION' | 'INVOICE',
  title: string
): Promise<void> => {
  const doc = await generateCustomTemplate(template, document, companyDetails, documentType, title)

  // Save the PDF
  const filename = `${documentType === 'INVOICE' ? 'Invoice' : 'Quotation'}-${document._id || 'doc'}.pdf`
  doc.save(filename)
}
// Helper function to generate a custom template PDF
export const generateCustomTemplate = async (
  template: CustomTemplate,
  document: Quotation | Invoice,
  companyDetails: CompanyDetails,
  documentType: 'QUOTATION' | 'INVOICE',
  title: string
) => {
  const doc = new jsPDF()
  const ctx = createPDFContext(doc)

  // Load and set background image
  ctx.backgroundImage = await loadBackgroundImage(
    template.imageUrl,
    template.templateFile as string
  )
  if (ctx.backgroundImage) {
    addBackgroundImage(ctx)
  }

  let currentY = 75

  // ========== DOCUMENT NUMBER (top right) ==========
  doc.setFontSize(12)
  doc.setTextColor(100)
  doc.text(`${documentType} #: ${document.uniqueId || ''}`, ctx.pageWidth - ctx.margin, 75, {
    align: 'right',
  })

  // ========== CUSTOMER SECTION ==========
  currentY = renderCustomerSection(ctx, document, currentY)

  // ========== CENTERED TITLE ==========
  currentY = checkPageBreak(ctx, 15, currentY)
  doc.setFontSize(12)
  doc.setTextColor('#333333')
  doc.setFont('helvetica', 'bold')

  const centerX = ctx.pageWidth / 2
  doc.text(title, centerX, currentY, { align: 'center' })

  // Draw underline
  try {
    const textWidth = doc.getTextWidth(title)
    doc.setLineWidth(0.8)
    doc.setDrawColor('#333333')
    doc.line(centerX - textWidth / 2, currentY + 2, centerX + textWidth / 2, currentY + 2)
  } catch (err) {
    console.warn('Could not draw underline:', err)
  }
  currentY += 15

  // ========== ITEMS TABLE ==========
  currentY = renderItemsTable(ctx, document, currentY, documentType)

  // ========== TOTALS ==========
  currentY = renderTotals(ctx, document, currentY)

  // ========== TERMS ==========
  currentY = renderTerms(ctx, document.terms, currentY)

  // ========== CLOSING ==========
  renderClosing(ctx, companyDetails.name, currentY)

  return doc
}
// Helper function to generate PDF with custom template and return as blob for preview
export const generateCustomTemplatePDFBlob = async (
  template: CustomTemplate,
  document: Quotation | Invoice,
  companyDetails: CompanyDetails,
  documentType: 'QUOTATION' | 'INVOICE',
  title: string
): Promise<Blob> => {
  // Return the PDF as blob instead of saving
  const doc = await generateCustomTemplate(template, document, companyDetails, documentType, title)

  const pdfBlob = doc.output('blob')
  return pdfBlob
}

// Helper function to validate custom template
export const validateCustomTemplate = (
  template: CustomTemplate
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!template.name.trim()) {
    errors.push('Template name is required')
  }

  if (!template.templateFile) {
    errors.push('Template file is required')
  }

  // Check for required placeholders
  const requiredPlaceholders = ['companyName', 'documentNumber', 'customerName', 'total']

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Re-export addCompanyLogo for backward compatibility
export { addCompanyLogo } from './pdfUtils'
