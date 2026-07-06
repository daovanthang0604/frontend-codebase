"use client"

import type { ComponentProps, ReactNode } from "react"
import { Radio as BaseRadio } from "@base-ui/react/radio"
import { RadioGroup as BaseRadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Circle } from "lucide-react"

import { Label } from "@workspace/base-ui/components/Label"
import { cn } from "@workspace/base-ui/lib/utils"

// Base UI RadioGroup container.
function BaseRadioGroup({
  className,
  ...props
}: ComponentProps<typeof BaseRadioGroupPrimitive>) {
  return (
    <BaseRadioGroupPrimitive
      className={cn("flex flex-col flex-wrap gap-2", className)}
      {...props}
    />
  )
}

// A single radio (ring + accent dot), ported from @workspace/ui/Radio (default
// variant; card variant + tooltip deferred). Wrapped in a label so the text is
// clickable. react-aria `data-selected` -> Base UI `data-checked`.
function Radio({
  value,
  children,
  className,
}: {
  value: string
  children?: ReactNode
  className?: string
}) {
  return (
    <label
      className={cn("flex cursor-pointer items-center gap-x-2 text-sm", className)}
    >
      <BaseRadio.Root
        value={value}
        className={cn(
          // WDS radio: a 20px ring (not a filled disc); ring + inner dot go
          // accent (navy) when selected.
          "bg-panel ring-offset-gray-1 border-gray-a7 flex aspect-square size-5 items-center justify-center rounded-full border-2 outline-none transition-colors",
          "data-checked:border-accent-solid data-checked:text-accent-solid",
          "hover:border-gray-8",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50"
        )}
      >
        <BaseRadio.Indicator>
          <Circle className="animate-in fade-in-0 zoom-in-60 size-2.5 fill-current text-current" />
        </BaseRadio.Indicator>
      </BaseRadio.Root>
      {children}
    </label>
  )
}

interface RadioOption {
  value: string | number
  label: string
}

interface RadioGroupProps<T extends RadioOption> {
  options: Array<T>
  label?: string
  withAsterisk?: boolean
  value?: T
  defaultValue?: T
  onChange?: (value: T | undefined) => void
  className?: string
  renderOption?: (option: T) => ReactNode
}

// Drop-in for @workspace/ui/RadioGroup (default variant). Each option's primitive
// `value` is the Base UI radio value (ui JSON-serialized because react-aria needs
// strings; Base UI takes it directly).
function RadioGroup<T extends RadioOption>({
  options,
  label,
  withAsterisk,
  value,
  defaultValue,
  onChange,
  className,
  renderOption,
}: RadioGroupProps<T>) {
  return (
    <BaseRadioGroup
      value={value ? String(value.value) : undefined}
      defaultValue={defaultValue ? String(defaultValue.value) : undefined}
      onValueChange={(v) =>
        onChange?.(options.find((o) => String(o.value) === v))
      }
    >
      {label ? <Label withAsterisk={withAsterisk}>{label}</Label> : null}
      <div className={cn("grid gap-1.5", className)}>
        {options.map((option) => (
          <Radio key={option.value} value={String(option.value)}>
            {renderOption ? renderOption(option) : option.label}
          </Radio>
        ))}
      </div>
    </BaseRadioGroup>
  )
}

export { BaseRadioGroup, Radio, RadioGroup }
export type { RadioGroupProps, RadioOption }
