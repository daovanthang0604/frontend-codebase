"use client"

import type { ComponentProps } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface AspectRatioProps extends ComponentProps<"div"> {
  /** Width / height, e.g. `16 / 9` (default), `1`, `4 / 3`. */
  ratio?: number
}

// WDS AspectRatio — constrains its content to a fixed width:height using the
// native CSS `aspect-ratio`. Handy for media, thumbnails, maps, and embeds.
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
