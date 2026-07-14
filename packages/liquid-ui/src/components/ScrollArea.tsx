"use client"

import type { ComponentProps, ReactNode } from "react"
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area"

import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/liquid-ui/ScrollArea, rebuilt on Base UI (Root/Viewport/
// Scrollbar/Thumb/Corner). ui used Radix; the anatomy + overlay-scrollbar look
// line up. Thumb is a translucent gray pill on a hairline gutter.

function ScrollArea({
  className,
  children,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof BaseScrollArea.Root> & {
  orientation?: "vertical" | "horizontal"
  children?: ReactNode
}) {
  return (
    <BaseScrollArea.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <BaseScrollArea.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none"
      >
        {children}
      </BaseScrollArea.Viewport>
      <ScrollBar orientation={orientation} />
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof BaseScrollArea.Scrollbar> & {
  orientation?: "vertical" | "horizontal"
}) {
  return (
    <BaseScrollArea.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "z-10 flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <BaseScrollArea.Thumb
        data-slot="scroll-area-thumb"
        className="bg-gray-11/35 relative flex-1 rounded-full"
      />
    </BaseScrollArea.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
