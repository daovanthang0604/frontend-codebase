"use client"

import type { ReactNode } from "react"
import { Slider as BaseSlider } from "@base-ui/react/slider"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Slider, rebuilt on Base UI (Root/Control/Track/
// Indicator/Thumb/Value — Base UI draws the fill via Indicator, no manual
// positioning). WDS look ported: accent fill on a tan rail with a white knob.
// react-aria prop names (onChange/minValue/maxValue) are aliased.
interface SliderProps {
  value?: number | number[]
  defaultValue?: number | number[]
  onValueChange?: (value: number | number[]) => void
  onChange?: (value: number | number[]) => void
  min?: number
  max?: number
  minValue?: number
  maxValue?: number
  step?: number
  disabled?: boolean
  label?: ReactNode
  showValue?: boolean
  className?: string
}

function Slider({
  className,
  label,
  showValue = true,
  value,
  defaultValue,
  onValueChange,
  onChange,
  min,
  max,
  minValue,
  maxValue,
  step,
  disabled,
}: SliderProps) {
  return (
    <BaseSlider.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ?? onChange}
      min={min ?? minValue}
      max={max ?? maxValue}
      step={step}
      disabled={disabled}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {label != null || showValue ? (
        <div className="flex items-center justify-between">
          {label != null ? (
            <span className="text-gray-12 text-sm font-medium">{label}</span>
          ) : (
            <span />
          )}
          {showValue ? (
            <BaseSlider.Value className="text-gray-11 text-sm tabular-nums" />
          ) : null}
        </div>
      ) : null}
      <BaseSlider.Control className="relative flex h-5 w-full items-center">
        <BaseSlider.Track className="bg-gray-4 relative h-1.5 w-full grow rounded-full">
          <BaseSlider.Indicator className="bg-accent-9 absolute h-full rounded-full" />
          <BaseSlider.Thumb className="border-accent-9 size-4 rounded-full border-2 bg-white shadow-sm outline-none transition-[width,height] data-dragging:size-[18px] data-[focus-visible]:ring-accent-7 data-[focus-visible]:ring-2 data-disabled:cursor-not-allowed data-disabled:opacity-50" />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

export { Slider }
