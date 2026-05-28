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

export type ConceptNodeDef = {
  id: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7'
  label: string
  concept: string
}

export type ConceptualExerciseDef = {
  kind: 'conceptual'
  id: string
  exerciseLabel: string
  title: string
  context: string
  diagramTitle: string
  nodes: ConceptNodeDef[]
  summary: string
  similarities: string[]
  differences: string[]
}

export type ExerciseDef =
  | FrequencyExerciseDef
  | CentralExerciseDef
  | GroupedExerciseDef
  | ConceptualExerciseDef

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
  {
    kind: 'conceptual',
    id: 'conceptual-d1-diagnostico-clinico',
    exerciseLabel: 'D1',
    title: 'Mentefacto diferencial — Diagnóstico clínico (DSM IV vs CIE 10)',
    context:
      'Comparación conceptual entre los dos sistemas de clasificación más usados históricamente en psicopatología clínica.',
    diagramTitle: 'Diagnóstico clínico',
    nodes: [
      {
        id: 'P1',
        label: 'Diagnóstico clínico',
        concept:
          'Es el proceso fundamental en la psicopatología y la clínica que permite identificar, clasificar y nombrar un cuadro clínico a partir de la observación de signos y síntomas. Actúa como una herramienta esencial para establecer un lenguaje común entre profesionales y guiar el plan de tratamiento.',
      },
      {
        id: 'P2',
        label: 'DSM IV',
        concept:
          'Hace referencia al Manual Diagnóstico y Estadístico de los Trastornos Mentales (4ta edición). Es un sistema de clasificación categorial estandarizado enfocado exclusiva y exhaustivamente en los trastornos de la salud mental.',
      },
      {
        id: 'P3',
        label: 'APA',
        concept:
          'Es la institución estadounidense creadora y editora del DSM. Al ser elaborada por una asociación profesional de psiquiatría, este manual tiene una fuerte influencia de la práctica clínica y la investigación psiquiátrica de Norteamérica.',
      },
      {
        id: 'P4',
        label: 'Multiaxial',
        concept:
          'Es el enfoque de evaluación característico del DSM IV (luego eliminado en DSM 5). Consiste en evaluar al paciente en cinco ejes distintos (I. Trastornos clínicos, II. Trastornos de personalidad/retraso mental, III. Enfermedades médicas, IV. Problemas psicosociales, V. Evaluación global de la actividad), permitiendo una visión estructurada del individuo.',
      },
      {
        id: 'P5',
        label: 'CIE 10',
        concept:
          'Es la Clasificación Internacional de Enfermedades (10ma revisión). Es el estándar global para el reporte de enfermedades y condiciones de salud, en la cual los trastornos mentales y del comportamiento ocupan una sección específica (Capítulo V o letra F).',
      },
      {
        id: 'P6',
        label: 'OMS',
        concept:
          'Es la agencia de la Organización de las Naciones Unidas responsable de la creación y publicación de la CIE. Le otorga a este manual un carácter oficial, global y un enfoque orientado a la salud pública y la recolección de estadísticas epidemiológicas a nivel mundial.',
      },
      {
        id: 'P7',
        label: 'General / Integral',
        concept:
          'A diferencia del DSM, la CIE abarca todo el espectro de las enfermedades médicas (físicas y mentales). Esto sitúa a la psicopatología dentro de un marco médico integral de salud, relacionando los trastornos mentales con el resto del funcionamiento orgánico.',
      },
    ],
    summary:
      'Este trabajo expone al diagnóstico clínico como la supra-clase o el fin último de la evaluación en psicopatología. Para llegar a este diagnóstico, los profesionales de la salud mental se apoyan históricamente en dos herramientas de clasificación categorial predominantes: el DSM IV (creado por la APA) y la CIE 10 (creada por la OMS). A través del mentefacto diferencial, se evidencia que aunque ambos sistemas buscan el mismo propósito de identificar patologías, poseen orígenes, alcances y estructuras diferenciadas.',
    similarities: [
      'Propósito taxonómico: ambos son manuales de clasificación que organizan los trastornos mentales en categorías basadas en criterios descriptivos (signos y síntomas).',
      'Lenguaje común: los dos facilitan la comunicación entre distintos profesionales de la salud (psicólogos, psiquiatras, médicos e investigadores) a nivel internacional.',
      'Guía clínica: ambos sirven como punto de partida para decidir el pronóstico clínico y orientar el tratamiento adecuado para el paciente.',
    ],
    differences: [
      'Autoría y enfoque: el DSM es elaborado por la APA y está más ligado a la práctica clínica e investigación psiquiátrica, predominantemente estadounidense. La CIE es elaborada por la OMS y tiene un enfoque universal orientado a salud pública, epidemiología y políticas de salud globales.',
      'Alcance: el DSM es exclusivo para trastornos mentales y del comportamiento. La CIE abarca todas las enfermedades del cuerpo humano, donde la salud mental representa solo un capítulo.',
      'Estructura: históricamente, el DSM IV se caracterizó por su evaluación multiaxial en cinco ejes; la CIE 10 emplea un sistema de códigos alfanuméricos orientado al registro de morbilidad y mortalidad en sistemas de salud.',
    ],
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
    case 'conceptual':
      return 'Mapa conceptual'
  }
}
