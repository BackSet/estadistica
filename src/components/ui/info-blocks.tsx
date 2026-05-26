import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Bloque de contexto del caso: ancho acotado, poco padding vertical. */
export function ContextCallout({
  label = 'Contexto',
  children,
  className,
}: {
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <aside
      className={cn(
        'max-w-xl rounded-lg border border-border/70 border-l-[3px] border-l-primary',
        'bg-muted/35 px-3 py-2.5',
        className,
      )}
    >
      <p className="mb-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-snug text-foreground/90">{children}</p>
    </aside>
  )
}

/** Datos de entrada: etiqueta + contenido en bloque compacto. */
export function DataPanel({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card px-3 py-2.5',
        className,
      )}
    >
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="font-mono text-sm leading-relaxed break-words text-foreground">
        {children}
      </div>
    </div>
  )
}

/** Resultado destacado: valor + texto breve, ancho según contenido. */
export function ResultHighlight({
  value,
  description,
  className,
}: {
  value: ReactNode
  description?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex max-w-full flex-col gap-1 rounded-lg border border-border',
        'bg-muted/40 px-3 py-2 sm:flex-row sm:items-center sm:gap-2.5',
        className,
      )}
    >
      <div className="shrink-0 font-mono text-sm font-semibold tabular-nums text-primary">
        {value}
      </div>
      {description ? (
        <p className="text-xs leading-snug text-muted-foreground sm:text-sm">
          {description}
        </p>
      ) : null}
    </div>
  )
}

/** Valor numérico final (media, mediana, verificación). */
export function MetricChip({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'inline-block w-fit rounded-md border border-primary/30 bg-primary/10',
        'px-2.5 py-1 font-mono text-base font-semibold tabular-nums leading-none',
        className,
      )}
    >
      {children}
    </p>
  )
}

/** Bloque de verificación o nota corta con título opcional. */
export function NoteBlock({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-xl rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5',
        className,
      )}
    >
      {title ? (
        <p className="mb-1 text-xs font-medium text-muted-foreground">{title}</p>
      ) : null}
      <div className="text-sm leading-snug">{children}</div>
    </div>
  )
}
