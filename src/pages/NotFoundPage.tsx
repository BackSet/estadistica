import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AppShell } from '@/components/layout/AppShell'
import { usePageMeta } from '@/hooks/usePageMeta'
import { NOT_FOUND_PAGE_META } from '@/lib/siteMeta'

export function NotFoundPage() {
  usePageMeta(NOT_FOUND_PAGE_META)

  return (
    <AppShell>
      <div className="py-12 text-center">
        <h1 className="font-display mb-2 text-2xl font-semibold">
          Página no encontrada
        </h1>
        <p className="mb-6 text-muted-foreground">
          La ruta solicitada no existe en esta aplicación.
        </p>
        <Button variant="outline" nativeButton={false} render={<Link to="/" />}>
          Ir al inicio
        </Button>
      </div>
    </AppShell>
  )
}
