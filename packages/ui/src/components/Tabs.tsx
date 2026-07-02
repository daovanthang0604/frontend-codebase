"use client"

import { cn } from "@workspace/ui/lib/utils"
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  composeRenderProps,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from "react-aria-components"

// WDS Tabs — underline style. A quiet row of labels on a hairline base; the
// active tab is inked (gray-12) with an accent underline. Reach for
// SegmentedControl instead when you want the "pick one" pill switcher.
function Tabs({ className, ...props }: AriaTabsProps) {
  return (
    <AriaTabs
      className={composeRenderProps(className, (className) =>
        cn("flex flex-col gap-4 data-[orientation=vertical]:flex-row", className)
      )}
      {...props}
    />
  )
}

function TabList<T extends object>({
  className,
  ...props
}: AriaTabListProps<T>) {
  return (
    <AriaTabList
      className={composeRenderProps(className, (className) =>
        cn(
          "border-gray-a5 flex gap-5 border-b data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-1 data-[orientation=vertical]:border-r data-[orientation=vertical]:border-b-0",
          className
        )
      )}
      {...props}
    />
  )
}

function Tab({ className, ...props }: AriaTabProps) {
  return (
    <AriaTab
      className={composeRenderProps(className, (className) =>
        cn(
          "text-gray-11 hover:text-gray-12 relative -mb-px cursor-pointer border-b-2 border-transparent px-0.5 pb-3 text-sm font-semibold whitespace-nowrap transition-colors outline-none",
          "data-selected:border-accent-9 data-selected:text-gray-12",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "data-[focus-visible]:ring-accent-7 rounded-t-sm data-[focus-visible]:ring-2",
          className
        )
      )}
      {...props}
    />
  )
}

function TabPanel({ className, ...props }: AriaTabPanelProps) {
  return (
    <AriaTabPanel
      className={composeRenderProps(className, (className) =>
        cn(
          "text-gray-12 ring-accent-7 rounded-sm text-sm outline-none data-[focus-visible]:ring-2",
          className
        )
      )}
      {...props}
    />
  )
}

export { Tabs, TabList, Tab, TabPanel }
