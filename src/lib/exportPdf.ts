import type { ExerciseDef } from '@/data/exercises'
import { generatePdf, type GeneratePdfTarget } from './pdf/generatePdf'

export type ExportPdfOptions = {
  filename: string
  title?: string
  target: GeneratePdfTarget
}

/**
 * Genera un PDF A4 con diseño propio (texto y tablas nativas, sin captura de pantalla).
 */
export function exportPageToPdf(options: ExportPdfOptions): void {
  generatePdf(options.target, options.filename)
}

export type { ExerciseDef }
