"use client"

import type { ReactNode } from "react"
import { Toggle as BaseToggle } from "@base-ui/react/toggle"
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Toggle, rebuilt on Base UI (Toggle + ToggleGroup).
// react-aria props map onto Base UI: isSelected -> pressed, defaultSelected ->
// defaultPressed, onChange -> onPressedChange, isDisabled -> disabled; a Toggle's
// `id` inside a group becomes its `value`. Selected state is data-pressed (was
// react-aria's data-selected).
const toggleVariants = cva(
  [
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors outline-none select-none",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "text-gray-11 hover:bg-gray-3 hover:text-gray-12",
    "data-[pressed]:bg-accent-a3 data-[pressed]:text-accent-12",
    "focus-visible:ring-accent-7 focus-visible:ring-2",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-8 min-w-8 px-2",
        md: "h-10 min-w-10 px-2.5",
        lg: "h-12 min-w-12 px-3.5",
      },
      variant: {
        default: "",
        outline: "border-gray-a5 border",
      },
    },
    defaultVariants: { size: "md", variant: "default" },
  }
)

interface ToggleProps extends VariantProps<typeof toggleVariants> {
  children?: ReactNode
  className?: string
  isSelected?: boolean
  defaultSelected?: boolean
  onChange?: (isSelected: boolean) => void
  isDisabled?: boolean
  /** Value when used inside a ToggleGroup (react-aria called this `id`). */
  id?: string
  "aria-label"?: string
}

function Toggle({
  className,
  size,
  variant,
  isSelected,
  defaultSelected,
  onChange,
  isDisabled,
  id,
  ...props
}: ToggleProps) {
  return (
    <BaseToggle
      pressed={isSelected}
      defaultPressed={defaultSelected}
      onPressedChange={onChange}
      disabled={isDisabled}
      value={id}
      className={cn(toggleVariants({ size, variant }), className)}
      {...props}
    />
  )
}

interface ToggleGroupProps {
  children?: ReactNode
  className?: string
  selectionMode?: "single" | "multiple"
  defaultSelectedKeys?: Iterable<string>
  selectedKeys?: Array<string>
  onSelectionChange?: (keys: Array<string>) => void
}

function ToggleGroup({
  children,
  className,
  selectionMode = "single",
  defaultSelectedKeys,
  selectedKeys,
  onSelectionChange,
}: ToggleGroupProps) {
  return (
    <BaseToggleGroup
      multiple={selectionMode === "multiple"}
      defaultValue={
        defaultSelectedKeys ? Array.from(defaultSelectedKeys) : undefined
      }
      value={selectedKeys}
      onValueChange={(v) => onSelectionChange?.(v as Array<string>)}
      className={cn("inline-flex gap-1", className)}
    >
      {children}
    </BaseToggleGroup>
  )
}

export { Toggle, ToggleGroup, toggleVariants }
export type { ToggleProps }
