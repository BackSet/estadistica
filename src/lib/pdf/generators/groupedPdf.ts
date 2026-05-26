import type { GroupedExerciseDef } from '@/data/exercises'
import { exerciseKindLabel } from '@/data/exercises'
import { buildGroupedAnalysis } from '@/lib/statistics'
import { PdfDocument } from '../document/PdfDocument'

export function generateGroupedPdf(exercise: GroupedExerciseDef): PdfDocument {
  const doc = new PdfDocument(exercise.title)
  const analysis = buildGroupedAnalysis(
    exercise.min,
    exercise.max,
    exercise.n,
    exercise.intervals,
  )

  doc.addExerciseCover({
    label: exercise.exerciseLabel,
    title: exercise.title,
    kindLabel: exerciseKindLabel(exercise),
    context: exercise.context,
  })

  doc.addDataPanel(
    'Resumen de los datos',
    `${exercise.dataSummary} · n = ${exercise.n} familias · unidad: ${exercise.unit}`,
  )

  doc.addSectionTitle('Construcción de la tabla (intervalos)')
  doc.addResolutionSteps(analysis.setupSteps)

  doc.addSectionTitle('Tabla de frecuencias por intervalos')
  doc.addBodyText(analysis.tableNote, { muted: true })
  doc.addTable(
    [['Intervalo', 'xᵢ (marca)', 'fᵢ', 'fᵢ/n', 'Fᵢ', 'xᵢ·fᵢ']],
    analysis.rows.map((r) => [
      r.label,
      String(r.xi),
      String(r.fi),
      String(r.fr),
      String(r.fac),
      String(r.xifi),
    ]),
    {
      align: ['left', 'right', 'right', 'right', 'right', 'right'],
      widths: [1.7, 1.2, 1, 1.1, 1, 1.3],
    },
  )

  doc.addSectionTitle('Media con datos agrupados')
  doc.addResolutionSteps(analysis.meanSteps)
  doc.addMetricRow([
    {
      label: 'Media',
      symbol: 'x̄',
      value: `${Math.round(analysis.mean)} ${exercise.unit}`,
    },
  ])

  return doc
}
