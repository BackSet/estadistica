import { exercises, exerciseKindLabel, type ExerciseDef } from '@/data/exercises'
import { PdfDocument } from '../document/PdfDocument'

const KIND_ORDER: ExerciseDef['kind'][] = [
  'frequency',
  'grouped',
  'central',
  'conceptual',
]

const KIND_SECTION_TITLE: Record<ExerciseDef['kind'], string> = {
  frequency: 'Tablas de frecuencias',
  grouped: 'Datos agrupados',
  central: 'Tendencia central',
  conceptual: 'Diagramas conceptuales',
}

export function generateHomePdf(): PdfDocument {
  const doc = new PdfDocument('Estadística descriptiva — Índice de ejercicios')

  doc.addHomeTitle(
    'Estadística descriptiva',
    'Ejercicios para trabajo social — índice de contenidos',
  )

  doc.addBodyText(
    'Cada ejercicio incluye contexto, datos, resolución paso a paso con leyendas bajo las fórmulas y tablas. Descarga el PDF completo de un ejercicio desde su página.',
    { muted: true },
  )

  for (const kind of KIND_ORDER) {
    const list = exercises.filter((e) => e.kind === kind)
    if (list.length === 0) continue

    doc.addSectionTitle(KIND_SECTION_TITLE[kind])
    doc.addTable(
      [['#', 'Título', 'Tipo']],
      list.map((ex) => [
        ex.exerciseLabel,
        ex.title,
        exerciseKindLabel(ex),
      ]),
      {
        align: ['center', 'left', 'left'],
        widths: [0.5, 4, 1.6],
      },
    )
  }

  doc.addNote(
    'Cómo usar estos materiales',
    'Abre cada ejercicio en el navegador para ver gráficos interactivos y la guía visual ampliada cuando aplique. El PDF de cada ejercicio reproduce el contenido analítico en formato A4 con texto seleccionable.',
  )

  return doc
}
