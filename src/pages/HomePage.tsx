import { Link } from 'react-router-dom'
import { DownloadPdfToolbar } from '../components/DownloadPdfToolbar'
import {
  exercisePath,
  exercises,
  type ExerciseDef,
} from '../data/exercises'

function exerciseKindLabel(ex: ExerciseDef): string {
  return ex.kind === 'frequency' ? 'Tabla de frecuencias' : 'Tendencia central'
}

function ExerciseCard({ ex }: { ex: ExerciseDef }) {
  const to = exercisePath(ex.id)
  return (
    <Link to={to} className="home-exercise-card">
      <span className="home-exercise-card-badge">{ex.exerciseLabel}</span>
      <span className="home-exercise-card-kind">{exerciseKindLabel(ex)}</span>
      <span className="home-exercise-card-title">{ex.title}</span>
      <span className="home-exercise-card-cta">Abrir ejercicio →</span>
    </Link>
  )
}

export function HomePage() {
  const frequency = exercises.filter((e) => e.kind === 'frequency')
  const central = exercises.filter((e) => e.kind === 'central')

  return (
    <div className="app-shell">
      <div className="home-pdf-row no-print">
        <DownloadPdfToolbar scope="home" />
      </div>
      <header className="app-header home-header">
        <h1>Estadística descriptiva para trabajo social</h1>
        <p className="home-intro">
          Ejemplos con datos que pueden surgir en la práctica profesional
          (visitas, encuestas, tiempos de servicio, escalas y fichas de hogar).
          Cada ejercicio tiene su propia ruta para compartir o guardar el
          enlace.
        </p>
      </header>

      <main className="app-main home-main">
        <section className="home-section" aria-labelledby="home-freq-heading">
          <h2 id="home-freq-heading" className="home-section-title">
            Tablas de frecuencias
          </h2>
          <p className="home-section-desc">
            A partir de registros de campo o fichas (horas de intervención,
            composición del hogar, etc.): frecuencia absoluta, relativa,
            porcentual y acumulada, con gráfico.
          </p>
          <div className="home-exercise-grid">
            {frequency.map((ex) => (
              <ExerciseCard key={ex.id} ex={ex} />
            ))}
          </div>
        </section>

        <section className="home-section" aria-labelledby="home-central-heading">
          <h2 id="home-central-heading" className="home-section-title">
            Media, mediana y moda
          </h2>
          <p className="home-section-desc">
            Datos no agrupados tomados de evaluaciones, encuestas o indicadores
            de servicio; en un caso se desarrolla paso a paso la mediana con
            número par de observaciones.
          </p>
          <div className="home-exercise-grid">
            {central.map((ex) => (
              <ExerciseCard key={ex.id} ex={ex} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
