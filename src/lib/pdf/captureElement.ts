import { domToPng } from 'modern-screenshot'

export type CaptureOptions = {
  hideSelectors?: string[]
  scale?: number
  backgroundColor?: string
}

function shouldHide(node: Node, hideSelectors: string[]): boolean {
  if (!(node instanceof HTMLElement)) return false
  for (const sel of hideSelectors) {
    if (node.matches(sel)) return true
  }
  return false
}

/**
 * Captura un nodo como PNG (soporta OKLCH y CSS moderno mejor que html2canvas).
 */
export async function captureElementAsPng(
  element: HTMLElement,
  options: CaptureOptions = {},
): Promise<string> {
  const {
    hideSelectors = ['.no-print'],
    scale = 2,
    backgroundColor = '#faf9f5',
  } = options

  const width = Math.ceil(
    Math.max(element.scrollWidth, element.getBoundingClientRect().width, 1),
  )
  const height = Math.ceil(
    Math.max(element.scrollHeight, element.getBoundingClientRect().height, 1),
  )

  return domToPng(element, {
    scale,
    width,
    height,
    backgroundColor,
    filter: (node) => !shouldHide(node, hideSelectors),
  })
}
