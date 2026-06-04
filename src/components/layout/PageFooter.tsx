import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ExerciseDef } from '@/data/exercises'
import { DownloadExcelAction } from './DownloadExcelAction'
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
            Mismo diseño que en pantalla: PDF en A4 con texto seleccionable o
            Excel (.xlsx) con tablas booktabs y formato numérico.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-0">
          {props.pdfScope === 'home' ? (
            <>
              <DownloadPdfAction scope="home" />
              <DownloadExcelAction scope="home" />
            </>
          ) : (
            <>
              <DownloadPdfAction
                scope="exercise"
                exercise={props.pdfScope.exercise}
              />
              <DownloadExcelAction
                scope="exercise"
                exercise={props.pdfScope.exercise}
              />
            </>
          )}
        </CardContent>
      </Card>
    </footer>
  )
}
