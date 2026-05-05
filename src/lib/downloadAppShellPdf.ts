/**
 * Genera un PDF fiel al diseño actual (captura de `.app-shell`), una hoja
 * completa, ocultando elementos `.no-print` (p. ej. barra con “Descargar”).
 */
export async function downloadAppShellPdf(filename: string): Promise<void> {
  const el = document.querySelector('.app-shell') as HTMLElement | null
  if (!el) {
    throw new Error('No se encontró el contenedor de la aplicación (.app-shell).')
  }
  const { exportElementToSinglePagePdf } = await import(
    './exportVisualSinglePagePdf'
  )
  await exportElementToSinglePagePdf(el, {
    filename,
    hideSelectors: ['.no-print'],
  })
}
