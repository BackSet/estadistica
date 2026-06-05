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
      intervalNotation: exercise.intervalNotation,
    },
  )
  const subjectLabelPlural = exercise.subjectLabelPlural ?? 'familias'
  const isHalfOpen = exercise.intervalNotation === 'half-open'
  const intervalFormula = isHalfOpen
    ? '="["&C2&", "&D2&")"'
    : '=C2&"-"&D2'
  const upperLimitFormula = isHalfOpen ? '=C2+$B$7' : '=C2+$B$7-1'
  const frequencyFormula = isHalfOpen
    ? `=CONTAR.SI.CONJUNTO($A$2:$A$${exercise.n + 1};">="&C2;$A$2:$A$${exercise.n + 1};"<"&D2)`
    : `=CONTAR.SI.CONJUNTO($A$2:$A$${exercise.n + 1};">="&C2;$A$2:$A$${exercise.n + 1};"<="&D2)`

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
      { header: 'Clase', align: 'right' },
      { header: 'Intervalo', span: 2, align: 'left' },
      { header: 'xᵢ (marca)', align: 'right' },
      { header: 'fᵢ', align: 'right' },
      { header: 'fᵢ/n', align: 'right' },
      { header: 'Fᵢ', align: 'right' },
      { header: 'xᵢ·fᵢ', align: 'right' },
    ],
    analysis.rows.map((r) => [
      r.classIndex,
      r.label,
      r.xi,
      r.fi,
      r.fr,
      r.fac,
      r.xifi,
    ]),
  )

  if (exercise.rawValues) {
    doc.addSectionTitle('Fórmulas de Excel')
    doc.addBodyText(
      `Supón que los datos están en A2:A${exercise.n + 1}; los límites inferiores en C2:C${analysis.k + 1}, los superiores en D2:D${analysis.k + 1}, las marcas en F y las frecuencias en G.`,
      { muted: true },
    )
    doc.addTable(
      [
        { header: 'Valor', span: 2, align: 'left' },
        { header: 'Fórmula', span: 8, align: 'left' },
      ],
      [
        ['n', `=CONTAR($A$2:$A$${exercise.n + 1})`],
        ['Mínimo', `=MIN($A$2:$A$${exercise.n + 1})`],
        ['Máximo', `=MAX($A$2:$A$${exercise.n + 1})`],
        ['Rango', '=B4-B3'],
        ['Número de clases (K)', '=REDONDEAR.MAS(1+3,322*LOG10(B2);0)'],
        ['Amplitud (C)', '=REDONDEAR.MAS(B5/B6;0)'],
        ['Límite inferior de la 1.ª clase', '=B3'],
        ['Límite superior de la clase', upperLimitFormula],
        [isHalfOpen ? 'Intervalo [)' : 'Intervalo', intervalFormula],
        ['Marca de clase (xᵢ)', '=(C2+D2)/2'],
        ['Frecuencia (fᵢ)', frequencyFormula],
        ['Frecuencia acumulada (Fᵢ)', '=SUMA($G$2:G2)'],
        ['xᵢ · fᵢ', '=F2*G2'],
        ['Media agrupada', `=SUMA(I2:I${analysis.k + 1})/B2`],
      ],
    )
  }

  doc.addSectionTitle('Media con datos agrupados')
  doc.addResolutionSteps(analysis.meanSteps)
  doc.addMetricRow([
    {
      label: 'Media',
      symbol: 'x̄',
      value: `${analysis.meanText} ${exercise.unit}`,
    },
  ])
}
