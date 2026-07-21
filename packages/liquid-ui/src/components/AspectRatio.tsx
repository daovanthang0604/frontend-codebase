"use client"

import type { ComponentProps } from "react"

import { cn } from "@workspace/liquid-ui/lib/utils"

interface AspectRatioProps extends ComponentProps<"div"> {
  /** Width / height, e.g. `16 / 9` (default), `1`, `4 / 3`. */
  ratio?: number
}

// Ported verbatim from @workspace/liquid-ui/AspectRatio. Constrains its content to a
// fixed width:height using the native CSS `aspect-ratio`.
function AspectRatio({
  ratio = 16 / 9,
  className,
  style,
  ...props
}: AspectRatioProps) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  )
}

export { AspectRatio }
export type { AspectRatioProps }
