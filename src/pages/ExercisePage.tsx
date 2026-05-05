import { Link, useParams } from 'react-router-dom'
import { CentralTendencyExercise } from '../components/CentralTendencyExercise'
import { FrequencyExercise } from '../components/FrequencyExercise'
import { DownloadPdfToolbar } from '../components/DownloadPdfToolbar'
import { getExerciseById } from '../data/exercises'

export function ExercisePage() {
  const { id } = useParams<{ id: string }>()
  const exercise = id ? getExerciseById(id) : undefined

  if (!exercise) {
    return (
      <div className="app-shell">
        <nav className="app-nav no-print" aria-label="Navegación principal">
          <Link to="/" className="app-nav-link">
            ← Inicio
          </Link>
        </nav>
        <div className="not-found">
          <h1>Ejercicio no encontrado</h1>
          <p>No existe un ejercicio con el identificador indicado en la URL.</p>
          <Link to="/" className="not-found-link">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <nav
        className="app-nav app-nav--split no-print"
        aria-label="Navegación principal"
      >
        <Link to="/" className="app-nav-link">
          ← Inicio
        </Link>
        <DownloadPdfToolbar scope="exercise" exercise={exercise} />
      </nav>
      <header className="app-header app-header--compact">
        <h1>Estadística descriptiva — Trabajo social</h1>
      </header>
      <main className="app-main">
        {exercise.kind === 'frequency' ? (
          <FrequencyExercise exercise={exercise} />
        ) : (
          <CentralTendencyExercise exercise={exercise} />
        )}
      </main>
    </div>
  )
}
