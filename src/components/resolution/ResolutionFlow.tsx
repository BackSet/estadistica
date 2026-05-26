import type { ResolutionStep } from '@/lib/statistics'
import { FormulaBlock } from './FormulaBlock'

type Props = {
  steps: ResolutionStep[]
  className?: string
}

export function ResolutionFlow({ steps, className }: Props) {
  return (
    <div className={className ?? 'flex flex-col gap-4'}>
      {steps.map((block) => (
        <FormulaBlock key={block.step} block={block} />
      ))}
    </div>
  )
}
