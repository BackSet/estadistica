# Estadística descriptiva — Trabajo social

Aplicación web con ejercicios resueltos paso a paso: tablas de frecuencias, datos agrupados y medidas de tendencia central. Cada ejercicio tiene su propia URL.

## Stack

- React 19 + TypeScript + Vite
- React Router
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com) (componentes en `src/components/ui`)

## Desarrollo

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Rutas

| Ruta | Contenido |
|------|-----------|
| `/` | Índice de ejercicios |
| `/ejercicio/:id` | Ejercicio individual (p. ej. `/ejercicio/freq-1`) |

## Estructura del código

```
src/
  data/exercises.ts       # Definición de ejercicios y datos
  lib/statistics/         # Cálculos y pasos de resolución (con leyendas)
  components/
    resolution/           # FormulaBlock, ResolutionFlow
    layout/               # AppShell, ExerciseLayout
    ui/                   # Componentes shadcn
  pages/                  # Home, ejercicio, 404
```

La lógica numérica vive en `src/lib/statistics/`; los componentes solo presentan los resultados.

## Tema (claro / oscuro / sistema)

En la cabecera de cada página, el botón de apariencia permite elegir **Claro**, **Oscuro** o **Sistema** (sigue la preferencia del dispositivo). La elección se guarda en el navegador.

## PDF

Al final de cada página, **Exportar esta página** genera un PDF en **A4** con diseño propio (tipografía, tablas y pasos de resolución). El archivo lleva **texto seleccionable** y no es una captura de pantalla. Los gráficos de barras solo están en la versión web; el PDF indica su disponibilidad allí.

## SEO y compartir en redes

- **Favicon** en `public/favicon.svg` (gráfico de barras, color terracota).
- **Vista previa al compartir** (`og:image`, WhatsApp, Telegram): `public/og-image.png` (1200×630; WhatsApp no admite SVG).
- Cada ruta actualiza título, descripción, Open Graph y URL canónica vía `usePageMeta`.
- `public/robots.txt` y `public/sitemap.xml` para buscadores.

Si despliegas en producción, define la URL pública para que las previsualizaciones usen enlaces absolutos:

```bash
# .env (copia desde .env.example)
VITE_SITE_URL=https://tu-dominio.com
```

## Despliegue en Railway (Docker)

El proyecto incluye `Dockerfile`, `railway.toml` y nginx para servir el build estático con rutas SPA.

### Variables en Railway

| Variable | Cuándo | Descripción |
|----------|--------|-------------|
| `PORT` | Runtime | La asigna Railway automáticamente; nginx escucha en ese puerto. |
| `VITE_SITE_URL` | **Build** | URL pública del sitio (p. ej. `https://tu-app.up.railway.app`) para canonical y vista previa al compartir. |

Marca `VITE_SITE_URL` como variable de **build** en el servicio (p. ej. `https://estadistica.bymerge.org`). Sin URL absoluta, WhatsApp muestra la miniatura en blanco.

Tras desplegar, si el enlace ya se compartió antes, refresca la caché en [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (también afecta a WhatsApp).

### CLI

```bash
# Instalar CLI: https://docs.railway.com/guides/cli
railway login
railway init          # o enlaza un proyecto existente
railway up            # build con Docker y deploy
railway domain        # dominio público
```

### Docker local

```bash
docker build -t estadistica-ejercicios .
docker run --rm -p 8080:8080 -e PORT=8080 estadistica-ejercicios
# http://localhost:8080
```

## Build

```bash
npm run build
npm run preview
```
