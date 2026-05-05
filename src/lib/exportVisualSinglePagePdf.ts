import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export type ExportVisualOptions = {
  filename: string
  /** Clases o selectores a ocultar en el clon (p. ej. barra con botón de descarga). */
  hideSelectors?: string[]
  /** Escala lógica de captura (2 = buena calidad; subir puede aumentar memoria). */
  scale?: number
}

/**
 * Un PDF con **una sola página** cuyo aspecto es una captura fiel del nodo
 * (diseño CSS y tipografías como en pantalla). El contenido se inserta como
 * imagen: no es texto seleccionable.
 */
export async function exportElementToSinglePagePdf(
  element: HTMLElement,
  options: ExportVisualOptions,
): Promise<void> {
  const {
    filename,
    hideSelectors = ['.no-print'],
    scale = 2,
  } = options

  if (document.fonts?.ready) {
    await document.fonts.ready
  }
  window.scrollTo(0, 0)
  // Reflow
  void element.offsetHeight

  const width = Math.max(
    1,
    Math.ceil(
      Math.max(element.scrollWidth, element.getBoundingClientRect().width),
    ),
  )
  const height = Math.max(
    1,
    Math.ceil(
      Math.max(element.scrollHeight, element.getBoundingClientRect().height),
    ),
  )

  const bg = getComputedStyle(document.documentElement).getPropertyValue(
    '--bg',
  )?.trim()
  const bodyBg = getComputedStyle(document.body).backgroundColor
  const fillBg =
    bg && (bg.startsWith('#') || bg.startsWith('rgb')) ? bg : bodyBg

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: fillBg || '#faf9f5',
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    logging: false,
    onclone(clonedDoc) {
      for (const sel of hideSelectors) {
        clonedDoc.querySelectorAll(sel).forEach((n) => {
          ;(n as HTMLElement).style.setProperty('display', 'none', 'important')
        })
      }
      const shell = clonedDoc.querySelector('.app-shell') as HTMLElement | null
      if (shell) {
        shell.style.overflow = 'visible'
        shell.style.height = 'auto'
        shell.style.maxHeight = 'none'
        shell.style.minHeight = 'auto'
      }
      clonedDoc.body.style.overflow = 'visible'
      clonedDoc.body.style.height = 'auto'
      if (fillBg) {
        clonedDoc.body.style.backgroundColor = fillBg
      }
    },
  })

  const w = canvas.width
  const h = canvas.height
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95)

  // Algunos motores de PDF limitan el tamaño de página; reescalamos de forma uniforme.
  const MAX = 12000
  let pageW = w
  let pageH = h
  if (pageH > MAX || pageW > MAX) {
    const r = Math.min(MAX / pageH, MAX / pageW, 1)
    pageW = Math.floor(w * r)
    pageH = Math.floor(h * r)
  }

  const pdf = new jsPDF({
    orientation: pageH >= pageW ? 'portrait' : 'landscape',
    unit: 'px',
    format: [pageW, pageH],
    hotfixes: ['px_scaling'],
    compress: true,
  })
  pdf.addImage(dataUrl, 'JPEG', 0, 0, pageW, pageH, undefined, 'MEDIUM')
  pdf.save(filename)
}
