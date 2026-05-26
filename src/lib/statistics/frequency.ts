import type { ResolutionStep } from './types'

export type FrequencyRowTrace = {
  fi: { explanation: string; positionsOneBased: number[] }
  fr: { explanation: string; fraction: string; decimal: number }
  fp: { explanation: string; percent: number }
  fac: { explanation: string; sumFormula: string }
}

export type FrequencyRow = {
  xi: number
  fi: number
  fr: number
  fp: number
  fac: number
  trace: FrequencyRowTrace
}

export type FrequencyTable = {
  n: number
  rows: FrequencyRow[]
  verification: {
    sumFi: number
    sumFr: number
  }
}

function roundFr(x: number): number {
  return Math.round(x * 1000) / 1000
}

function roundFp(x: number): number {
  return Math.round(x * 10) / 10
}

function positionsOfValue(values: number[], value: number): number[] {
  const out: number[] = []
  values.forEach((v, i) => {
    if (v === value) out.push(i + 1)
  })
  return out
}

export function buildFrequencyTable(values: number[]): FrequencyTable {
  const n = values.length
  const unique = [...new Set(values)].sort((a, b) => a - b)
  let cum = 0
  const rows: FrequencyRow[] = unique.map((xi) => {
    const positions = positionsOfValue(values, xi)
    const fi = positions.length
    const frRaw = fi / n
    const fr = roundFr(frRaw)
    const fp = roundFp(frRaw * 100)
    cum += fi
    const posStr =
      positions.length <= 12
        ? positions.join(', ')
        : `${positions.slice(0, 8).join(', ')}… (+${positions.length - 8} más)`
    const trace: FrequencyRowTrace = {
      fi: {
        explanation: `Conteo en los datos originales: el valor ${xi} aparece ${fi} vez${fi === 1 ? '' : 'es'} (observaciones en posición ${posStr}).`,
        positionsOneBased: positions,
      },
      fr: {
        explanation: `Frecuencia relativa = fᵢ / n = ${fi} / ${n}.`,
        fraction: `${fi}/${n}`,
        decimal: fr,
      },
      fp: {
        explanation: `Porcentaje = (fᵢ / n) × 100 = (${fi}/${n}) × 100 ≈ ${fp}%.`,
        percent: fp,
      },
      fac: {
        explanation: `Frecuencia acumulada = suma de fᵢ desde la primera fila hasta esta (inclusive).`,
        sumFormula:
          cum === fi ? `Fᵢ = ${fi}` : `Fᵢ = … + ${fi} = ${cum}`,
      },
    }
    return { xi, fi, fr, fp, fac: cum, trace }
  })
  const sumFi = rows.reduce((s, r) => s + r.fi, 0)
  const sumFrExact = sumFi / n
  return {
    n,
    rows,
    verification: { sumFi, sumFr: sumFrExact },
  }
}

export function buildFrequencyResolutionSteps(
  table: FrequencyTable,
): ResolutionStep[] {
  const first = table.rows[0]
  const second = table.rows[1]
  const posShort =
    first.trace.fi.positionsOneBased.length <= 10
      ? first.trace.fi.positionsOneBased.join(', ')
      : `${first.trace.fi.positionsOneBased.slice(0, 6).join(', ')}…`

  const steps: ResolutionStep[] = [
    {
      step: 1,
      title: 'Tamaño muestral (n)',
      formula: `n = ${table.n}`,
      legends: [
        {
          term: 'n',
          value: String(table.n),
          origin: 'Número total de observaciones en la lista de datos originales.',
        },
      ],
    },
    {
      step: 2,
      title: 'Valores distintos (xᵢ)',
      formula: `xᵢ = ${first.xi} (primera fila; valores ordenados de menor a mayor)`,
      legends: [
        {
          term: 'xᵢ',
          value: String(first.xi),
          origin:
            'Cada valor distinto que aparece en los datos, sin repetir, ordenado.',
        },
      ],
      note: 'En las demás filas, xᵢ toma el siguiente valor distinto de la lista.',
    },
    {
      step: 3,
      title: 'Frecuencia absoluta (fᵢ)',
      formula: `fᵢ = ${first.fi} para xᵢ = ${first.xi}`,
      legends: [
        {
          term: 'fᵢ',
          value: String(first.fi),
          origin: `Cuenta cuántas veces aparece xᵢ = ${first.xi} en los datos.`,
        },
        {
          term: 'Posiciones',
          value: posShort,
          origin: 'Lugares en la lista original (contando desde 1).',
        },
      ],
    },
    {
      step: 4,
      title: 'Frecuencia relativa (fᵢ/n)',
      formula: `fᵢ/n = ${first.fi}/${table.n} ≈ ${Number(first.fr.toFixed(3))}`,
      legends: [
        {
          term: `${first.fi}`,
          value: String(first.fi),
          origin: 'fᵢ de la fila (paso anterior).',
        },
        {
          term: `${table.n}`,
          value: String(table.n),
          origin: 'n total de observaciones.',
        },
      ],
    },
    {
      step: 5,
      title: 'Frecuencia porcentual (%)',
      formula: `(fᵢ/n) × 100 ≈ ${first.fp}%`,
      legends: [
        {
          term: 'fᵢ/n',
          value: `${first.fi}/${table.n}`,
          origin: 'Misma razón del paso 4.',
        },
        {
          term: '100',
          value: '100',
          origin: 'Factor para expresar la proporción en porcentaje.',
        },
      ],
    },
    {
      step: 6,
      title: 'Frecuencia acumulada (Fᵢ)',
      formula:
        second != null
          ? `Fᵢ = ${first.fac} (1.ª fila); Fᵢ = ${first.fac} + ${second.fi} = ${second.fac} (2.ª fila)`
          : `Fᵢ = ${first.fac}`,
      legends: [
        {
          term: 'Fᵢ',
          value: String(first.fac),
          origin: 'En la primera fila coincide con fᵢ.',
        },
        ...(second
          ? [
              {
                term: `${second.fi}`,
                value: String(second.fi),
                origin: 'fᵢ de la segunda fila que se suma al acumulado.',
              },
            ]
          : []),
      ],
      note: 'En cada fila siguiente se suma la fᵢ de esa fila al acumulado anterior hasta llegar a n.',
    },
  ]
  return steps
}
