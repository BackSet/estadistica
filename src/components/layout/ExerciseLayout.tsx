import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { ContextCallout, DataPanel } from '@/components/ui/info-blocks'
import { Separator } from '@/components/ui/separator'

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
    <article className="space-y-5">
      <header className="space-y-2">
        <Badge variant="secondary" className="text-sm font-semibold">
          {exerciseLabel}
        </Badge>
        <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight">
          {title}
        </h2>
      </header>

      {context ? <ContextCallout>{context}</ContextCallout> : null}

      <DataPanel label={dataLabel}>{dataContent}</DataPanel>

      <Separator />

      <div className="space-y-6">{children}</div>
    </article>
  )
}
