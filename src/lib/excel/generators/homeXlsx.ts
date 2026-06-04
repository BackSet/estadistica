import { exercises, exerciseKindLabel, type ExerciseDef } from '@/data/exercises'
import type { CellValue, ExcelDoc } from '../workbook/ExcelDoc'

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

export function generateHomeExcel(doc: ExcelDoc): void {
  doc.addHomeTitle(
    'Estadística descriptiva',
    'Ejercicios para trabajo social — índice de contenidos',
  )

  doc.addBodyText(
    'Cada ejercicio incluye contexto, datos, resolución paso a paso con leyendas bajo las fórmulas y tablas. Descarga el Excel completo de un ejercicio desde su página.',
    { muted: true },
  )

  for (const kind of KIND_ORDER) {
    const list = exercises.filter((e) => e.kind === kind)
    if (list.length === 0) continue

    doc.addSectionTitle(KIND_SECTION_TITLE[kind])
    doc.addTable(
      [
        { header: '#', align: 'center' },
        { header: 'Título', span: 5, align: 'left' },
        { header: 'Tipo', span: 2, align: 'left' },
      ],
      list.map(
        (ex): CellValue[] => [ex.exerciseLabel, ex.title, exerciseKindLabel(ex)],
      ),
    )
  }

  doc.addNote(
    'Cómo usar estos materiales',
    'Abre cada ejercicio en el navegador para ver gráficos interactivos y la guía visual ampliada cuando aplique. El Excel de cada ejercicio reproduce el contenido analítico con tablas con formato numérico.',
  )
}
