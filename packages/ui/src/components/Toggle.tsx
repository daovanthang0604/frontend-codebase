"use client"

import { cn } from "@workspace/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components"

// WDS Toggle — a two-state button. Off is a quiet ghost; on tints to accent-soft
// with inked accent text. Group several with <ToggleGroup> (single or multiple
// selection via its `selectionMode`).
const toggleVariants = cva(
  [
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors outline-none select-none",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "text-gray-11 hover:bg-gray-3 hover:text-gray-12",
    "data-selected:bg-accent-a3 data-selected:text-accent-12",
    "data-[focus-visible]:ring-accent-7 data-[focus-visible]:ring-2",
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

interface ToggleProps
  extends AriaToggleButtonProps,
    VariantProps<typeof toggleVariants> {}

function Toggle({ className, size, variant, ...props }: ToggleProps) {
  return (
    <AriaToggleButton
      className={composeRenderProps(className, (className) =>
        cn(toggleVariants({ size, variant }), className)
      )}
      {...props}
    />
  )
}

function ToggleGroup({ className, ...props }: AriaToggleButtonGroupProps) {
  return (
    <AriaToggleButtonGroup
      className={composeRenderProps(className, (className) =>
        cn("inline-flex gap-1", className)
      )}
      {...props}
    />
  )
}

export { Toggle, ToggleGroup, toggleVariants }
export type { ToggleProps }
