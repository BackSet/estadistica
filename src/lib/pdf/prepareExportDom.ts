/** Prepara el DOM antes de capturar (fuentes, scroll, tema claro para impresión). */

export type ExportDomSession = {
  restore: () => void
}

export async function prepareExportDom(): Promise<ExportDomSession> {
  const root = document.documentElement
  const body = document.body
  const hadDark = root.classList.contains('dark')

  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  window.scrollTo(0, 0)
  await nextFrame()
  await nextFrame()

  if (hadDark) {
    root.classList.remove('dark')
    await nextFrame()
  }

  body.classList.add('is-exporting-pdf')

  return {
    restore: () => {
      body.classList.remove('is-exporting-pdf')
      if (hadDark) {
        root.classList.add('dark')
      }
    },
  }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}
