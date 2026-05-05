import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="app-shell">
      <nav className="app-nav no-print" aria-label="Navegación principal">
        <Link to="/" className="app-nav-link">
          ← Inicio
        </Link>
      </nav>
      <div className="not-found">
        <h1>Página no encontrada</h1>
        <p>La ruta solicitada no existe en esta aplicación.</p>
        <Link to="/" className="not-found-link">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
