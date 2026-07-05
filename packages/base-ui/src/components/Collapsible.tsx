"use client"

import type { ComponentProps, ReactNode } from "react"
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Collapsible, rebuilt on Base UI (Root/Trigger/Panel).
// Prop names line up (open/onOpenChange/defaultOpen).

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
      // Base UI is engineered to animate the panel's own `height` against the
      // `--collapsible-panel-height` var it measures and sets inline (it also owns
      // the mount/`hidden` lifecycle). We ride that: transition height, collapsing
      // to 0 on the enter/exit frames (`data-starting-style`/`data-ending-style`).
      // Same visual as ui's grid-rows (0 -> content height, 200ms ease-out) but on
      // Base UI's native path — no grid-vs-height double-driver jank. keepMounted
      // keeps content in the DOM, matching ui (react-aria never unmounts).
      keepMounted
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out",
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

type CollapsibleTriggerProps = ComponentProps<typeof CollapsibleTrigger>
type CollapsibleContentProps = ComponentProps<typeof CollapsibleContent>

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
}
