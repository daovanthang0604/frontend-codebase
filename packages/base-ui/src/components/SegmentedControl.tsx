"use client"

import type { ReactNode } from "react"
import { Toggle as BaseToggle } from "@base-ui/react/toggle"
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/SegmentedControl, rebuilt on Base UI ToggleGroup
// (single-select) — a "pick one" pill switcher. ui's was hand-rolled native
// buttons; on ToggleGroup we get roving focus + arrow-key nav for free. Same
// options/value/onChange API; clicking the active segment can't deselect it (a
// segmented control always keeps one selected). WDS look ported: tan track,
// selected segment lifts to a white pill with accent ink + soft shadow.

interface SegmentedControlOption<T extends string> {
  value: T
  label: ReactNode
  icon?: ReactNode
}

interface SegmentedControlProps<T extends string> {
  options: Array<SegmentedControlOption<T>>
  value: T
  onChange: (value: T) => void
  className?: string
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <BaseToggleGroup
      value={[value]}
      onValueChange={(v) => {
        // Base UI emits [] when the active segment is re-clicked; a segmented
        // control always keeps one selected, so ignore the empty selection.
        const next = v[0]
        if (next != null) onChange(next as T)
      }}
      className={cn(
        "border-gray-a5 bg-gray-2 inline-flex gap-1 rounded-md border p-1",
        className
      )}
    >
      {options.map((opt) => (
        <BaseToggle
          key={opt.value}
          value={opt.value}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-[color,background-color,box-shadow,transform] outline-none select-none [&>svg]:size-4",
            "text-gray-11 hover:text-gray-12",
            "data-[pressed]:bg-panel data-[pressed]:text-accent-12 data-[pressed]:font-bold data-[pressed]:shadow-sm",
            "focus-visible:ring-ring focus-visible:ring-2",
            "motion-safe:active:translate-y-px"
          )}
        >
          {opt.icon}
          {opt.label}
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  )
}

export { SegmentedControl }
export type { SegmentedControlProps, SegmentedControlOption }
