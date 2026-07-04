"use client"

import type { ComponentProps } from "react"
import { Separator as BaseSeparator } from "@base-ui/react/separator"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Separator, rebuilt on Base UI. 9ui-style: dimensions
// key off Base UI's `data-orientation` attribute rather than a JS branch. Colour
// (bg-gray-6) is ported verbatim so the hairline looks identical.
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<typeof BaseSeparator>) {
  return (
    <BaseSeparator
      orientation={orientation}
      className={cn(
        "bg-gray-6 shrink-0",
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
