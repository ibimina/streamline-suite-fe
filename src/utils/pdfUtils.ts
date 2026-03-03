import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CompanyDetails } from '@/types'
import { Invoice } from '@/types/invoice.type'
import { Quotation } from '@/types/quotation.type'

export type PDFContext = {
  doc: jsPDF
  pageWidth: number
  pageHeight: number
  margin: number
  contentWidth: number
  bottomMargin: number
  backgroundImage?: string | null
}

// ========== PAGE UTILITIES ==========

export const createPDFContext = (doc: jsPDF, margin = 15, bottomMargin = 20): PDFContext => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  return {
    doc,
    pageWidth,
    pageHeight,
    margin,
    contentWidth: pageWidth - margin * 2,
    bottomMargin,
    backgroundImage: null,
  }
}

export const checkPageBreak = (
  ctx: PDFContext,
  requiredHeight: number,
  currentY: number
): number => {
  if (currentY + requiredHeight > ctx.pageHeight - ctx.bottomMargin) {
    ctx.doc.addPage()
    if (ctx.backgroundImage) {
      addBackgroundImage(ctx)
    }
    return ctx.margin + 10
  }
  return currentY
}

export const getTextHeight = (
  doc: jsPDF,
  text: string,
  fontSize: number,
  maxWidth: number
): number => {
  doc.setFontSize(fontSize)
  const lines = doc.splitTextToSize(text, maxWidth)
  const lineHeight = fontSize * 0.4
  return lines.length * lineHeight
}

// ========== BACKGROUND IMAGE ==========

export const loadBackgroundImage = async (
  imageUrl?: string,
  templateFile?: string
): Promise<string | null> => {
  try {
    if (imageUrl) {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } else if (templateFile && typeof templateFile === 'string') {
      return templateFile
    }
  } catch (error) {
    console.warn('Could not load background image:', error)
  }
  return null
}

export const addBackgroundImage = (ctx: PDFContext): void => {
  if (!ctx.backgroundImage || ctx.backgroundImage.startsWith('data:application/pdf')) {
    return
  }

  try {
    const format = ctx.backgroundImage.includes('data:image/jpeg') ? 'JPEG' : 'PNG'
    ctx.doc.addImage(ctx.backgroundImage, format, 0, 0, ctx.pageWidth, ctx.pageHeight)
  } catch (e) {
    console.warn('Could not add background image')
  }
}

// ========== COMPANY LOGO ==========

export const addCompanyLogo = (
  doc: jsPDF,
  companyDetails: CompanyDetails,
  x: number,
  y: number,
  width: number,
  height: number
): void => {
  if (companyDetails.logoUrl && companyDetails.logoUrl.startsWith('http')) {
    try {
      doc.addImage(companyDetails.logoUrl, 'PNG', x, y, width, height)
    } catch (e) {
      console.warn('Could not add company logo')
    }
  }
}

// ========== CUSTOMER SECTION ==========

export const renderCustomerSection = (
  ctx: PDFContext,
  data: Quotation | Invoice,
  startY: number
): number => {
  const { doc, margin } = ctx
  let currentY = startY

  const customerName = typeof data.customer === 'object' ? data.customer.companyName : ''
  const billingAddress = typeof data.customer === 'object' ? data.customer.billingAddress : null

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.setFont('helvetica', 'normal')

  // Date
  doc.text(`${new Date(data.issuedDate).toLocaleDateString()}`, margin, currentY)
  currentY += 5

  // Customer name
  if (customerName) {
    doc.text(customerName, margin, currentY)
    currentY += 5
  }

  // Customer address
  if (billingAddress) {
    if (billingAddress.street) {
      doc.text(billingAddress.street, margin, currentY)
      currentY += 5
    }
    if (billingAddress.city) {
      doc.text(billingAddress.city, margin, currentY)
      currentY += 5
    }
    const stateCountry = [billingAddress.state, billingAddress.country].filter(Boolean).join(', ')
    if (stateCountry) {
      doc.text(stateCountry, margin, currentY)
      currentY += 5
    }
  }

  return currentY + 5
}

// ========== BILL TO SECTION (for built-in templates) ==========

export const renderBillToSection = (
  ctx: PDFContext,
  data: Quotation | Invoice,
  startY: number,
  pdfType: string
): number => {
  const { doc, margin, pageWidth, contentWidth } = ctx
  let currentY = startY

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO:', margin, currentY)
  currentY += 5

  doc.setFont('helvetica', 'normal')

  if (data.customer.companyName) {
    doc.text(data.customer.companyName, margin, currentY)
    currentY += 5
  }

  const billing = data.customer.billingAddress
  if (billing) {
    if (billing.street) {
      doc.text(billing.street, margin, currentY)
      currentY += 5
    }
    const cityStateZip = [billing.city, billing.state, billing.zipCode].filter(Boolean).join(', ')
    if (cityStateZip) {
      doc.text(cityStateZip, margin, currentY)
      currentY += 5
    }
    if (billing.country) {
      doc.text(billing.country, margin, currentY)
      currentY += 5
    }
  }

  // Document info on right side
  doc.setFontSize(12)
  doc.text(`${pdfType} #: ${data.uniqueId}`, margin + contentWidth, startY, { align: 'right' })
  doc.text(`Date: ${data.issuedDate}`, margin + contentWidth, startY + 5, { align: 'right' })

  return currentY + 10
}

// ========== CLASSIC BILL TO SECTION ==========

export const renderClassicBillToSection = (
  ctx: PDFContext,
  data: Quotation | Invoice,
  startY: number
): number => {
  const { doc, margin, pageWidth } = ctx
  const currentY = startY

  // Left side: Bill To section (no background)
  const boxWidth = 80
  const boxX = margin
  const boxY = currentY
  const boxHeight = 35

  // Bill To content
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.setFont('helvetica', 'bold')
  doc.text('Bill To', boxX + 4, boxY + 6)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0)
  let textY = boxY + 12

  if (data.customer.companyName) {
    doc.setFont('helvetica', 'bold')
    doc.text(data.customer.companyName, boxX + 4, textY)
    textY += 5
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const billing = data.customer.billingAddress
  if (billing) {
    if (billing.street) {
      doc.text(billing.street, boxX + 4, textY)
      textY += 4
    }
    const cityStateZip = [billing.city, billing.state, billing.zipCode].filter(Boolean).join(', ')
    if (cityStateZip) {
      doc.text(cityStateZip, boxX + 4, textY)
      textY += 4
    }
    if (billing.country) {
      doc.text(billing.country, boxX + 4, textY)
    }
  }

  // Right side: Date info section (no background)
  const rightBoxWidth = 55
  const rightBoxX = pageWidth - margin - rightBoxWidth
  const rightBoxHeight = 22

  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text('Date:', rightBoxX + 4, boxY + 8)
  doc.setTextColor(0)
  doc.setFont('helvetica', 'bold')
  doc.text(
    new Date(data.issuedDate).toLocaleDateString(),
    rightBoxX + rightBoxWidth - 4,
    boxY + 8,
    {
      align: 'right',
    }
  )

  // Due date or valid until
  if ('dueDate' in data && data.dueDate) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text('Due Date:', rightBoxX + 4, boxY + 15)
    doc.setTextColor(0)
    doc.setFont('helvetica', 'bold')
    doc.text(
      new Date(data.dueDate as string).toLocaleDateString(),
      rightBoxX + rightBoxWidth - 4,
      boxY + 15,
      { align: 'right' }
    )
  } else if ('validUntil' in data && data.validUntil) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text('Valid Until:', rightBoxX + 4, boxY + 15)
    doc.setTextColor(0)
    doc.setFont('helvetica', 'bold')
    doc.text(
      new Date(data.validUntil as string).toLocaleDateString(),
      rightBoxX + rightBoxWidth - 4,
      boxY + 15,
      { align: 'right' }
    )
  }

  return currentY + boxHeight + 8
}

// ========== MINIMALIST BILL TO SECTION (uppercase labels, thin styling) ==========

export const renderMinimalistBillToSection = (
  ctx: PDFContext,
  data: Quotation | Invoice,
  startY: number
): number => {
  const { doc, margin, pageWidth } = ctx
  let currentY = startY

  // Left side: Bill To
  doc.setFontSize(7)
  doc.setTextColor(120)
  doc.setFont('helvetica', 'normal')
  doc.text('BILL TO', margin, currentY)

  // Right side: Details
  doc.text('DETAILS', pageWidth - margin, currentY, { align: 'right' })
  currentY += 5

  // Customer info
  doc.setTextColor(0)
  doc.setFontSize(10)
  if (data.customer.companyName) {
    doc.text(data.customer.companyName, margin, currentY)
    currentY += 5
  }

  doc.setFontSize(8)
  doc.setTextColor(100)
  const billing = data.customer.billingAddress
  if (billing) {
    if (billing.street) {
      doc.text(billing.street, margin, currentY)
      currentY += 4
    }
    const cityStateZip = [billing.city, billing.state, billing.zipCode].filter(Boolean).join(', ')
    if (cityStateZip) {
      doc.text(cityStateZip, margin, currentY)
    }
  }

  // Date info on right
  let rightY = startY + 5
  doc.setFontSize(8)
  doc.setTextColor(100)
  const dateLabel = 'Date: '
  const dateValue = new Date(data.issuedDate).toLocaleDateString()
  doc.text(dateLabel + dateValue, pageWidth - margin, rightY, { align: 'right' })
  rightY += 5

  if ('dueDate' in data && data.dueDate) {
    doc.text(
      `Due: ${new Date(data.dueDate as string).toLocaleDateString()}`,
      pageWidth - margin,
      rightY,
      {
        align: 'right',
      }
    )
  }

  return currentY + 15
}

// ========== CREATIVE BILL TO SECTION (accent left border) ==========

export const renderCreativeBillToSection = (
  ctx: PDFContext,
  data: Quotation | Invoice,
  startY: number,
  accentColor: string
): number => {
  const { doc, margin, pageWidth } = ctx
  const currentY = startY

  // Draw accent left border
  doc.setFillColor(accentColor)
  doc.rect(margin, currentY, 2, 30, 'F')

  // Bill To content with padding
  const textX = margin + 6
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.setFont('helvetica', 'bold')
  doc.text('Bill To', textX, currentY + 5)

  doc.setTextColor(0)
  doc.setFontSize(10)
  let textY = currentY + 11

  if (data.customer.companyName) {
    doc.setFont('helvetica', 'bold')
    doc.text(data.customer.companyName, textX, textY)
    textY += 5
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const billing = data.customer.billingAddress
  if (billing) {
    if (billing.street) {
      doc.text(billing.street, textX, textY)
      textY += 4
    }
    const cityStateZip = [billing.city, billing.state, billing.zipCode].filter(Boolean).join(', ')
    if (cityStateZip) {
      doc.text(cityStateZip, textX, textY)
      textY += 4
    }
    if (billing.country) {
      doc.text(billing.country, textX, textY)
    }
  }

  // Date info on right
  let rightY = currentY + 5
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0)
  doc.text('Date: ', pageWidth - margin - 30, rightY)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(data.issuedDate).toLocaleDateString(), pageWidth - margin, rightY, {
    align: 'right',
  })
  rightY += 6

  if ('dueDate' in data && data.dueDate) {
    doc.setFont('helvetica', 'bold')
    doc.text('Due Date: ', pageWidth - margin - 30, rightY)
    doc.setFont('helvetica', 'normal')
    doc.text(new Date(data.dueDate as string).toLocaleDateString(), pageWidth - margin, rightY, {
      align: 'right',
    })
  }

  return currentY + 38
}

// ========== ITEMS TABLE ==========

export const renderItemsTable = (
  ctx: PDFContext,
  data: Quotation | Invoice,
  startY: number,
  pdfType: 'INVOICE' | 'QUOTATION',
  accentColor?: string
): number => {
  const { doc, margin, pageWidth, pageHeight, backgroundImage } = ctx

  // Check if any item has a non-empty SKU
  const hasAnySku = data.items.some(item => item.sku && item.sku.trim() !== '')

  const isInvoice = pdfType === 'INVOICE'
  const tableColumn =
    isInvoice && hasAnySku
      ? ['#', 'Description', 'Quantity', 'SKU', 'Unit Price', 'Total']
      : ['#', 'Description', 'Quantity', 'Unit Price', 'Total']

  const tableRows = data.items.map((item, index) => {
    const baseRow: (string | number)[] = [index + 1, item.description ?? '', item.quantity ?? 0]

    if (isInvoice && hasAnySku) {
      baseRow.push(item.sku ?? '')
    }

    baseRow.push(
      `$${(item.unitPrice ?? 0).toLocaleString()}`,
      `$${((item.quantity ?? 0) * (item.unitPrice ?? 0)).toLocaleString()}`
    )

    return baseRow
  })

  const headStyles: any = {
    fillColor: accentColor || '#4a5568',
    textColor: '#ffffff',
    fontSize: 10,
    fontStyle: 'bold',
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY,
    theme: 'striped',
    headStyles,
    bodyStyles: { fontSize: 9 },
    margin: { left: margin, right: margin },
    didDrawPage: (tableData: any) => {
      if (tableData.pageNumber > 1 && backgroundImage) {
        try {
          const format = backgroundImage.includes('data:image/jpeg') ? 'JPEG' : 'PNG'
          doc.addImage(backgroundImage, format, 0, 0, pageWidth, pageHeight)
        } catch (e) {
          console.warn('Could not add background to table page')
        }
      }
    },
  })

  return (doc as any).lastAutoTable.finalY + 10
}

// ========== TOTALS SECTION ==========

export const renderTotals = (
  ctx: PDFContext,
  data: Quotation | Invoice,
  startY: number
): number => {
  const { doc, pageWidth, margin } = ctx
  let currentY = checkPageBreak(ctx, 25, startY)

  const totalX = pageWidth - margin
  const labelsX = totalX - 40

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80)

  doc.text('Subtotal:', labelsX, currentY, { align: 'right' })
  doc.text(`$${(data.subtotal ?? 0).toLocaleString()}`, totalX, currentY, { align: 'right' })
  currentY += 7

  doc.text(`VAT (${data.vatRate ?? 0}%):`, labelsX, currentY, { align: 'right' })
  doc.text(`$${(data.totalVat ?? 0).toLocaleString()}`, totalX, currentY, { align: 'right' })
  currentY += 7

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Total:', labelsX, currentY, { align: 'right' })
  doc.text(`$${(data.grandTotal ?? 0).toLocaleString()}`, totalX, currentY, { align: 'right' })

  return currentY + 15
}

// ========== TERMS & CONDITIONS ==========

export const renderTerms = (ctx: PDFContext, terms: string | undefined, startY: number): number => {
  if (!terms) return startY

  const { doc, margin, contentWidth } = ctx
  const termsHeight = getTextHeight(doc, terms, 8, contentWidth) + 15
  let currentY = checkPageBreak(ctx, termsHeight, startY)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(150)
  doc.text('Terms & Conditions', margin, currentY)
  currentY += 5

  doc.setFont('helvetica', 'normal')
  const termsLines = doc.splitTextToSize(terms, contentWidth)
  doc.text(termsLines, margin, currentY)

  return currentY + termsLines.length * 3.5 + 10
}

// ========== NOTES SECTION ==========

export const renderNotes = (ctx: PDFContext, notes: string | undefined, startY: number): number => {
  if (!notes) return startY

  const { doc, margin, contentWidth } = ctx
  const notesHeight = getTextHeight(doc, notes, 9, contentWidth) + 10
  let currentY = checkPageBreak(ctx, notesHeight, startY)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100)
  doc.text('Notes:', margin, currentY)
  currentY += 5

  doc.setFont('helvetica', 'normal')
  const notesLines = doc.splitTextToSize(notes, contentWidth)
  doc.text(notesLines, margin, currentY)

  return currentY + notesLines.length * 4 + 10
}

// ========== CLOSING SECTION ==========

export const renderClosing = (ctx: PDFContext, companyName: string, startY: number): number => {
  const { doc, margin } = ctx
  let currentY = checkPageBreak(ctx, 25, startY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Thank you for your business!', margin, currentY)
  currentY += 6

  doc.text('Yours faithfully,', margin, currentY)
  currentY += 6

  doc.setFont('helvetica', 'bold')
  doc.text(companyName, margin, currentY)

  return currentY + 10
}
