"use client"

import "@workspace/liquid-ui/lib/glass"

import type { ComponentProps } from "react"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/base-ui's Kbd (same single <kbd> export). The cap is a
// light glass surface instead of a flat solid fill: a legible translucent plate
// (--glass-overlay-bg) + a hairline rim (--glass-rim) + a 1px inset top highlight
// (--glass-edge-hi), like light catching the top of a frosted key. No
// backdrop-filter -- a blurred panel is overkill (and costly once several are
// strung together, e.g. a shortcuts table) for a glyph-sized chip; see the p3
// taste guardrail. String several together for a shortcut, e.g.
// <Kbd>⌘</Kbd><Kbd>K</Kbd>.
function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "text-gray-11 inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded border [border-color:var(--glass-rim)] bg-[var(--glass-overlay-bg)] px-1.5 font-mono text-[11px] font-medium shadow-[inset_0_1px_0_0_var(--glass-edge-hi)]",
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
