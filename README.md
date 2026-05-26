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

Al final de cada página, **Exportar esta página** genera un PDF en formato **A4** con márgenes y varias páginas si el contenido es largo. La captura usa tema claro para mejor impresión y excluye la barra de navegación y el pie de exportación.

## Build

```bash
npm run build
npm run preview
```
