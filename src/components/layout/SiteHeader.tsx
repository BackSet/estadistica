import { Link } from 'react-router-dom'
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
    <header className="no-print sticky top-0 z-40 -mx-4 mb-8 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link
            to="/"
            className="font-display text-base font-semibold leading-tight text-foreground hover:text-primary"
          >
            Estadística · Trabajo social
          </Link>
          {props.variant === 'exercise' ? (
            <p
              className="mt-1 truncate text-xs text-muted-foreground"
              title={props.exerciseTitle}
            >
              <span className="font-medium text-foreground/80">
                {props.exerciseLabel}
              </span>
              {' — '}
              {props.exerciseTitle}
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Ejercicios de estadística descriptiva
            </p>
          )}
        </div>
        <div className="shrink-0 pt-0.5">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
