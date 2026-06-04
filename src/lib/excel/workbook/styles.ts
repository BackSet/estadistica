/**
 * Paleta y tipografía del libro de Excel, alineadas con el diseño
 * distill.pub de la aplicación (mismas que el PDF, en formato ARGB).
 */
export const XLSX = {
  /** Columnas de contenido de la "hoja-documento". */
  cols: 8,
  colors: {
    primary: 'FFB4532A',
    primarySoft: 'FFF3E2D5',
    primaryDeep: 'FF78371C',
    text: 'FF1C1A18',
    muted: 'FF6A6764',
    subtle: 'FF969188',
    border: 'FFE0DEDC',
    /** Regla gruesa estilo booktabs (gris oscuro neutro). */
    rule: 'FF4E4A46',
    fillLight: 'FFF9F8F7',
    fillFormula: 'FFF5F4F3',
    white: 'FFFFFFFF',
  },
  font: {
    /** Titulares y UI (sans). */
    heading: 'Arial',
    /** Cuerpo (serif, en línea con Source Serif 4). */
    body: 'Georgia',
    /** Datos y fórmulas (monoespaciada). */
    mono: 'Consolas',
  },
  size: {
    kicker: 8,
    title: 20,
    subtitle: 11,
    h2: 12,
    body: 10,
    small: 9,
    metricValue: 16,
  },
} as const

export const SITE_NAME = 'Estadística descriptiva — Trabajo social'
