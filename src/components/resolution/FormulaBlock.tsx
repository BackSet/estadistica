import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ResolutionStep } from '@/lib/statistics'

type Props = {
  block: ResolutionStep
}

export function FormulaBlock({ block }: Props) {
  return (
    <Card className="print:break-inside-avoid">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Paso {block.step}. {block.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-mono text-sm leading-relaxed">{block.formula}</p>
        {block.legends.length > 0 ? (
          <ul className="space-y-1.5 border-l-2 border-border pl-3">
            {block.legends.map((leg) => (
              <li
                key={`${leg.term}-${leg.value}`}
                className="text-xs text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  {leg.term} = {leg.value}
                </span>
                {' — '}
                {leg.origin}
              </li>
            ))}
          </ul>
        ) : null}
        {block.note ? (
          <CardDescription className="text-xs">{block.note}</CardDescription>
        ) : null}
      </CardContent>
    </Card>
  )
}
