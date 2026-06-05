import { Fragment, useMemo } from 'react'
import { Figure } from '@/components/ui/figure'
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
        {
          subjectLabel: exercise.subjectLabel,
          subjectLabelPlural: exercise.subjectLabelPlural,
          variableLabel: exercise.variableLabel,
          unit: exercise.unit,
          intervalNotation: exercise.intervalNotation,
        },
      ),
    [exercise],
  )
  const subjectLabelPlural = exercise.subjectLabelPlural ?? 'familias'
  const isHalfOpen = exercise.intervalNotation === 'half-open'
  const intervalFormula = isHalfOpen
    ? '="["&C2&", "&D2&")"'
    : '=C2&"-"&D2'
  const upperLimitFormula = isHalfOpen ? '=C2+$B$7' : '=C2+$B$7-1'
  const frequencyFormula = isHalfOpen
    ? `=CONTAR.SI.CONJUNTO($A$2:$A$${exercise.n + 1};">="&C2;$A$2:$A$${exercise.n + 1};"<"&D2)`
    : `=CONTAR.SI.CONJUNTO($A$2:$A$${exercise.n + 1};">="&C2;$A$2:$A$${exercise.n + 1};"<="&D2)`
  const rawValueRows =
    exercise.rawValues?.reduce<number[][]>((rows, value, index) => {
      const rowIndex = Math.floor(index / 5)
      rows[rowIndex] = rows[rowIndex] ?? []
      rows[rowIndex].push(value)
      return rows
    }, []) ?? []

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
          {exercise.dataSummary} · <strong>n = {exercise.n}</strong>{' '}
          {subjectLabelPlural}
        </>
      }
    >
      {exercise.rawValues ? (
        <section aria-labelledby="grouped-raw-data-heading">
          <h3 id="grouped-raw-data-heading" className="mb-3 text-lg font-semibold">
            Cuadro de datos
          </h3>
          <Figure
            label="Cuadro 1"
            caption="Cada columna representa una observación. De este cuadro se obtiene n, Xmax y Xmin."
          >
              <Table>
                <TableHeader>
                  <TableRow>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Fragment key={`raw-head-${index}`}>
                        <TableHead className="text-right">
                          N°
                        </TableHead>
                        <TableHead className="text-right">
                          Dato
                        </TableHead>
                      </Fragment>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawValueRows.map((row, rowIndex) => (
                    <TableRow key={`raw-row-${rowIndex}`}>
                      {Array.from({ length: 5 }).map((_, cellIndex) => {
                        const absoluteIndex = rowIndex * 5 + cellIndex
                        const value = row[cellIndex]

                        return (
                          <Fragment key={`raw-cell-${absoluteIndex}`}>
                            <TableCell
                              className="text-right text-muted-foreground tabular-nums"
                            >
                              {value === undefined ? '' : absoluteIndex + 1}
                            </TableCell>
                            <TableCell
                              className="text-right tabular-nums"
                            >
                              {value ?? ''}
                            </TableCell>
                          </Fragment>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </Figure>
        </section>
      ) : null}

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
        <Figure
          label="Tabla 1"
          caption={analysis.tableNote}
          captionOnTop
        >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">Clase</TableHead>
                  <TableHead>Intervalo</TableHead>
                  <TableHead className="text-right">
                    <abbr title="Marca de clase">xᵢ</abbr>
                  </TableHead>
                  <TableHead className="text-right">
                    <abbr title="Frecuencia absoluta">fᵢ</abbr>
                  </TableHead>
                  <TableHead className="text-right">fᵢ/n</TableHead>
                  <TableHead className="text-right">
                    <abbr title="Frecuencia acumulada">Fᵢ</abbr>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="text-right tabular-nums">
                      {row.classIndex}
                    </TableCell>
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
        </Figure>
      </section>

      <section aria-labelledby="grouped-mean-heading">
        <h3 id="grouped-mean-heading" className="mb-4 text-lg font-semibold">
          Media aritmética (datos agrupados)
        </h3>
        <ResolutionFlow steps={analysis.meanSteps} />

        <Figure
          className="mt-4"
          label="Tabla 2"
          caption="Cálculo auxiliar xᵢ × fᵢ usado en el numerador de la media."
          captionOnTop
        >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">xᵢ</TableHead>
                  <TableHead className="text-right">fᵢ</TableHead>
                  <TableHead className="text-right">xᵢ × fᵢ</TableHead>
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
        </Figure>

        <ResultHighlight
          className="mt-3"
          value={
            <>
              x̄ ≈ {analysis.meanText} {exercise.unit}
            </>
          }
          description="Media estimada a partir de las marcas de clase."
        />
      </section>

      {exercise.rawValues ? (
        <section aria-labelledby="grouped-excel-heading">
          <h3 id="grouped-excel-heading" className="mb-3 text-lg font-semibold">
            Fórmulas de Excel
          </h3>
          <Figure
            label="Tabla 3"
            caption={`Supón que los datos están en A2:A${exercise.n + 1}; los límites inferiores en C2:C${analysis.k + 1}, los superiores en D2:D${analysis.k + 1}, las marcas en F y las frecuencias en G.`}
            captionOnTop
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Valor</TableHead>
                  <TableHead>Fórmula</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ['n', `=CONTAR($A$2:$A$${exercise.n + 1})`],
                  ['Mínimo', `=MIN($A$2:$A$${exercise.n + 1})`],
                  ['Máximo', `=MAX($A$2:$A$${exercise.n + 1})`],
                  ['Rango', '=B4-B3'],
                  ['Número de clases (K)', '=REDONDEAR.MAS(1+3,322*LOG10(B2);0)'],
                  ['Amplitud (C)', '=REDONDEAR.MAS(B5/B6;0)'],
                  ['Límite inferior de la 1.ª clase', '=B3'],
                  ['Límite superior de la clase', upperLimitFormula],
                  [isHalfOpen ? 'Intervalo [)' : 'Intervalo', intervalFormula],
                  ['Marca de clase (xᵢ)', '=(C2+D2)/2'],
                  ['Frecuencia (fᵢ)', frequencyFormula],
                  ['Frecuencia acumulada (Fᵢ)', '=SUMA($G$2:G2)'],
                  ['xᵢ · fᵢ', '=F2*G2'],
                  ['Media agrupada', `=SUMA(I2:I${analysis.k + 1})/B2`],
                ].map(([label, formula]) => (
                  <TableRow key={label}>
                    <TableCell>{label}</TableCell>
                    <TableCell className="font-mono text-xs">{formula}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Figure>
        </section>
      ) : null}

      <section aria-labelledby="grouped-chart-heading">
        <h3 id="grouped-chart-heading" className="mb-3 text-lg font-semibold">
          {exercise.chartTitle}
        </h3>
        <Figure
          framed
          label="Figura 1"
          caption="Frecuencia absoluta por marca de clase (xᵢ)."
        >
          <BarChart rows={chartRows} barLabelFormatter={(xi) => `${xi}`} />
        </Figure>
      </section>
    </ExerciseLayout>
  )
}
