import { useMemo } from 'react'
import type { CentralExerciseDef } from '../data/exercises'
import {
  meanWithSteps,
  medianWithSteps,
  modeWithSteps,
} from '../lib/statistics'
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
    <span className="ordered-list">
      {sorted.map((v, i) => (
        <span key={`${v}-${i}`}>
          {i > 0 ? ', ' : null}
          {highlightIndices.has(i) ? (
            <span className="highlight">{v}</span>
          ) : (
            v
          )}
        </span>
      ))}
    </span>
  )
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
  const primaryMode = mode.modes[0]
  const modeLabel =
    mode.modes.length > 1
      ? `Valores modales: ${mode.modes.join(', ')}`
      : `Mo = ${primaryMode}${suffix}`

  const modeExample =
    mode.frequencies.find((f) => f.count === mode.maxCount) ??
    mode.frequencies[0]

  return (
    <section className="exercise-section">
      <h2>
        <span className="exercise-number">{exercise.exerciseLabel}</span>
        {exercise.title}
      </h2>

      <div className="data-display">
        <div className="data-label">Datos (n={mean.n}):</div>
        <div className="data-values">{exercise.values.join(', ')}</div>
      </div>

      <div className="result-box">
        <div className="result-title">Media aritmética (x̄)</div>
        <span className="badge badge-formula">x̄ = Σxᵢ / n</span>
        <div className="calculation-steps">
          {mean.steps.map((s) => (
            <div key={s.label} className="step">
              <div className="step-number">{s.label}</div>
              <div className="step-content">{s.text}</div>
            </div>
          ))}
        </div>
        <div className="result-value">
          x̄ = {meanDisplay}
          {suffix}
        </div>
        <div className="result-explanation">
          Cada sumando del paso 2 es un dato de la lista; n es el número de
          observaciones.
        </div>
      </div>

      <div className="result-box">
        <div className="result-title">Moda (Mo)</div>
        <div className="calculation-steps">
          {mode.steps.map((s) => (
            <div key={s.label} className="step">
              <div className="step-number">{s.label}</div>
              <div className="step-content">{s.text}</div>
            </div>
          ))}
        </div>
        <p className="mode-legend">
          Cada celda es <strong>valor: frecuencia</strong> (cuántas veces
          aparece ese valor en la lista). Ejemplo: el valor{' '}
          <strong>{modeExample.value}</strong> aparece{' '}
          <strong>{modeExample.count}</strong> veces (frecuencia máxima ={' '}
          {mode.maxCount}).
        </p>
        <table className="mode-mini-table table-clean">
          <tbody>
            {chunk(mode.frequencies, 2).map((pair, ri) => (
              <tr key={ri}>
                {pair.map((f) => (
                  <td key={f.value}>
                    {f.value}:{' '}
                    <span
                      className={
                        f.count === mode.maxCount ? 'highlight' : undefined
                      }
                    >
                      {f.count}
                    </span>
                  </td>
                ))}
                {pair.length === 1 ? <td /> : null}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="result-value">{modeLabel}</div>
        <div className="result-explanation">
          La moda es el valor con mayor frecuencia absoluta en la tabla anterior.
        </div>
      </div>

      <div className="result-box">
        <div className="result-title">Mediana (Me)</div>
        <span className="badge badge-formula">
          {median.rule === 'odd'
            ? 'Posición central: (n+1)/2'
            : 'n par: promedio de los dos valores centrales'}
        </span>
        <div className="calculation-steps">
          {median.steps.map((s) => (
            <div key={s.label} className="step">
              <div className="step-number">{s.label}</div>
              <div className="step-content">
                {s.label === '1' ? (
                  <>
                    Ordenar datos de menor a mayor:{' '}
                    <OrderedDataWithMedianHighlight
                      sorted={median.sorted}
                      rule={median.rule}
                      positionOneBased={median.positionOneBased}
                      leftPos={median.leftPos}
                      rightPos={median.rightPos}
                    />
                  </>
                ) : (
                  s.text
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="result-value">
          Me = {formatMean(median.median)}
          {suffix}
        </div>
        <div className="result-explanation">
          Los valores resaltados en la lista ordenada son los que definen la
          mediana.
        </div>
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
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-marker" aria-hidden>
            x̄
          </div>
          <div className="summary-label">Media</div>
          <div className="summary-value">{meanDisplay}</div>
        </div>
        <div className="summary-card">
          <div className="summary-marker" aria-hidden>
            Mo
          </div>
          <div className="summary-label">Moda</div>
          <div className="summary-value">{mode.modes.join(', ')}</div>
        </div>
        <div className="summary-card">
          <div className="summary-marker" aria-hidden>
            Me
          </div>
          <div className="summary-label">Mediana</div>
          <div className="summary-value">
            {formatMean(median.median)}
          </div>
        </div>
      </div>

      {exercise.note ? (
        <div className="note">
          <strong>Observación:</strong> {exercise.note}
        </div>
      ) : null}
    </section>
  )
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}
