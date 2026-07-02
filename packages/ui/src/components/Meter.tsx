"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Label as AriaLabel,
  Meter as AriaMeter,
  composeRenderProps,
  type MeterProps as AriaMeterProps,
} from "react-aria-components"

export interface MeterProps extends AriaMeterProps {
  label?: ReactNode
  showValue?: boolean
  /** Tint the fill by level: green < 60%, amber 60–85%, red ≥ 85%. Default true. */
  colorByLevel?: boolean
  barClassName?: string
}

// WDS Meter — a static measurement within a range (disk usage, quota, score).
// Unlike Progress (a task in flight), the fill signals a *level*, so it tints
// green → amber → red as it fills. Set `colorByLevel={false}` for a plain accent
// fill.
function Meter({
  className,
  label,
  showValue = true,
  colorByLevel = true,
  barClassName,
  ...props
}: MeterProps) {
  return (
    <AriaMeter
      className={composeRenderProps(className, (className) =>
        cn("flex w-full flex-col gap-2", className)
      )}
      {...props}
    >
      {({ percentage, valueText }) => {
        const fill = !colorByLevel
          ? "bg-accent-9"
          : percentage >= 85
            ? "bg-error-9"
            : percentage >= 60
              ? "bg-warning-9"
              : "bg-success-9"
        return (
          <>
            {(label != null || showValue) && (
              <div className="flex items-center justify-between text-sm">
                {label != null ? (
                  <AriaLabel className="text-gray-12 font-medium">
                    {label}
                  </AriaLabel>
                ) : (
                  <span />
                )}
                {showValue && (
                  <span className="text-gray-11 tabular-nums">{valueText}</span>
                )}
              </div>
            )}
            <div className="bg-gray-4 h-2 w-full overflow-hidden rounded-full">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-300 ease-out",
                  fill,
                  barClassName
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </>
        )
      }}
    </AriaMeter>
  )
}

export { Meter }
