import { useMemo } from 'react'
import type { FrequencyExerciseDef } from '../data/exercises'
import { buildFrequencyTable } from '../lib/statistics'
import { BarChart } from './BarChart'

type Props = {
  exercise: FrequencyExerciseDef
}

export function FrequencyExercise({ exercise }: Props) {
  const table = useMemo(
    () => buildFrequencyTable(exercise.values),
    [exercise.values],
  )

  const dataStr = exercise.values.join(', ')
  const legendId = `freq-formula-${exercise.id}`
  const first = table.rows[0]
  const frExample = Number(first.fr.toFixed(3))
  const second = table.rows[1]

  const posShort =
    first.trace.fi.positionsOneBased.length <= 10
      ? first.trace.fi.positionsOneBased.join(', ')
      : `${first.trace.fi.positionsOneBased.slice(0, 6).join(', ')}…`

  return (
    <section className="exercise-section">
      <h2>
        <span className="exercise-number">{exercise.exerciseLabel}</span>
        {exercise.title}
      </h2>

      <div className="data-display">
        <div className="data-label">
          Datos originales (n={table.n}):
        </div>
        <div className="data-values">{dataStr}</div>
      </div>

      <aside className="table-formula-legend" id={legendId}>
        <p className="table-formula-legend-title">
          Cómo se calculan las columnas (orden)
        </p>
        <ol className="table-formula-steps">
          <li>
            <strong>n</strong> es el número total de datos:{' '}
            <span className="formula-inline">n = {table.n}</span> (cuenta de la
            lista de arriba).
          </li>
          <li>
            <strong>xᵢ</strong> es cada valor distinto ordenado de menor a
            mayor. En la <em>primera</em> fila de la tabla:{' '}
            <span className="formula-inline">xᵢ = {first.xi}</span>.
          </li>
          <li>
            <strong>fᵢ</strong> (frecuencia absoluta) es cuántas veces aparece
            ese xᵢ en los datos. Para xᵢ = {first.xi}:{' '}
            <span className="formula-inline">fᵢ = {first.fi}</span> (en las
            posiciones {posShort} de la lista, contando desde 1).
          </li>
          <li>
            <strong>fᵢ/n</strong> (frecuencia relativa) es fᵢ dividido entre n:{' '}
            <span className="formula-inline">
              {first.fi}/{table.n} ≈ {frExample}
            </span>
            .
          </li>
          <li>
            <strong>%</strong> es el porcentaje:{' '}
            <span className="formula-inline">
              (fᵢ/n) × 100 ≈ {first.fp}%
            </span>{' '}
            (mismo número que la columna %, redondeado a una cifra decimal).
          </li>
          <li>
            <strong>Fᵢ</strong> (frecuencia acumulada) suma las fᵢ desde la
            primera fila hasta la actual. En la primera fila:{' '}
            <span className="formula-inline">Fᵢ = {first.fac}</span>
            {second ? (
              <>
                . En la segunda (xᵢ = {second.xi}):{' '}
                <span className="formula-inline">
                  Fᵢ = {first.fac} + {second.fi} = {second.fac}
                </span>
              </>
            ) : null}
            .
          </li>
          <li>
            El resto de filas repite el mismo esquema: nuevas{' '}
            <strong>fᵢ</strong> y <strong>fᵢ/n</strong> y <strong>%</strong> con
            su xᵢ; <strong>Fᵢ</strong> va sumando la fᵢ de la fila al acumulado
            anterior hasta llegar a n.
          </li>
        </ol>
      </aside>

      <div className="table-wrap">
        <table className="table-clean">
          <thead>
            <tr>
              <th scope="col">
                <abbr title={exercise.variableLabel}>xᵢ</abbr>
              </th>
              <th scope="col">
                <abbr title="Frecuencia absoluta">fᵢ</abbr>
              </th>
              <th scope="col">
                <abbr title="Frecuencia relativa">fᵢ/n</abbr>
              </th>
              <th scope="col">
                <abbr title="Frecuencia porcentual">%</abbr>
              </th>
              <th scope="col">
                <abbr title="Frecuencia acumulada">Fᵢ</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.xi} className="animate-row data-row">
                <td>{row.xi}</td>
                <td className="num">{row.fi}</td>
                <td className="num">{Number(row.fr.toFixed(3))}</td>
                <td className="num">{row.fp}%</td>
                <td className="num">{row.fac}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="result-box">
        <div className="result-title">Verificación</div>
        <div className="result-value">
          Σfᵢ = {table.verification.sumFi} = n
        </div>
        <div className="result-explanation">
          La suma de las frecuencias absolutas debe coincidir con n ={' '}
          {table.n}. La suma exacta de fᵢ/n es {table.verification.sumFr}; en
          cada fila fᵢ/n está redondeado a tres decimales.
        </div>
      </div>

      <h3 className="subsection-title">{exercise.chartTitle}</h3>
      <BarChart
        rows={table.rows}
        describedById={legendId}
        barLabelFormatter={
          exercise.id === 'freq-1' ? (xi) => `${xi}h` : undefined
        }
      />
    </section>
  )
}
