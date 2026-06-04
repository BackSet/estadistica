import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import {
  exerciseKindLabel,
  exercisePath,
  exercises,
  type ExerciseDef,
} from '@/data/exercises'
import { usePageMeta } from '@/hooks/usePageMeta'
import { HOME_PAGE_META } from '@/lib/siteMeta'

export function HomePage() {
  usePageMeta(HOME_PAGE_META)

  return <HomePageContent />
}

function ExerciseRow({ ex }: { ex: ExerciseDef }) {
  return (
    <li>
      <Link
        to={exercisePath(ex.id)}
        className="group flex items-center gap-4 rounded-md px-3 py-3 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="kicker w-9 shrink-0 tabular-nums">
          {ex.exerciseLabel}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block leading-snug font-medium text-foreground group-hover:text-primary">
            {ex.title}
          </span>
          <span className="caption mt-0.5 block">{exerciseKindLabel(ex)}</span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </Link>
    </li>
  )
}

function ExerciseSection({
  id,
  index,
  title,
  description,
  items,
}: {
  id: string
  index: number
  title: string
  description: string
  items: ExerciseDef[]
}) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby={id}>
      <div className="border-b border-rule pb-2">
        <p className="kicker mb-1">Sección {index}</p>
        <h2 id={id} className="font-display text-xl font-bold tracking-tight">
          {title}
        </h2>
      </div>
      <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
        {description}
      </p>
      <ul className="mt-3 -mx-3 divide-y divide-border/70">
        {items.map((ex) => (
          <ExerciseRow key={ex.id} ex={ex} />
        ))}
      </ul>
    </section>
  )
}

function HomePageContent() {
  const frequency = exercises.filter((e) => e.kind === 'frequency')
  const grouped = exercises.filter((e) => e.kind === 'grouped')
  const central = exercises.filter((e) => e.kind === 'central')
  const conceptual = exercises.filter((e) => e.kind === 'conceptual')

  return (
    <AppShell pdfScope="home">
      <header className="mb-12 border-b border-rule pb-8">
        <p className="kicker mb-3">Estadística descriptiva · Trabajo social</p>
        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl">
          Índice de ejercicios
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Una colección de ejercicios resueltos con datos de práctica
          profesional: tablas de frecuencias, datos agrupados, medidas de
          tendencia central y diagramas conceptuales. Cada ejercicio tiene su
          propia URL para compartir o exportar en PDF.
        </p>
      </header>

      <div className="space-y-12">
        <ExerciseSection
          id="home-freq"
          index={1}
          title="Tablas de frecuencias"
          description="Datos no agrupados: frecuencia absoluta, relativa, porcentual y acumulada."
          items={frequency}
        />
        <ExerciseSection
          id="home-grouped"
          index={2}
          title="Datos agrupados"
          description="Intervalos, tabla de frecuencias y media con marcas de clase."
          items={grouped}
        />
        <ExerciseSection
          id="home-central"
          index={3}
          title="Media, mediana y moda"
          description="Tendencia central en datos no agrupados; guía ampliada para mediana con n par."
          items={central}
        />
        <ExerciseSection
          id="home-conceptual"
          index={4}
          title="Diagramas conceptuales"
          description="Mentefactos diferenciales con conceptos, resumen, semejanzas y diferencias."
          items={conceptual}
        />
      </div>
    </AppShell>
  )
}
