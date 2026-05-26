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
    text: [28, 25, 23] as const,
    muted: [110, 105, 100] as const,
    subtle: [150, 142, 135] as const,
    border: [222, 215, 209] as const,
    fillLight: [251, 248, 244] as const,
    fillFormula: [244, 240, 235] as const,
    fillCard: [248, 245, 240] as const,
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
