import { jsPDF } from 'jspdf'

export type A4PdfOptions = {
  filename: string
  title?: string
  marginMm?: number
}

/**
 * Inserta una imagen PNG/JPEG en páginas A4 con márgenes y numeración.
 */
export function buildA4PdfFromImage(
  dataUrl: string,
  format: 'PNG' | 'JPEG',
  options: A4PdfOptions,
): void {
  const margin = options.marginMm ?? 14
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  if (options.title) {
    pdf.setProperties({
      title: options.title,
      subject: 'Estadística descriptiva — Trabajo social',
    })
  }

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const contentWidth = pageWidth - margin * 2
  const contentHeight = pageHeight - margin * 2

  const props = pdf.getImageProperties(dataUrl)
  const imgHeightMm = (props.height * contentWidth) / props.width

  let heightLeft = imgHeightMm
  let y = margin

  pdf.addImage(dataUrl, format, margin, y, contentWidth, imgHeightMm)
  heightLeft -= contentHeight

  while (heightLeft > 0.5) {
    y = margin - (imgHeightMm - heightLeft)
    pdf.addPage()
    pdf.addImage(dataUrl, format, margin, y, contentWidth, imgHeightMm)
    heightLeft -= contentHeight
  }

  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(130, 120, 115)
    pdf.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' },
    )
  }

  pdf.save(options.filename)
}
