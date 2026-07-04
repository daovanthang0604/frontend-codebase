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
      // Identical to ui's mechanism: grid-rows 0fr<->1fr on the open state, with an
      // always-mounted panel. ui gets "always mounted" from react-aria; Base UI
      // unmounts on close, so keepMounted restores it. `grid` (author) beats the
      // [hidden] UA rule, keeping the closed panel a 0fr grid (collapsed, in-flow).
      keepMounted
      className={cn(
        "grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-200 ease-out data-[open]:grid-rows-[1fr]",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </BaseCollapsible.Panel>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
export type { CollapsibleProps }
