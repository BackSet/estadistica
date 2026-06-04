import type { GroupedExerciseDef } from '@/data/exercises'
import { exerciseKindLabel } from '@/data/exercises'
import { buildGroupedAnalysis } from '@/lib/statistics'
import type { ExcelDoc, CellValue } from '../workbook/ExcelDoc'

export function generateGroupedExcel(
  doc: ExcelDoc,
  exercise: GroupedExerciseDef,
): void {
  const analysis = buildGroupedAnalysis(
    exercise.min,
    exercise.max,
    exercise.n,
    exercise.intervals,
    {
      subjectLabel: exercise.subjectLabel,
      subjectLabelPlural: exercise.subjectLabelPlural,
      variableLabel: exercise.variableLabel,
      unit: exercise.unit,
    },
  )
  const subjectLabelPlural = exercise.subjectLabelPlural ?? 'familias'

  doc.addExerciseCover({
    label: exercise.exerciseLabel,
    title: exercise.title,
    kindLabel: exerciseKindLabel(exercise),
    context: exercise.context,
  })

  doc.addDataPanel(
    'Resumen de los datos',
    `${exercise.dataSummary} · n = ${exercise.n} ${subjectLabelPlural} · unidad: ${exercise.unit}`,
  )

  if (exercise.rawValues) {
    const rawValueRows = exercise.rawValues.reduce<CellValue[][]>(
      (rows, value, index) => {
        const rowIndex = Math.floor(index / 5)
        rows[rowIndex] = rows[rowIndex] ?? []
        rows[rowIndex].push(index + 1, value)
        return rows
      },
      [],
    )

    doc.addSectionTitle('Cuadro de datos')
    doc.addTable(
      [
        { header: 'N°', align: 'right' },
        { header: 'Dato', align: 'right' },
        { header: 'N°', align: 'right' },
        { header: 'Dato', align: 'right' },
        { header: 'N°', align: 'right' },
        { header: 'Dato', align: 'right' },
        { header: 'N°', align: 'right' },
        { header: 'Dato', align: 'right' },
      ],
      rawValueRows,
    )
    doc.addBodyText('De este cuadro se obtiene n, Xmax y Xmin.', { muted: true })
  }

  doc.addSectionTitle('Construcción de la tabla (intervalos)')
  doc.addResolutionSteps(analysis.setupSteps)

  doc.addSectionTitle('Tabla de frecuencias por intervalos')
  doc.addBodyText(analysis.tableNote, { muted: true })
  doc.addTable(
    [
      { header: 'Intervalo', span: 2, align: 'left' },
      { header: 'xᵢ (marca)', align: 'right' },
      { header: 'fᵢ', align: 'right' },
      { header: 'fᵢ/n', align: 'right' },
      { header: 'Fᵢ', align: 'right' },
      { header: 'xᵢ·fᵢ', align: 'right' },
    ],
    analysis.rows.map((r) => [r.label, r.xi, r.fi, r.fr, r.fac, r.xifi]),
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
}
