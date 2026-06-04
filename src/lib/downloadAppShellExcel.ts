import type { ExerciseDef } from '@/data/exercises'

export type DownloadExcelOptions = {
  exercise?: ExerciseDef
}

/**
 * Genera y descarga un libro de Excel (.xlsx) con el diseño editorial de la
 * app (tablas booktabs, paleta neutra, contraste serif/sans).
 */
export async function downloadAppShellExcel(
  filename: string,
  options?: DownloadExcelOptions,
): Promise<void> {
  const { generateExcel } = await import('./excel/generateExcel')
  const target =
    options?.exercise != null
      ? { scope: 'exercise' as const, exercise: options.exercise }
      : { scope: 'home' as const }

  await generateExcel(target, filename)
}
