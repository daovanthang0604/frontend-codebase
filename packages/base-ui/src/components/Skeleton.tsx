import type { ComponentProps } from "react"

import { cn } from "@workspace/base-ui/lib/utils"

// WDS Skeleton — a loading placeholder. A soft pulsing block; size it with width/
// height utilities (e.g. <Skeleton className="h-4 w-32" /> or `size-10 rounded-full`).
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-3 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
