import type { ExerciseDef } from '@/data/exercises'
import { exerciseKindLabel } from '@/data/exercises'

export const SITE = {
  name: 'Estadística descriptiva — Trabajo social',
  shortName: 'Estadística TS',
  locale: 'es_EC',
  themeColor: '#b4532a',
  description:
    'Ejercicios de estadística descriptiva para trabajo social: tablas de frecuencias, datos agrupados y medidas de tendencia central, con resolución paso a paso, fórmulas y tablas.',
  keywords: [
    'estadística descriptiva',
    'trabajo social',
    'tabla de frecuencias',
    'datos agrupados',
    'media mediana moda',
    'tendencia central',
    'ejercicios resueltos',
  ],
  author: 'Estadística descriptiva',
  ogImagePath: '/og-image.svg',
  twitterHandle: '',
} as const

export type PageMeta = {
  title?: string
  description?: string
  path?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

function siteBaseUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL
  if (typeof raw !== 'string' || !raw.trim()) return ''
  return raw.trim().replace(/\/$/, '')
}

export function absoluteSiteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const base = siteBaseUrl()
  if (!base) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${normalized}`
    }
    return normalized
  }
  return `${base}${normalized}`
}

function upsertMeta(
  selector: string,
  create: () => HTMLMetaElement,
  content: string,
): void {
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string): void {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function applyPageMeta(meta: PageMeta = {}): void {
  const title = meta.title
    ? `${meta.title} · ${SITE.shortName}`
    : SITE.name
  const description = meta.description ?? SITE.description
  const path = meta.path ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
  const url = absoluteSiteUrl(path)
  const image = absoluteSiteUrl(SITE.ogImagePath)
  const type = meta.type ?? 'website'
  const robots = meta.noIndex ? 'noindex, nofollow' : 'index, follow'

  document.title = title
  document.documentElement.lang = 'es'

  upsertMeta(
    'meta[name="description"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'description'
      return m
    },
    description,
  )
  upsertMeta(
    'meta[name="keywords"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'keywords'
      return m
    },
    SITE.keywords.join(', '),
  )
  upsertMeta(
    'meta[name="author"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'author'
      return m
    },
    SITE.author,
  )
  upsertMeta(
    'meta[name="robots"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'robots'
      return m
    },
    robots,
  )
  upsertMeta(
    'meta[name="theme-color"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'theme-color'
      return m
    },
    SITE.themeColor,
  )

  upsertMeta(
    'meta[property="og:site_name"]',
    () => {
      const m = document.createElement('meta')
      m.setAttribute('property', 'og:site_name')
      return m
    },
    SITE.name,
  )
  upsertMeta(
    'meta[property="og:title"]',
    () => {
      const m = document.createElement('meta')
      m.setAttribute('property', 'og:title')
      return m
    },
    title,
  )
  upsertMeta(
    'meta[property="og:description"]',
    () => {
      const m = document.createElement('meta')
      m.setAttribute('property', 'og:description')
      return m
    },
    description,
  )
  upsertMeta(
    'meta[property="og:type"]',
    () => {
      const m = document.createElement('meta')
      m.setAttribute('property', 'og:type')
      return m
    },
    type,
  )
  upsertMeta(
    'meta[property="og:url"]',
    () => {
      const m = document.createElement('meta')
      m.setAttribute('property', 'og:url')
      return m
    },
    url,
  )
  upsertMeta(
    'meta[property="og:image"]',
    () => {
      const m = document.createElement('meta')
      m.setAttribute('property', 'og:image')
      return m
    },
    image,
  )
  upsertMeta(
    'meta[property="og:locale"]',
    () => {
      const m = document.createElement('meta')
      m.setAttribute('property', 'og:locale')
      return m
    },
    SITE.locale,
  )

  upsertMeta(
    'meta[name="twitter:card"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'twitter:card'
      return m
    },
    'summary_large_image',
  )
  upsertMeta(
    'meta[name="twitter:title"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'twitter:title'
      return m
    },
    title,
  )
  upsertMeta(
    'meta[name="twitter:description"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'twitter:description'
      return m
    },
    description,
  )
  upsertMeta(
    'meta[name="twitter:image"]',
    () => {
      const m = document.createElement('meta')
      m.name = 'twitter:image'
      return m
    },
    image,
  )

  upsertLink('canonical', url)
}

export function exercisePageMeta(exercise: ExerciseDef): PageMeta {
  const kind = exerciseKindLabel(exercise)
  const context =
    'context' in exercise && exercise.context
      ? ` ${exercise.context}`
      : ''
  return {
    title: `Ejercicio ${exercise.exerciseLabel} — ${exercise.title}`,
    description: `${kind}: ${exercise.title}.${context} Resolución paso a paso con fórmulas, leyendas y tablas. Descarga el PDF del ejercicio.`,
    type: 'article',
  }
}

export const HOME_PAGE_META: PageMeta = {
  title: 'Índice de ejercicios',
  description: SITE.description,
  type: 'website',
}

export const NOT_FOUND_PAGE_META: PageMeta = {
  title: 'Página no encontrada',
  description:
    'La página solicitada no existe. Vuelve al índice de ejercicios de estadística descriptiva para trabajo social.',
  noIndex: true,
}
