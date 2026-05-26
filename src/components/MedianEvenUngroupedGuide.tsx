import type { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { MedianWithSteps } from '@/lib/statistics'
import { cn } from '@/lib/utils'
import { FormulaBlock } from './resolution/FormulaBlock'
import type { ResolutionStep } from '@/lib/statistics'

type Props = {
  exerciseLabel: string
  exerciseTitle: string
  rawValues: number[]
  median: MedianWithSteps
  unitSuffix: string
  caseBlurb?: string
}

function GuideSection({
  step,
  concept,
  title,
  children,
}: {
  step: number
  concept: string
  title: string
  children: ReactNode
}) {
  return (
    <Card className="print:break-inside-avoid">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Badge variant="default" className="shrink-0">
            {step}
          </Badge>
          <div>
            <CardDescription className="text-xs uppercase tracking-wide">
              {concept}
            </CardDescription>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">{children}</CardContent>
    </Card>
  )
}

export function MedianEvenUngroupedGuide({
  exerciseLabel,
  exerciseTitle,
  rawValues,
  median,
  unitSuffix,
  caseBlurb,
}: Props) {
  if (median.rule !== 'even') return null

  const n = median.n
  const leftPos = median.leftPos!
  const rightPos = median.rightPos!
  const leftVal = median.leftValue!
  const rightVal = median.rightValue!
  const meRounded = Math.round(median.median * 100) / 100

  const formulaStep: ResolutionStep = {
    step: 5,
    title: 'Fórmula de la mediana (n par)',
    formula: `Me = (x₍${leftPos}₎ + x₍${rightPos}₎) / 2 = (${leftVal} + ${rightVal}) / 2 = ${meRounded}`,
    legends: [
      {
        term: `x₍${leftPos}₎`,
        value: String(leftVal),
        origin: `Valor en la posición n/2 = ${leftPos}.`,
      },
      {
        term: `x₍${rightPos}₎`,
        value: String(rightVal),
        origin: `Valor en la posición n/2 + 1 = ${rightPos}.`,
      },
      {
        term: 'Me',
        value: `${meRounded}${unitSuffix}`,
        origin: 'Promedio de los dos valores centrales.',
      },
    ],
  }

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-dashed border-primary/30 bg-muted/30 p-4">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Guía ampliada
        </p>
        <h4 className="font-display text-xl font-semibold">
          Mediana con datos no agrupados y n par
        </h4>
        <p className="text-sm text-muted-foreground">
          Cada bloque separa el razonamiento: enunciado, tipo de datos, tamaño
          muestral, orden y fórmula.
        </p>
      </header>

      {caseBlurb ? (
        <Alert>
          <AlertTitle>Caso de trabajo social</AlertTitle>
          <AlertDescription>{caseBlurb}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-4">
        <GuideSection
          step={1}
          concept="Encabezado"
          title="Qué problema se está midiendo"
        >
          <p>
            El título indica la <strong>variable</strong> y el{' '}
            <strong>contexto</strong> de las observaciones.
          </p>
          <p className="rounded-lg bg-background p-3 ring-1 ring-border">
            <strong>
              Ejercicio {exerciseLabel} — {exerciseTitle}
            </strong>
          </p>
        </GuideSection>

        <GuideSection
          step={2}
          concept="Datos no agrupados"
          title="Lista original"
        >
          <p>Cada valor es una observación suelta (sin intervalos ni clases).</p>
          <div className="flex flex-wrap gap-2">
            {rawValues.map((v, i) => (
              <Badge key={`${v}-${i}`} variant="outline">
                {v}
              </Badge>
            ))}
          </div>
        </GuideSection>

        <GuideSection
          step={3}
          concept="Tamaño y paridad"
          title="Contar n y comprobar si n es par"
        >
          <div className="flex flex-wrap gap-3">
            <Card className="min-w-[8rem] flex-1">
              <CardHeader className="pb-1">
                <CardDescription>Tamaño muestral</CardDescription>
                <CardTitle className="text-2xl">n = {n}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="min-w-[8rem] flex-1 border-primary/30">
              <CardHeader className="pb-1">
                <CardDescription>Paridad</CardDescription>
                <CardTitle className="text-lg text-primary">n es par</CardTitle>
                <CardDescription className="text-xs">
                  Posiciones centrales: n/2 y n/2 + 1 (desde 1).
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </GuideSection>

        <GuideSection
          step={4}
          concept="Orden"
          title="Serie ordenada y posiciones centrales"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {median.sorted.map((v, i) => {
              const pos = i + 1
              const isCentral = pos === leftPos || pos === rightPos
              return (
                <div
                  key={`${v}-${i}`}
                  className={cn(
                    'rounded-lg border p-2 text-center text-xs',
                    isCentral && 'border-primary bg-primary/10',
                  )}
                >
                  <div className="text-muted-foreground">Pos. {pos}</div>
                  <div className="font-mono font-semibold">{v}</div>
                  {pos === leftPos ? (
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      n/2
                    </Badge>
                  ) : null}
                  {pos === rightPos ? (
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      n/2+1
                    </Badge>
                  ) : null}
                </div>
              )
            })}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posición i</TableHead>
                {median.sorted.map((_, i) => (
                  <TableHead key={i} className="text-center">
                    {i + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">x₍ᵢ₎</TableCell>
                {median.sorted.map((v, i) => (
                  <TableCell
                    key={i}
                    className={cn(
                      'text-center tabular-nums',
                      (i + 1 === leftPos || i + 1 === rightPos) &&
                        'bg-primary/15 font-semibold',
                    )}
                  >
                    {v}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </GuideSection>

        <FormulaBlock block={formulaStep} />
      </div>
    </div>
  )
}
