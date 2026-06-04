import type { ResolutionStep } from '@/lib/statistics'

type Props = {
  block: ResolutionStep
}

export function FormulaBlock({ block }: Props) {
  return (
    <div className="flex gap-4 print:break-inside-avoid">
      <div
        aria-hidden
        className="font-ui mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold tabular-nums text-primary"
      >
        {block.step}
      </div>
      <div className="min-w-0 flex-1 space-y-3 pb-1">
        <h4 className="font-ui text-base font-semibold leading-snug">
          {block.title}
        </h4>
        <p className="overflow-x-auto rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-sm leading-relaxed">
          {block.formula}
        </p>
        {block.legends.length > 0 ? (
          <dl className="grid gap-1.5 border-l-2 border-border pl-3 text-xs text-muted-foreground">
            {block.legends.map((leg) => (
              <div key={`${leg.term}-${leg.value}`}>
                <span className="font-ui font-semibold text-foreground">
                  {leg.term} = {leg.value}
                </span>
                {' — '}
                {leg.origin}
              </div>
            ))}
          </dl>
        ) : null}
        {block.note ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {block.note}
          </p>
        ) : null}
      </div>
    </div>
  )
}
