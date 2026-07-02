import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

export type StatCardColor = "accent" | "blue" | "grass" | "amber"

export interface StatCardProps {
  /** Metric label, e.g. "Total stories". Rendered as a quiet uppercase caption. */
  label: string
  /** Primary value — already formatted by the caller. */
  value: ReactNode
  /** Optional icon chip rendered above the value; tinted by `color`. */
  icon?: ReactNode
  /** Optional small sub-label under the metric label. */
  sublabel?: ReactNode
  /** Trend-delta slot — hosts a Sparkline or delta label. */
  trend?: ReactNode
  /** Tints the icon (calm accent cue). The figure stays ink for a quiet read. */
  color?: StatCardColor
  /** When true, the value is replaced by a pulse placeholder. */
  isLoading?: boolean
  className?: string
}

/**
 * WDS StatTile — a standout number in a calm tan well. Re-skinned from the
 * previous "premium analytics" card (gradient wash + corner glow) to match the
 * design system's "bookshop warmth, not techy glass" principle: a flat sunk
 * surface (--gray-2), no glow, with the figure carrying the weight in Space
 * Grotesk tabular lining numerals. The optional `trend` slot hosts a Sparkline
 * or delta label. Presentational — callers resolve value/label/i18n.
 *
 * Reference: packages/ui/design-system/components/core/StatTile.jsx.
 */
export function StatCard({
  label,
  value,
  icon,
  sublabel,
  trend,
  color = "accent",
  isLoading = false,
  className,
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "bg-gray-2 flex flex-col gap-1.5 rounded-lg p-4",
        className
      )}
    >
      {icon != null ? (
        <div
          className="mb-1 [&>svg]:size-5"
          style={{ color: `var(--${color}-11)` }}
        >
          {icon}
        </div>
      ) : null}

      {isLoading ? (
        // h-8 matches the 26px figure line-box, so swapping the placeholder for
        // the resolved value causes no vertical reflow.
        <div className="bg-gray-a4 h-8 w-1/2 animate-pulse rounded-md" />
      ) : (
        <p className="text-gray-12 font-num text-[26px] leading-none font-bold tracking-tight tabular-nums">
          {value}
        </p>
      )}

      <p className="text-gray-9 text-[11px] font-semibold tracking-[0.04em] uppercase">
        {label}
      </p>
      {sublabel != null ? (
        <p className="text-gray-10 text-xs">{sublabel}</p>
      ) : null}
      {trend != null ? <div className="mt-1">{trend}</div> : null}
    </div>
  )
}
