"use client"

import { Children, type ComponentProps, type ReactElement, type ReactNode } from "react"
import { Popover as BasePopover } from "@base-ui/react/popover"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Popover, rebuilt on Base UI (Root/Trigger/Portal/
// Positioner/Popup). Same call shape as the react-aria original:
//   <PopoverTrigger>
//     <Button/>                         {/* trigger */}
//     <Popover placement="bottom">      {/* surface */}
//       <PopoverDialog>…</PopoverDialog>
//     </Popover>
//   </PopoverTrigger>
// PopoverTrigger takes the FIRST child as the trigger (fed to Base UI's `render`
// prop so click/keyboard open-handlers merge onto it) and renders the rest (the
// <Popover> surface) inside the same Root. react-aria's isOpen/onOpenChange map
// onto Base UI's open/onOpenChange. Base UI's Popup owns the dialog role + focus,
// so PopoverDialog is just the padding wrapper.

interface PopoverTriggerProps {
  children: ReactNode
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function PopoverTrigger({
  children,
  isOpen,
  defaultOpen,
  onOpenChange,
}: PopoverTriggerProps) {
  const [trigger, ...content] = Children.toArray(children)
  return (
    <BasePopover.Root
      open={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <BasePopover.Trigger render={trigger as ReactElement} />
      {content}
    </BasePopover.Root>
  )
}

interface PopoverProps {
  children: ReactNode
  // react-aria placement: "bottom" | "bottom start" | "top end" | … → side + align
  placement?: string
  offset?: number
  className?: string
}

function Popover({
  children,
  placement = "bottom",
  offset = 4,
  className,
}: PopoverProps) {
  const [side, align = "center"] = placement.split(" ") as [
    "top" | "bottom" | "left" | "right",
    ("start" | "center" | "end")?,
  ]
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={offset}
        className="z-50"
      >
        <BasePopover.Popup
          className={cn(
            // WDS: overlays sit on the white paper surface (bg-panel) with a soft
            // shadow + hairline so they lift off the cream page. Ported from ui.
            "bg-panel text-gray-12 rounded-lg border shadow-lg outline-none",
            // Same entrance recipe as Tooltip: grow from the trigger + fade + a
            // small directional slide, 200ms ease-out; exit ~20% faster. (Tailwind
            // v4 emits scale/translate as their own props, so name them here.)
            "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
            "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
            "data-[starting-style]:data-[side=top]:translate-y-1 data-[starting-style]:data-[side=bottom]:-translate-y-1 data-[starting-style]:data-[side=left]:translate-x-1 data-[starting-style]:data-[side=right]:-translate-x-1",
            "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:duration-150",
            className
          )}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

function PopoverDialog({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-3.5 outline-0", className)} {...props} />
}

export { Popover, PopoverDialog, PopoverTrigger }
export type { PopoverProps }
