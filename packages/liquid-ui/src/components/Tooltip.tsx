"use client"

import "@workspace/liquid-ui/lib/glass"

import { Children, type ReactElement, type ReactNode } from "react"
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/liquid-ui/Tooltip, rebuilt on Base UI (Root/Trigger/Portal/
// Positioner/Popup/Arrow). The app's call site is
//   <TooltipTrigger><Trigger/><Tooltip placement="top">text</Tooltip></TooltipTrigger>
// react-aria wired trigger + bubble by child order; Base UI needs an explicit
// Tooltip.Trigger, so TooltipTrigger takes the FIRST child as the trigger (fed
// to Base UI's `render` prop so its hover/focus handlers merge onto it) and
// renders the rest (the <Tooltip> bubble) inside the same Root. The bubble is a
// liquid-glass surface (glass-overlay: frosted fill + rim + sheen) with a small
// translucent caret arrow.

interface TooltipTriggerProps {
  children: ReactNode
  delay?: number
  closeDelay?: number
}

function TooltipTrigger({
  children,
  delay = 0,
  closeDelay = 0,
}: TooltipTriggerProps) {
  const [trigger, ...content] = Children.toArray(children)
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger
        delay={delay}
        closeDelay={closeDelay}
        render={trigger as ReactElement}
      />
      {content}
    </BaseTooltip.Root>
  )
}

type Placement = "top" | "bottom" | "left" | "right"

interface TooltipProps {
  children: ReactNode
  placement?: Placement
  className?: string
}

function Tooltip({ children, placement = "top", className }: TooltipProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={placement} sideOffset={10}>
        <BaseTooltip.Popup
          className={cn(
            "glass-overlay group pointer-events-none max-w-lg rounded-md px-2 py-1 text-sm will-change-transform",
            // Enter/exit is driven by Base UI's data-[starting|ending-style]. Scale
            // up from the trigger (Base UI sets --transform-origin to point at it) +
            // fade + a small directional slide; exit is ~20% quicker.
            // NB: Tailwind v4 emits scale/translate as their OWN css properties, so
            // the transition list must name them — `transform` alone won't animate
            // them (this is what made the old fade-only feel unpolished).
            "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[starting-style]:data-[side=bottom]:-translate-y-1 data-[starting-style]:data-[side=left]:translate-x-1 data-[starting-style]:data-[side=right]:-translate-x-1 data-[starting-style]:data-[side=top]:translate-y-1",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150",
            className
          )}
        >
          {children}
          <BaseTooltip.Arrow
            className={cn(
              // Base UI centers the cross-axis (inline left/top) but leaves the
              // main-axis offset to us — without this the arrow falls into the
              // popup's content flow. `*-full` seats it against the edge; since the
              // abs arrow resolves against the popup's padding box, 100% lands 1px
              // inside the border, so the caret's flat base blends in (no seam).
              "data-[side=bottom]:bottom-full data-[side=top]:top-full",
              "data-[side=left]:left-full data-[side=right]:right-full"
            )}
          >
            <svg
              width={8}
              height={8}
              viewBox="0 0 8 8"
              className="fill-white/10 stroke-white/20 group-data-[side=bottom]:rotate-180 group-data-[side=left]:-rotate-90 group-data-[side=right]:rotate-90"
            >
              <path d="M0 0 L4 4 L8 0" />
            </svg>
          </BaseTooltip.Arrow>
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { Tooltip, TooltipTrigger }
export type { TooltipProps }
