"use client"

import * as React from "react"
import { Legend, ResponsiveContainer, Tooltip } from "recharts"
import type { LegendPayload, TooltipPayload } from "recharts"

import { cn } from "@workspace/base-ui/lib/utils"

// shadcn-style recharts wrappers themed to WDS. recharts ships opinionated blue
// series + #ccc grey chrome; these wrappers (a) let a consumer name/colour each
// series via a `config` map, (b) expose those colours to recharts as
// `--color-<key>` CSS vars so `<Area stroke="var(--color-desktop)" />` works,
// and (c) re-skin recharts' built-in axis/grid/tooltip chrome to theme tokens.
// Everything is CSS-var driven (no hex) so light and dark both track the theme.

/**
 * Per-series display config, keyed by the recharts `dataKey`. `color` is any CSS
 * colour (a token like `var(--accent-9)` is preferred); when omitted a series
 * falls back to the categorical palette by config order.
 */
type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
    icon?: React.ComponentType
  }
>

// WDS categorical palette — applied by config order when a series omits `color`.
// Token refs (not hex) so both themes track the accent/semantic ramps.
const CHART_PALETTE = [
  "var(--accent-9)",
  "var(--grass-9)",
  "var(--amber-9)",
  "var(--blue-9)",
  "var(--red-9)",
] as const

const ChartContext = React.createContext<ChartConfig | null>(null)

function useChartConfig(): ChartConfig {
  return React.useContext(ChartContext) ?? {}
}

interface ChartContainerProps {
  config: ChartConfig
  /** A single recharts chart element (e.g. `<AreaChart>…</AreaChart>`). */
  children: React.ReactElement
  className?: string
}

function ChartContainer({ config, children, className }: ChartContainerProps) {
  // Map config → `--color-<key>` custom properties, resolving the palette
  // fallback here so series can reference `var(--color-<key>)` uniformly.
  // CSSProperties has no custom-property index signature (@types/react), so the
  // record is asserted at the boundary — the documented pattern for CSS vars.
  const colorVars = React.useMemo(() => {
    const vars: Record<string, string> = {}
    Object.entries(config).forEach(([key, item], index) => {
      vars[`--color-${key}`] =
        item.color ??
        CHART_PALETTE[index % CHART_PALETTE.length] ??
        CHART_PALETTE[0]
    })
    return vars as unknown as React.CSSProperties
  }, [config])

  return (
    <ChartContext.Provider value={config}>
      <div
        data-slot="chart"
        style={colorVars}
        className={cn(
          "aspect-video w-full text-xs",
          // Re-skin recharts' default chrome to WDS tokens (muted ticks, hairline
          // grid/axis, calm tooltip cursor) and drop its focus outlines.
          "[&_.recharts-cartesian-axis-tick_text]:fill-gray-11",
          "[&_.recharts-cartesian-axis-line]:stroke-gray-a5",
          "[&_.recharts-cartesian-axis-tick-line]:stroke-gray-a5",
          "[&_.recharts-cartesian-grid_line]:stroke-gray-a5",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-gray-a5",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-gray-a5",
          "[&_.recharts-reference-line-line]:stroke-gray-a5",
          "[&_.recharts-radial-bar-background-sector]:fill-gray-a5",
          "[&_.recharts-layer]:outline-none",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-surface]:outline-none",
          className
        )}
      >
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// recharts positions the tooltip/legend; these re-exports just carry our custom
// content component through the `content` prop.
const ChartTooltip = Tooltip
const ChartLegend = Legend

interface ChartTooltipContentProps {
  // recharts clones the content element and injects these at render time.
  active?: boolean
  payload?: TooltipPayload
  label?: string | number
  className?: string
}

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: ChartTooltipContentProps) {
  const config = useChartConfig()

  if (!active || !payload?.length) return null

  return (
    <div
      className={cn(
        "bg-panel rounded-lg border px-2.5 py-1.5 text-xs shadow-lg",
        className
      )}
    >
      {label !== undefined && label !== "" ? (
        <div className="text-gray-12 mb-1 font-medium">{label}</div>
      ) : null}
      <div className="grid gap-1">
        {payload.map((entry, index) => {
          const configKey = String(entry.dataKey ?? entry.name ?? index)
          const item = config[configKey]
          // Prefer the injected `--color-<key>` var; fall back to the series'
          // own paint so an unconfigured entry still shows a swatch.
          const color = item
            ? `var(--color-${configKey})`
            : (entry.color ?? entry.fill ?? entry.stroke)
          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-11">
                  {item?.label ?? entry.name ?? configKey}
                </span>
              </div>
              <span className="text-gray-12 font-medium tabular-nums">
                {entry.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ChartLegendContentProps {
  // recharts injects `payload` when cloning the content element.
  payload?: ReadonlyArray<LegendPayload>
  className?: string
}

function ChartLegendContent({ payload, className }: ChartLegendContentProps) {
  const config = useChartConfig()

  if (!payload?.length) return null

  return (
    <div className={cn("flex justify-center gap-4", className)}>
      {payload.map((entry, index) => {
        const configKey = String(entry.dataKey ?? entry.value ?? index)
        const item = config[configKey]
        const Icon = item?.icon
        const color = item ? `var(--color-${configKey})` : entry.color
        return (
          <div
            key={index}
            className="text-gray-11 flex items-center gap-1.5 text-xs"
          >
            {Icon ? (
              <Icon />
            ) : (
              <span
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
            )}
            {item?.label ?? entry.value}
          </div>
        )
      })}
    </div>
  )
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
export type { ChartConfig }
