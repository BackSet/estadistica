import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FigureProps = {
  /** Etiqueta corta, p. ej. "Tabla 1" o "Figura 2". */
  label?: string
  /** Texto descriptivo del pie de figura. */
  caption?: ReactNode
  /** Enmarca el contenido con una caja de borde fino (gráficos). */
  framed?: boolean
  /** Pone el pie encima del contenido (convención de tablas). */
  captionOnTop?: boolean
  className?: string
  contentClassName?: string
  id?: string
  children: ReactNode
}

/**
 * Figura estilo distill.pub: contenido con un pie de figura numerado en
 * tipografía sans, gris y compacta. Las tablas suelen llevar el pie arriba;
 * los gráficos, abajo y enmarcados.
 */
export function Figure({
  label,
  caption,
  framed = false,
  captionOnTop = false,
  className,
  contentClassName,
  id,
  children,
}: FigureProps) {
  const cap =
    label || caption ? (
      <figcaption className="caption print:break-inside-avoid">
        {label ? (
          <span className="font-semibold text-foreground/80">{label}.</span>
        ) : null}{' '}
        {caption}
      </figcaption>
    ) : null

  return (
    <figure
      id={id}
      className={cn('m-0 space-y-2 print:break-inside-avoid', className)}
    >
      {captionOnTop ? cap : null}
      <div
        className={cn(
          framed && 'rounded-md border border-border bg-card p-4',
          contentClassName,
        )}
      >
        {children}
      </div>
      {captionOnTop ? null : cap}
    </figure>
  )
}
