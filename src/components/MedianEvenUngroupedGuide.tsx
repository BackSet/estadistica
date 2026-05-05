import type { ReactNode } from 'react'
import type { MedianWithSteps } from '../lib/statistics'

type Props = {
  exerciseLabel: string
  exerciseTitle: string
  rawValues: number[]
  median: MedianWithSteps
  unitSuffix: string
  caseBlurb?: string
}

type SectionProps = {
  step: number
  concept: string
  title: string
  children: ReactNode
}

function MedianSection({ step, concept, title, children }: SectionProps) {
  const headingId = `median-section-${step}-title`
  return (
    <section
      className="median-section"
      aria-labelledby={headingId}
    >
      <div className="median-section__badge" aria-hidden>
        {step}
      </div>
      <div className="median-section__content">
        <p className="median-section__concept">{concept}</p>
        <h4 id={headingId} className="median-section__title">
          {title}
        </h4>
        <div className="median-section__body">{children}</div>
      </div>
    </section>
  )
}

/**
 * Guía explícita: mediana con datos no agrupados cuando n es par.
 * Solo debe renderizarse si median.rule === 'even'.
 */
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

  return (
    <div className="median-guide-panel">
      <header className="median-guide-hero">
        <p className="median-guide-hero-eyebrow">Guía paso a paso</p>
        <h3 className="median-guide-hero-title">
          Cómo obtener la mediana con datos no agrupados y n par
        </h3>
        <p className="median-guide-hero-lead">
          Cada bloque abajo corresponde a una parte del razonamiento: primero se
          identifica el enunciado, luego el tipo de datos, el tamaño muestral, el
          orden, y por último la fórmula. Así se separa lo conceptual del cálculo.
        </p>
      </header>

      {caseBlurb ? (
        <div className="median-case-banner" role="note">
          <span className="median-case-banner-label">Caso de trabajo social</span>
          <p className="median-case-banner-text">{caseBlurb}</p>
        </div>
      ) : null}

      <div className="median-guide-flow">
        <MedianSection
          step={1}
          concept="Ubicar el encabezado"
          title="Qué problema se está midiendo"
        >
          <p className="median-prose">
            Lea el título del ejercicio: indica la <strong>variable</strong> (qué
            se contó o midió) y el <strong>contexto</strong> (quién o qué casos).
          </p>
          <div className="median-callout median-callout--accent">
            <span className="median-callout-label">Encabezado del enunciado</span>
            <p className="median-callout-text">
              <strong>
                Ejercicio {exerciseLabel} — {exerciseTitle}
              </strong>
            </p>
          </div>
        </MedianSection>

        <MedianSection
          step={2}
          concept="Datos no agrupados"
          title="Lista original (sin clases ni intervalos)"
        >
          <p className="median-prose">
            Cada valor es una observación suelta. No hay tabla de frecuencias
            previa: primero se trabaja con la lista tal cual (orden de registro en
            la bitácora o planilla).
          </p>
          <div className="median-chip-row" aria-label="Datos en orden de captura">
            {rawValues.map((v, i) => (
              <span key={`${v}-${i}`} className="median-chip median-chip--raw">
                {v}
              </span>
            ))}
          </div>
        </MedianSection>

        <MedianSection
          step={3}
          concept="Número de datos y paridad"
          title="Contar n y comprobar si n es par"
        >
          <p className="median-prose">
            <strong>n</strong> es el número de observaciones (cuántos números hay
            en la lista). Si <strong>n es par</strong>, no existe un solo valor
            “justo al medio”: hay <strong>dos</strong> posiciones centrales en la
            serie ordenada.
          </p>
          <div className="median-n-badge-row">
            <div className="median-n-badge">
              <span className="median-n-badge-label">Tamaño muestral</span>
              <span className="median-n-badge-value">n = {n}</span>
              <span className="median-n-badge-hint">conteo de datos</span>
            </div>
            <div className="median-parity median-parity--even">
              <span className="median-parity-label">Paridad</span>
              <span className="median-parity-value">n es par</span>
              <span className="median-parity-detail">
                n mod 2 = 0 → usamos las posiciones n/2 y n/2 + 1 (contando desde
                1).
              </span>
            </div>
          </div>
        </MedianSection>

        <MedianSection
          step={4}
          concept="Orden y posiciones"
          title="Serie ordenada y dónde cae el centro"
        >
          <p className="median-prose">
            Ordene los datos de menor a mayor. Numere las posiciones{' '}
            <strong>1, …, n</strong> sobre esa lista ya ordenada. Los valores
            x<sub>(k)</sub> son los de esa lista ordenada (no el orden original).
          </p>
          <p className="median-subheading">Vista en tarjetas (posición → valor)</p>
          <div className="median-visual-track" role="list">
            {median.sorted.map((v, i) => {
              const pos = i + 1
              const isLeft = pos === leftPos
              const isRight = pos === rightPos
              const isCentral = isLeft || isRight
              return (
                <div
                  key={`${v}-${i}`}
                  className={`median-visual-cell${
                    isCentral ? ' median-visual-cell--central' : ''
                  }`}
                  role="listitem"
                >
                  <span className="median-visual-pos">Posición i = {pos}</span>
                  <span className="median-visual-val">x₍{pos}₎ = {v}</span>
                  {isLeft ? (
                    <span className="median-visual-tag">n / 2</span>
                  ) : null}
                  {isRight ? (
                    <span className="median-visual-tag">n / 2 + 1</span>
                  ) : null}
                </div>
              )
            })}
          </div>
          <p className="median-subheading">Tabla resumen (misma información)</p>
          <div className="table-wrap">
            <table className="table-clean median-guide-table">
              <thead>
                <tr>
                  <th scope="col">Posición i</th>
                  {median.sorted.map((_, i) => (
                    <th key={i} scope="col" className="num">
                      {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">x₍ᵢ₎</th>
                  {median.sorted.map((v, i) => (
                    <td
                      key={i}
                      className={`num${
                        i + 1 === leftPos || i + 1 === rightPos
                          ? ' median-guide-cell-highlight'
                          : ''
                      }`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </MedianSection>

        <MedianSection
          step={5}
          concept="Cierre"
          title="Fórmula de la mediana cuando n es par"
        >
          <ul className="median-guide-list median-guide-list--tight">
            <li>
              Posición <strong>n/2</strong> = {n}/2 = <strong>{leftPos}</strong>{' '}
              → valor x<sub>({leftPos})</sub> = <strong>{leftVal}</strong>.
            </li>
            <li>
              Posición <strong>n/2 + 1</strong> = <strong>{rightPos}</strong> →
              valor x<sub>({rightPos})</sub> = <strong>{rightVal}</strong>.
            </li>
          </ul>
          <div className="median-guide-formula median-guide-formula--hero">
            Me = ( x<sub>(n/2)</sub> + x<sub>(n/2 + 1)</sub> ) / 2 = ({leftVal} +{' '}
            {rightVal}) / 2 = {(leftVal + rightVal) / 2} ={' '}
            <strong>
              {meRounded}
              {unitSuffix}
            </strong>
          </div>
          <p className="median-prose median-prose--muted">
            Interpretación: la mitad de los casos queda por debajo o en ese valor
            y la mitad por encima o en él (definición usual de mediana en datos
            continuos o discretos no agrupados).
          </p>
        </MedianSection>
      </div>
    </div>
  )
}
