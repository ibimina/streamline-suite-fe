import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  CustomTemplate,
  TemplatePlaceholder,
  TemplateMapping,
  Quotation,
  Invoice,
  CompanyDetails,
} from '../types'

export class CustomTemplateProcessor {
  private doc: jsPDF
  private template: CustomTemplate
  private mapping!: TemplateMapping

  constructor(template: CustomTemplate) {
    this.template = template
    this.doc = new jsPDF({
      unit: 'pt',
      format: [template.dimensions.width, template.dimensions.height],
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

      // Process each placeholder
      for (const placeholder of this.template.placeholders) {
        await this.processPlaceholder(placeholder, quotationOrInvoice)
      }
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

        this.doc.addImage(
          base64,
          format,
          0,
          0,
          this.template.dimensions.width,
          this.template.dimensions.height
        )
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

        this.doc.addImage(
          this.template.templateFile,
          format,
          0,
          0,
          this.template.dimensions.width,
          this.template.dimensions.height
        )
      }
    } catch (error) {
      console.warn('Could not load base template as background:', error)
      // Continue without background - just use placeholders
    }
  }

  private async processPlaceholder(
    placeholder: TemplatePlaceholder,
    document: Quotation | Invoice
  ): Promise<void> {
    const content = this.getContentForPlaceholder(placeholder.id, document)

    if (!content && placeholder.type !== 'table') return

    // Set text properties
    if (placeholder.fontSize) this.doc.setFontSize(placeholder.fontSize)
    if (placeholder.fontColor) this.doc.setTextColor(placeholder.fontColor)
    if (placeholder.fontWeight) this.doc.setFont('helvetica', placeholder.fontWeight)

    switch (placeholder.type) {
      case 'text':
        this.addText(placeholder, content as string)
        break
      case 'currency':
        this.addCurrency(placeholder, content as number)
        break
      case 'date':
        this.addDate(placeholder, content as string)
        break
      case 'image':
        await this.addImage(placeholder, content as string)
        break
      case 'table':
        this.addTable(placeholder, document)
        break
    }
  }

  private addText(placeholder: TemplatePlaceholder, text: string): void {
    if (!text) return

    const options: any = {}
    if (placeholder.align) options.align = placeholder.align
    if (placeholder.maxLines) {
      const splitText = this.doc.splitTextToSize(text, placeholder.width || 200)
      const linesToShow = splitText.slice(0, placeholder.maxLines)
      this.doc.text(linesToShow, placeholder.x, placeholder.y, options)
    } else {
      this.doc.text(text, placeholder.x, placeholder.y, options)
    }
  }

  private addCurrency(placeholder: TemplatePlaceholder, amount: number): void {
    const formatted = `$${amount.toFixed(2)}`

    this.addText(placeholder, formatted)
  }

  private addDate(placeholder: TemplatePlaceholder, dateString: string): void {
    let formatted = dateString
    if (placeholder.format) {
      const date = new Date(dateString)
      formatted = this.formatDate(date, placeholder.format)
    }
    this.addText(placeholder, formatted)
  }

  private async addImage(placeholder: TemplatePlaceholder, imageUrl: string): Promise<void> {
    try {
      if (imageUrl && imageUrl.startsWith('http')) {
        this.doc.addImage(
          imageUrl,
          'PNG',
          placeholder.x,
          placeholder.y,
          placeholder.width || 50,
          placeholder.height || 30
        )
      }
    } catch (error) {
      console.warn('Could not load image for placeholder:', placeholder.id, error)
      // Add fallback text
      this.doc.setFontSize(8)
      this.doc.text('[Image]', placeholder.x, placeholder.y)
    }
  }

  private addTable(placeholder: TemplatePlaceholder, document: Quotation | Invoice): void {
    const tableBody = document.items.map((item, index) => [
      (index + 1).toString(), // Add item number
      item.description,
      item.quantity.toString(),
      `$${item.unitPrice.toFixed(2)}`,
      `$${(item.quantity * item.unitPrice).toFixed(2)}`,
    ])

    autoTable(this.doc, {
      startY: placeholder.y,
      head: [['S/N', 'Description', 'Qty', 'Unit Price', 'Amount']],
      body: tableBody,
      theme: 'striped',
      headStyles: {
        fillColor: '#f8f9fa',
        textColor: '#333333',
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        lineWidth: 0.1,
        lineColor: '#dddddd',
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4,
        lineWidth: 0.1,
        lineColor: '#dddddd',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 30 }, // S/N
        1: { halign: 'left', cellWidth: 200 }, // Description
        2: { halign: 'center', cellWidth: 40 }, // Qty
        3: { halign: 'right', cellWidth: 60 }, // Unit Price
        4: { halign: 'right', cellWidth: 70 }, // Amount
      },
      alternateRowStyles: {
        fillColor: '#f8f9fa',
      },
      margin: {
        left: placeholder.x,
        right: placeholder.x + (placeholder.width || 400),
      },
      tableWidth: placeholder.width || 400,
      styles: {
        lineColor: '#dddddd',
        lineWidth: 0.1,
      },
    })
  }

  private createMapping(
    document: Quotation | Invoice,
    companyDetails: CompanyDetails,
    documentType: string
  ): TemplateMapping {
    return {
      documentNumber: document.id,
      documentDate: document.date,
      documentType,
      customerName: document.customerName,
      customerAddress: document.customerAddress,

      itemsTable: '', // Handled specially
      subtotal: document.subtotal.toString(),
      vat: document.vat.toString(),
      vatRate: '10', // Default or calculate from document
      total: document.total.toString(),

      terms: document.terms,
      notes: '',
      watermark: companyDetails.name,
    }
  }

  private getContentForPlaceholder(
    placeholderId: string,
    document: Quotation | Invoice
  ): string | number | undefined {
    const mapping = this.mapping

    switch (placeholderId) {
      //   case 'companyName':
      //     return mapping.companyName
      //   case 'companyAddress':
      //     return mapping.companyAddress
      //   case 'companyContact':
      //     return mapping.companyContact
      //   case 'companyLogo':
      //     return mapping.companyLogo
      //   case 'companyTagline':
      //     return mapping.companyTagline
      case 'documentType':
        return mapping.documentType
      case 'documentNumber':
        return mapping.documentNumber
      case 'documentDate':
        return mapping.documentDate
      case 'customerName':
        return mapping.customerName
      case 'customerAddress':
        return mapping.customerAddress
      case 'subtotal':
        return `Subtotal: $${document.subtotal.toFixed(2)}`
      case 'vat':
        const vatRate = 'vatRate' in document ? document.vatRate : 7.5 // Default rate
        return `VAT (${vatRate}%): $${document.vat.toFixed(2)}`
      case 'total':
        return `Total: $${document.total.toFixed(2)}`
      case 'terms':
        return mapping.terms
      case 'notes':
        return mapping.notes
      default:
        // Handle custom placeholders
        if (placeholderId.startsWith('custom_')) {
          return `[${placeholderId}]` // Placeholder for custom content
        }
        return undefined
    }
  }

  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`
      default:
        return date.toLocaleDateString()
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
  documentType: string
): Promise<void> => {
  const doc = await generateCustomTemplate(template, document, companyDetails, documentType)

  // Save the PDF
  const filename = `${documentType === 'Invoice' ? 'Invoice' : 'Quotation'}-${document.id}.pdf`
  doc.save(filename)
}
// generate
export const generateCustomTemplate = async (
  template: CustomTemplate,
  document: Quotation | Invoice,
  companyDetails: CompanyDetails,
  documentType: string
) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Try to add background image if it's an image file (not PDF)
  try {
    if (template.templateFile && typeof template.templateFile === 'string') {
      // Only add image background if it's not a PDF
      if (!template.templateFile.startsWith('data:application/pdf')) {
        let format = 'PNG'
        if (
          template.templateFile.includes('data:image/jpeg') ||
          template.templateFile.includes('data:image/jpg')
        ) {
          format = 'JPEG'
        }

        doc.addImage(template.templateFile, format, 0, 0, pageWidth, pageHeight)
      }
    }
  } catch (error) {
    console.warn('Could not load custom template background:', error)
  }

  // Company and Client Details
  doc.setFontSize(10)
  doc.setTextColor(100)

  const companyX = 15
  const clientX = pageWidth - 15
  const detailsY = 75
  const startX = 15

  doc.setFont('helvetica', 'bold')
  // doc.text('BILL TO:', clientX, detailsY,)
  doc.setFont('helvetica', 'normal')
  doc.text(`${document.date}`, companyX, detailsY)
  doc.text(document.customerName, companyX, detailsY + 5)
  doc.text(document.customerAddress, companyX, detailsY + 10)

  doc.setFontSize(12)
  doc.text(`Quotation #: ${document.id}`, clientX, detailsY, { align: 'right' })
  // doc.text(`Date: ${document.date}`, startX, detailsY + 32)

  // Centered document type title
  doc.setFontSize(12)
  doc.setTextColor('#333333')
  doc.setFont('helvetica', 'bold')
  const centerX = pageWidth / 2

  // Draw an underline for the centered document title
  try {
    const textWidth = doc.getTextWidth(documentType)
    const underlineY = detailsY + 37 // a few points below the text baseline
    doc.setLineWidth(0.8)
    doc.setDrawColor('#333333')
    doc.line(centerX - textWidth / 2, underlineY, centerX + textWidth / 2, underlineY)
  } catch (err) {
    console.warn('Could not draw underline for title:', err)
  }
  doc.text(documentType, centerX, detailsY + 35, { align: 'center' })

  // Table
  const tableBody = document.items.map((item, index) => [
    (index + 1).toString(),
    item.description,
    item.quantity.toString(),
    `$${item.unitPrice.toFixed(2)}`,
    `$${(item.quantity * item.unitPrice).toFixed(2)}`,
  ])

  autoTable(doc, {
    startY: detailsY + 40,
    head: [['S/N', 'Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableBody,
    theme: 'striped',
    headStyles: {
      fillColor: '#4a5568',
      textColor: '#ffffff',
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
    },
    margin: { left: startX, right: 15 },
    styles: {
      cellPadding: 3,
    },
  })

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10
  const totalX = pageWidth - 15
  doc.setFontSize(10)
  doc.text('Subtotal:', totalX - 30, finalY, { align: 'right' })
  doc.text(`$${document.subtotal.toFixed(2)}`, totalX, finalY, { align: 'right' })
  const vatRate = 'vatRate' in document ? document.vatRate : 7.5

  doc.text(`VAT (${vatRate}%):`, totalX - 30, finalY + 7, { align: 'right' })
  doc.text(`$${document.vat.toFixed(2)}`, totalX, finalY + 7, { align: 'right' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Total:', totalX - 30, finalY + 14, { align: 'right' })
  doc.text(`$${document.total.toFixed(2)}`, totalX, finalY + 14, { align: 'right' })

  // Terms
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text('Terms & Conditions', startX, finalY + 30)
  doc.setFont('helvetica', 'normal')
  doc.text(document.terms, startX, finalY + 35, { maxWidth: pageWidth - startX - 15 })

  // Closing greetings.
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(150)
  doc.text('Thank you', startX, finalY + 48)
  doc.text('Yours faithfully', startX, finalY + 52)
  doc.text(companyDetails.name, startX, finalY + 56)

  return doc
}
// Helper function to generate PDF with custom template and return as blob for preview
export const generateCustomTemplatePDFBlob = async (
  template: CustomTemplate,
  document: Quotation | Invoice,
  companyDetails: CompanyDetails,
  documentType: string
): Promise<Blob> => {
  // Return the PDF as blob instead of saving
  const doc = await generateCustomTemplate(template, document, companyDetails, documentType)

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

  if (template.placeholders.length === 0) {
    errors.push('At least one placeholder is required')
  }

  // Check for required placeholders
  const requiredPlaceholders = ['companyName', 'documentNumber', 'customerName', 'total']
  const existingIds = template.placeholders.map(p => p.id)
  const missingRequired = requiredPlaceholders.filter(id => !existingIds.includes(id))

  if (missingRequired.length > 0) {
    errors.push(`Missing required placeholders: ${missingRequired.join(', ')}`)
  }

  // Validate placeholder positions
  template.placeholders.forEach(placeholder => {
    if (placeholder.x < 0 || placeholder.y < 0) {
      errors.push(`Invalid position for placeholder ${placeholder.id}`)
    }
    if (placeholder.fontSize && placeholder.fontSize < 6) {
      errors.push(`Font size too small for placeholder ${placeholder.id}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

export const addCompanyLogo = (
  doc: jsPDF,
  companyDetails: any,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  // Try to add logo first
  if (companyDetails.logoUrl && companyDetails.logoUrl.startsWith('http')) {
    doc.addImage(companyDetails.logoUrl, 'PNG', x, y, width, height)
  }
}
