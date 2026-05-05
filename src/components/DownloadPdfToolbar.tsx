import { useState } from 'react'
import type { ExerciseDef } from '../data/exercises'
import { downloadAppShellPdf } from '../lib/downloadAppShellPdf'

type PropsExercise = {
  scope: 'exercise'
  exercise: ExerciseDef
}

type PropsHome = {
  scope: 'home'
}

type Props = PropsExercise | PropsHome

function defaultFilename(ex: ExerciseDef): string {
  return `ejercicio-${ex.id}.pdf`
}

/**
 * Descarga un PDF de **una sola página** que reproduce el diseño real
 * (captura de alta resolución). El resultado es visualmente fiel; el texto
 * en el PDF es imagen (no copiable).
 */
export function DownloadPdfToolbar(props: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      if (props.scope === 'home') {
        await downloadAppShellPdf('estadistica-inicio.pdf')
      } else {
        await downloadAppShellPdf(defaultFilename(props.exercise))
      }
    } catch (e) {
      console.error(e)
      window.alert(
        `No se pudo generar el PDF: ${e instanceof Error ? e.message : String(e)}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const label =
    props.scope === 'home'
      ? 'Descargar índice (PDF)'
      : 'Descargar ejercicio (PDF)'

  return (
    <div className="pdf-download-toolbar">
      <button
        type="button"
        className="pdf-download-btn"
        onClick={() => void handleClick()}
        disabled={loading}
      >
        {loading ? 'Generando PDF…' : label}
      </button>
      <span className="pdf-download-hint">
        Mismo aspecto que en pantalla (una hoja en PDF; botón y menú excluidos
        al generar el archivo).
      </span>
    </div>
  )
}
