"use client"

import * as React from "react"

import { cn } from "@workspace/base-ui/lib/utils"

// Pure-custom activity feed. An <ol> rail with per-item dots; each item exposes
// its status to the dot via context so callers set it once on <TimelineItem>.
// The rail is a hairline drawn by <TimelineConnector>; the dot's ring-4 halo
// (page-bg coloured) masks the line where it passes behind, giving clean breaks.

type TimelineStatus = "done" | "current" | "pending"

const TimelineItemContext = React.createContext<TimelineStatus>("pending")

// Solid marker fill per status: current = accent, done = success green,
// pending = muted gray. Shared by the plain dot and the icon dot.
const DOT_BG: Record<TimelineStatus, string> = {
  current: "bg-accent-9",
  done: "bg-success-9",
  pending: "bg-gray-7",
}

function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol className={cn("relative", className)} {...props} />
}

function TimelineItem({
  status = "pending",
  className,
  ...props
}: React.ComponentProps<"li"> & { status?: TimelineStatus }) {
  return (
    <TimelineItemContext.Provider value={status}>
      <li
        data-status={status}
        className={cn("relative flex gap-4 pb-6 last:pb-0", className)}
        {...props}
      />
    </TimelineItemContext.Provider>
  )
}

function TimelineDot({
  status,
  icon,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  status?: TimelineStatus
  /** Renders a small icon disc on the rail instead of the bare dot. */
  icon?: React.ReactNode
}) {
  const itemStatus = React.useContext(TimelineItemContext)
  const resolved = status ?? itemStatus
  // Fixed-width rail column so the marker — bare dot or wider icon disc —
  // always centres on the connector line (w-6 → centre at 12px = left-3).
  return (
    <span
      className={cn("relative z-10 flex w-6 shrink-0 justify-center", className)}
      {...props}
    >
      {icon ? (
        <span
          className={cn(
            "mt-0.5 flex size-6 items-center justify-center rounded-full ring-4 ring-gray-1",
            "[&>svg]:size-3.5 [&>svg]:text-white",
            DOT_BG[resolved]
          )}
        >
          {icon}
        </span>
      ) : (
        <span
          className={cn(
            "mt-1 size-2.5 rounded-full ring-4 ring-gray-1",
            DOT_BG[resolved]
          )}
        />
      )}
    </span>
  )
}

function TimelineConnector({
  className,
  ...props
}: React.ComponentProps<"span">) {
  // Hairline rail centred on the dot column, running full height and masked
  // where it passes behind the dot's ring halo. Auto-hidden on the last item
  // so there is no trailing tail below the final dot.
  return (
    <span
      aria-hidden
      className={cn(
        "bg-gray-a5 absolute top-2 bottom-0 left-3 w-px -translate-x-1/2",
        "[li:last-child_&]:hidden",
        className
      )}
      {...props}
    />
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex-1 pb-2", className)} {...props} />
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-gray-12 text-sm font-medium", className)}
      {...props}
    />
  )
}

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return <time className={cn("text-gray-11 text-xs", className)} {...props} />
}

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-gray-11 mt-1 text-sm", className)} {...props} />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
}
export type { TimelineStatus }
