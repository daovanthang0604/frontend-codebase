"use client"

import { Children, type ReactElement, type ReactNode } from "react"
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card"

import { cn } from "@workspace/base-ui/lib/utils"

// Hover card on Base UI (Root/Trigger/Portal/Positioner/Popup/Arrow). A trigger
// — usually an inline link — that reveals a floating card on hover/focus after a
// short delay. Same trigger convention as Tooltip/Popover: the FIRST child is
// fed to Base UI's `render` prop so its hover/focus handlers merge onto it.
//   <PreviewCard>
//     <PreviewCardTrigger><a href="/u/ada">@ada</a></PreviewCardTrigger>
//     <PreviewCardContent>…profile preview…</PreviewCardContent>
//   </PreviewCard>

// Root — groups all parts (open/defaultOpen/onOpenChange live here).
const PreviewCard = BasePreviewCard.Root

interface PreviewCardTriggerProps {
  children: ReactNode
  /** ms before the card opens on hover (Base UI default: 600). */
  delay?: number
  /** ms before the card closes after the pointer leaves (Base UI default: 300). */
  closeDelay?: number
}

function PreviewCardTrigger({
  children,
  delay,
  closeDelay,
}: PreviewCardTriggerProps) {
  const [trigger] = Children.toArray(children)
  return (
    <BasePreviewCard.Trigger
      delay={delay}
      closeDelay={closeDelay}
      render={trigger as ReactElement}
    />
  )
}

interface PreviewCardContentProps {
  children: ReactNode
  // react-aria-style placement: "bottom" | "bottom start" | "top end" | … → side + align
  placement?: string
  offset?: number
  className?: string
}

function PreviewCardContent({
  children,
  placement = "bottom",
  offset = 8,
  className,
}: PreviewCardContentProps) {
  const [side, align = "center"] = placement.split(" ") as [
    "top" | "bottom" | "left" | "right",
    ("start" | "center" | "end")?,
  ]
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner
        side={side}
        align={align}
        sideOffset={offset}
        className="z-50"
      >
        <BasePreviewCard.Popup
          className={cn(
            // WDS: overlays sit on the white paper surface (bg-panel) with a soft
            // shadow + hairline so they lift off the cream page. `group` lets an
            // optional <PreviewCardArrow> read the side via group-data-*.
            "group bg-panel text-gray-12 w-72 rounded-lg border p-4 shadow-lg outline-none",
            // Same entrance recipe as Popover/Tooltip: grow from the trigger + fade
            // + a small directional slide, 200ms ease-out; exit ~20% faster.
            // (Tailwind v4 emits scale/translate as their own props, so name them.)
            "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
            "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
            "data-[starting-style]:data-[side=top]:translate-y-1 data-[starting-style]:data-[side=bottom]:-translate-y-1 data-[starting-style]:data-[side=left]:translate-x-1 data-[starting-style]:data-[side=right]:-translate-x-1",
            "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:duration-150",
            className
          )}
        >
          {children}
        </BasePreviewCard.Popup>
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  )
}

// Optional caret. Drop inside <PreviewCardContent> to point at the trigger.
function PreviewCardArrow({ className }: { className?: string }) {
  return (
    <BasePreviewCard.Arrow
      className={cn(
        // Base UI centers the cross-axis but leaves the main-axis offset to us;
        // `*-full` seats the caret against the popup edge (see Tooltip.tsx).
        "data-[side=top]:top-full data-[side=bottom]:bottom-full",
        "data-[side=left]:left-full data-[side=right]:right-full",
        className
      )}
    >
      <svg
        width={10}
        height={10}
        viewBox="0 0 8 8"
        className="fill-panel stroke-gray-6 group-data-[side=bottom]:rotate-180 group-data-[side=left]:-rotate-90 group-data-[side=right]:rotate-90"
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </BasePreviewCard.Arrow>
  )
}

export { PreviewCard, PreviewCardArrow, PreviewCardContent, PreviewCardTrigger }
export type { PreviewCardContentProps, PreviewCardTriggerProps }
