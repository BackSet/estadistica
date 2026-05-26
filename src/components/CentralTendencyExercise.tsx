import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MetricChip, NoteBlock } from '@/components/ui/info-blocks'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { ExerciseLayout } from '@/components/layout/ExerciseLayout'
import { ResolutionFlow } from '@/components/resolution/ResolutionFlow'
import type { CentralExerciseDef } from '@/data/exercises'
import {
  meanWithSteps,
  medianWithSteps,
  modeWithSteps,
} from '@/lib/statistics'
import { cn } from '@/lib/utils'
import { MedianEvenUngroupedGuide } from './MedianEvenUngroupedGuide'

type Props = {
  exercise: CentralExerciseDef
}

function formatMean(m: number): string {
  return String(Math.round(m * 100) / 100)
}

function OrderedDataWithMedianHighlight({
  sorted,
  rule,
  positionOneBased,
  leftPos,
  rightPos,
}: {
  sorted: number[]
  rule: 'odd' | 'even'
  positionOneBased?: number
  leftPos?: number
  rightPos?: number
}) {
  const highlightIndices = new Set<number>()
  if (rule === 'odd' && positionOneBased != null) {
    highlightIndices.add(positionOneBased - 1)
  }
  if (rule === 'even' && leftPos != null && rightPos != null) {
    highlightIndices.add(leftPos - 1)
    highlightIndices.add(rightPos - 1)
  }

  return (
    <span>
      {sorted.map((v, i) => (
        <span key={`${v}-${i}`}>
          {i > 0 ? ', ' : null}
          {highlightIndices.has(i) ? (
            <span className="rounded bg-primary/15 px-1 font-semibold text-primary">
              {v}
            </span>
          ) : (
            v
          )}
        </span>
      ))}
    </span>
  )
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

export function CentralTendencyExercise({ exercise }: Props) {
  const suffix = exercise.unitSuffix ?? ''
  const mean = useMemo(() => meanWithSteps(exercise.values), [exercise.values])
  const mode = useMemo(() => modeWithSteps(exercise.values), [exercise.values])
  const median = useMemo(
    () => medianWithSteps(exercise.values),
    [exercise.values],
  )

  const meanDisplay = formatMean(mean.mean)
  const modeLabel =
    mode.modes.length > 1
      ? `Valores modales: ${mode.modes.join(', ')}`
      : `Mo = ${mode.modes[0]}${suffix}`

  const medianStepsWithOrdered = median.resolutionSteps.map((step) => {
    if (step.step !== 1) return step
    return {
      ...step,
      formula: `Datos ordenados: ver lista resaltada abajo`,
      note: `Serie ordenada de menor a mayor (n = ${median.n}).`,
    }
  })

  return (
    <ExerciseLayout
      exerciseLabel={exercise.exerciseLabel}
      title={exercise.title}
      context={exercise.context}
      dataLabel={`Datos (n=${mean.n})`}
      dataContent={exercise.values.join(', ')}
    >
      <section aria-labelledby="central-mean-heading" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id="central-mean-heading" className="text-lg font-semibold">
            Media aritmética
          </h3>
          <Badge variant="outline">x̄ = Σxᵢ / n</Badge>
        </div>
        <ResolutionFlow steps={mean.resolutionSteps} />
        <MetricChip>
          x̄ = {meanDisplay}
          {suffix}
        </MetricChip>
      </section>

      <Separator />

      <section aria-labelledby="central-mode-heading" className="space-y-4">
        <h3 id="central-mode-heading" className="text-lg font-semibold">
          Moda (Mo)
        </h3>
        <ResolutionFlow steps={mode.resolutionSteps} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Frecuencias por valor</CardTitle>
            <CardDescription>
              Cada celda es valor: frecuencia (repeticiones en la lista).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {chunk(mode.frequencies, 3).map((group, ri) => (
                  <TableRow key={ri}>
                    {group.map((f) => (
                      <TableCell key={f.value} className="text-center">
                        {f.value}:{' '}
                        <span
                          className={cn(
                            f.count === mode.maxCount &&
                              'rounded bg-primary/15 px-1 font-semibold text-primary',
                          )}
                        >
                          {f.count}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <MetricChip className="text-sm">{modeLabel}</MetricChip>
      </section>

      <Separator />

      <section aria-labelledby="central-median-heading" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id="central-median-heading" className="text-lg font-semibold">
            Mediana (Me)
          </h3>
          <Badge variant="outline">
            {median.rule === 'odd'
              ? 'Posición (n+1)/2'
              : 'Promedio de dos centrales'}
          </Badge>
        </div>
        <Card className="print:break-inside-avoid">
          <CardContent className="pt-4 font-mono text-sm">
            <OrderedDataWithMedianHighlight
              sorted={median.sorted}
              rule={median.rule}
              positionOneBased={median.positionOneBased}
              leftPos={median.leftPos}
              rightPos={median.rightPos}
            />
          </CardContent>
        </Card>
        <ResolutionFlow steps={medianStepsWithOrdered} />
        <MetricChip>
          Me = {formatMean(median.median)}
          {suffix}
        </MetricChip>
        {exercise.showMedianEvenUngroupedGuide && median.rule === 'even' ? (
          <MedianEvenUngroupedGuide
            exerciseLabel={exercise.exerciseLabel}
            exerciseTitle={exercise.title}
            rawValues={exercise.values}
            median={median}
            unitSuffix={suffix}
            caseBlurb={exercise.medianGuideCaseBlurb}
          />
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Media', sym: 'x̄', value: meanDisplay },
          { label: 'Moda', sym: 'Mo', value: mode.modes.join(', ') },
          { label: 'Mediana', sym: 'Me', value: formatMean(median.median) },
        ].map((item) => (
          <Card key={item.sym} size="sm" className="min-w-[7rem] flex-1 text-center">
            <CardHeader className="gap-0 pb-0 pt-3">
              <CardDescription className="text-[0.65rem] uppercase tracking-wide">
                {item.label}
              </CardDescription>
              <CardTitle className="text-lg font-semibold tabular-nums">
                {item.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-1">
              <Badge variant="secondary" className="text-[0.65rem]">
                {item.sym}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {exercise.note ? (
        <NoteBlock title="Observación">{exercise.note}</NoteBlock>
      ) : null}
    </ExerciseLayout>
  )
}
