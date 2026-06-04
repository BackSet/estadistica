import { FileSpreadsheet, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ExerciseDef } from '@/data/exercises'
import { downloadAppShellExcel } from '@/lib/downloadAppShellExcel'
import { useState } from 'react'

type Props =
  | { scope: 'home' }
  | { scope: 'exercise'; exercise: ExerciseDef }

function defaultFilename(ex: ExerciseDef): string {
  return `ejercicio-${ex.id}.xlsx`
}

export function DownloadExcelAction(props: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      if (props.scope === 'home') {
        await downloadAppShellExcel('estadistica-inicio.xlsx')
      } else {
        await downloadAppShellExcel(defaultFilename(props.exercise), {
          exercise: props.exercise,
        })
      }
    } catch (e) {
      console.error(e)
      window.alert(
        `No se pudo generar el Excel: ${e instanceof Error ? e.message : String(e)}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const label =
    props.scope === 'home'
      ? 'Descargar índice (Excel)'
      : 'Descargar ejercicio (Excel)'

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
        <FileSpreadsheet className="size-4" aria-hidden />
      )}
      {loading ? 'Generando Excel…' : label}
    </Button>
  )
}
