export type FrequencyExerciseDef = {
  kind: 'frequency'
  id: string
  exerciseLabel: string
  title: string
  variableLabel: string
  values: number[]
  chartTitle: string
}

export type CentralExerciseDef = {
  kind: 'central'
  id: string
  exerciseLabel: string
  title: string
  values: number[]
  unitSuffix?: string
  note?: string
  /** Muestra guía detallada para mediana con datos no agrupados y n par. */
  showMedianEvenUngroupedGuide?: boolean
  /** Texto opcional: contexto del caso (p. ej. origen de los datos en trabajo social). */
  medianGuideCaseBlurb?: string
}

export type ExerciseDef = FrequencyExerciseDef | CentralExerciseDef

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
  },
  {
    kind: 'central',
    id: 'central-a',
    exerciseLabel: 'A',
    title:
      'Media, mediana y moda — Edades de personas usuarias de un programa comunitario',
    values: [20, 21, 22, 23, 21, 24, 22, 25, 23, 22, 21, 24, 26, 22, 23],
    unitSuffix: ' años',
  },
  {
    kind: 'central',
    id: 'central-b',
    exerciseLabel: 'B',
    title:
      'Media, mediana y moda — Nivel de satisfacción con el servicio (encuesta 0 a 5)',
    values: [1, 2, 3, 2, 4, 5, 3, 2, 1, 0, 3, 4, 2, 5, 1, 2],
    unitSuffix: ' (puntos en escala)',
  },
  {
    kind: 'central',
    id: 'central-c',
    exerciseLabel: 'C',
    title:
      'Media, mediana y moda — Puntuación en escala de malestar psicológico percibido (ítems 6–10)',
    values: [7, 8, 9, 6, 7, 8, 10, 9, 7, 8, 6, 8, 10, 8],
    unitSuffix: ' pts',
    note: 'Datos típicos de un tamizaje o seguimiento: aquí la moda (8) y la mediana (8) coinciden, lo que sugiere una tendencia central marcada en torno a ese valor.',
  },
  {
    kind: 'central',
    id: 'central-median-even-ungrouped',
    exerciseLabel: 'D',
    title:
      'Datos no agrupados: mediana con n par — Minutos de espera hasta la primera valoración',
    values: [18, 12, 22, 15, 20, 14],
    unitSuffix: ' min',
    note: 'Indicador operativo frecuente en servicios de atención: con n par, la mediana es el promedio de los dos valores centrales de la serie ordenada (posiciones n/2 y n/2+1).',
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
      'En ocho expedientes de un servicio de primera línea se anotó, por familia, cuántos días hábiles pasaron desde la derivación (por ejemplo, desde atención primaria o bienestar infantil) hasta la primera cita con trabajo social. Cada número es un caso real distinto: datos no agrupados.',
    note: 'La mediana resume el “día típico” de espera sin verse arrastrada por un solo caso muy largo o muy corto: con n par se promedian los dos valores centrales de la serie ordenada.',
  },
]

export function getExerciseById(id: string): ExerciseDef | undefined {
  return exercises.find((e) => e.id === id)
}

/** Ruta URL de un ejercicio (SPA). */
export function exercisePath(id: string): string {
  return `/ejercicio/${encodeURIComponent(id)}`
}
