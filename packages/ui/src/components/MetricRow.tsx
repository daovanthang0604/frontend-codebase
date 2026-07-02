import * as React from "react"

// WDS MetricRow - a row of borderless Metrics separated by whitespace, with optional
// hairline dividers between them. The calm alternative to a row of StatCards: the
// figures sit on the page under a Section header instead of in competing boxes. The
// responsive grid (auto-fit / fixed columns / numeric gap) is genuinely dynamic, so
// it stays inline-styled; the divider uses the warm `--gray-a6` hairline token.
// (packages/ui/design-system/components/layout/MetricRow)
interface MetricRowProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Metric children (or any nodes). */
  children: React.ReactNode
  /** Thin vertical hairlines between items. @default false */
  dividers?: boolean
  /** Fix the column count; omit to flow responsively. */
  columns?: number
  /** Horizontal gap between metrics (px). @default 30 */
  gap?: number
  /** Min column width before wrapping, when `columns` is unset (px). @default 150 */
  minColumn?: number
}

function MetricRow({
  children,
  dividers = false,
  columns,
  gap = 30,
  minColumn = 150,
  style,
  ...props
}: MetricRowProps) {
  const items = React.Children.toArray(children).filter(Boolean)
  const gridTemplateColumns = columns
    ? `repeat(${columns}, minmax(0, 1fr))`
    : `repeat(auto-fit, minmax(${minColumn}px, 1fr))`

  return (
    <div
      data-slot="metric-row"
      style={{
        display: "grid",
        gridTemplateColumns,
        columnGap: gap,
        rowGap: 22,
        alignItems: "start",
        ...style,
      }}
      {...props}
    >
      {items.map((child, i) => (
        <div
          key={i}
          style={
            dividers && i > 0
              ? { paddingLeft: gap, borderLeft: "1px solid var(--gray-a6)" }
              : undefined
          }
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export { MetricRow }
export type { MetricRowProps }
