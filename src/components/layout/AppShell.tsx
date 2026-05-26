import type { ReactNode } from 'react'
import type { ExerciseDef } from '@/data/exercises'
import { PageFooter } from './PageFooter'
import { SiteHeader } from './SiteHeader'

type Props = {
  children: ReactNode
  variant?: 'home' | 'exercise'
  exerciseLabel?: string
  exerciseTitle?: string
  pdfScope?: 'home' | { exercise: ExerciseDef }
}

export function AppShell({
  children,
  variant = 'home',
  exerciseLabel,
  exerciseTitle,
  pdfScope,
}: Props) {
  return (
    <div className="app-shell mx-auto min-h-screen max-w-3xl px-4 pb-12 sm:px-6">
      <div className="pdf-capture-target space-y-0">
        {variant === 'exercise' &&
        exerciseLabel != null &&
        exerciseTitle != null ? (
          <SiteHeader
            variant="exercise"
            exerciseLabel={exerciseLabel}
            exerciseTitle={exerciseTitle}
          />
        ) : (
          <SiteHeader variant="home" />
        )}

        <main>{children}</main>
      </div>

      {pdfScope === 'home' ? (
        <PageFooter pdfScope="home" />
      ) : pdfScope ? (
        <PageFooter pdfScope={{ exercise: pdfScope.exercise }} />
      ) : null}
    </div>
  )
}
