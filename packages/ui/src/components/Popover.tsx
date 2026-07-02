"use client"

import { cn } from "@workspace/ui/lib/utils"
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
  composeRenderProps,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components"

const PopoverTrigger = AriaDialogTrigger
const Popover = ({
  className,
  offset = 4,
  animateIn = true,
  animateOut = true,
  ...props
}: AriaPopoverProps & {
  animateIn?: boolean
  animateOut?: boolean
}) => (
  <AriaPopover
    offset={offset}
    className={composeRenderProps(className, (className) =>
      cn(
        // WDS: overlays sit on the white paper surface (bg-panel) with a soft
        // warm shadow + hairline, so they lift off the cream page like the DS menu.
        "bg-panel text-gray-12 z-50 rounded-lg border shadow-lg outline-none",
        /* Entering */
        animateIn && "data-[entering]:animate-in data-[entering]:fade-in-0",
        /* Exiting */
        animateOut && "data-[exiting]:animate-out data-[exiting]:fade-out-0",
        /* Placement */
        "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
        className
      )
    )}
    {...props}
  />
)
function PopoverDialog({ className, ...props }: AriaDialogProps) {
  return <AriaDialog className={cn("p-3.5 outline-0", className)} {...props} />
}
export { Popover, PopoverDialog, PopoverTrigger }
