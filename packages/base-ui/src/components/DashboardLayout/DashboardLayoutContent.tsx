import { Button } from "@workspace/base-ui/components/Button"
import { cn } from "@workspace/base-ui/lib/utils"
import { PanelLeft } from "lucide-react"

import { useSidebar } from "../Sidebar"

interface DashboardLayoutContentProps {
  /** The header of the page */
  header?: React.ReactNode
  /** The content of the page */
  children?: React.ReactNode
}

export function DashboardLayoutContent({
  header,
  children,
}: DashboardLayoutContentProps) {
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <div className="flex h-full flex-col">
      <header
        className={cn(
          "border-gray-a5 bg-gray-1/70 sticky top-0 z-10 flex h-12 items-center gap-1 overflow-x-auto border-b pr-4 pl-4 backdrop-blur-md",
          collapsed && "md:pl-3.5"
        )}
      >
        <div className="max-md:hidden">
          <Button
            mode="icon"
            size="sm"
            intent="secondary"
            variant="ghost"
            aria-label="Expand sidebar"
            tooltip="Expand sidebar"
            tooltipDelay={1000}
            onClick={() => setCollapsed(!collapsed)}
          >
            <PanelLeft />
          </Button>
        </div>
        <div className="flex-1">{header}</div>
      </header>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
