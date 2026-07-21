"use client"

import type { ReactNode } from "react"
import { Tabs as BaseTabs } from "@base-ui/react/tabs"

import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/liquid-ui/Tabs (underline style). react-aria keys map to Base
// UI values: defaultSelectedKey -> defaultValue, selectedKey -> value,
// onSelectionChange -> onValueChange; Tab/TabPanel id -> value. Per-tab underline
// (Base UI marks the selected tab data-active), not the moving Indicator, to
// match ui exactly.

interface TabsProps {
  children: ReactNode
  className?: string
  defaultSelectedKey?: string
  selectedKey?: string
  onSelectionChange?: (key: string) => void
  orientation?: "horizontal" | "vertical"
}

function Tabs({
  children,
  className,
  defaultSelectedKey,
  selectedKey,
  onSelectionChange,
  orientation,
}: TabsProps) {
  return (
    <BaseTabs.Root
      defaultValue={defaultSelectedKey}
      value={selectedKey}
      onValueChange={(v) => onSelectionChange?.(v as string)}
      orientation={orientation}
      className={cn(
        "flex flex-col gap-4 data-[orientation=vertical]:flex-row",
        className
      )}
    >
      {children}
    </BaseTabs.Root>
  )
}

function TabList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <BaseTabs.List
      className={cn(
        "border-gray-a5 flex gap-5 border-b data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-1 data-[orientation=vertical]:border-r data-[orientation=vertical]:border-b-0",
        className
      )}
    >
      {children}
    </BaseTabs.List>
  )
}

function Tab({
  id,
  children,
  className,
}: {
  id: string
  children?: ReactNode
  className?: string
}) {
  return (
    <BaseTabs.Tab
      value={id}
      className={cn(
        "text-gray-11 hover:text-gray-12 relative -mb-px cursor-pointer border-b-2 border-transparent px-0.5 pb-3 text-sm font-semibold whitespace-nowrap transition-colors outline-none",
        "data-[active]:border-accent-9 data-[active]:text-gray-12",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "data-[focus-visible]:ring-accent-7 rounded-t-sm data-[focus-visible]:ring-2",
        className
      )}
    >
      {children}
    </BaseTabs.Tab>
  )
}

function TabPanel({
  id,
  children,
  className,
}: {
  id: string
  children?: ReactNode
  className?: string
}) {
  return (
    <BaseTabs.Panel
      value={id}
      className={cn(
        "text-gray-12 ring-accent-7 rounded-sm text-sm outline-none data-[focus-visible]:ring-2",
        className
      )}
    >
      {children}
    </BaseTabs.Panel>
  )
}

export { Tab, TabList, TabPanel, Tabs }
export type { TabsProps }
