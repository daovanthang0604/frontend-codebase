"use client"

import type { ReactNode } from "react"
import { Accordion as BaseAccordion } from "@base-ui/react/accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Accordion, rebuilt on Base UI (Root/Item/Header/
// Trigger/Panel). react-aria's collection props map over: allowsMultipleExpanded
// -> openMultiple, defaultExpandedKeys -> defaultValue, AccordionItem id -> value.

interface AccordionProps {
  children: ReactNode
  className?: string
  allowsMultipleExpanded?: boolean
  defaultExpandedKeys?: Array<string>
  expandedKeys?: Array<string>
  onExpandedChange?: (keys: Array<string>) => void
}

function Accordion({
  children,
  className,
  allowsMultipleExpanded = false,
  defaultExpandedKeys,
  expandedKeys,
  onExpandedChange,
}: AccordionProps) {
  return (
    <BaseAccordion.Root
      multiple={allowsMultipleExpanded}
      defaultValue={defaultExpandedKeys}
      value={expandedKeys}
      onValueChange={(v) => onExpandedChange?.(v as Array<string>)}
      // WDS: stacked disclosures in a bordered card with hairline dividers.
      className={cn(
        "border-gray-a5 divide-gray-a5 divide-y overflow-hidden rounded-lg border",
        className
      )}
    >
      {children}
    </BaseAccordion.Root>
  )
}

function AccordionItem({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children?: ReactNode
}) {
  return (
    <BaseAccordion.Item value={id} className={cn("group", className)}>
      {children}
    </BaseAccordion.Item>
  )
}

function AccordionTrigger({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <BaseAccordion.Header className="flex">
      <BaseAccordion.Trigger
        className={cn(
          "text-gray-12 hover:bg-gray-2 flex flex-1 items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold outline-none transition-colors",
          "data-[focus-visible]:ring-accent-7 -outline-offset-2 data-[focus-visible]:ring-2",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className
        )}
      >
        {children}
        <ChevronDown className="text-gray-11 size-4 shrink-0 transition-transform duration-200 group-data-[open]:rotate-180" />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  )
}

function AccordionContent({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <BaseAccordion.Panel
      // Base UI is engineered to animate the panel's own `height` against the
      // `--accordion-panel-height` var it measures and sets inline (it also owns
      // the mount/`hidden` lifecycle). We ride that: transition height, collapsing
      // to 0 on the enter/exit frames (`data-starting-style`/`data-ending-style`).
      // Same visual as ui's grid-rows (0 -> content height, 200ms ease-out) but on
      // Base UI's native path — no grid-vs-height double-driver jank. keepMounted
      // keeps content in the DOM, matching ui (react-aria never unmounts).
      keepMounted
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out",
        "data-[starting-style]:h-0 data-[ending-style]:h-0 motion-reduce:transition-none",
        className
      )}
    >
      <div className="text-gray-11 px-4 pb-4 text-sm">{children}</div>
    </BaseAccordion.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
export type { AccordionProps }
