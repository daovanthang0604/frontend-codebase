"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  type ButtonProps as AriaButtonProps,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
} from "react-aria-components"

export interface CollapsibleProps
  extends Omit<AriaDisclosureProps, "children"> {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (isOpen: boolean) => void
  disabled?: boolean
  defaultOpen?: boolean
}

function Collapsible({
  children,
  open,
  onOpenChange,
  disabled,
  defaultOpen,
  className,
  ...props
}: CollapsibleProps) {
  return (
    <AriaDisclosure
      isExpanded={open}
      onExpandedChange={onOpenChange}
      isDisabled={disabled}
      defaultExpanded={defaultOpen}
      className={cn("group", className)}
      {...props}
    >
      {children}
    </AriaDisclosure>
  )
}

export interface CollapsibleTriggerProps extends AriaButtonProps {
  children?: React.ReactNode
}

function CollapsibleTrigger({
  children,
  className,
  ...props
}: CollapsibleTriggerProps) {
  return (
    <AriaButton
      slot="trigger"
      className={cn("flex w-full items-center focus:outline-none", className)}
      {...props}
    >
      {children}
    </AriaButton>
  )
}

export interface CollapsibleContentProps
  extends Omit<AriaDisclosurePanelProps, "children"> {
  children?: React.ReactNode
}

function CollapsibleContent({
  children,
  className,
  ...props
}: CollapsibleContentProps) {
  return (
    <AriaDisclosurePanel
      className={cn(
        "grid overflow-hidden",
        "transition-[grid-template-rows,opacity] duration-200 ease-out",
        "motion-reduce:transition-none",

        "group-data-[expanded]:grid-rows-[1fr] group-data-[expanded]:opacity-100",
        "group-not-data-[expanded]:grid-rows-[0fr] group-not-data-[expanded]:opacity-0",

        className
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </AriaDisclosurePanel>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
