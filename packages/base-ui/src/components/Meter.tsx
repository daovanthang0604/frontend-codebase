"use client"

import type { ReactNode } from "react"
import { Meter as BaseMeter } from "@base-ui/react/meter"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Meter, rebuilt on Base UI (Root/Track/Indicator/
// Value/Label). A static level within a range; the fill tints green -> amber ->
// red as it fills (set colorByLevel={false} for a plain accent fill).

interface MeterProps {
  value: number
  min?: number
  max?: number
  label?: ReactNode
  showValue?: boolean
  colorByLevel?: boolean
  className?: string
  barClassName?: string
}

function Meter({
  value,
  min = 0,
  max = 100,
  label,
  showValue = true,
  colorByLevel = true,
  className,
  barClassName,
}: MeterProps) {
  const pct = ((value - min) / (max - min)) * 100
  const fill = !colorByLevel
    ? "bg-accent-9"
    : pct >= 85
      ? "bg-error-9"
      : pct >= 60
        ? "bg-warning-9"
        : "bg-success-9"
  return (
    <BaseMeter.Root
      value={value}
      min={min}
      max={max}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {(label != null || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label != null ? (
            <BaseMeter.Label className="text-gray-12 font-medium">
              {label}
            </BaseMeter.Label>
          ) : (
            <span />
          )}
          {showValue && <BaseMeter.Value className="text-gray-11 tabular-nums" />}
        </div>
      )}
      <BaseMeter.Track className="bg-gray-4 h-2 w-full overflow-hidden rounded-full">
        <BaseMeter.Indicator
          className={cn(
            "h-full rounded-full transition-[width] duration-300 ease-out",
            fill,
            barClassName
          )}
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  )
}

export { Meter }
export type { MeterProps }
