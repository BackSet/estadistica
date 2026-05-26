import { cn } from '@/lib/utils'
import type { FrequencyRow } from '@/lib/statistics'

type Props = {
  rows: Pick<FrequencyRow, 'xi' | 'fi'>[]
  barLabelFormatter?: (xi: number) => string
  describedById?: string
}

const VB_W = 560
const VB_H = 220
const PAD = { l: 48, r: 24, t: 20, b: 52 }

function buildYTicks(maxFi: number): number[] {
  if (maxFi <= 0) return [0, 1]
  if (maxFi <= 4) {
    return Array.from({ length: maxFi + 1 }, (_, i) => i)
  }
  const a = Math.round(maxFi / 3)
  const b = Math.round((2 * maxFi) / 3)
  return [...new Set([0, a, b, maxFi])].sort((x, y) => x - y)
}

export function BarChart({ rows, barLabelFormatter, describedById }: Props) {
  const maxFi = Math.max(...rows.map((r) => r.fi), 1)
  const yTicks = buildYTicks(maxFi)
  const yMax = yTicks[yTicks.length - 1] || maxFi

  const innerW = VB_W - PAD.l - PAD.r
  const innerH = VB_H - PAD.t - PAD.b
  const n = rows.length
  const gap = Math.min(14, innerW / (n * 4))
  const barW = (innerW - gap * Math.max(0, n - 1)) / n
  const x0 = PAD.l
  const yBase = PAD.t + innerH

  const scaleY = (fi: number) => (fi / yMax) * innerH

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4',
        'print:break-inside-avoid',
      )}
    >
      <svg
        className="mx-auto block h-auto w-full max-w-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="Gráfico de barras de frecuencias absolutas"
        {...(describedById ? { 'aria-describedby': describedById } : {})}
      >
        {yTicks.map((tick) => {
          const y = yBase - scaleY(tick)
          return (
            <line
              key={`g-${tick}`}
              className="stroke-border"
              strokeDasharray="4 4"
              x1={PAD.l}
              y1={y}
              x2={VB_W - PAD.r}
              y2={y}
            />
          )
        })}

        <line
          className="stroke-foreground/40"
          strokeWidth={1}
          x1={PAD.l}
          y1={yBase}
          x2={VB_W - PAD.r}
          y2={yBase}
        />
        <line
          className="stroke-foreground/40"
          strokeWidth={1}
          x1={PAD.l}
          y1={PAD.t}
          x2={PAD.l}
          y2={yBase}
        />

        {yTicks.map((tick) => {
          const y = yBase - scaleY(tick) + 4
          return (
            <text
              key={`yt-${tick}`}
              className="fill-muted-foreground text-[11px]"
              x={PAD.l - 8}
              y={y}
              textAnchor="end"
            >
              {tick}
            </text>
          )
        })}

        {rows.map((row, i) => {
          const x = x0 + i * (barW + gap)
          const h = scaleY(row.fi)
          const y = yBase - h
          const label = barLabelFormatter
            ? barLabelFormatter(row.xi)
            : String(row.xi)
          const rx = 5

          return (
            <g key={row.xi}>
              <rect
                className="fill-primary"
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, 0)}
                rx={rx}
                ry={rx}
              />
              {row.fi > 0 ? (
                <text
                  className="fill-foreground text-[11px] font-medium"
                  x={x + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                >
                  {row.fi}
                </text>
              ) : null}
              <text
                className="fill-muted-foreground text-[10px]"
                x={x + barW / 2}
                y={VB_H - 18}
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
