"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  ProgressBar as AriaProgressBar,
  composeRenderProps,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components"

export interface ProgressProps extends AriaProgressBarProps {
  /** Optional label shown above the bar. */
  label?: ReactNode
  /** Show the value text (e.g. "40%") opposite the label. */
  showValue?: boolean
  /** Class applied to the filled portion of the bar. */
  barClassName?: string
}

// WDS Progress — a slim determinate bar (accent fill on a tan track). Omit
// `value` for an indeterminate pulse.
function Progress({
  className,
  label,
  showValue = false,
  barClassName,
  ...props
}: ProgressProps) {
  return (
    <AriaProgressBar
      className={composeRenderProps(className, (className) =>
        cn("flex w-full flex-col gap-2", className)
      )}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {(label != null || showValue) && (
            <div className="flex items-center justify-between text-sm">
              {label != null ? (
                <span className="text-gray-12 font-medium">{label}</span>
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
                "bg-accent-9 h-full rounded-full",
                isIndeterminate
                  ? "w-2/5 animate-pulse"
                  : "transition-[width] duration-300 ease-out",
                barClassName
              )}
              style={
                isIndeterminate ? undefined : { width: `${percentage ?? 0}%` }
              }
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  )
}

export { Progress }
