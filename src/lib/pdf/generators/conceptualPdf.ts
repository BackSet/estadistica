import type { ConceptualExerciseDef } from '@/data/exercises'
import { exerciseKindLabel } from '@/data/exercises'
import { PdfDocument } from '../document/PdfDocument'

export function generateConceptualPdf(
  exercise: ConceptualExerciseDef,
): PdfDocument {
  const doc = new PdfDocument(exercise.title)

  doc.addExerciseCover({
    label: exercise.exerciseLabel,
    title: exercise.title,
    kindLabel: exerciseKindLabel(exercise),
    context: exercise.context,
  })

  doc.addDataPanel(
    'Estructura del diagrama',
    'P1 como categoría superior; P2 y P5 como sistemas comparados; P3-P4 y P6-P7 como rasgos diferenciales.',
  )

  doc.addSectionTitle(`Diagrama D1 — ${exercise.diagramTitle}`)
  doc.addBodyText(
    'Representación estructurada del mentefacto diferencial (relaciones principales).',
    { muted: true },
  )
  doc.addTable(
    [['Punto', 'Elemento', 'Relación']],
    [
      ['P1', 'Diagnóstico clínico', 'Categoría superior o fin del proceso.'],
      ['P2', 'DSM IV', 'Sistema de clasificación categorial en salud mental.'],
      ['P3', 'APA', 'Autoría institucional del DSM IV.'],
      ['P4', 'Multiaxial', 'Rasgo estructural principal del DSM IV.'],
      ['P5', 'CIE 10', 'Clasificación internacional de enfermedades.'],
      ['P6', 'OMS', 'Autoría institucional de la CIE 10.'],
      ['P7', 'General / Integral', 'Alcance global de la CIE (no solo salud mental).'],
    ],
    { align: ['center', 'left', 'left'], widths: [0.7, 1.8, 3.5] },
  )

  doc.addSectionTitle('Conceptos (P1 a P7)')
  doc.addTable(
    [['Punto', 'Concepto']],
    exercise.nodes.map((node) => [
      `${node.id} — ${node.label}`,
      node.concept,
    ]),
    { align: ['left', 'left'], widths: [1.2, 4.8] },
  )

  doc.addSectionTitle('Resumen del trabajo')
  doc.addNote('Síntesis', exercise.summary)

  doc.addSubsectionTitle('¿Cómo se relacionan (Semejanzas)?')
  exercise.similarities.forEach((item, i) => {
    doc.addBodyText(`${i + 1}. ${item}`)
  })

  doc.addSubsectionTitle('¿En qué se diferencian?')
  exercise.differences.forEach((item, i) => {
    doc.addBodyText(`${i + 1}. ${item}`)
  })

  return doc
}
