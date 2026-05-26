import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResultHighlight } from '@/components/ui/info-blocks'
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
import type { GroupedExerciseDef } from '@/data/exercises'
import { buildGroupedAnalysis } from '@/lib/statistics'
import { BarChart } from './BarChart'

type Props = {
  exercise: GroupedExerciseDef
}

export function GroupedDataExercise({ exercise }: Props) {
  const analysis = useMemo(
    () =>
      buildGroupedAnalysis(
        exercise.min,
        exercise.max,
        exercise.n,
        exercise.intervals,
      ),
    [exercise],
  )

  const chartRows = analysis.rows.map((r) => ({
    xi: r.xi,
    fi: r.fi,
    fr: r.fr,
    fp: Math.round(r.fr * 1000) / 10,
    fac: r.fac,
    trace: {
      fi: { explanation: '', positionsOneBased: [] },
      fr: { explanation: '', fraction: '', decimal: r.fr },
      fp: { explanation: '', percent: 0 },
      fac: { explanation: '', sumFormula: '' },
    },
  }))

  return (
    <ExerciseLayout
      exerciseLabel={exercise.exerciseLabel}
      title={exercise.title}
      context={exercise.context}
      dataLabel="Resumen de los datos"
      dataContent={
        <>
          {exercise.dataSummary} · <strong>n = {exercise.n}</strong> familias
        </>
      }
    >
      <section aria-labelledby="grouped-setup-heading">
        <h3 id="grouped-setup-heading" className="mb-4 text-lg font-semibold">
          Construcción de la tabla (intervalos)
        </h3>
        <ResolutionFlow steps={analysis.setupSteps} />
      </section>

      <section aria-labelledby="grouped-table-heading">
        <h3 id="grouped-table-heading" className="mb-3 text-lg font-semibold">
          Tabla de frecuencias por intervalos
        </h3>
        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intervalo</TableHead>
                  <TableHead>
                    <abbr title="Marca de clase">xᵢ</abbr>
                  </TableHead>
                  <TableHead>
                    <abbr title="Frecuencia absoluta">fᵢ</abbr>
                  </TableHead>
                  <TableHead>fᵢ/n</TableHead>
                  <TableHead>
                    <abbr title="Frecuencia acumulada">Fᵢ</abbr>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.xi}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fi}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fr}
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
        <p className="mt-2 text-xs text-muted-foreground">
          {analysis.tableNote}
        </p>
      </section>

      <section aria-labelledby="grouped-mean-heading">
        <h3 id="grouped-mean-heading" className="mb-4 text-lg font-semibold">
          Media aritmética (datos agrupados)
        </h3>
        <ResolutionFlow steps={analysis.meanSteps} />

        <Card className="mt-4 print:break-inside-avoid">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cálculo auxiliar xᵢ × fᵢ</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>xᵢ</TableHead>
                  <TableHead>fᵢ</TableHead>
                  <TableHead>xᵢ × fᵢ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="text-right tabular-nums">
                      {row.xi}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.fi}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.xifi.toLocaleString('es')}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell />
                  <TableCell className="text-right tabular-nums">
                    {analysis.sumXifi.toLocaleString('es')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ResultHighlight
          className="mt-3"
          value={
            <>
              x̄ ≈ {Math.round(analysis.mean)} {exercise.unit}/mes
            </>
          }
          description="Ingreso medio mensual estimado a partir de marcas de clase."
        />
      </section>

      <section aria-labelledby="grouped-chart-heading">
        <h3 id="grouped-chart-heading" className="mb-3 text-lg font-semibold">
          {exercise.chartTitle}
        </h3>
        <BarChart rows={chartRows} barLabelFormatter={(xi) => `${xi}`} />
      </section>
    </ExerciseLayout>
  )
}
