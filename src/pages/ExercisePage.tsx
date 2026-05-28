import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CentralTendencyExercise } from '@/components/CentralTendencyExercise'
import { DiagnosticDiagramExercise } from '@/components/DiagnosticDiagramExercise'
import { FrequencyExercise } from '@/components/FrequencyExercise'
import { GroupedDataExercise } from '@/components/GroupedDataExercise'
import { AppShell } from '@/components/layout/AppShell'
import { getExerciseById } from '@/data/exercises'
import { usePageMeta } from '@/hooks/usePageMeta'
import {
  exercisePageMeta,
  NOT_FOUND_PAGE_META,
} from '@/lib/siteMeta'

export function ExercisePage() {
  const { id } = useParams<{ id: string }>()
  const exercise = id ? getExerciseById(id) : undefined

  usePageMeta(
    exercise
      ? exercisePageMeta(exercise)
      : { ...NOT_FOUND_PAGE_META, path: id ? `/ejercicio/${id}` : undefined },
  )

  if (!exercise) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h1 className="font-display mb-2 text-2xl font-semibold">
            Ejercicio no encontrado
          </h1>
          <p className="mb-6 text-muted-foreground">
            No existe un ejercicio con ese identificador en la URL.
          </p>
          <Button variant="outline" nativeButton={false} render={<Link to="/" />}>
            Volver al inicio
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      variant="exercise"
      exerciseLabel={exercise.exerciseLabel}
      exerciseTitle={exercise.title}
      pdfScope={{ exercise }}
    >
      {exercise.kind === 'frequency' ? (
        <FrequencyExercise exercise={exercise} />
      ) : exercise.kind === 'grouped' ? (
        <GroupedDataExercise exercise={exercise} />
      ) : exercise.kind === 'conceptual' ? (
        <DiagnosticDiagramExercise exercise={exercise} />
      ) : (
        <CentralTendencyExercise exercise={exercise} />
      )}
    </AppShell>
  )
}
