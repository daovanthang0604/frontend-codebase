import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Minus, TrendingDown, TrendingUp } from "lucide-react"

// WDS Metric - a borderless mini-stat: a label, a standout number (Space Grotesk
// tabular figures), and an optional delta + inline trend line. The un-boxed
// counterpart to StatCard (no tan well, no border) - meant to sit on the page inside
// a Section / MetricRow so a group of figures reads as a calm row, not a wall of
// tiles. (packages/ui/design-system/components/layout/Metric)

type Trend = "up" | "down" | "flat"

const valueSize = {
  sm: "text-[21px]",
  md: "text-[27px]",
  lg: "text-[35px]",
} as const

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus }
const trendText = {
  up: "text-success-11",
  down: "text-error-11",
  flat: "text-gray-10",
} as const
const sparkStroke: Record<Trend, string> = {
  up: "var(--color-success-9)",
  down: "var(--color-error-9)",
  flat: "var(--gray-9)",
}

interface MetricProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The figure - a node so "3.1M", "$182K", 92 all work. */
  value: React.ReactNode
  label: string
  /** Change text, e.g. "+8.45% than last month". */
  delta?: React.ReactNode
  /** Colours the delta + spark and picks a trend icon. */
  trend?: Trend
  /** Series for the inline trend line (>= 2 points). */
  spark?: number[]
  /** Render the figure in the accent colour. */
  emphasis?: boolean
  /** @default "md" */
  size?: keyof typeof valueSize
  /** @default "left" */
  align?: "left" | "center"
}

// Tiny inline sparkline path, kept dependency-free so Metric stands alone.
function buildSparkPath(spark: number[]): string {
  const w = 60
  const h = 22
  const pad = 3
  const min = Math.min(...spark)
  const max = Math.max(...spark)
  const span = max - min || 1
  const stepX = (w - pad * 2) / (spark.length - 1)
  return spark
    .map((d, i) => {
      const x = (pad + i * stepX).toFixed(1)
      const y = (pad + (1 - (d - min) / span) * (h - pad * 2)).toFixed(1)
      return `${i ? "L" : "M"}${x},${y}`
    })
    .join(" ")
}

function Metric({
  className,
  value,
  label,
  delta,
  trend,
  spark,
  emphasis = false,
  size = "md",
  align = "left",
  ...props
}: MetricProps) {
  const TrendIcon = trend ? trendIcon[trend] : null
  const hasSpark = spark != null && spark.length >= 2

  return (
    <div
      data-slot="metric"
      className={cn(
        "flex min-w-0 flex-col gap-1.5",
        align === "center" ? "text-center" : "text-left",
        className
      )}
      {...props}
    >
      <div className="text-gray-9 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase">
        {label}
      </div>
      <div
        className={cn(
          "flex items-end gap-3",
          align === "center" ? "justify-center" : "justify-between"
        )}
      >
        <span
          className={cn(
            "font-num leading-none font-bold tracking-tight tabular-nums",
            valueSize[size],
            emphasis ? "text-accent-12" : "text-gray-12"
          )}
        >
          {value}
        </span>
        {hasSpark ? (
          <svg
            width="60"
            height="22"
            viewBox="0 0 60 22"
            fill="none"
            aria-hidden
            className="shrink-0 overflow-visible"
          >
            <path
              d={buildSparkPath(spark)}
              stroke={trend ? sparkStroke[trend] : "var(--accent-9)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>
      {delta != null ? (
        <div
          className={cn(
            "inline-flex items-center gap-1 font-sans text-[12.5px] font-semibold",
            trend ? trendText[trend] : "text-gray-10"
          )}
        >
          {TrendIcon ? <TrendIcon className="size-3.5" /> : null}
          {delta}
        </div>
      ) : null}
    </div>
  )
}

export { Metric }
export type { MetricProps }
