import type { FrequencyExerciseDef } from '@/data/exercises'
import { exerciseKindLabel } from '@/data/exercises'
import {
  buildFrequencyResolutionSteps,
  buildFrequencyTable,
} from '@/lib/statistics'
import { PdfDocument } from '../document/PdfDocument'

export function generateFrequencyPdf(exercise: FrequencyExerciseDef): PdfDocument {
  const doc = new PdfDocument(exercise.title)
  const table = buildFrequencyTable(exercise.values)
  const steps = buildFrequencyResolutionSteps(table)

  doc.addExerciseCover({
    label: exercise.exerciseLabel,
    title: exercise.title,
    kindLabel: exerciseKindLabel(exercise),
    context: exercise.context,
  })

  doc.addDataPanel(
    `Datos originales (n = ${table.n})`,
    exercise.values.join(', '),
  )

  doc.addSectionTitle('Resolución (orden de las columnas)')
  doc.addResolutionSteps(steps)

  doc.addSectionTitle('Tabla de frecuencias')
  doc.addTable(
    [['xᵢ', 'fᵢ', 'fᵢ/n', '%', 'Fᵢ']],
    table.rows.map((r) => [
      String(r.xi),
      String(r.fi),
      String(Number(r.fr.toFixed(3))),
      `${r.fp}%`,
      String(r.fac),
    ]),
    { align: ['center', 'right', 'right', 'right', 'right'] },
  )

  doc.addNote(
    'Verificación',
    `Σfᵢ = ${table.verification.sumFi} = n. La suma de frecuencias absolutas coincide con n = ${table.n}. Suma exacta de fᵢ/n: ${table.verification.sumFr} (redondeo a 3 decimales por fila).`,
  )

  return doc
}
