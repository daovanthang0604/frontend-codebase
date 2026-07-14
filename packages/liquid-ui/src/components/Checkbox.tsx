"use client"

import type { ReactNode } from "react"
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/liquid-ui/Checkbox, rebuilt on Base UI (Root + Indicator, per
// 9ui — the icon is chosen from the `indeterminate` prop). react-aria props
// (isSelected/isIndeterminate/onChange/isDisabled) are mapped onto Base UI's
// checked/indeterminate/onCheckedChange/disabled, and the WDS square classes are
// ported verbatim (react-aria data-selected -> Base UI data-checked).
interface CheckboxProps {
  isSelected?: boolean
  defaultSelected?: boolean
  isIndeterminate?: boolean
  onChange?: (isSelected: boolean) => void
  isDisabled?: boolean
  className?: string
  children?: ReactNode
  "aria-label"?: string
}

function Checkbox({
  isSelected,
  defaultSelected,
  isIndeterminate,
  onChange,
  isDisabled,
  className,
  children,
  ...props
}: CheckboxProps) {
  const box = (
    <BaseCheckbox.Root
      checked={isSelected}
      defaultChecked={defaultSelected}
      indeterminate={isIndeterminate}
      onCheckedChange={onChange}
      disabled={isDisabled}
      className={cn(
        // WDS: 20px square on white paper, hairline border; accent fill + white
        // check/minus when selected.
        "bg-panel text-accent-contrast ring-offset-gray-1 border-gray-a7 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border outline-none transition-all duration-150",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        "data-checked:bg-accent-solid data-checked:border-accent-solid data-indeterminate:bg-accent-solid data-indeterminate:border-accent-solid",
        "hover:border-gray-8",
        "data-disabled:cursor-not-allowed data-disabled:opacity-80",
        "active:scale-[0.95]",
        className
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex items-center justify-center data-unchecked:hidden">
        {isIndeterminate ? (
          <Minus className="animate-in zoom-in-60 fade-in size-4" />
        ) : (
          <Check className="animate-in zoom-in-60 fade-in size-4" />
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
  if (children == null) return box
  return (
    <label className="flex cursor-pointer items-center gap-x-2 text-sm">
      {box}
      {children}
    </label>
  )
}

export { Checkbox }
