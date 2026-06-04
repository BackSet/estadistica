import type { ExerciseDef } from '@/data/exercises'
import { ExcelDoc } from './workbook/ExcelDoc'
import { generateCentralExcel } from './generators/centralXlsx'
import { generateConceptualExcel } from './generators/conceptualXlsx'
import { generateFrequencyExcel } from './generators/frequencyXlsx'
import { generateGroupedExcel } from './generators/groupedXlsx'
import { generateHomeExcel } from './generators/homeXlsx'

export type GenerateExcelTarget =
  | { scope: 'home' }
  | { scope: 'exercise'; exercise: ExerciseDef }

export async function generateExcel(
  target: GenerateExcelTarget,
  filename: string,
): Promise<void> {
  const mod = await import('exceljs')
  // Interop CJS/ESM: el espacio de nombres puede venir en `default`.
  const ExcelJS = mod.default ?? mod

  if (target.scope === 'home') {
    const doc = new ExcelDoc(ExcelJS, 'Índice de ejercicios')
    generateHomeExcel(doc)
    await doc.save(filename)
    return
  }

  const { exercise } = target
  const doc = new ExcelDoc(ExcelJS, `Ejercicio ${exercise.exerciseLabel}`)
  switch (exercise.kind) {
    case 'frequency':
      generateFrequencyExcel(doc, exercise)
      break
    case 'central':
      generateCentralExcel(doc, exercise)
      break
    case 'grouped':
      generateGroupedExcel(doc, exercise)
      break
    case 'conceptual':
      generateConceptualExcel(doc, exercise)
      break
  }
  await doc.save(filename)
}
