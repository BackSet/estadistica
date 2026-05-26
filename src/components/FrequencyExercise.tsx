import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { NoteBlock } from '@/components/ui/info-blocks'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ExerciseLayout } from '@/components/layout/ExerciseLayout'
import { ResolutionFlow } from '@/components/resolution/ResolutionFlow'
import type { FrequencyExerciseDef } from '@/data/exercises'
import {
  buildFrequencyResolutionSteps,
  buildFrequencyTable,
} from '@/lib/statistics'
import { BarChart } from './BarChart'

type Props = {
  exercise: FrequencyExerciseDef
}

export function FrequencyExercise({ exercise }: Props) {
  const table = useMemo(
    () => buildFrequencyTable(exercise.values),
    [exercise.values],
  )
  const resolutionSteps = useMemo(
    () => buildFrequencyResolutionSteps(table),
    [table],
  )
  const legendId = `freq-formula-${exercise.id}`

  return (
    <ExerciseLayout
      exerciseLabel={exercise.exerciseLabel}
      title={exercise.title}
      context={exercise.context}
      dataLabel={`Datos originales (n=${table.n})`}
      dataContent={exercise.values.join(', ')}
    >
      <section aria-labelledby="freq-resolution-heading">
        <h3
          id="freq-resolution-heading"
          className="mb-4 text-lg font-semibold"
        >
          Resolución (orden de las columnas)
        </h3>
        <ResolutionFlow steps={resolutionSteps} />
      </section>

      <section aria-labelledby="freq-table-heading">
        <h3 id="freq-table-heading" className="mb-3 text-lg font-semibold">
          Tabla de frecuencias
        </h3>
        <Card id={legendId}>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <abbr title={exercise.variableLabel}>xᵢ</abbr>
                  </TableHead>
                  <TableHead>
                    <abbr title="Frecuencia absoluta">fᵢ</abbr>
                  </TableHead>
                  <TableHead>
                    <abbr title="Frecuencia relativa">fᵢ/n</abbr>
                  </TableHead>
                  <TableHead>
                    <abbr title="Frecuencia porcentual">%</abbr>
                  </TableHead>
                  <TableHead>
                    <abbr title="Frecuencia acumulada">Fᵢ</abbr>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.rows.map((row) => (
                  <TableRow key={row.xi}>
                    <TableCell>{row.xi}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fi}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {Number(row.fr.toFixed(3))}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fp}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fac}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <NoteBlock
        className="print:break-inside-avoid"
        title="Verificación"
      >
        <p className="mb-1 font-mono font-semibold tabular-nums">
          Σfᵢ = {table.verification.sumFi} = n
        </p>
        <p className="text-muted-foreground">
          La suma de frecuencias absolutas debe coincidir con n = {table.n}.
          Suma exacta de fᵢ/n: {table.verification.sumFr} (redondeo a 3
          decimales por fila).
        </p>
      </NoteBlock>

      <section aria-labelledby="freq-chart-heading">
        <h3 id="freq-chart-heading" className="mb-3 text-lg font-semibold">
          {exercise.chartTitle}
        </h3>
        <BarChart
          rows={table.rows}
          describedById={legendId}
          barLabelFormatter={
            exercise.id === 'freq-1' ? (xi) => `${xi}h` : undefined
          }
        />
      </section>
    </ExerciseLayout>
  )
}
