import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

type Props =
  | { variant: 'home' }
  | {
      variant: 'exercise'
      exerciseLabel: string
      exerciseTitle: string
    }

export function SiteHeader(props: Props) {
  return (
    <header className="no-print sticky top-0 z-40 -mx-4 mb-10 border-b border-border bg-background/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        {props.variant === 'exercise' ? (
          <Link
            to="/"
            className="group inline-flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="kicker truncate group-hover:text-foreground">
              Índice de ejercicios
            </span>
          </Link>
        ) : (
          <Link
            to="/"
            className="min-w-0 font-display text-base font-semibold leading-tight tracking-tight text-foreground hover:text-primary"
          >
            Estadística
            <span className="text-muted-foreground"> · Trabajo social</span>
          </Link>
        )}

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
