"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

// WDS SegmentedControl - a "pick one" switcher rendered as pills on a tan track
// (the DS "Tabs": e.g. In the Tribune / Social Campaign / Summary). The selected
// segment lifts to a white pill with accent-ink text + a soft warm shadow; the
// rest stay quiet muted labels on the track.
// (packages/ui/design-system/components/navigation/Tabs)

interface SegmentedControlOption<T extends string> {
  value: T
  label: React.ReactNode
  /** Optional leading icon (e.g. a Lucide glyph), sized to the label. */
  icon?: React.ReactNode
}

interface SegmentedControlProps<T extends string>
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  options: Array<SegmentedControlOption<T>>
  /** The selected segment value (controlled). */
  value: T
  onChange: (value: T) => void
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      data-slot="segmented-control"
      className={cn(
        "border-gray-a5 bg-gray-2 inline-flex gap-1 rounded-md border p-1",
        className
      )}
      {...props}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-[13px] whitespace-nowrap transition-[color,background-color,box-shadow,transform] motion-safe:active:transform-[translateY(1px)] [&>svg]:size-4",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              selected
                ? "bg-panel text-accent-12 font-bold shadow-sm"
                : "text-gray-11 hover:text-gray-12 font-semibold"
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export { SegmentedControl }
export type { SegmentedControlProps, SegmentedControlOption }
