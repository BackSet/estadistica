/** Utilidades de estadística descriptiva con trazas para la UI. */

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

/** Posiciones 1-based en la lista original donde aparece `value`. */
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
          cum === fi
            ? `Fᵢ = ${fi}`
            : `Fᵢ = … + ${fi} = ${cum}`,
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

export type TextStep = { label: string; text: string }

export type MeanWithSteps = {
  sum: number
  n: number
  mean: number
  expression: string
  steps: TextStep[]
}

export function meanWithSteps(values: number[]): MeanWithSteps {
  const n = values.length
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const expression = values.join(' + ')
  const meanStr = String(Math.round(mean * 100) / 100)
  const steps: TextStep[] = [
    {
      label: '1',
      text: `Identificar n: número de datos = ${n} (cuenta de observaciones en la lista).`,
    },
    {
      label: '2',
      text: `Sumar todos los valores: ${expression} = ${sum}.`,
    },
    {
      label: '3',
      text: `Media aritmética x̄ = Σxᵢ / n = ${sum} ÷ ${n} = ${meanStr}.`,
    },
  ]
  return { sum, n, mean, expression, steps }
}

export type ModeFrequency = { value: number; count: number }

export type ModeWithSteps = {
  frequencies: ModeFrequency[]
  modes: number[]
  maxCount: number
  steps: TextStep[]
}

export function modeWithSteps(values: number[]): ModeWithSteps {
  const map = new Map<number, number>()
  values.forEach((v) => map.set(v, (map.get(v) ?? 0) + 1))
  const frequencies = [...map.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value - b.value)
  const maxCount = Math.max(...frequencies.map((f) => f.count))
  const modes = frequencies.filter((f) => f.count === maxCount).map((f) => f.value)
  const top = modes.join(', ')
  const steps: TextStep[] = [
    {
      label: '1',
      text: 'Contar cuántas veces aparece cada valor distinto en la lista (tabla de frecuencias absolutas por valor).',
    },
    {
      label: '2',
      text: `La frecuencia máxima es ${maxCount}. El valor (o valores) con esa frecuencia es la moda: ${top}.`,
    },
  ]
  return { frequencies, modes, maxCount, steps }
}

export type MedianWithSteps = {
  sorted: number[]
  n: number
  median: number
  rule: 'odd' | 'even'
  positionOneBased?: number
  leftPos?: number
  rightPos?: number
  leftValue?: number
  rightValue?: number
  steps: TextStep[]
}

export function medianWithSteps(values: number[]): MedianWithSteps {
  const n = values.length
  const sorted = [...values].sort((a, b) => a - b)
  const listStr = sorted.join(', ')
  const steps: TextStep[] = [
    {
      label: '1',
      text: `Ordenar los datos de menor a mayor (n = ${n}): ${listStr}.`,
    },
  ]

  if (n % 2 === 1) {
    const positionOneBased = (n + 1) / 2
    const idx = positionOneBased - 1
    const median = sorted[idx]
    steps.push({
      label: '2',
      text: `n es impar: la mediana está en la posición central (n+1)/2 = (${n}+1)/2 = ${positionOneBased} (contando desde 1). El valor en esa posición es ${median}.`,
    })
    return {
      sorted,
      n,
      median,
      rule: 'odd',
      positionOneBased,
      steps,
    }
  }

  const leftPos = n / 2
  const rightPos = n / 2 + 1
  const leftValue = sorted[leftPos - 1]
  const rightValue = sorted[rightPos - 1]
  const median = (leftValue + rightValue) / 2
  steps.push({
    label: '2',
    text: `n es par: se promedian los dos valores centrales, en las posiciones ${leftPos} y ${rightPos} (desde 1): (${leftValue} + ${rightValue}) / 2 = ${median}.`,
  })
  return {
    sorted,
    n,
    median,
    rule: 'even',
    leftPos,
    rightPos,
    leftValue,
    rightValue,
    steps,
  }
}
