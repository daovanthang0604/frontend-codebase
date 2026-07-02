"use client"

import type { ComponentProps } from "react"
import { cn } from "@workspace/ui/lib/utils"

// WDS Kbd — a keyboard key. Renders a <kbd> as a small tan cap with a mono glyph;
// string several together for shortcuts (e.g. <Kbd>⌘</Kbd><Kbd>K</Kbd>).
function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-gray-2 border-gray-a6 text-gray-11 inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded border px-1.5 font-mono text-[11px] font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
