import { ACCENT_COLORS } from '@/contants'
import { useAppSelector } from '@/store/hooks'
import { Invoice, Quotation } from '@/types'
import { addCompanyLogo, generateCustomTemplatePDF } from '@/utils/customTemplateProcessor'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const useGeneratePdf = () => {
  const companyDetails = useAppSelector(state => state.company.details)

  const generatePdf = async (
    data: Quotation | Invoice,
    title: string,
    pdfType: 'INVOICE' | 'QUOTATION'
  ) => {
    const doc = new jsPDF()
    const accentColor = ACCENT_COLORS[data.accentColor]
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

    // Header
    switch (data.template) {
      case 'custom':
        const customTemplate = companyDetails?.customTemplates?.find(
          t => t.id === data.customTemplateId
        )

        if (customTemplate) {
          try {
            await generateCustomTemplatePDF(customTemplate, data, companyDetails, pdfType, title)

            return
          } catch (error) {
            console.error('Error generating custom template PDF:', error)
            return
          }
        } else {
          console.error(
            'Custom template not found, available templates:',
            companyDetails?.customTemplates?.map(t => ({ id: t.id, name: t.name }))
          )
          return
        }
      case 'modern':
        doc.setFillColor(accentColor)
        doc.rect(0, 0, pageWidth, 40, 'F')
        if (companyDetails.logoUrl) {
          addCompanyLogo(doc, companyDetails, 14, 15, 30, 10)
        }
        doc.setFontSize(22)
        doc.setTextColor('#FFFFFF')
        doc.setFont('helvetica', 'bold')
        doc.text('Quotation', pageWidth - 14, 25, { align: 'right' })
        break
      case 'corporate':
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
        break
      case 'creative':
        drawWatermark()
      default: // classic, minimalist
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
        break
    }
    const contentX = data.template === 'corporate' ? 60 : 14
    const contentWidth = data.template === 'corporate' ? pageWidth - 70 : pageWidth - 28

    // Company and Client Details
    doc.setFontSize(10)
    doc.setTextColor(100)

    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', contentX, 70)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerName, contentX, 75)
    doc.text(data.customerAddress, contentX, 80)

    doc.setFontSize(12)
    doc.text(`${pdfType} #: ${data.id}`, contentX + contentWidth, 70, { align: 'right' })
    doc.text(`Date: ${data.date}`, contentX + contentWidth, 75, { align: 'right' })

    // Table
    if (pdfType === 'QUOTATION') {
      const tableBody = data.items.map((item, index) => [
        index + 1,
        item.description,
        item.quantity,
        `$${item.unitPrice.toFixed(2)}`,
        `$${(item.quantity * item.unitPrice).toFixed(2)}`,
      ])

      autoTable(doc, {
        startY: 90,
        head: [['#', 'Description', 'Quantity', 'Unit Price', 'Total']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: accentColor },
        margin: { left: contentX, right: 15 },
      })
    } else {
      const tableColumn = ['#', 'Description', 'Quantity', 'SKU', 'Unit Price', 'Total']
      const tableRows = data.items.map((item, index) => [
        index + 1,
        item.description ?? '',
        item.quantity ?? 0,
        item.sku ?? '',
        `$${(item.unitPrice ?? 0).toFixed(2)}`,
        `$${((item.quantity ?? 0) * (item.unitPrice ?? 0)).toFixed(2)}`,
      ]) as (string | number)[][]

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: data.template === 'minimalist' ? 'grid' : 'striped',
        headStyles: { fillColor: accentColor },
        margin: { left: contentX },
      })
    }
    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10
    const totalX = pageWidth - 15
    doc.setFontSize(10)
    doc.text('Subtotal:', totalX - 30, finalY, { align: 'right' })
    doc.text(`$${data.subtotal.toFixed(2)}`, totalX, finalY, { align: 'right' })
    const vat = 'vatRate' in data && data.vatRate != null ? data.vatRate : 7.5

    doc.text(`VAT (${vat}%):`, totalX - 30, finalY + 7, { align: 'right' })
    doc.text(`$${data.vat.toFixed(2)}`, totalX, finalY + 7, { align: 'right' })
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Total:', totalX - 30, finalY + 14, { align: 'right' })
    doc.text(`$${data.total.toFixed(2)}`, totalX, finalY + 14, { align: 'right' })

    // Terms
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('Terms & Conditions', contentX, finalY + 30)
    doc.setFont('helvetica', 'normal')
    const splitTerms = doc.splitTextToSize(data.terms, contentWidth)
    doc.text(splitTerms, contentX, finalY + 35)

    doc.save(`${pdfType}-${data.id}.pdf`)
  }
  return { generatePdf }
}

export default useGeneratePdf
