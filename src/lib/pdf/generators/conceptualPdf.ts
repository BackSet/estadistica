import type { ConceptDiagramLayout, ConceptualExerciseDef } from '@/data/exercises'
import { exerciseKindLabel } from '@/data/exercises'
import { PdfDocument } from '../document/PdfDocument'

function diagramDataContent(diagram: ConceptDiagramLayout): string {
  return `P1 como categoría superior; ${diagram.leftSystemId} y ${diagram.rightSystemId} como sistemas comparados; ${diagram.leftTraitIds.join('-')} y ${diagram.rightTraitIds.join('-')} como rasgos diferenciales.`
}

function buildDiagramRows(exercise: ConceptualExerciseDef): string[][] {
  const byId = new Map(exercise.nodes.map((n) => [n.id, n]))
  const { diagram } = exercise
  const rows: string[][] = []

  const root = byId.get(diagram.rootId)!
  rows.push([root.id, root.label, 'Categoría superior o fin del proceso.'])

  const leftSystem = byId.get(diagram.leftSystemId)!
  rows.push([leftSystem.id, leftSystem.label, 'Sistema de clasificación categorial en salud mental.'])
  for (const id of diagram.leftTraitIds) {
    const node = byId.get(id)!
    rows.push([id, node.label, 'Rasgo del DSM IV.'])
  }

  const rightSystem = byId.get(diagram.rightSystemId)!
  rows.push([
    rightSystem.id,
    rightSystem.label,
    'Clasificación internacional de enfermedades.',
  ])
  for (const id of diagram.rightTraitIds) {
    const node = byId.get(id)!
    rows.push([id, node.label, 'Rasgo de la CIE 10.'])
  }

  return rows
}

export function generateConceptualPdf(
  exercise: ConceptualExerciseDef,
): PdfDocument {
  const doc = new PdfDocument(exercise.title)
  const firstId = exercise.nodes[0]?.id ?? 'P1'
  const lastId = exercise.nodes[exercise.nodes.length - 1]?.id ?? 'P10'

  doc.addExerciseCover({
    label: exercise.exerciseLabel,
    title: exercise.title,
    kindLabel: exerciseKindLabel(exercise),
    context: exercise.context,
  })

  doc.addDataPanel(
    'Estructura del diagrama',
    diagramDataContent(exercise.diagram),
  )

  doc.addSectionTitle(`Diagrama D1 — ${exercise.diagramTitle}`)
  doc.addBodyText(
    'Representación estructurada del mentefacto diferencial (relaciones principales).',
    { muted: true },
  )
  doc.addTable(
    [['Punto', 'Elemento', 'Relación']],
    buildDiagramRows(exercise),
    { align: ['center', 'left', 'left'], widths: [0.7, 1.8, 3.5] },
  )

  doc.addSectionTitle(`Conceptos (${firstId} a ${lastId})`)
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
