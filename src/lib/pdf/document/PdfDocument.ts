import jsPDF from 'jspdf'
import type { ResolutionStep } from '@/lib/statistics/types'
import { toPdfText } from './pdfText'
import { PDF, SITE_NAME } from './styles'

export type PdfTableRow = (string | number)[]

export type TableAlign = 'left' | 'center' | 'right'

export type TableOptions = {
  align?: TableAlign[]
  /** Pesos relativos para anchos de columna (opcional). */
  widths?: number[]
}

type Color3 = readonly [number, number, number]

type WriteOpts = {
  align?: TableAlign
  maxWidth?: number
}

export class PdfDocument {
  readonly pdf: jsPDF
  private y: number
  private readonly pageWidth: number
  private readonly pageHeight: number
  readonly contentWidth: number
  private readonly docTitle: string

  constructor(docTitle: string) {
    this.pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    this.docTitle = docTitle
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.contentWidth = this.pageWidth - 2 * PDF.page.margin
    this.y = this.contentTop
    this.paintHeader()
  }

  private get contentLeft(): number {
    return PDF.page.margin
  }

  private get contentRight(): number {
    return this.pageWidth - PDF.page.margin
  }

  private get contentTop(): number {
    return PDF.page.margin + PDF.page.headerH
  }

  private get bottomLimit(): number {
    return this.pageHeight - PDF.page.margin - PDF.page.footerH
  }

  private t(text: string): string {
    return toPdfText(text)
  }

  private setFont(
    weight: 'normal' | 'bold' | 'italic',
    size: number,
    color: Color3,
  ): void {
    this.pdf.setFont('helvetica', weight)
    this.pdf.setFontSize(size)
    this.pdf.setTextColor(color[0], color[1], color[2])
  }

  private setFill(color: Color3): void {
    this.pdf.setFillColor(color[0], color[1], color[2])
  }

  private setDraw(color: Color3): void {
    this.pdf.setDrawColor(color[0], color[1], color[2])
  }

  /**
   * Parte texto respetando saltos de línea explícitos (\n).
   * Debe llamarse con la fuente/tamaño ya activos (afecta el ancho medido).
   */
  private split(text: string, maxWidth: number): string[] {
    const normalized = this.t(text)
    const paragraphs = normalized.split(/\r?\n/)
    const lines: string[] = []
    for (const part of paragraphs) {
      const chunk = part.trim()
      if (!chunk) continue
      lines.push(...this.pdf.splitTextToSize(chunk, maxWidth))
    }
    return lines.length > 0 ? lines : ['']
  }

  private write(text: string, x: number, y: number, opts?: WriteOpts): void {
    const safe = this.t(text)
    if (opts?.maxWidth != null) {
      this.pdf.text(safe, x, y, { align: opts.align, maxWidth: opts.maxWidth })
    } else if (opts?.align != null) {
      this.pdf.text(safe, x, y, { align: opts.align })
    } else {
      this.pdf.text(safe, x, y)
    }
  }

  /** baseline para que la línea de altura `lineH` quede dentro de `top + pad`. */
  private baseline(top: number, lineH: number): number {
    return top + lineH * 0.78
  }

  ensureSpace(needMm: number): void {
    if (this.y + needMm > this.bottomLimit) {
      this.pdf.addPage()
      this.y = this.contentTop
      this.paintHeader()
    }
  }

  private paintHeader(): void {
    this.setFont('normal', PDF.font.small, PDF.colors.muted)
    this.write(SITE_NAME, this.contentLeft, PDF.page.margin + 3)
    this.setDraw(PDF.colors.border)
    this.pdf.setLineWidth(0.2)
    this.pdf.line(
      this.contentLeft,
      PDF.page.margin + 5,
      this.contentRight,
      PDF.page.margin + 5,
    )
  }

  private paintFooters(): void {
    const total = this.pdf.getNumberOfPages()
    for (let i = 1; i <= total; i++) {
      this.pdf.setPage(i)
      this.setFont('normal', PDF.font.small, PDF.colors.muted)
      this.write(
        `Página ${i} de ${total}`,
        this.pageWidth / 2,
        this.pageHeight - PDF.page.margin / 2,
        { align: 'center' },
      )
    }
  }

  save(filename: string): void {
    this.paintFooters()
    this.pdf.setProperties({
      title: this.docTitle,
      subject: 'Ejercicios de estadística descriptiva',
      creator: 'estadistica-ejercicios',
    })
    const name = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
    this.pdf.save(name)
  }

  // ---------- bloques de contenido ----------

  addExerciseCover(opts: {
    label: string
    title: string
    kindLabel: string
    context?: string
  }): void {
    this.setFont('bold', PDF.font.eyebrow, PDF.colors.primary)
    this.write(
      `EJERCICIO ${opts.label}  ·  ${opts.kindLabel.toUpperCase()}`,
      this.contentLeft,
      this.baseline(this.y, 4),
    )
    this.y += 5.5

    this.setFont('bold', PDF.font.title, PDF.colors.text)
    const titleLines = this.split(opts.title, this.contentWidth)
    for (const line of titleLines) {
      this.ensureSpace(PDF.line.title)
      this.write(line, this.contentLeft, this.baseline(this.y, PDF.line.title))
      this.y += PDF.line.title
    }

    if (opts.context) {
      this.y += PDF.gap.xs
      this.setFont('normal', PDF.font.body, PDF.colors.muted)
      for (const line of this.split(opts.context, this.contentWidth)) {
        this.ensureSpace(PDF.line.body)
        this.write(line, this.contentLeft, this.baseline(this.y, PDF.line.body))
        this.y += PDF.line.body
      }
    }

    this.y += PDF.gap.sm
    this.setDraw(PDF.colors.border)
    this.pdf.setLineWidth(0.3)
    this.pdf.line(this.contentLeft, this.y, this.contentRight, this.y)
    this.y += PDF.gap.md
  }

  addHomeTitle(title: string, subtitle: string): void {
    this.setFont('bold', 18, PDF.colors.text)
    this.write(title, this.contentLeft, this.baseline(this.y, 8))
    this.y += 8.5
    this.setFont('normal', PDF.font.body, PDF.colors.muted)
    this.write(subtitle, this.contentLeft, this.baseline(this.y, PDF.line.body))
    this.y += PDF.line.body + PDF.gap.sm
    this.setDraw(PDF.colors.border)
    this.pdf.setLineWidth(0.3)
    this.pdf.line(this.contentLeft, this.y, this.contentRight, this.y)
    this.y += PDF.gap.md
  }

  addSectionTitle(title: string): void {
    this.ensureSpace(PDF.line.title + PDF.gap.sm)
    const top = this.y
    this.setFill(PDF.colors.primary)
    this.pdf.rect(this.contentLeft, top + 0.5, 1.6, 5, 'F')
    this.setFont('bold', PDF.font.h1, PDF.colors.text)
    this.write(
      title,
      this.contentLeft + 4,
      this.baseline(top, PDF.line.title),
    )
    this.y = top + PDF.line.title + PDF.gap.sm
  }

  addSubsectionTitle(title: string): void {
    this.ensureSpace(6)
    this.setFont('bold', PDF.font.h2, PDF.colors.text)
    this.write(title, this.contentLeft, this.baseline(this.y, 5))
    this.y += 5 + PDF.gap.xs
  }

  addBodyText(text: string, opts?: { italic?: boolean; muted?: boolean }): void {
    this.setFont(
      opts?.italic ? 'italic' : 'normal',
      PDF.font.body,
      opts?.muted ? PDF.colors.muted : PDF.colors.text,
    )
    for (const line of this.split(text, this.contentWidth)) {
      this.ensureSpace(PDF.line.body)
      this.write(line, this.contentLeft, this.baseline(this.y, PDF.line.body), {
        maxWidth: this.contentWidth,
      })
      this.y += PDF.line.body
    }
    this.y += PDF.gap.xs
  }

  addDataPanel(label: string, content: string): void {
    const pad = 3
    this.setFont('normal', PDF.font.body, PDF.colors.text)
    const lines = this.split(content, this.contentWidth - pad * 2)
    const labelH = 3.5
    const contentH = lines.length * PDF.line.body
    const blockH = pad + labelH + 1.2 + contentH + pad

    this.ensureSpace(blockH + PDF.gap.sm)
    const top = this.y
    this.setFill(PDF.colors.fillLight)
    this.setDraw(PDF.colors.border)
    this.pdf.setLineWidth(0.15)
    this.pdf.roundedRect(this.contentLeft, top, this.contentWidth, blockH, 1.5, 1.5, 'FD')

    this.setFont('bold', PDF.font.eyebrow, PDF.colors.muted)
    this.write(
      label.toUpperCase(),
      this.contentLeft + pad,
      this.baseline(top + pad - 1.5, labelH),
    )

    this.setFont('normal', PDF.font.body, PDF.colors.text)
    let ty = top + pad + labelH + 1.2
    for (const line of lines) {
      this.write(line, this.contentLeft + pad, this.baseline(ty, PDF.line.body))
      ty += PDF.line.body
    }

    this.y = top + blockH + PDF.gap.sm
  }

  addCallout(title: string, body: string): void {
    const pad = 3
    const titleH = 4
    this.setFont('normal', PDF.font.body, PDF.colors.text)
    const bodyLines = this.split(body, this.contentWidth - pad * 2 - 2)
    const bodyH = bodyLines.length * PDF.line.body
    const blockH = pad + titleH + 1 + bodyH + pad

    this.ensureSpace(blockH + PDF.gap.sm)
    const top = this.y
    this.setFill(PDF.colors.fillCard)
    this.pdf.rect(this.contentLeft, top, this.contentWidth, blockH, 'F')
    this.setFill(PDF.colors.primary)
    this.pdf.rect(this.contentLeft, top, 1.6, blockH, 'F')

    this.setFont('bold', PDF.font.h2, PDF.colors.primary)
    this.write(
      title,
      this.contentLeft + pad + 1.5,
      this.baseline(top + pad - 1, titleH),
    )
    this.setFont('normal', PDF.font.body, PDF.colors.text)
    let ty = top + pad + titleH + 1
    for (const line of bodyLines) {
      this.write(
        line,
        this.contentLeft + pad + 1.5,
        this.baseline(ty, PDF.line.body),
      )
      ty += PDF.line.body
    }
    this.y = top + blockH + PDF.gap.sm
  }

  addNote(title: string, body: string): void {
    this.addCallout(title, body)
  }

  /**
   * Tarjetas de métrica en una sola fila. Cada tarjeta ocupa el mismo ancho.
   * Si hay una sola, se renderiza como pill compacto (no estirado).
   */
  addMetricRow(
    items: { label: string; symbol: string; value: string }[],
  ): void {
    if (items.length === 0) return
    const cardH = 12
    this.ensureSpace(cardH + PDF.gap.sm)
    const top = this.y

    if (items.length === 1) {
      const item = items[0]!
      this.drawMetricPill(item, this.contentLeft, top)
    } else {
      const gap = 3
      const colW = (this.contentWidth - gap * (items.length - 1)) / items.length
      items.forEach((item, i) => {
        const x = this.contentLeft + i * (colW + gap)
        this.drawMetricCard(item, x, top, colW, cardH)
      })
    }
    this.y = top + cardH + PDF.gap.sm
  }

  private drawMetricCard(
    item: { label: string; symbol: string; value: string },
    x: number,
    top: number,
    w: number,
    h: number,
  ): void {
    this.setFill(PDF.colors.fillCard)
    this.setDraw(PDF.colors.border)
    this.pdf.setLineWidth(0.15)
    this.pdf.roundedRect(x, top, w, h, 1.5, 1.5, 'FD')
    const center = x + w / 2

    this.setFont('bold', PDF.font.eyebrow, PDF.colors.muted)
    this.write(item.label.toUpperCase(), center, top + 3.5, { align: 'center' })
    this.setFont('bold', PDF.font.metricValue, PDF.colors.text)
    this.write(item.value, center, top + 7.8, { align: 'center' })
    this.setFont('normal', PDF.font.micro, PDF.colors.primary)
    this.write(item.symbol, center, top + 11, { align: 'center' })
  }

  private drawMetricPill(
    item: { label: string; symbol: string; value: string },
    x: number,
    top: number,
  ): void {
    const labelText = this.t(item.label.toUpperCase())
    const valueText = this.t(item.value)
    const symbolText = this.t(item.symbol)

    this.setFont('bold', PDF.font.eyebrow, PDF.colors.muted)
    const labelW = this.pdf.getTextWidth(labelText)
    this.setFont('bold', PDF.font.metricValue, PDF.colors.text)
    const valueW = this.pdf.getTextWidth(valueText)
    this.setFont('normal', PDF.font.micro, PDF.colors.primary)
    const symbolW = this.pdf.getTextWidth(symbolText)

    const padX = 4
    const innerGap = 4
    const pillW =
      padX * 2 + labelW + innerGap + valueW + innerGap + symbolW
    const pillH = 8

    const yTop = top + 2

    this.setFill(PDF.colors.primarySoft)
    this.pdf.roundedRect(x, yTop, pillW, pillH, 1.5, 1.5, 'F')

    const baselineY = yTop + pillH / 2 + 1.5
    let cursor = x + padX
    this.setFont('bold', PDF.font.eyebrow, PDF.colors.primaryDeep)
    this.write(labelText, cursor, baselineY)
    cursor += labelW + innerGap
    this.setFont('bold', PDF.font.metricValue, PDF.colors.text)
    this.write(valueText, cursor, baselineY)
    cursor += valueW + innerGap
    this.setFont('normal', PDF.font.micro, PDF.colors.primary)
    this.write(symbolText, cursor, baselineY)
  }

  addResolutionStep(step: ResolutionStep): void {
    const formulaPad = PDF.gap.sm
    const formulaInnerW = this.contentWidth - formulaPad * 2

    // Misma fuente que al dibujar: si no, splitTextToSize subestima el ancho (bold).
    this.setFont('bold', PDF.font.formula, PDF.colors.text)
    const formulaLines = this.split(step.formula, formulaInnerW)
    const formulaH = formulaLines.length * PDF.line.formula + formulaPad * 2

    this.ensureSpace(8 + formulaH + PDF.line.small)

    const badgeSize = 4.6
    const badgeY = this.y
    this.setFill(PDF.colors.primary)
    this.pdf.circle(
      this.contentLeft + badgeSize / 2,
      badgeY + badgeSize / 2,
      badgeSize / 2,
      'F',
    )
    this.setFont('bold', PDF.font.micro, PDF.colors.white)
    this.write(
      String(step.step),
      this.contentLeft + badgeSize / 2,
      badgeY + badgeSize / 2 + 1.1,
      { align: 'center' },
    )

    this.setFont('bold', PDF.font.h2, PDF.colors.text)
    this.write(
      step.title,
      this.contentLeft + badgeSize + 2,
      this.baseline(badgeY, badgeSize),
    )
    this.y = badgeY + badgeSize + PDF.gap.xs

    const formulaTop = this.y
    this.setFill(PDF.colors.fillFormula)
    this.setDraw(PDF.colors.border)
    this.pdf.setLineWidth(0.15)
    this.pdf.roundedRect(
      this.contentLeft,
      formulaTop,
      this.contentWidth,
      formulaH,
      1.2,
      1.2,
      'FD',
    )
    let fy = formulaTop + formulaPad
    for (const line of formulaLines) {
      this.write(line, this.contentLeft + formulaPad, this.baseline(fy, PDF.line.formula), {
        maxWidth: formulaInnerW,
      })
      fy += PDF.line.formula
    }
    this.y = formulaTop + formulaH + PDF.gap.xs

    for (const leg of step.legends) {
      const text = `${leg.term} = ${leg.value}  —  ${leg.origin}`
      this.setFont('normal', PDF.font.small, PDF.colors.text)
      const lines = this.split(text, this.contentWidth - 4)
      for (let i = 0; i < lines.length; i++) {
        this.ensureSpace(PDF.line.small)
        const prefix = i === 0 ? '•  ' : '    '
        this.write(
          prefix + lines[i]!,
          this.contentLeft,
          this.baseline(this.y, PDF.line.small),
        )
        this.y += PDF.line.small
      }
    }
    if (step.note) {
      this.setFont('italic', PDF.font.small, PDF.colors.muted)
      for (const line of this.split(step.note, this.contentWidth - 4)) {
        this.ensureSpace(PDF.line.small)
        this.write(
          line,
          this.contentLeft + 4,
          this.baseline(this.y, PDF.line.small),
        )
        this.y += PDF.line.small
      }
    }
    this.y += PDF.gap.sm
  }

  addResolutionSteps(steps: ResolutionStep[]): void {
    for (const step of steps) {
      this.addResolutionStep(step)
    }
  }

  addTable(
    head: string[][],
    body: PdfTableRow[],
    opts?: TableOptions,
  ): void {
    const headers = (head[0] ?? []).map((h) => this.t(String(h)))
    const rows = body.map((row) =>
      row.map((cell) => this.t(String(cell ?? ''))),
    )
    if (headers.length === 0) return
    const colCount = headers.length

    const weights = opts?.widths ?? Array.from({ length: colCount }, () => 1)
    const totalW = weights.reduce((a, b) => a + b, 0)
    const colWidths = weights.map((w) => (w / totalW) * this.contentWidth)

    const align = opts?.align ?? Array.from({ length: colCount }, () => 'center' as TableAlign)
    const padX = 2
    const padY = 1.8
    const lineH = PDF.line.small

    const measureRow = (cells: string[]) =>
      cells.map((text, i) => this.split(text, colWidths[i]! - padX * 2))

    const drawRow = (
      cells: string[],
      type: 'head' | 'body',
      altIndex: number,
    ): void => {
      const wrapped = measureRow(cells)
      const maxLines = Math.max(1, ...wrapped.map((l) => l.length))
      const rowH = Math.max(6, maxLines * lineH + padY * 2)

      this.ensureSpace(rowH)
      const top = this.y

      if (type === 'head') {
        this.setFill(PDF.colors.primary)
      } else if (altIndex % 2 === 1) {
        this.setFill(PDF.colors.fillLight)
      } else {
        this.setFill(PDF.colors.white)
      }
      this.pdf.rect(this.contentLeft, top, this.contentWidth, rowH, 'F')

      this.setDraw(PDF.colors.border)
      this.pdf.setLineWidth(0.1)
      let x = this.contentLeft
      for (let c = 0; c <= colCount; c++) {
        this.pdf.line(x, top, x, top + rowH)
        if (c < colCount) x += colWidths[c]!
      }
      this.pdf.line(this.contentLeft, top, this.contentRight, top)
      this.pdf.line(
        this.contentLeft,
        top + rowH,
        this.contentRight,
        top + rowH,
      )

      const weight = type === 'head' ? 'bold' : 'normal'
      const color = type === 'head' ? PDF.colors.white : PDF.colors.text
      this.setFont(weight, PDF.font.small, color)

      let cx = this.contentLeft
      for (let c = 0; c < colCount; c++) {
        const colW = colWidths[c]!
        const a = align[c] ?? 'center'
        let textX = cx + padX
        if (a === 'center') textX = cx + colW / 2
        if (a === 'right') textX = cx + colW - padX
        const lines = wrapped[c] ?? ['']
        let ty = top + padY
        for (const line of lines) {
          this.write(line, textX, this.baseline(ty, lineH), {
            align: a,
            maxWidth: colW - padX * 2,
          })
          ty += lineH
        }
        cx += colW
      }

      this.y = top + rowH
    }

    drawRow(headers, 'head', 0)
    rows.forEach((row, i) => {
      if (this.y + 8 > this.bottomLimit) {
        this.pdf.addPage()
        this.y = this.contentTop
        this.paintHeader()
        drawRow(headers, 'head', 0)
      }
      const cells = headers.map((_, ci) => row[ci] ?? '')
      drawRow(cells, 'body', i)
    })

    this.y += PDF.gap.sm
  }
}
