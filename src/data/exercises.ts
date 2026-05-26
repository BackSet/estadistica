export type FrequencyExerciseDef = {
  kind: 'frequency'
  id: string
  exerciseLabel: string
  title: string
  variableLabel: string
  values: number[]
  chartTitle: string
  context?: string
}

export type CentralExerciseDef = {
  kind: 'central'
  id: string
  exerciseLabel: string
  title: string
  values: number[]
  unitSuffix?: string
  note?: string
  context?: string
  showMedianEvenUngroupedGuide?: boolean
  medianGuideCaseBlurb?: string
}

export type GroupedIntervalDef = {
  label: string
  xi: number
  fi: number
}

export type GroupedExerciseDef = {
  kind: 'grouped'
  id: string
  exerciseLabel: string
  title: string
  context: string
  dataSummary: string
  min: number
  max: number
  n: number
  unit: string
  intervals: GroupedIntervalDef[]
  chartTitle: string
}

export type ExerciseDef =
  | FrequencyExerciseDef
  | CentralExerciseDef
  | GroupedExerciseDef

export const exercises: ExerciseDef[] = [
  {
    kind: 'frequency',
    id: 'freq-1',
    exerciseLabel: '1',
    title:
      'Tabla de frecuencias — Horas semanales dedicadas al acompañamiento en campo',
    variableLabel: 'Horas de intervención (xᵢ)',
    values: [2, 4, 6, 4, 8, 2, 6, 4, 10, 6, 2, 8, 4, 6, 2],
    chartTitle: 'Distribución de horas registradas en bitácora',
    context:
      'Registro en bitácora de horas de intervención directa por semana en un equipo de trabajo social.',
  },
  {
    kind: 'frequency',
    id: 'freq-2',
    exerciseLabel: '2',
    title:
      'Tabla de frecuencias — Personas que conviven en el hogar visitado (censo de hogar)',
    variableLabel: 'Integrantes del hogar (xᵢ)',
    values: [
      5, 3, 4, 3, 6, 4, 5, 3, 4, 2, 7, 3, 4, 5, 6, 4, 3, 5, 4, 3,
    ],
    chartTitle: 'Hogares según tamaño (frecuencias)',
    context:
      'Censo rápido de composición familiar en visitas domiciliarias (número de personas en el hogar).',
  },
  {
    kind: 'grouped',
    id: 'grouped-income',
    exerciseLabel: '★',
    title: 'Datos agrupados — Ingreso familiar mensual (USD)',
    context:
      'Ingreso mensual familiar en USD de 80 familias atendidas en Quito (programa de trabajo social).',
    dataSummary: 'Valores entre 150 y 550 USD',
    min: 150,
    max: 550,
    n: 80,
    unit: 'USD',
    intervals: [
      { label: '150-199', xi: 175, fi: 4 },
      { label: '200-249', xi: 225, fi: 6 },
      { label: '250-299', xi: 275, fi: 14 },
      { label: '300-349', xi: 325, fi: 12 },
      { label: '350-399', xi: 375, fi: 18 },
      { label: '400-449', xi: 425, fi: 14 },
      { label: '450-499', xi: 475, fi: 8 },
      { label: '500-549', xi: 525, fi: 4 },
    ],
    chartTitle: 'Distribución de ingresos por marca de clase (fᵢ)',
  },
  {
    kind: 'central',
    id: 'central-a',
    exerciseLabel: 'A',
    title:
      'Media, mediana y moda — Edades de personas usuarias de un programa comunitario',
    values: [20, 21, 22, 23, 21, 24, 22, 25, 23, 22, 21, 24, 26, 22, 23],
    unitSuffix: ' años',
    context: 'Edades registradas en fichas de personas usuarias de un centro comunitario.',
  },
  {
    kind: 'central',
    id: 'central-b',
    exerciseLabel: 'B',
    title:
      'Media, mediana y moda — Nivel de satisfacción con el servicio (encuesta 0 a 5)',
    values: [1, 2, 3, 2, 4, 5, 3, 2, 1, 0, 3, 4, 2, 5, 1, 2],
    unitSuffix: ' (puntos en escala)',
    context: 'Respuestas en escala Likert de satisfacción con el servicio recibido.',
  },
  {
    kind: 'central',
    id: 'central-c',
    exerciseLabel: 'C',
    title:
      'Media, mediana y moda — Puntuación en escala de malestar psicológico percibido (ítems 6–10)',
    values: [7, 8, 9, 6, 7, 8, 10, 9, 7, 8, 6, 8, 10, 8],
    unitSuffix: ' pts',
    context:
      'Puntuaciones de un tamizaje o seguimiento clínico-comunitario (escala 6–10).',
    note: 'La moda (8) y la mediana (8) coinciden: hay una tendencia central marcada en torno a ese valor.',
  },
  {
    kind: 'central',
    id: 'central-median-even-ungrouped',
    exerciseLabel: 'D',
    title:
      'Datos no agrupados: mediana con n par — Minutos de espera hasta la primera valoración',
    values: [18, 12, 22, 15, 20, 14],
    unitSuffix: ' min',
    context:
      'Tiempos de espera hasta la primera valoración en un servicio de atención.',
    note: 'Con n par, la mediana es el promedio de los dos valores centrales de la serie ordenada.',
  },
  {
    kind: 'central',
    id: 'central-median-even-visual',
    exerciseLabel: 'E',
    title:
      'Mediana con datos no agrupados y n par — Días hasta la primera entrevista con trabajo social',
    values: [21, 14, 19, 27, 16, 23, 20, 25],
    unitSuffix: ' días hábiles',
    showMedianEvenUngroupedGuide: true,
    medianGuideCaseBlurb:
      'En ocho expedientes se anotó, por familia, cuántos días hábiles pasaron desde la derivación hasta la primera cita con trabajo social.',
    context: 'Indicador de acceso oportuno al servicio (datos no agrupados).',
    note: 'La mediana resume el “día típico” de espera sin que un solo caso extremo domine el resumen.',
  },
]

export function getExerciseById(id: string): ExerciseDef | undefined {
  return exercises.find((e) => e.id === id)
}

export function exercisePath(id: string): string {
  return `/ejercicio/${encodeURIComponent(id)}`
}

export function exerciseKindLabel(ex: ExerciseDef): string {
  switch (ex.kind) {
    case 'frequency':
      return 'Tabla de frecuencias'
    case 'grouped':
      return 'Datos agrupados'
    case 'central':
      return 'Tendencia central'
  }
}
