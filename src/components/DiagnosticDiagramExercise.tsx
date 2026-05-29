import { ExerciseLayout } from '@/components/layout/ExerciseLayout'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NoteBlock } from '@/components/ui/info-blocks'
import { Separator } from '@/components/ui/separator'
import type { ConceptDiagramLayout, ConceptNodeDef, ConceptualExerciseDef } from '@/data/exercises'

type Props = {
  exercise: ConceptualExerciseDef
}

function diagramDataContent(diagram: ConceptDiagramLayout): string {
  return `P1 como categoría superior; ${diagram.leftSystemId} y ${diagram.rightSystemId} como sistemas comparados; ${diagram.leftTraitIds.join('-')} y ${diagram.rightTraitIds.join('-')} como rasgos diferenciales.`
}

function conceptRangeLabel(nodes: ConceptNodeDef[]): string {
  if (nodes.length === 0) return 'Conceptos'
  return `Conceptos (${nodes[0].id} a ${nodes[nodes.length - 1].id})`
}

function DiagramBox({
  point,
  className,
}: {
  point: ConceptNodeDef
  className?: string
}) {
  return (
    <div
      className={`rounded-lg border bg-card px-3 py-2 text-center shadow-sm ${className ?? ''}`}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {point.id}
      </p>
      <p className="text-sm font-semibold">{point.label}</p>
    </div>
  )
}

function TraitRow({ point }: { point: ConceptNodeDef }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Badge variant="outline">{point.id}</Badge>
      <span>{point.label}</span>
    </div>
  )
}

function ConceptCard({ point }: { point: ConceptNodeDef }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{point.id}</Badge>
          <CardTitle className="text-base">{point.label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/90">{point.concept}</p>
      </CardContent>
    </Card>
  )
}

export function DiagnosticDiagramExercise({ exercise }: Props) {
  const byId = new Map(exercise.nodes.map((n) => [n.id, n]))
  const { diagram } = exercise
  const root = byId.get(diagram.rootId)!
  const leftSystem = byId.get(diagram.leftSystemId)!
  const rightSystem = byId.get(diagram.rightSystemId)!
  const leftTraits = diagram.leftTraitIds.map((id) => byId.get(id)!)
  const rightTraits = diagram.rightTraitIds.map((id) => byId.get(id)!)

  return (
    <ExerciseLayout
      exerciseLabel={exercise.exerciseLabel}
      title={exercise.title}
      context={exercise.context}
      dataLabel="Estructura del diagrama"
      dataContent={diagramDataContent(diagram)}
    >
      <section className="space-y-4" aria-labelledby="d1-diagram-heading">
        <div>
          <h3 id="d1-diagram-heading" className="text-lg font-semibold">
            Diagrama D1 — {exercise.diagramTitle}
          </h3>
          <p className="text-sm text-muted-foreground">
            Relación diferencial entre DSM IV y CIE 10.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-3 pt-4">
            <div className="mx-auto max-w-xl">
              <DiagramBox point={root} />
              <div className="mx-auto h-5 w-px bg-border" />
              <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
                <div className="space-y-2">
                  <DiagramBox point={leftSystem} />
                  <div className="space-y-2 rounded-md border border-dashed p-2">
                    <CardDescription className="text-xs">Características DSM IV</CardDescription>
                    {leftTraits.map((trait) => (
                      <TraitRow key={trait.id} point={trait} />
                    ))}
                  </div>
                </div>
                <div className="pt-5 text-muted-foreground">↔</div>
                <div className="space-y-2">
                  <DiagramBox point={rightSystem} />
                  <div className="space-y-2 rounded-md border border-dashed p-2">
                    <CardDescription className="text-xs">Características CIE 10</CardDescription>
                    {rightTraits.map((trait) => (
                      <TraitRow key={trait.id} point={trait} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4" aria-labelledby="d1-concepts-heading">
        <h3 id="d1-concepts-heading" className="text-lg font-semibold">
          {conceptRangeLabel(exercise.nodes)}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {exercise.nodes.map((node) => (
            <ConceptCard key={node.id} point={node} />
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-4" aria-labelledby="d1-summary-heading">
        <h3 id="d1-summary-heading" className="text-lg font-semibold">
          Resumen del trabajo
        </h3>
        <NoteBlock>{exercise.summary}</NoteBlock>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">¿Cómo se relacionan (Semejanzas)?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {exercise.similarities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">¿En qué se diferencian?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {exercise.differences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </ExerciseLayout>
  )
}
