import type { ResolutionStep } from './types'

export type GroupedIntervalInput = {
  label: string
  xi: number
  fi: number
}

export type GroupedIntervalRow = GroupedIntervalInput & {
  classIndex: number
  fr: number
  fac: number
  xifi: number
}

export type GroupedAnalysis = {
  min: number
  max: number
  n: number
  range: number
  kRaw: number
  k: number
  amplitude: number
  log10n: number
  rows: GroupedIntervalRow[]
  sumXifi: number
  mean: number
  meanText: string
  setupSteps: ResolutionStep[]
  tableNote: string
  meanSteps: ResolutionStep[]
}

export type GroupedAnalysisOptions = {
  subjectLabel?: string
  subjectLabelPlural?: string
  variableLabel?: string
  unit?: string
  intervalNotation?: 'closed-integer' | 'half-open'
}

const STURGES_FACTOR = 3.322

function formatDecimal(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString('es', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits,
  })
}

export function sturgesK(n: number): { kRaw: number; k: number; log10n: number } {
  const log10n = Math.log10(n)
  const kRaw = 1 + STURGES_FACTOR * log10n
  const k = Math.ceil(kRaw)
  return { kRaw, k, log10n }
}

export function buildGroupedAnalysis(
  min: number,
  max: number,
  n: number,
  intervals: GroupedIntervalInput[],
  options: GroupedAnalysisOptions = {},
): GroupedAnalysis {
  const subjectLabelPlural = options.subjectLabelPlural ?? 'familias'
  const variableLabel = options.variableLabel ?? 'ingreso mensual'
  const unit = options.unit ?? 'USD'
  const intervalNotation = options.intervalNotation ?? 'closed-integer'
  const range = max - min
  const { kRaw, k, log10n } = sturgesK(n)
  const amplitudeRaw = range / k
  const amplitude = Math.ceil(amplitudeRaw)

  let cum = 0
  const rows: GroupedIntervalRow[] = intervals.map((row, index) => {
    cum += row.fi
    const fr = Math.round((row.fi / n) * 1000) / 1000
    return {
      ...row,
      classIndex: index + 1,
      fr,
      fac: cum,
      xifi: row.xi * row.fi,
    }
  })

  const sumXifi = rows.reduce((s, r) => s + r.xifi, 0)
  const mean = sumXifi / n
  const meanText = formatDecimal(mean)
  const kRawStr = (Math.round(kRaw * 100) / 100).toFixed(2)
  const logStr = (Math.round(log10n * 1000) / 1000).toFixed(3)
  const amplitudeRawStr = (Math.round(amplitudeRaw * 100) / 100).toFixed(2)

  const setupSteps: ResolutionStep[] = [
    {
      step: 1,
      title: 'Xmax, Xmin y rango',
      formula: `Rango = Xmax − Xmin = ${max} − ${min} = ${range}`,
      legends: [
        {
          term: 'Xmax',
          value: String(max),
          origin: `Es el ${variableLabel} más alto observado en el cuadro de datos.`,
        },
        {
          term: 'Xmin',
          value: String(min),
          origin: `Es el ${variableLabel} más bajo observado en el cuadro de datos.`,
        },
        {
          term: 'Rango',
          value: String(range),
          origin: 'Amplitud total cubierta por los datos (de un extremo al otro).',
        },
      ],
      note: `Mide cuántos ${unit} separan el valor menor del valor mayor.`,
    },
    {
      step: 2,
      title: 'Número de intervalos (K) — Regla de Sturges',
      formula: `K = 1 + 3,322 · log₁₀(n) = 1 + 3,322 · log₁₀(${n}) = 1 + 3,322(${logStr}) ≈ ${kRawStr} → ${k}`,
      legends: [
        {
          term: 'n',
          value: String(n),
          origin: `Número de ${subjectLabelPlural} registrados en el cuadro de datos.`,
        },
        {
          term: `log₁₀(${n})`,
          value: logStr,
          origin: 'Logaritmo en base 10 de n (en calculadora: log o log10).',
        },
        {
          term: 'Constante de Sturges',
          value: '3,322',
          origin: 'Constante de Sturges cuando se usa log₁₀; ≈ 1/log₁₀(2).',
        },
        {
          term: 'K',
          value: String(k),
          origin: `${kRawStr} se redondea al entero inmediato superior para obtener ${k} clases. Se hace hacia arriba porque no puede existir una fracción de clase; si se redondeara hacia abajo, la tabla tendría menos intervalos de los sugeridos y podría perder detalle en la distribución.`,
        },
      ],
    },
    {
      step: 3,
      title: 'Amplitud de clase (C)',
      formula: `C = Rango / K = ${range} / ${k} = ${amplitudeRawStr} → ${amplitude}`,
      legends: [
        {
          term: 'Rango',
          value: String(range),
          origin: 'Rango del paso 1.',
        },
        {
          term: 'K',
          value: String(k),
          origin: 'Número de intervalos del paso 2.',
        },
        {
          term: 'C',
          value: String(amplitude),
          origin: `Ancho de cada intervalo; ${amplitudeRawStr} se redondea al entero inmediato superior para trabajar con límites enteros. Se hace hacia arriba para que la suma de las amplitudes cubra todo el rango; si se redondeara hacia abajo, el último intervalo podría no alcanzar el valor máximo.`,
        },
      ],
    },
    {
      step: 4,
      title: 'Construcción de intervalos',
      formula: `Desde Mín = ${min}, cada clase abarca C = ${amplitude} →\n${intervals.map((i) => i.label).join(', ')}`,
      legends: [
        {
          term: intervalNotation === 'half-open' ? 'Intervalo [)' : 'Límite superior',
          value:
            intervalNotation === 'half-open'
              ? 'incluye izquierda, excluye derecha'
              : `${min + amplitude - 1}`,
          origin:
            intervalNotation === 'half-open'
              ? `Convención: una clase como ${intervals[0]?.label ?? ''} cuenta valores >= al límite inferior y < al límite superior.`
              : `Convención: 1.ª clase ${intervals[0]?.label ?? ''} (Mín + C − 1 evita solapamiento).`,
        },
        {
          term: 'xᵢ',
          value: 'Punto medio',
          origin: 'Marca de clase = (límite inferior + límite superior) / 2 de cada intervalo.',
        },
      ],
      note:
        intervalNotation === 'half-open'
          ? `Se forman ${k} intervalos consecutivos. El último intervalo puede terminar por encima del máximo (${max}); aquí eso es correcto porque debe cubrir el valor máximo sin cerrar el intervalo por la derecha.`
          : `Se forman ${k} intervalos consecutivos hasta cubrir desde ${min} hasta ${max}.`,
    },
  ]

  const meanSteps: ResolutionStep[] = [
    {
      step: 5,
      title: 'Media con datos agrupados',
      formula: `x̄ = Σ(xᵢ · fᵢ) / n = ${sumXifi.toLocaleString('es')} / ${n} = ${meanText}`,
      legends: [
        {
          term: 'xᵢ',
          value: 'Punto medio',
          origin: 'Centro de cada intervalo (no el límite inferior).',
        },
        {
          term: 'fᵢ',
          value: 'Por fila',
          origin: `Frecuencia absoluta: cantidad de ${subjectLabelPlural} en ese intervalo.`,
        },
        {
          term: 'Σ(xᵢ·fᵢ)',
          value: sumXifi.toLocaleString('es'),
          origin: 'Suma de la columna xᵢ×fᵢ de la tabla auxiliar.',
        },
        {
          term: 'n',
          value: String(n),
          origin: 'Total de observaciones; debe coincidir con Σfᵢ.',
        },
      ],
    },
  ]

  return {
    min,
    max,
    n,
    range,
    kRaw,
    k,
    amplitude,
    log10n,
    rows,
    sumXifi,
    mean,
    meanText,
    setupSteps,
    tableNote:
      `Las frecuencias fᵢ provienen del conteo de ${subjectLabelPlural} en cada intervalo. Fᵢ acumula fᵢ desde la primera fila.`,
    meanSteps,
  }
}
