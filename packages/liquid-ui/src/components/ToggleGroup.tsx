"use client"

import "@workspace/liquid-ui/lib/glass"

import type { ReactNode } from "react"
import { Toggle as BaseToggle } from "@base-ui/react/toggle"
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group"
import { cn } from "@workspace/liquid-ui/lib/utils"

// A row of toggle buttons on Base UI's ToggleGroup + Toggle -- same primitives
// as @workspace/base-ui/ToggleGroup, imported directly rather than composing a
// local Toggle wrapper: base-ui's own ToggleGroup.tsx doesn't compose its
// Toggle.tsx either, it re-styles the raw <Toggle> inline, so this file
// mirrors that structure. Single-select by default (the group value is an
// array with at most one item); pass `toggleMultiple` for multi-select -- it
// maps to Base UI's `multiple`. Selected state is `data-pressed` and the group
// exposes `data-orientation` so vertical stacks flip to a column.
//
// Glass treatment: the GROUP is a frosted rail (glass-overlay) that holds the
// items, padded so its rounded-lg outer edge reads distinct from each item's
// inner rounded-md. A pressed item brightens with the shared --glass-overlay-bg
// plate instead of base-ui's flat gray-4, so the selected toggle reads as a
// brighter chip sitting on the rail.

interface ToggleGroupProps {
  /** Pressed items, as their `ToggleGroupItem` values (controlled). */
  value?: string[]
  /** Initially pressed items (uncontrolled). */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Allow more than one item pressed at once (Base UI `multiple`). */
  toggleMultiple?: boolean
  orientation?: "horizontal" | "vertical"
  disabled?: boolean
  className?: string
  children?: ReactNode
}

function ToggleGroup({
  value,
  defaultValue,
  onValueChange,
  toggleMultiple,
  orientation,
  disabled,
  className,
  children,
}: ToggleGroupProps) {
  return (
    <BaseToggleGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.(v)}
      multiple={toggleMultiple}
      orientation={orientation}
      disabled={disabled}
      className={cn(
        // Liquid glass surface: glass-overlay swaps in the frosted-glass
        // material (fill + blur + rim + sheen + shadow) in place of no
        // background at all; the rail gets its own radius + padding so the
        // row of items sits inset from the frosted edge.
        "glass-overlay inline-flex gap-1 rounded-lg p-1 data-[orientation=vertical]:flex-col",
        className
      )}
    >
      {children}
    </BaseToggleGroup>
  )
}

interface ToggleGroupItemProps {
  /** Identifies the item within the group (Base UI Toggle `value`). */
  value: string
  children?: ReactNode
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

function ToggleGroupItem({
  value,
  children,
  disabled,
  className,
  ...props
}: ToggleGroupItemProps) {
  return (
    <BaseToggle
      value={value}
      disabled={disabled}
      className={cn(
        "text-gray-11 inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-sm whitespace-nowrap transition-colors outline-none select-none",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        "hover:bg-gray-3 hover:text-gray-12",
        // Brighter, not solid: the pressed item picks up the shared overlay
        // plate (a legible translucent fill) so it lifts off the frosted rail
        // instead of going flat gray.
        "data-[pressed]:text-gray-12 data-[pressed]:bg-[var(--glass-overlay-bg)]",
        "focus-visible:ring-accent-7 focus-visible:ring-2 focus-visible:ring-inset",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </BaseToggle>
  )
}

export { ToggleGroup, ToggleGroupItem }
export type { ToggleGroupProps, ToggleGroupItemProps }
