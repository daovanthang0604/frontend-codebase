"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Label as AriaLabel,
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
  type SliderProps as AriaSliderProps,
} from "react-aria-components"

export interface SliderProps<T extends number | number[]>
  extends AriaSliderProps<T> {
  label?: ReactNode
  /** Show the current value (respects the slider's `formatOptions`). */
  showValue?: boolean
}

// WDS Slider — accent fill on a tan rail with a white knob. Single value, or a
// range when `value`/`defaultValue` is an array.
function Slider<T extends number | number[]>({
  className,
  label,
  showValue = true,
  ...props
}: SliderProps<T>) {
  return (
    <AriaSlider
      className={composeRenderProps(className, (className) =>
        cn("flex w-full flex-col gap-2", className)
      )}
      {...props}
    >
      {(label != null || showValue) && (
        <div className="flex items-center justify-between">
          {label != null ? (
            <AriaLabel className="text-gray-12 text-sm font-medium">
              {label}
            </AriaLabel>
          ) : (
            <span />
          )}
          {showValue && (
            <AriaSliderOutput className="text-gray-11 text-sm tabular-nums" />
          )}
        </div>
      )}
      <AriaSliderTrack className="relative flex h-5 w-full items-center">
        {({ state }) => {
          const first = state.getThumbPercent(0)
          const last = state.getThumbPercent(state.values.length - 1)
          const multi = state.values.length > 1
          return (
            <>
              <div className="bg-gray-4 h-1.5 w-full rounded-full" />
              <div
                className="bg-accent-9 absolute h-1.5 rounded-full"
                style={{
                  left: `${(multi ? first : 0) * 100}%`,
                  width: `${(multi ? last - first : first) * 100}%`,
                }}
              />
              {state.values.map((_, i) => (
                <AriaSliderThumb
                  key={i}
                  index={i}
                  className={cn(
                    "border-accent-9 size-4 rounded-full border-2 bg-white shadow-sm outline-none",
                    "data-dragging:size-[18px] transition-[width,height]",
                    "data-[focus-visible]:ring-accent-7 data-[focus-visible]:ring-2",
                    "data-disabled:cursor-not-allowed data-disabled:opacity-50"
                  )}
                />
              ))}
            </>
          )
        }}
      </AriaSliderTrack>
    </AriaSlider>
  )
}

export { Slider }
