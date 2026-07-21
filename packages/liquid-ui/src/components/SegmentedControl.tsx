"use client"

import "@workspace/liquid-ui/lib/glass"

import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { Toggle as BaseToggle } from "@base-ui/react/toggle"
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/liquid-ui/SegmentedControl -- same Base UI ToggleGroup
// (single-select "pick one" pill switcher): same options/value/onChange API,
// roving focus + arrow-key nav, and the active segment still can't deselect
// itself. The base-ui version highlights the active segment by painting ITS
// OWN background (data-[pressed]:bg-panel); here a single absolutely-
// positioned thumb slides + resizes under whichever segment is active, so the
// selection can carry the liquid-glass look: a bright, near-opaque
// glass-overlay fill (see lib/glass) that pops off a subtly frosted rail. The
// thumb's rect is measured off the active button's real layout box (not
// guessed from equal-width columns), since real segment labels -- "Round
// trip" vs "One way" vs "Multi-city" -- are not equal width.

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
  const trackRef = useRef<HTMLDivElement>(null)
  const segmentRefs = useRef(new Map<string, HTMLButtonElement>())
  const [thumbRect, setThumbRect] = useState({ x: 0, width: 0 })

  useLayoutEffect(() => {
    const track = trackRef.current
    const active = segmentRefs.current.get(value)
    if (!track || !active) return

    const measure = () =>
      setThumbRect({ x: active.offsetLeft, width: active.offsetWidth })
    measure()

    // Re-measure on layout changes -- e.g. a viewport resize reflowing the
    // track, or an i18n label swap changing the active segment's width.
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [value, options])

  return (
    <BaseToggleGroup
      ref={trackRef}
      value={[value]}
      onValueChange={(v) => {
        // Base UI emits [] when the active segment is re-clicked; a segmented
        // control always keeps one selected, so ignore the empty selection.
        const next = v[0]
        if (next != null) onChange(next as T)
      }}
      className={cn(
        "relative inline-flex gap-1 rounded-full border p-1",
        className
      )}
      style={{
        // Frosted rail: light --glass-* fill + rim, no popover-strength drop
        // shadow -- this sits flush on the page, it doesn't float above it.
        borderColor: "var(--glass-rim)",
        backgroundImage:
          "linear-gradient(180deg, var(--glass-fill-top), var(--glass-fill-bot))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(180%)",
        backdropFilter: "blur(var(--glass-blur)) saturate(180%)",
      }}
    >
      {/* Raised pill chip, concentric with the pill rail (inset by its p-1) —
          NOT .glass-overlay: the popover recipe reads as a dark plate with a
          floating-surface shadow in dark mode. iOS-style platter instead: a
          light chip in both modes, inset top highlight, tight contact shadow. */}
      <div
        aria-hidden
        className={cn(
          "ease-spring pointer-events-none absolute inset-y-1 left-0 z-0 rounded-full border backdrop-blur-sm transition-[transform,width] duration-[var(--dur-fast)]",
          "border-white/60 bg-white/80 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.6),0_2px_6px_-2px_var(--glass-contact)]",
          "dark:border-white/20 dark:bg-white/15 dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_2px_6px_-2px_var(--glass-contact)]"
        )}
        style={{
          width: thumbRect.width,
          transform: `translateX(${thumbRect.x}px)`,
        }}
      />
      {options.map((opt) => (
        <BaseToggle
          key={opt.value}
          value={opt.value}
          ref={(el) => {
            if (el) segmentRefs.current.set(opt.value, el)
            else segmentRefs.current.delete(opt.value)
          }}
          className={cn(
            "relative z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-[color,transform] outline-none select-none [&>svg]:size-4",
            "text-gray-11 hover:text-gray-12",
            "data-[pressed]:text-accent-12 data-[pressed]:font-bold",
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
