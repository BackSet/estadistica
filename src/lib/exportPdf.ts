import { buildA4PdfFromImage } from './pdf/buildA4Pdf'
import { captureElementAsPng } from './pdf/captureElement'
import { prepareExportDom } from './pdf/prepareExportDom'

export type ExportPdfOptions = {
  filename: string
  /** Título en metadatos y pie de la 1.ª página */
  title?: string
  /** Selector del bloque a capturar (sin pie de exportación). */
  captureSelector?: string
}

const DEFAULT_CAPTURE = '.pdf-capture-target'

/**
 * Exporta el contenido del ejercicio/inicio a un PDF A4 multipágina legible.
 */
export async function exportPageToPdf(options: ExportPdfOptions): Promise<void> {
  const selector = options.captureSelector ?? DEFAULT_CAPTURE
  const target =
    document.querySelector(selector) ??
    document.querySelector('.app-shell main') ??
    document.querySelector('.app-shell')

  if (!target || !(target instanceof HTMLElement)) {
    throw new Error(
      'No se encontró el contenido para exportar. Recarga la página e inténtalo de nuevo.',
    )
  }

  const session = await prepareExportDom()

  try {
    const dataUrl = await captureElementAsPng(target, {
      hideSelectors: ['.no-print'],
      scale: 2,
      backgroundColor: '#faf9f5',
    })

    if (!dataUrl || dataUrl.length < 100) {
      throw new Error('La captura salió vacía. Prueba de nuevo o usa otro navegador.')
    }

    buildA4PdfFromImage(dataUrl, 'PNG', {
      filename: options.filename.endsWith('.pdf')
        ? options.filename
        : `${options.filename}.pdf`,
      title: options.title,
      marginMm: 14,
    })
  } finally {
    session.restore()
  }
}
