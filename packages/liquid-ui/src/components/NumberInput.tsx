"use client"

import { NumberField as BaseNumberField } from "@base-ui/react/number-field"
import { Label } from "@workspace/liquid-ui/components/Label"
import { Separator } from "@workspace/liquid-ui/components/Separator"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

// Drop-in for @workspace/liquid-ui/NumberInput, rebuilt on Base UI (NumberField Root/
// Group/Input/Increment/Decrement). react-aria maps over: minValue/maxValue ->
// min/max, formatOptions -> format, onChange -> onValueChange, isDisabled ->
// disabled. The WDS field-group look (bg-panel, hairline border, accent focus
// halo) is ported onto NumberField.Group.

interface NumberInputProps {
  showStepper?: boolean
  placeholder?: string
  label?: string
  withAsterisk?: boolean
  className?: string
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  minValue?: number
  maxValue?: number
  step?: number
  isDisabled?: boolean
  formatOptions?: Intl.NumberFormatOptions
  // Input-level props forwarded to NumberField.Input (react-aria's NumberField
  // accepted these directly; consumers like DataTable's pagination rely on them).
  "aria-label"?: string
  onFocus?: React.FocusEventHandler<HTMLInputElement>
}

function NumberInput({
  className,
  showStepper = false,
  placeholder,
  label,
  withAsterisk,
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  step,
  isDisabled,
  formatOptions,
  onFocus,
  "aria-label": ariaLabel,
}: NumberInputProps) {
  return (
    <BaseNumberField.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onChange?.(v ?? 0)}
      min={minValue}
      max={maxValue}
      step={step}
      disabled={isDisabled}
      format={{ useGrouping: false, ...formatOptions }}
      className={cn("group flex flex-col gap-1", className)}
    >
      {label && <Label withAsterisk={withAsterisk}>{label}</Label>}
      <BaseNumberField.Group
        className={cn(
          // WDS control: white paper, 44px tall, hairline border → accent focus halo.
          "bg-panel border-gray-a7 relative flex h-11 w-full items-center overflow-hidden rounded-md border px-3.5 transition-[box-shadow,border-color] duration-150 md:text-sm",
          "focus-within:border-accent-8 focus-within:ring-ring/30 focus-within:ring-[3px]",
          "data-disabled:opacity-60"
        )}
      >
        <BaseNumberField.Input
          placeholder={placeholder}
          inputMode="numeric"
          aria-label={ariaLabel}
          onFocus={onFocus}
          className="placeholder:text-gray-8 w-fit min-w-0 flex-1 border-transparent bg-transparent pr-2 outline-0"
        />
        {showStepper && (
          <div className="absolute right-0 flex items-center">
            <Separator orientation="vertical" className="h-5" />
            <div className="flex flex-col pr-0.5">
              <BaseNumberField.Increment
                aria-label="Increment"
                className="[&>svg]:text-gray-11 hover:[&>svg]:text-gray-12 flex grow items-center justify-center px-1 transition-transform motion-safe:active:translate-y-px"
              >
                <ChevronUp aria-hidden className="size-4 translate-y-px" />
              </BaseNumberField.Increment>
              <BaseNumberField.Decrement
                aria-label="Decrement"
                className="[&>svg]:text-gray-11 hover:[&>svg]:text-gray-12 flex grow items-center justify-center px-1 transition-transform motion-safe:active:-translate-y-px"
              >
                <ChevronDown aria-hidden className="size-4 -translate-y-px" />
              </BaseNumberField.Decrement>
            </div>
          </div>
        )}
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  )
}

export { NumberInput }
export type { NumberInputProps }
