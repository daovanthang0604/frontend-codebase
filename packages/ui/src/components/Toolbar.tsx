"use client"

import { cn } from "@workspace/ui/lib/utils"
import {
  Separator as AriaSeparator,
  Toolbar as AriaToolbar,
  composeRenderProps,
  type SeparatorProps as AriaSeparatorProps,
  type ToolbarProps as AriaToolbarProps,
} from "react-aria-components"

// WDS Toolbar — a group of controls with roving arrow-key focus (a tan-bordered
// tray). Drop Buttons/Toggles inside; divide groups with <ToolbarSeparator />.
function Toolbar({ className, ...props }: AriaToolbarProps) {
  return (
    <AriaToolbar
      className={composeRenderProps(className, (className) =>
        cn(
          "border-gray-a5 bg-panel flex items-center gap-1 rounded-md border p-1 data-[orientation=vertical]:flex-col",
          className
        )
      )}
      {...props}
    />
  )
}

function ToolbarSeparator({ className, ...props }: AriaSeparatorProps) {
  return (
    <AriaSeparator
      orientation="vertical"
      className={cn("bg-gray-a5 mx-1 h-5 w-px shrink-0 self-center", className)}
      {...props}
    />
  )
}

export { Toolbar, ToolbarSeparator }
