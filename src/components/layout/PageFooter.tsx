import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ExerciseDef } from '@/data/exercises'
import { DownloadPdfAction } from './DownloadPdfAction'

type Props =
  | { pdfScope: 'home' }
  | { pdfScope: { exercise: ExerciseDef } }

export function PageFooter(props: Props) {
  return (
    <footer className="no-print mt-10 border-t pt-6">
      <Card size="sm" className="max-w-md">
        <CardHeader className="gap-0.5 pb-2">
          <CardTitle className="text-sm">Exportar esta página</CardTitle>
          <CardDescription className="text-xs leading-snug">
            PDF en A4 con diseño propio: texto seleccionable, tablas y pasos de
            resolución (no es una captura de pantalla).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {props.pdfScope === 'home' ? (
            <DownloadPdfAction scope="home" />
          ) : (
            <DownloadPdfAction
              scope="exercise"
              exercise={props.pdfScope.exercise}
            />
          )}
        </CardContent>
      </Card>
    </footer>
  )
}
