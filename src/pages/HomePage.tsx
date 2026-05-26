import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AppShell } from '@/components/layout/AppShell'
import {
  exerciseKindLabel,
  exercisePath,
  exercises,
  type ExerciseDef,
} from '@/data/exercises'
import { usePageMeta } from '@/hooks/usePageMeta'
import { HOME_PAGE_META } from '@/lib/siteMeta'
import { cn } from '@/lib/utils'

export function HomePage() {
  usePageMeta(HOME_PAGE_META)

  return <HomePageContent />
}

function ExerciseCard({ ex }: { ex: ExerciseDef }) {
  const to = exercisePath(ex.id)
  return (
    <Link
      to={to}
      className={cn(
        'block rounded-xl no-underline outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <Card className="h-full transition-colors hover:border-primary/40 hover:shadow-sm">
        <CardHeader>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{ex.exerciseLabel}</Badge>
            <Badge variant="outline">{exerciseKindLabel(ex)}</Badge>
          </div>
          <CardTitle className="text-base leading-snug">{ex.title}</CardTitle>
          <CardDescription>Abrir ejercicio →</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

function ExerciseSection({
  id,
  title,
  description,
  items,
}: {
  id: string
  title: string
  description: string
  items: ExerciseDef[]
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display mb-2 text-xl font-semibold">
        {title}
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((ex) => (
          <ExerciseCard key={ex.id} ex={ex} />
        ))}
      </div>
    </section>
  )
}

function HomePageContent() {
  const frequency = exercises.filter((e) => e.kind === 'frequency')
  const grouped = exercises.filter((e) => e.kind === 'grouped')
  const central = exercises.filter((e) => e.kind === 'central')

  return (
    <AppShell pdfScope="home">
      <div className="mb-10 space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Índice de ejercicios
        </h1>
        <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
          Ejemplos con datos de práctica profesional. Cada ejercicio tiene su
          propia URL para compartir o guardar.
        </p>
      </div>

      <div className="space-y-10">
        <ExerciseSection
          id="home-freq"
          title="Tablas de frecuencias"
          description="Datos no agrupados: frecuencia absoluta, relativa, porcentual y acumulada."
          items={frequency}
        />
        <ExerciseSection
          id="home-grouped"
          title="Datos agrupados"
          description="Intervalos, tabla de frecuencias y media con marcas de clase."
          items={grouped}
        />
        <ExerciseSection
          id="home-central"
          title="Media, mediana y moda"
          description="Tendencia central en datos no agrupados; guía ampliada para mediana con n par."
          items={central}
        />
      </div>
    </AppShell>
  )
}
