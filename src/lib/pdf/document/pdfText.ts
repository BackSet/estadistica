/** Convierte texto con símbolos Unicode a ASCII seguro para las fuentes estándar de jsPDF. */
export function toPdfText(input: string): string {
  let s = input.normalize('NFC')

  const subDigits: Record<string, string> = {
    '₀': '0',
    '₁': '1',
    '₂': '2',
    '₃': '3',
    '₄': '4',
    '₅': '5',
    '₆': '6',
    '₇': '7',
    '₈': '8',
    '₉': '9',
  }
  s = s.replace(/[₀-₉]/g, (ch) => subDigits[ch] ?? ch)

  const map: [RegExp, string][] = [
    [/Σ/g, 'Suma'],
    [/x̄/g, 'x'],
    [/x̅/g, 'x'],
    [/xᵢ/g, 'xi'],
    [/fᵢ/g, 'fi'],
    [/Fᵢ/g, 'Fi'],
    [/x₍([^₎]*)₎/g, 'x($1)'],
    [/log₁₀/g, 'log10'],
    [/log\s*₁₀/g, 'log10'],
    [/·/g, ' * '],
    [/×/g, ' * '],
    [/÷/g, ' / '],
    [/—/g, ' - '],
    [/–/g, '-'],
    [/≈/g, '~'],
    [/→/g, '->'],
    [/«|»/g, '"'],
    [/…/g, '...'],
    [/₍/g, '('],
    [/₎/g, ')'],
    [/\u00a0/g, ' '],
    [/\u202f/g, ' '],
  ]

  for (const [pattern, replacement] of map) {
    s = s.replace(pattern, replacement)
  }

  return s.replace(/\s{2,}/g, ' ').trim()
}
