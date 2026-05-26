import type { ResolutionStep, TextStep } from './types'

export type MeanWithSteps = {
  sum: number
  n: number
  mean: number
  expression: string
  steps: TextStep[]
  resolutionSteps: ResolutionStep[]
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
  const resolutionSteps: ResolutionStep[] = [
    {
      step: 1,
      title: 'Identificar n',
      formula: `n = ${n}`,
      legends: [
        {
          term: 'n',
          value: String(n),
          origin: 'Cantidad de números en la lista de datos (una observación por valor listado).',
        },
      ],
    },
    {
      step: 2,
      title: 'Sumar observaciones',
      formula: `Σxᵢ = ${expression} = ${sum}`,
      legends: [
        {
          term: 'Σxᵢ',
          value: String(sum),
          origin: 'Suma de cada dato de la lista; cada sumando es un xᵢ.',
        },
      ],
    },
    {
      step: 3,
      title: 'Aplicar la fórmula de la media',
      formula: `x̄ = Σxᵢ / n = ${sum} ÷ ${n} = ${meanStr}`,
      legends: [
        {
          term: `${sum}`,
          value: String(sum),
          origin: 'Total del paso 2.',
        },
        {
          term: `${n}`,
          value: String(n),
          origin: 'Tamaño muestral del paso 1.',
        },
        {
          term: 'x̄',
          value: meanStr,
          origin: 'Media aritmética (promedio).',
        },
      ],
    },
  ]
  return { sum, n, mean, expression, steps, resolutionSteps }
}

export type ModeFrequency = { value: number; count: number }

export type ModeWithSteps = {
  frequencies: ModeFrequency[]
  modes: number[]
  maxCount: number
  steps: TextStep[]
  resolutionSteps: ResolutionStep[]
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
  const example = frequencies.find((f) => f.count === maxCount) ?? frequencies[0]
  const resolutionSteps: ResolutionStep[] = [
    {
      step: 1,
      title: 'Frecuencia por valor',
      formula: 'Contar repeticiones de cada xᵢ distinto en la lista',
      legends: [
        {
          term: 'Ejemplo',
          value: `${example.value}: ${example.count}`,
          origin: `El valor ${example.value} aparece ${example.count} vez${example.count === 1 ? '' : 'es'} en los datos.`,
        },
      ],
      note: 'Se arma una mini-tabla valor → frecuencia absoluta.',
    },
    {
      step: 2,
      title: 'Moda (Mo)',
      formula: `Mo = ${top} (frecuencia máxima = ${maxCount})`,
      legends: [
        {
          term: `${maxCount}`,
          value: String(maxCount),
          origin: 'Mayor conteo entre todos los valores distintos.',
        },
        {
          term: 'Mo',
          value: top,
          origin: 'Valor(es) con esa frecuencia máxima.',
        },
      ],
    },
  ]
  return { frequencies, modes, maxCount, steps, resolutionSteps }
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
  resolutionSteps: ResolutionStep[]
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
    const resolutionSteps: ResolutionStep[] = [
      {
        step: 1,
        title: 'Ordenar la muestra',
        formula: `Datos ordenados (n = ${n}): ${listStr}`,
        legends: [
          {
            term: 'n',
            value: String(n),
            origin: 'Número de observaciones.',
          },
        ],
      },
      {
        step: 2,
        title: 'Posición central (n impar)',
        formula: `Me = x₍${positionOneBased}₎ = ${median}`,
        legends: [
          {
            term: '(n+1)/2',
            value: String(positionOneBased),
            origin: `(${n}+1)/2 = ${positionOneBased}; posición central contando desde 1.`,
          },
          {
            term: 'Me',
            value: String(median),
            origin: `Valor en la posición ${positionOneBased} de la serie ordenada.`,
          },
        ],
      },
    ]
    return {
      sorted,
      n,
      median,
      rule: 'odd',
      positionOneBased,
      steps,
      resolutionSteps,
    }
  }

  const leftPos = n / 2
  const rightPos = n / 2 + 1
  const leftValue = sorted[leftPos - 1]
  const rightValue = sorted[rightPos - 1]
  const median = (leftValue + rightValue) / 2
  const meRounded = Math.round(median * 100) / 100
  steps.push({
    label: '2',
    text: `n es par: se promedian los dos valores centrales, en las posiciones ${leftPos} y ${rightPos} (desde 1): (${leftValue} + ${rightValue}) / 2 = ${median}.`,
  })
  const resolutionSteps: ResolutionStep[] = [
    {
      step: 1,
      title: 'Ordenar la muestra',
      formula: `Datos ordenados (n = ${n}): ${listStr}`,
      legends: [
        {
          term: 'n',
          value: String(n),
          origin: 'Número de observaciones.',
        },
      ],
    },
    {
      step: 2,
      title: 'Promediar los dos centrales (n par)',
      formula: `Me = (${leftValue} + ${rightValue}) / 2 = ${meRounded}`,
      legends: [
        {
          term: String(leftValue),
          value: String(leftValue),
          origin: `Valor en la posición ${leftPos} (n/2).`,
        },
        {
          term: String(rightValue),
          value: String(rightValue),
          origin: `Valor en la posición ${rightPos} (n/2 + 1).`,
        },
        {
          term: 'Me',
          value: String(meRounded),
          origin: 'Promedio aritmético de los dos valores centrales.',
        },
      ],
    },
  ]
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
    resolutionSteps,
  }
}
