"use client"

import { cn } from "@workspace/ui/lib/utils"
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components"

const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: AriaSeparatorProps) => (
  <AriaSeparator
    orientation={orientation}
    className={cn(
      "border-gray-6 bg-gray-6",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className
    )}
    {...props}
  />
)
export { Separator }
