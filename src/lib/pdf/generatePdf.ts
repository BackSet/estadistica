import type { ExerciseDef } from '@/data/exercises'
import { generateCentralPdf } from './generators/centralPdf'
import { generateFrequencyPdf } from './generators/frequencyPdf'
import { generateGroupedPdf } from './generators/groupedPdf'
import { generateHomePdf } from './generators/homePdf'

export type GeneratePdfTarget =
  | { scope: 'home' }
  | { scope: 'exercise'; exercise: ExerciseDef }

export function generatePdf(target: GeneratePdfTarget, filename: string): void {
  switch (target.scope) {
    case 'home':
      generateHomePdf().save(filename)
      return
    case 'exercise': {
      const { exercise } = target
      switch (exercise.kind) {
        case 'frequency':
          generateFrequencyPdf(exercise).save(filename)
          return
        case 'central':
          generateCentralPdf(exercise).save(filename)
          return
        case 'grouped':
          generateGroupedPdf(exercise).save(filename)
          return
      }
    }
  }
}
