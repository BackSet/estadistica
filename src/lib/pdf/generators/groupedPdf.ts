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
    const rawValueRows = exercise.rawValues.reduce<string[][]>((rows, value, index) => {
      const rowIndex = Math.floor(index / 5)
      rows[rowIndex] = rows[rowIndex] ?? []
      rows[rowIndex].push(String(index + 1), String(value))
      return rows
    }, [])

    doc.addSectionTitle('Cuadro de datos')
    doc.addTable(
      [['N°', 'Dato', 'N°', 'Dato', 'N°', 'Dato', 'N°', 'Dato', 'N°', 'Dato']],
      rawValueRows,
    )
    doc.addBodyText('De este cuadro se obtiene n, Xmax y Xmin.', { muted: true })
  }

  doc.addSectionTitle('Construcción de la tabla (intervalos)')
  doc.addResolutionSteps(analysis.setupSteps)

  doc.addSectionTitle('Tabla de frecuencias por intervalos')
  doc.addBodyText(analysis.tableNote, { muted: true })
  doc.addTable(
    [['Clase', 'Intervalo', 'xᵢ (marca)', 'fᵢ', 'fᵢ/n', 'Fᵢ', 'xᵢ·fᵢ']],
    analysis.rows.map((r) => [
      String(r.classIndex),
      r.label,
      String(r.xi),
      String(r.fi),
      String(r.fr),
      String(r.fac),
      String(r.xifi),
    ]),
    {
      align: ['right', 'left', 'right', 'right', 'right', 'right', 'right'],
      widths: [0.8, 1.7, 1.2, 1, 1.1, 1, 1.3],
    },
  )

  if (exercise.rawValues) {
    doc.addSectionTitle('Fórmulas de Excel')
    doc.addBodyText(
      `Supón que los datos están en A2:A${exercise.n + 1}; los límites inferiores en C2:C${analysis.k + 1}, los superiores en D2:D${analysis.k + 1}, las marcas en F y las frecuencias en G.`,
      { muted: true },
    )
    doc.addTable(
      [['Valor', 'Fórmula']],
      [
        ['n', `=CONTAR($A$2:$A$${exercise.n + 1})`],
        ['Mínimo', `=MIN($A$2:$A$${exercise.n + 1})`],
        ['Máximo', `=MAX($A$2:$A$${exercise.n + 1})`],
        ['Rango', '=B4-B3'],
        ['Número de clases (K)', '=REDONDEAR.MAS(1+3,322*LOG10(B2);0)'],
        ['Amplitud (C)', '=REDONDEAR.MAS(B5/B6;0)'],
        ['Límite inferior', '=B3'],
        ['Límite superior', upperLimitFormula],
        [isHalfOpen ? 'Intervalo [)' : 'Intervalo', intervalFormula],
        ['Marca de clase (xᵢ)', '=(C2+D2)/2'],
        ['Frecuencia (fᵢ)', frequencyFormula],
        ['Frecuencia acumulada (Fᵢ)', '=SUMA($G$2:G2)'],
        ['xᵢ · fᵢ', '=F2*G2'],
        ['Media agrupada', `=SUMA(I2:I${analysis.k + 1})/B2`],
      ],
      {
        align: ['left', 'left'],
        widths: [1.3, 3],
      },
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

  return doc
}
