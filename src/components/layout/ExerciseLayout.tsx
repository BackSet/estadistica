import type { ReactNode } from 'react'
import { ContextCallout, DataPanel } from '@/components/ui/info-blocks'

type Props = {
  exerciseLabel: string
  title: string
  context?: string
  dataLabel: string
  dataContent: ReactNode
  children: ReactNode
}

export function ExerciseLayout({
  exerciseLabel,
  title,
  context,
  dataLabel,
  dataContent,
  children,
}: Props) {
  return (
    <article className="space-y-6">
      <header className="space-y-3 border-b border-rule pb-6">
        <p className="kicker">{exerciseLabel}</p>
        <h1 className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-balance sm:text-[2.25rem]">
          {title}
        </h1>
        {context ? <ContextCallout>{context}</ContextCallout> : null}
        <DataPanel label={dataLabel}>{dataContent}</DataPanel>
      </header>

      <div className="space-y-9">{children}</div>
    </article>
  )
}
