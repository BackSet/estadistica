import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ExerciseDef } from '@/data/exercises'
import { downloadAppShellPdf } from '@/lib/downloadAppShellPdf'
import { useState } from 'react'

type Props =
  | { scope: 'home' }
  | { scope: 'exercise'; exercise: ExerciseDef }

function defaultFilename(ex: ExerciseDef): string {
  return `ejercicio-${ex.id}.pdf`
}

export function DownloadPdfAction(props: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      if (props.scope === 'home') {
        await downloadAppShellPdf(
          'estadistica-inicio.pdf',
          'Estadística descriptiva — Índice de ejercicios',
        )
      } else {
        await downloadAppShellPdf(
          defaultFilename(props.exercise),
          props.exercise.title,
        )
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
    props.scope === 'home' ? 'Descargar índice (PDF)' : 'Descargar ejercicio (PDF)'

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void handleClick()}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Download className="size-4" aria-hidden />
      )}
      {loading ? 'Generando PDF…' : label}
    </Button>
  )
}
