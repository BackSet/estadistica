export type ValueLegend = {
  term: string
  value: string
  origin: string
}

export type ResolutionStep = {
  step: number
  title: string
  formula: string
  legends: ValueLegend[]
  note?: string
}

export type TextStep = { label: string; text: string }
