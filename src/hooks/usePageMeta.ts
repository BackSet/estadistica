import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyPageMeta, type PageMeta } from '@/lib/siteMeta'

/**
 * Actualiza título, descripción, Open Graph y Twitter Card según la ruta.
 */
export function usePageMeta(meta: PageMeta): void {
  const { pathname } = useLocation()

  useEffect(() => {
    applyPageMeta({ ...meta, path: meta.path ?? pathname })
  }, [pathname, meta.title, meta.description, meta.type, meta.noIndex, meta.path])
}
