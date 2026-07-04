"use client"

import type { ReactNode } from "react"
import { Progress as BaseProgress } from "@base-ui/react/progress"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Progress, rebuilt on Base UI (Root/Track/Indicator/
// Value/Label). Slim determinate bar; pass value=null for an indeterminate pulse.
// Fill uses accent-solid (navy) to match the other controls (Slider/Switch/…),
// not ui's blue accent-9.

interface ProgressProps {
  value?: number | null
  label?: ReactNode
  showValue?: boolean
  className?: string
  barClassName?: string
}

function Progress({
  value,
  label,
  showValue = false,
  className,
  barClassName,
}: ProgressProps) {
  return (
    <BaseProgress.Root
      value={value ?? null}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {(label != null || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label != null ? (
            <BaseProgress.Label className="text-gray-12 font-medium">
              {label}
            </BaseProgress.Label>
          ) : (
            <span />
          )}
          {showValue && (
            <BaseProgress.Value className="text-gray-11 tabular-nums" />
          )}
        </div>
      )}
      <BaseProgress.Track className="bg-gray-4 h-2 w-full overflow-hidden rounded-full">
        <BaseProgress.Indicator
          className={cn(
            "bg-accent-solid h-full rounded-full transition-all duration-300 ease-out",
            "data-[indeterminate]:w-2/5 data-[indeterminate]:animate-pulse",
            barClassName
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

export { Progress }
export type { ProgressProps }
