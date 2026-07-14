"use client"

import type { ReactNode } from "react"
import { Accordion as BaseAccordion } from "@base-ui/react/accordion"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { ChevronDown } from "lucide-react"

// Kit-default --glass-* tokens (--glass-overlay-bg, --glass-rim) backing the
// item fill below.
import "@workspace/liquid-ui/lib/glass"

// Drop-in for @workspace/liquid-ui/Accordion (Root/Item/Header/Trigger/Panel),
// same react-aria-shaped props: allowsMultipleExpanded -> multiple,
// defaultExpandedKeys -> defaultValue, AccordionItem id -> value.
//
// liquid-ui addition: each item is its own glass card instead of one bordered
// card sliced by hairline divide-y dividers - see AccordionItem. Trigger and
// Content are unchanged from base-ui, including the panel-height animation
// mechanism (Base UI measures content into `--accordion-panel-height`; ridden
// unmodified below) - do not touch that var or its data-attrs.

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
      // liquid-ui: a stack of separately-glassed items with a thin gap between
      // each, instead of base-ui's one bordered card + divide-y hairlines -
      // every item now carries its own rim, so a shared outer border would
      // double up on it.
      className={cn("flex flex-col gap-2", className)}
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
    <BaseAccordion.Item
      value={id}
      // Glass item: light translucent fill + hairline rim + a soft blur -
      // deliberately subtle (a stack of frosted cards, not one heavy
      // glass-overlay panel: this item's own box height animates every time
      // its panel opens/closes, and a full glass-overlay's 16px backdrop-blur
      // + shadow + sheen layers would repaint that resizing box every frame).
      // overflow-hidden clips the trigger's hover fill and the panel to the
      // rounded corners; it has no effect on the panel's own height
      // measurement/animation below.
      className={cn(
        "group overflow-hidden rounded-lg border border-[var(--glass-rim)] bg-[var(--glass-overlay-bg)] backdrop-blur-sm",
        className
      )}
    >
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
          "text-gray-12 hover:bg-gray-2 flex flex-1 items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold transition-colors outline-none",
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
        "data-[ending-style]:h-0 data-[starting-style]:h-0 motion-reduce:transition-none",
        className
      )}
    >
      <div className="text-gray-11 px-4 pb-4 text-sm">{children}</div>
    </BaseAccordion.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
export type { AccordionProps }
