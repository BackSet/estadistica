import type { ExerciseDef } from '@/data/exercises'

export type DownloadPdfOptions = {
  filename: string
  title?: string
  exercise?: ExerciseDef
}

/**
 * Genera un PDF A4 con contenido tipográfico (no captura del DOM).
 */
export async function downloadAppShellPdf(
  filename: string,
  options?: Omit<DownloadPdfOptions, 'filename'> | string,
): Promise<void> {
  const opts: Omit<DownloadPdfOptions, 'filename'> =
    typeof options === 'string' ? { title: options } : (options ?? {})

  const { exportPageToPdf } = await import('./exportPdf')
  const target =
    opts.exercise != null
      ? { scope: 'exercise' as const, exercise: opts.exercise }
      : { scope: 'home' as const }

  exportPageToPdf({ filename, title: opts.title, target })
}
