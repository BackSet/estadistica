import type * as ExcelJS from 'exceljs'
import type { ResolutionStep } from '@/lib/statistics/types'
import { SITE_NAME, XLSX } from './styles'

type ExcelJSModule = typeof ExcelJS

export type Align = 'left' | 'center' | 'right'
export type CellValue = string | number | null | undefined

export type ColumnSpec = {
  header: string
  /** Columnas de la rejilla que ocupa (por defecto 1). */
  span?: number
  align?: Align
  /** Formato numérico Excel (p. ej. '0.000', '0.0%'). */
  numFmt?: string
}

export type MetricSpec = {
  label: string
  symbol: string
  value: string
}

const C = XLSX.colors
const F = XLSX.font
const S = XLSX.size

/** Estima la altura de fila para texto envuelto en el ancho de contenido. */
function estimateHeight(text: string, charsPerLine: number, lineH = 15): number {
  const hardLines = text.split('\n')
  const lines = hardLines.reduce(
    (acc, l) => acc + Math.max(1, Math.ceil(l.length / charsPerLine)),
    0,
  )
  return Math.max(lineH, lines * lineH)
}

/**
 * Construye un libro de Excel con el aspecto editorial de la app
 * (tablas booktabs, paleta neutra, contraste serif/sans). La API imita
 * a `PdfDocument` para mantener consistencia entre generadores.
 */
export class ExcelDoc {
  private wb: ExcelJS.Workbook
  private ws: ExcelJS.Worksheet
  /** Próxima fila libre (1-based). */
  private row = 1

  constructor(ExcelJSMod: ExcelJSModule, title: string) {
    this.wb = new ExcelJSMod.Workbook()
    this.wb.creator = SITE_NAME
    this.wb.created = new Date()

    this.ws = this.wb.addWorksheet(this.safeSheetName(title), {
      views: [{ showGridLines: false }],
      pageSetup: {
        paperSize: 9, // A4
        orientation: 'portrait',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
          left: 0.5,
          right: 0.5,
          top: 0.6,
          bottom: 0.6,
          header: 0.3,
          footer: 0.3,
        },
      },
    })

    for (let c = 1; c <= XLSX.cols; c++) {
      this.ws.getColumn(c).width = 13
    }
  }

  private safeSheetName(title: string): string {
    return (
      title
        .replace(/[\\/?*[\]:]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 31) || 'Hoja'
    )
  }

  /** Dibuja una regla horizontal (booktabs) a lo ancho indicado. */
  private rule(
    row: number,
    edge: 'top' | 'bottom',
    style: 'thin' | 'medium',
    argb: string,
    cols: number = XLSX.cols,
  ): void {
    for (let c = 1; c <= cols; c++) {
      const cell = this.ws.getCell(row, c)
      const prev = cell.border ?? {}
      cell.border = { ...prev, [edge]: { style, color: { argb } } }
    }
  }

  private spacer(height = 6): void {
    this.ws.getRow(this.row).height = height
    this.row += 1
  }

  // — Portada ----------------------------------------------------------------

  addExerciseCover(opts: {
    label: string
    title: string
    kindLabel: string
    context?: string
  }): void {
    this.addKicker(`Ejercicio ${opts.label} · ${opts.kindLabel}`)
    this.addTitle(opts.title)
    if (opts.context) {
      this.addBodyText(opts.context, { muted: true, italic: true })
    }
    this.spacer(8)
  }

  addHomeTitle(title: string, subtitle: string): void {
    this.addKicker(SITE_NAME)
    this.addTitle(title)
    this.addBodyText(subtitle, { muted: true, italic: true })
    this.spacer(8)
  }

  private addKicker(text: string): void {
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const cell = this.ws.getCell(this.row, 1)
    cell.value = text.toUpperCase()
    cell.font = {
      name: F.heading,
      size: S.kicker,
      bold: true,
      color: { argb: C.primary },
    }
    cell.alignment = { horizontal: 'left', vertical: 'middle' }
    this.ws.getRow(this.row).height = 14
    this.row += 1
  }

  private addTitle(text: string): void {
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const cell = this.ws.getCell(this.row, 1)
    cell.value = text
    cell.font = {
      name: F.heading,
      size: S.title,
      bold: true,
      color: { argb: C.primaryDeep },
    }
    cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    this.ws.getRow(this.row).height = estimateHeight(text, 55, 26)
    this.row += 1
  }

  // — Secciones / texto ------------------------------------------------------

  addSectionTitle(text: string): void {
    this.spacer(6)
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const cell = this.ws.getCell(this.row, 1)
    cell.value = text
    cell.font = {
      name: F.heading,
      size: S.h2,
      bold: true,
      color: { argb: C.text },
    }
    cell.alignment = { horizontal: 'left', vertical: 'bottom' }
    this.ws.getRow(this.row).height = 20
    this.rule(this.row, 'bottom', 'medium', C.rule)
    this.row += 1
    this.spacer(3)
  }

  addSubsectionTitle(text: string): void {
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const cell = this.ws.getCell(this.row, 1)
    cell.value = text
    cell.font = {
      name: F.heading,
      size: S.body,
      bold: true,
      color: { argb: C.muted },
    }
    cell.alignment = { horizontal: 'left', vertical: 'middle' }
    this.ws.getRow(this.row).height = 16
    this.row += 1
  }

  addBodyText(
    text: string,
    opts: { muted?: boolean; italic?: boolean } = {},
  ): void {
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const cell = this.ws.getCell(this.row, 1)
    cell.value = text
    cell.font = {
      name: F.body,
      size: S.body,
      italic: opts.italic,
      color: { argb: opts.muted ? C.muted : C.text },
    }
    cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true }
    this.ws.getRow(this.row).height = estimateHeight(text, 95)
    this.row += 1
  }

  // — Panel de datos ---------------------------------------------------------

  addDataPanel(label: string, content: string): void {
    this.addKicker(label)
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const cell = this.ws.getCell(this.row, 1)
    cell.value = content
    cell.font = { name: F.mono, size: S.small, color: { argb: C.text } }
    cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.fillLight } }
    this.ws.getRow(this.row).height = estimateHeight(content, 90, 16) + 6
    // Acento izquierdo + borde del panel.
    for (let c = 1; c <= XLSX.cols; c++) {
      const cc = this.ws.getCell(this.row, c)
      cc.border = {
        top: { style: 'thin', color: { argb: C.border } },
        bottom: { style: 'thin', color: { argb: C.border } },
        ...(c === 1
          ? { left: { style: 'medium', color: { argb: C.primary } } }
          : {}),
        ...(c === XLSX.cols
          ? { right: { style: 'thin', color: { argb: C.border } } }
          : {}),
      }
    }
    this.row += 1
    this.spacer(4)
  }

  // — Nota -------------------------------------------------------------------

  addNote(title: string, text: string): void {
    this.spacer(4)
    const top = this.row
    // Título
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const titleCell = this.ws.getCell(this.row, 1)
    titleCell.value = title.toUpperCase()
    titleCell.font = {
      name: F.heading,
      size: S.kicker,
      bold: true,
      color: { argb: C.primaryDeep },
    }
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' }
    this.ws.getRow(this.row).height = 16
    this.row += 1
    // Cuerpo
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const bodyCell = this.ws.getCell(this.row, 1)
    bodyCell.value = text
    bodyCell.font = { name: F.body, size: S.small, color: { argb: C.muted } }
    bodyCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true }
    this.ws.getRow(this.row).height = estimateHeight(text, 90, 14) + 4
    const bottom = this.row
    this.row += 1
    // Relleno + acento en todo el bloque.
    for (let r = top; r <= bottom; r++) {
      for (let c = 1; c <= XLSX.cols; c++) {
        const cc = this.ws.getCell(r, c)
        cc.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: C.fillLight },
        }
        if (c === 1) {
          cc.border = {
            ...(cc.border ?? {}),
            left: { style: 'medium', color: { argb: C.primary } },
          }
        }
      }
    }
    this.spacer(4)
  }

  // — Métricas ---------------------------------------------------------------

  addMetricRow(metrics: MetricSpec[]): void {
    this.spacer(3)
    const n = metrics.length
    const span = Math.max(1, Math.floor(XLSX.cols / n))
    const labelRow = this.row
    const valueRow = this.row + 1

    metrics.forEach((m, i) => {
      const startCol = i * span + 1
      const endCol = i === n - 1 ? XLSX.cols : startCol + span - 1
      this.ws.mergeCells(labelRow, startCol, labelRow, endCol)
      this.ws.mergeCells(valueRow, startCol, valueRow, endCol)

      const labelCell = this.ws.getCell(labelRow, startCol)
      labelCell.value = `${m.label} · ${m.symbol}`.toUpperCase()
      labelCell.font = {
        name: F.heading,
        size: S.kicker,
        bold: true,
        color: { argb: C.muted },
      }
      labelCell.alignment = { horizontal: 'center', vertical: 'middle' }

      const valueCell = this.ws.getCell(valueRow, startCol)
      valueCell.value = m.value
      valueCell.font = {
        name: F.heading,
        size: S.metricValue,
        bold: true,
        color: { argb: C.primaryDeep },
      }
      valueCell.alignment = { horizontal: 'center', vertical: 'middle' }

      // Relleno + borde de la "tarjeta".
      for (let c = startCol; c <= endCol; c++) {
        for (const r of [labelRow, valueRow]) {
          const cc = this.ws.getCell(r, c)
          cc.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: C.fillLight },
          }
          const isLeft = c === startCol
          const isRight = c === endCol
          cc.border = {
            top:
              r === labelRow
                ? { style: 'thin', color: { argb: C.border } }
                : undefined,
            bottom:
              r === valueRow
                ? { style: 'thin', color: { argb: C.border } }
                : undefined,
            left: isLeft ? { style: 'thin', color: { argb: C.border } } : undefined,
            right: isRight
              ? { style: 'thin', color: { argb: C.border } }
              : undefined,
          }
        }
      }
    })

    this.ws.getRow(labelRow).height = 15
    this.ws.getRow(valueRow).height = 22
    this.row = valueRow + 1
    this.spacer(4)
  }

  // — Pasos de resolución ----------------------------------------------------

  addResolutionSteps(steps: ResolutionStep[]): void {
    steps.forEach((step) => this.addResolutionStep(step))
  }

  addResolutionStep(step: ResolutionStep): void {
    // Título con número de paso.
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const titleCell = this.ws.getCell(this.row, 1)
    titleCell.value = `${step.step}.  ${step.title}`
    titleCell.font = {
      name: F.heading,
      size: S.body,
      bold: true,
      color: { argb: C.text },
    }
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' }
    this.ws.getRow(this.row).height = 16
    this.row += 1

    // Fórmula en caja monoespaciada.
    this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
    const formulaCell = this.ws.getCell(this.row, 1)
    formulaCell.value = step.formula
    formulaCell.font = { name: F.mono, size: S.small, color: { argb: C.text } }
    formulaCell.alignment = {
      horizontal: 'left',
      vertical: 'middle',
      wrapText: true,
    }
    formulaCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: C.fillFormula },
    }
    for (let c = 1; c <= XLSX.cols; c++) {
      this.ws.getCell(this.row, c).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: C.fillFormula },
      }
    }
    this.ws.getRow(this.row).height = estimateHeight(step.formula, 85, 15) + 4
    this.row += 1

    // Leyendas (término = valor · origen).
    step.legends.forEach((legend) => {
      this.ws.mergeCells(this.row, 1, this.row, XLSX.cols)
      const cell = this.ws.getCell(this.row, 1)
      cell.value = {
        richText: [
          {
            text: `${legend.term} = ${legend.value}`,
            font: {
              name: F.mono,
              size: S.small,
              bold: true,
              color: { argb: C.primaryDeep },
            },
          },
          {
            text: `  —  ${legend.origin}`,
            font: { name: F.body, size: S.small, color: { argb: C.muted } },
          },
        ],
      }
      cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true }
      this.ws.getRow(this.row).height = estimateHeight(
        `${legend.term} = ${legend.value}  —  ${legend.origin}`,
        90,
        13,
      )
      this.row += 1
    })

    if (step.note) {
      this.addBodyText(step.note, { muted: true, italic: true })
    }
    this.spacer(4)
  }

  // — Tabla (booktabs) -------------------------------------------------------

  addTable(columns: ColumnSpec[], rows: CellValue[][]): void {
    const spans = columns.map((c) => c.span ?? 1)
    const sumSpans = spans.reduce((a, b) => a + b, 0)
    // Si la tabla cabe en el ancho de contenido, la última columna se estira
    // para llenarlo; si es más ancha (muchas columnas), se respetan los spans.
    if (sumSpans < XLSX.cols) {
      spans[spans.length - 1] += XLSX.cols - sumSpans
    }
    const starts: number[] = []
    let cursor = 1
    spans.forEach((span, i) => {
      starts[i] = cursor
      cursor += span
    })
    const ends = starts.map((start, i) => start + spans[i] - 1)
    const tableCols = cursor - 1

    // Cabecera
    const headerRow = this.row
    columns.forEach((col, i) => {
      if (ends[i] > starts[i]) {
        this.ws.mergeCells(headerRow, starts[i], headerRow, ends[i])
      }
      const cell = this.ws.getCell(headerRow, starts[i])
      cell.value = col.header
      cell.font = {
        name: F.heading,
        size: S.small,
        bold: true,
        color: { argb: C.muted },
      }
      cell.alignment = {
        horizontal: col.align ?? 'left',
        vertical: 'middle',
      }
    })
    this.ws.getRow(headerRow).height = 18
    this.rule(headerRow, 'top', 'medium', C.rule, tableCols)
    this.rule(headerRow, 'bottom', 'thin', C.rule, tableCols)
    this.row += 1

    // Cuerpo
    rows.forEach((cells, rowIndex) => {
      const r = this.row
      const isLast = rowIndex === rows.length - 1
      columns.forEach((col, i) => {
        if (ends[i] > starts[i]) {
          this.ws.mergeCells(r, starts[i], r, ends[i])
        }
        const cell = this.ws.getCell(r, starts[i])
        const value = cells[i]
        cell.value = value ?? ''
        cell.font = { name: F.body, size: S.body, color: { argb: C.text } }
        cell.alignment = {
          horizontal: col.align ?? 'left',
          vertical: 'middle',
        }
        if (col.numFmt && typeof value === 'number') {
          cell.numFmt = col.numFmt
        }
      })
      this.ws.getRow(r).height = 16
      // Separador fino entre filas; regla gruesa al cerrar la tabla.
      if (isLast) {
        this.rule(r, 'bottom', 'medium', C.rule, tableCols)
      } else {
        this.rule(r, 'bottom', 'thin', C.border, tableCols)
      }
      this.row += 1
    })

    this.spacer(4)
  }

  // — Salida -----------------------------------------------------------------

  async toBlob(): Promise<Blob> {
    const buffer = await this.wb.xlsx.writeBuffer()
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  }

  async save(filename: string): Promise<void> {
    const blob = await this.toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
}
