"use client"

import type { ComponentProps, ReactNode } from "react"
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Collapsible, rebuilt on Base UI (Root/Trigger/Panel).
// Base UI's Panel exposes --collapsible-panel-height for a real height transition
// (vs ui's grid-rows trick). Prop names line up (open/onOpenChange/defaultOpen).

interface CollapsibleProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  disabled?: boolean
  className?: string
}

function Collapsible({
  children,
  open,
  onOpenChange,
  defaultOpen,
  disabled,
  className,
}: CollapsibleProps) {
  return (
    <BaseCollapsible.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      disabled={disabled}
      className={cn("group", className)}
    >
      {children}
    </BaseCollapsible.Root>
  )
}

function CollapsibleTrigger({
  className,
  ...props
}: ComponentProps<typeof BaseCollapsible.Trigger>) {
  return (
    <BaseCollapsible.Trigger
      className={cn("flex w-full items-center outline-none", className)}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      className={cn(
        // Base UI sets --collapsible-panel-height to the content height; animate
        // height from 0 at the starting/ending styles.
        "h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 ease-out",
        "data-[starting-style]:h-0 data-[ending-style]:h-0",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {children}
    </BaseCollapsible.Panel>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
export type { CollapsibleProps }
