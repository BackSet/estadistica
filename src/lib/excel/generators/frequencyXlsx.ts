import type { FrequencyExerciseDef } from '@/data/exercises'
import { exerciseKindLabel } from '@/data/exercises'
import {
  buildFrequencyResolutionSteps,
  buildFrequencyTable,
} from '@/lib/statistics'
import type { ExcelDoc } from '../workbook/ExcelDoc'

export function generateFrequencyExcel(
  doc: ExcelDoc,
  exercise: FrequencyExerciseDef,
): void {
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
    [
      { header: 'xᵢ', span: 2, align: 'center' },
      { header: 'fᵢ', align: 'right' },
      { header: 'fᵢ/n', align: 'right', numFmt: '0.000' },
      { header: '%', align: 'right', numFmt: '0.0%' },
      { header: 'Fᵢ', align: 'right' },
    ],
    table.rows.map((r) => [r.xi, r.fi, Number(r.fr.toFixed(3)), r.fr, r.fac]),
  )

  doc.addNote(
    'Verificación',
    `Σfᵢ = ${table.verification.sumFi} = n. La suma de frecuencias absolutas coincide con n = ${table.n}. Suma exacta de fᵢ/n: ${table.verification.sumFr} (redondeo a 3 decimales por fila).`,
  )
}
