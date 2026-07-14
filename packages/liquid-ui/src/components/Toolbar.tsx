"use client"

import type { ComponentProps } from "react"
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar"

import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/liquid-ui/Toolbar, rebuilt on Base UI (Toolbar Root/Separator).
// A group of controls with roving arrow-key focus (a tan-bordered tray). Drop
// Buttons/Toggles inside; divide groups with <ToolbarSeparator/>.
function Toolbar({
  className,
  ...props
}: ComponentProps<typeof BaseToolbar.Root>) {
  return (
    <BaseToolbar.Root
      className={cn(
        "border-gray-a5 bg-panel flex items-center gap-1 rounded-md border p-1 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ToolbarSeparator({
  className,
  ...props
}: ComponentProps<typeof BaseToolbar.Separator>) {
  return (
    <BaseToolbar.Separator
      className={cn("bg-gray-a5 mx-1 h-5 w-px shrink-0 self-center", className)}
      {...props}
    />
  )
}

export { Toolbar, ToolbarSeparator }
