export type DownloadPdfOptions = {
  filename: string
  title?: string
}

/**
 * Genera un PDF A4 multipágina del contenido del ejercicio (sin barra de exportación).
 */
export async function downloadAppShellPdf(
  filename: string,
  title?: string,
): Promise<void> {
  const { exportPageToPdf } = await import('./exportPdf')
  await exportPageToPdf({ filename, title })
}
