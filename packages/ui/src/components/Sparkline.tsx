import { useLayoutEffect, useRef, useState } from "react"

export interface SparklineProps {
  /**
   * Ordered numeric series (oldest → newest). A series with fewer than 2
   * points renders NOTHING (returns null) — an empty or single-point trend is
   * not enough to draw a line, and we never fake a flat baseline.
   */
  data: number[]
  /**
   * SVG coordinate-space width in px. When omitted, the component measures its
   * own rendered width and uses that, so the viewBox maps 1:1 to on-screen
   * pixels — see the docstring below for why that matters. Defaults to 96
   * until the first measurement lands (and stays 96 in non-DOM/test envs).
   */
  width?: number
  /** SVG viewport height in px. Default 28. */
  height?: number
  /** Stroke width in px. Default 1.5. */
  strokeWidth?: number
  /**
   * Accessible label. When omitted the SVG is marked `aria-hidden` (decorative
   * — the numeric value alongside it carries the meaning).
   */
  "aria-label"?: string
  className?: string
  /** Enable hover tooltip showing the value at each data point. */
  tooltip?: boolean
  /** Custom formatter for the tooltip label. Defaults to the raw number. */
  formatTooltip?: (value: number) => string
}

/**
 * Hand-rolled, zero-dependency SVG sparkline. No charting library — just a
 * normalized polyline. The stroke inherits `currentColor`, so wrapping it in a
 * trend-tone class (e.g. `text-grass-11` / `text-red-11`) colours it.
 *
 * Renders nothing for an empty/single-point series (never a fake line).
 * Pass `tooltip` to enable a hover dot + value label.
 *
 * ## Why it measures its own width
 * The card lays this out with `w-full`, so the SVG is rendered far wider than
 * its intrinsic 96px. If the viewBox stayed 96-wide we'd have to stretch it
 * with `preserveAspectRatio="none"`, which scales X (~3×) and Y (1×)
 * unevenly — that turns the hover dot into an oval and makes spike segments
 * look bolder than flat ones. Instead we measure the rendered width and use it
 * as the viewBox width, so user units map 1:1 to on-screen pixels: circles
 * stay round and stroke width is uniform regardless of segment angle. Callers
 * may still pass an explicit `width` (tests, fixed-size embeds) to opt out of
 * measurement.
 *
 * See .plan/dashboard-redesign/01-spec.md §Slice 3.
 */
export function Sparkline({
  data,
  width: widthProp,
  height = 28,
  strokeWidth = 1.5,
  "aria-label": ariaLabel,
  className,
  tooltip = false,
  formatTooltip,
}: SparklineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null)

  // When no explicit width is given, track the element's real rendered width so
  // the viewBox matches it 1:1 (no non-uniform scaling — see docstring). Guards
  // for non-DOM/test envs where ResizeObserver is absent; falls back to 96.
  useLayoutEffect(() => {
    if (widthProp != null) return
    const el = svgRef.current
    if (el == null || typeof ResizeObserver === "undefined") return
    const update = () => {
      const w = el.getBoundingClientRect().width
      setMeasuredWidth(w > 0 ? w : null)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [widthProp])

  const width = widthProp ?? measuredWidth ?? 96

  // Fewer than 2 points, or any non-finite value (NaN/Infinity from a missing
  // data point), is not a drawable trend — render nothing rather than emit a
  // broken/fabricated polyline.
  if (data.length < 2 || !data.every(Number.isFinite)) {
    return null
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  // Flat series (max === min) collapses to a centred horizontal line rather
  // than dividing by zero.
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const coords = data.map((value, index) => ({
    x: index * stepX,
    y: height - ((value - min) / range) * height,
    value,
  }))

  const points = coords
    .map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ")

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    // Scale mouse X from rendered pixels back into SVG user units
    const mouseX = ((e.clientX - rect.left) / rect.width) * width
    let nearest = 0
    let minDist = Infinity
    for (let i = 0; i < coords.length; i++) {
      const coord = coords[i]
      if (coord == null) continue
      const dist = Math.abs(coord.x - mouseX)
      if (dist < minDist) {
        minDist = dist
        nearest = i
      }
    }
    setHoveredIndex(nearest)
  }

  const hoveredPoint = hoveredIndex != null ? coords[hoveredIndex] : null

  const svg = (
    <svg
      ref={svgRef}
      width={widthProp ?? "100%"}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={className}
      onMouseMove={tooltip ? handleMouseMove : undefined}
      onMouseLeave={tooltip ? () => setHoveredIndex(null) : undefined}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {tooltip && hoveredPoint != null ? (
        <circle
          cx={hoveredPoint.x}
          cy={hoveredPoint.y}
          r={3}
          fill="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
    </svg>
  )

  if (!tooltip) return svg

  const tooltipLabel =
    hoveredPoint != null
      ? formatTooltip
        ? formatTooltip(hoveredPoint.value)
        : String(hoveredPoint.value)
      : null

  // left% positions the tooltip centre above the hovered dot
  const leftPct = hoveredPoint != null ? (hoveredPoint.x / width) * 100 : 0

  return (
    <div className="relative">
      {svg}
      {hoveredPoint != null ? (
        <div
          className="bg-gray-12 text-gray-1 pointer-events-none absolute -top-7 -translate-x-1/2 rounded px-1.5 py-0.5 text-xs whitespace-nowrap"
          style={{ left: `${leftPct}%` }}
        >
          {tooltipLabel}
        </div>
      ) : null}
    </div>
  )
}
