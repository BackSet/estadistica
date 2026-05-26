import type { CentralExerciseDef } from '@/data/exercises'
import { exerciseKindLabel } from '@/data/exercises'
import {
  meanWithSteps,
  medianWithSteps,
  modeWithSteps,
  type MedianWithSteps,
} from '@/lib/statistics'
import type { ResolutionStep } from '@/lib/statistics/types'
import { PdfDocument } from '../document/PdfDocument'

function formatNum(n: number): string {
  return String(Math.round(n * 100) / 100)
}

function medianOrderedFormula(median: MedianWithSteps): string {
  const sorted = median.sorted.join(', ')
  const header = `Datos ordenados (n = ${median.n}):`
  if (median.rule === 'odd' && median.positionOneBased != null) {
    return `${header}\n${sorted}\nMe = x₍${median.positionOneBased}₎ = ${formatNum(median.median)}`
  }
  if (median.leftValue != null && median.rightValue != null) {
    return `${header}\n${sorted}\nMe = (${median.leftValue} + ${median.rightValue}) / 2 = ${formatNum(median.median)}`
  }
  return `${header}\n${sorted}`
}

function addMedianGuide(
  doc: PdfDocument,
  exercise: CentralExerciseDef,
  median: MedianWithSteps,
  suffix: string,
): void {
  if (!exercise.showMedianEvenUngroupedGuide || median.rule !== 'even') return

  const leftPos = median.leftPos!
  const rightPos = median.rightPos!
  const leftVal = median.leftValue!
  const rightVal = median.rightValue!
  const meRounded = formatNum(median.median)

  doc.addSectionTitle('Guía ampliada — Mediana con n par')
  if (exercise.medianGuideCaseBlurb) {
    doc.addNote('Caso de trabajo social', exercise.medianGuideCaseBlurb)
  }

  doc.addSubsectionTitle('Tamaño y paridad')
  doc.addBodyText(
    `n = ${median.n}. Como n es par, la mediana es el promedio de los valores en las posiciones n/2 = ${leftPos} y n/2 + 1 = ${rightPos} (contando desde 1).`,
  )

  doc.addSubsectionTitle('Serie ordenada con posiciones centrales')
  const positions = median.sorted.map((_, i) => String(i + 1))
  const valuesRow = median.sorted.map((v, i) => {
    const pos = i + 1
    return pos === leftPos || pos === rightPos ? `[${v}]` : String(v)
  })
  doc.addTable(
    [['Posición', ...positions]],
    [['x(i)', ...valuesRow]],
    {
      align: [
        'left',
        ...Array.from({ length: positions.length }, () => 'center' as const),
      ],
      widths: [1.4, ...Array.from({ length: positions.length }, () => 1)],
    },
  )

  const formulaStep: ResolutionStep = {
    step: 5,
    title: 'Fórmula de la mediana (n par)',
    formula: `Me = (x₍${leftPos}₎ + x₍${rightPos}₎) / 2 = (${leftVal} + ${rightVal}) / 2 = ${meRounded}`,
    legends: [
      {
        term: `x₍${leftPos}₎`,
        value: String(leftVal),
        origin: `Valor en la posición n/2 = ${leftPos}.`,
      },
      {
        term: `x₍${rightPos}₎`,
        value: String(rightVal),
        origin: `Valor en la posición n/2 + 1 = ${rightPos}.`,
      },
      {
        term: 'Me',
        value: `${meRounded}${suffix}`,
        origin: 'Promedio de los dos valores centrales.',
      },
    ],
  }
  doc.addResolutionStep(formulaStep)
}

export function generateCentralPdf(exercise: CentralExerciseDef): PdfDocument {
  const doc = new PdfDocument(exercise.title)
  const suffix = exercise.unitSuffix ?? ''
  const mean = meanWithSteps(exercise.values)
  const mode = modeWithSteps(exercise.values)
  const median = medianWithSteps(exercise.values)

  doc.addExerciseCover({
    label: exercise.exerciseLabel,
    title: exercise.title,
    kindLabel: exerciseKindLabel(exercise),
    context: exercise.context,
  })

  doc.addDataPanel(`Datos (n = ${mean.n})`, exercise.values.join(', '))

  doc.addSectionTitle('Media aritmética')
  doc.addResolutionSteps(mean.resolutionSteps)
  doc.addMetricRow([
    { label: 'Media', symbol: 'x̄', value: `${formatNum(mean.mean)}${suffix}` },
  ])

  doc.addSectionTitle('Moda (Mo)')
  doc.addResolutionSteps(mode.resolutionSteps)
  doc.addTable(
    [['Valor (xᵢ)', 'Frecuencia (fᵢ)']],
    mode.frequencies.map((f) => [String(f.value), String(f.count)]),
    { align: ['center', 'right'] },
  )
  const modeLabel =
    mode.modes.length > 1
      ? mode.modes.join(', ')
      : `${mode.modes[0]}${suffix}`
  doc.addMetricRow([{ label: 'Moda', symbol: 'Mo', value: modeLabel }])

  doc.addSectionTitle('Mediana (Me)')
  const medianSteps = median.resolutionSteps.map((step) =>
    step.step === 1
      ? { ...step, formula: medianOrderedFormula(median) }
      : step,
  )
  doc.addResolutionSteps(medianSteps)
  doc.addMetricRow([
    { label: 'Mediana', symbol: 'Me', value: `${formatNum(median.median)}${suffix}` },
  ])

  addMedianGuide(doc, exercise, median, suffix)

  doc.addSectionTitle('Resumen')
  doc.addMetricRow([
    { label: 'Media', symbol: 'x̄', value: formatNum(mean.mean) },
    { label: 'Moda', symbol: 'Mo', value: mode.modes.join(', ') },
    { label: 'Mediana', symbol: 'Me', value: formatNum(median.median) },
  ])

  if (exercise.note) {
    doc.addNote('Observación', exercise.note)
  }

  return doc
}
