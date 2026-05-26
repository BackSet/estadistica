import type { ResolutionStep } from './types'

export type GroupedIntervalInput = {
  label: string
  xi: number
  fi: number
}

export type GroupedIntervalRow = GroupedIntervalInput & {
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
  setupSteps: ResolutionStep[]
  tableNote: string
  meanSteps: ResolutionStep[]
}

const STURGES_FACTOR = 3.322

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
): GroupedAnalysis {
  const range = max - min
  const { kRaw, k, log10n } = sturgesK(n)
  const amplitude = range / k

  let cum = 0
  const rows: GroupedIntervalRow[] = intervals.map((row) => {
    cum += row.fi
    const fr = Math.round((row.fi / n) * 1000) / 1000
    return {
      ...row,
      fr,
      fac: cum,
      xifi: row.xi * row.fi,
    }
  })

  const sumXifi = rows.reduce((s, r) => s + r.xifi, 0)
  const mean = sumXifi / n
  const kRawStr = (Math.round(kRaw * 100) / 100).toFixed(2)
  const logStr = (Math.round(log10n * 1000) / 1000).toFixed(3)

  const setupSteps: ResolutionStep[] = [
    {
      step: 1,
      title: 'Rango',
      formula: `Rango = Máx − Mín = ${max} − ${min} = ${range}`,
      legends: [
        {
          term: 'Máx',
          value: String(max),
          origin: 'Ingreso mensual más alto entre las familias de la muestra.',
        },
        {
          term: 'Mín',
          value: String(min),
          origin: 'Ingreso mensual más bajo entre las familias de la muestra.',
        },
        {
          term: 'Rango',
          value: String(range),
          origin: 'Amplitud total cubierta por los datos (de un extremo al otro).',
        },
      ],
      note: 'Mide cuántos dólares separan el ingreso mínimo del máximo.',
    },
    {
      step: 2,
      title: 'Número de intervalos (K) — Regla de Sturges',
      formula: `K = 1 + 3,322 · log₁₀(n) = 1 + 3,322 · log₁₀(${n}) = 1 + 3,322(${logStr}) ≈ ${kRawStr} → ${k}`,
      legends: [
        {
          term: 'n',
          value: String(n),
          origin: 'Número de familias (tamaño de la muestra).',
        },
        {
          term: `log₁₀(${n})`,
          value: logStr,
          origin: 'Logaritmo en base 10 de n (en calculadora: log o log10).',
        },
        {
          term: '3,322',
          value: '3,322',
          origin: 'Constante de Sturges cuando se usa log₁₀; ≈ 1/log₁₀(2).',
        },
        {
          term: 'K',
          value: String(k),
          origin: `${kRawStr} se redondea al entero superior para obtener ${k} clases.`,
        },
      ],
    },
    {
      step: 3,
      title: 'Amplitud de clase (C)',
      formula: `C = Rango / K = ${range} / ${k} = ${amplitude}`,
      legends: [
        {
          term: `${range}`,
          value: String(range),
          origin: 'Rango del paso 1.',
        },
        {
          term: `${k}`,
          value: String(k),
          origin: 'Número de intervalos del paso 2.',
        },
        {
          term: 'C',
          value: String(amplitude),
          origin: 'Ancho de cada clase en la misma unidad que los datos (USD).',
        },
      ],
    },
    {
      step: 4,
      title: 'Construcción de intervalos',
      formula: `Desde Mín = ${min}, cada clase abarca C = ${amplitude} →\n${intervals.map((i) => i.label).join(', ')}`,
      legends: [
        {
          term: 'Límite superior',
          value: `${min + amplitude - 1}`,
          origin: `Convención: 1.ª clase ${intervals[0]?.label ?? ''} (Mín + C − 1 evita solapamiento).`,
        },
        {
          term: 'xᵢ',
          value: 'Punto medio',
          origin: 'Marca de clase = (límite inferior + límite superior) / 2 de cada intervalo.',
        },
      ],
      note: `Se forman ${k} intervalos consecutivos hasta cubrir el rango hasta cerca de ${max}.`,
    },
  ]

  const meanSteps: ResolutionStep[] = [
    {
      step: 5,
      title: 'Media con datos agrupados',
      formula: `x̄ = Σ(xᵢ · fᵢ) / n = ${sumXifi.toLocaleString('es')} / ${n} = ${Math.round(mean)}`,
      legends: [
        {
          term: 'xᵢ',
          value: 'Punto medio',
          origin: 'Centro de cada intervalo (no el límite inferior).',
        },
        {
          term: 'fᵢ',
          value: 'Por fila',
          origin: 'Frecuencia absoluta: familias en ese intervalo de ingreso.',
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
    setupSteps,
    tableNote:
      'Las frecuencias fᵢ provienen del conteo de familias en cada rango de ingreso. Fᵢ acumula fᵢ desde la primera fila.',
    meanSteps,
  }
}
