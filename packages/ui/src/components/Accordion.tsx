"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronDown } from "lucide-react"
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosurePanel as AriaDisclosurePanel,
  Heading,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
} from "react-aria-components"

// WDS Accordion — stacked disclosures in a bordered card with hairline dividers
// (the calm "boxed" data unit). Pass `allowsMultipleExpanded` on <Accordion> to
// keep several open at once. Each <AccordionItem> needs a stable `id`.
function Accordion({ className, ...props }: AriaDisclosureGroupProps) {
  return (
    <AriaDisclosureGroup
      className={composeRenderProps(className, (className) =>
        cn(
          "border-gray-a5 divide-gray-a5 divide-y overflow-hidden rounded-lg border",
          className
        )
      )}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AriaDisclosureProps) {
  return (
    <AriaDisclosure
      className={composeRenderProps(className, (className) => cn("group", className))}
      {...props}
    />
  )
}

interface AccordionTriggerProps extends AriaButtonProps {
  children?: ReactNode
}

function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  return (
    <Heading className="flex">
      <AriaButton
        slot="trigger"
        className={cn(
          "text-gray-12 hover:bg-gray-2 flex flex-1 items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold outline-none transition-colors",
          "data-[focus-visible]:ring-accent-7 -outline-offset-2 data-[focus-visible]:ring-2",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="text-gray-11 size-4 shrink-0 transition-transform duration-200 group-data-[expanded]:rotate-180" />
      </AriaButton>
    </Heading>
  )
}

function AccordionContent({
  children,
  className,
  ...props
}: AriaDisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      className={cn(
        "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
        "group-data-[expanded]:grid-rows-[1fr] group-not-data-[expanded]:grid-rows-[0fr]",
        className
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="text-gray-11 px-4 pb-4 text-sm">{children}</div>
      </div>
    </AriaDisclosurePanel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
