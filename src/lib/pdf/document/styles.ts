export const PDF = {
  page: {
    margin: 16,
    headerH: 10,
    footerH: 10,
  },
  colors: {
    primary: [180, 83, 42] as const,
    primarySoft: [243, 226, 213] as const,
    primaryDeep: [120, 55, 28] as const,
    text: [28, 26, 24] as const,
    muted: [106, 103, 100] as const,
    subtle: [150, 145, 140] as const,
    border: [224, 222, 220] as const,
    /** Regla gruesa estilo booktabs (gris oscuro neutro). */
    rule: [78, 74, 70] as const,
    fillLight: [249, 248, 247] as const,
    fillFormula: [245, 244, 243] as const,
    fillCard: [247, 246, 245] as const,
    white: [255, 255, 255] as const,
  },
  font: {
    eyebrow: 7.5,
    title: 16,
    h1: 11.5,
    h2: 9.5,
    body: 9,
    small: 8,
    micro: 7,
    formula: 9.5,
    metricValue: 11,
  },
  line: {
    body: 4.2,
    small: 3.4,
    micro: 3,
    formula: 4.3,
    title: 6.5,
  },
  gap: {
    xs: 1.5,
    sm: 3,
    md: 5,
    lg: 8,
  },
} as const

export const SITE_NAME = 'Estadística descriptiva — Trabajo social'
