import { useMemo, type CSSProperties, type ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { PanelLeft } from "lucide-react"

import {
  SidebarContent,
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarProvider,
  SidebarTrigger,
  SidebarViewport,
  useSidebar,
} from "../Sidebar"
import type { DashboardLayoutProps } from "./types"

function DesktopSidebarShell({
  sidebarWidth,
  sidebarContentWidth,
  sidebarClassName,
  sidebarStyle,
  sidebarContent,
}: {
  sidebarWidth?: number | string
  sidebarContentWidth: number
  sidebarClassName?: string
  sidebarStyle?: CSSProperties
  sidebarContent: ReactNode
  onSearch?: () => void
}) {
  const { collapsed } = useSidebar()

  return (
    <SidebarContent>
      {({ ref }) => (
        <div
          data-sidebar-placeholder=""
          className={cn(
            "relative z-40 h-auto shrink-0 max-md:hidden",
            // Width morphs on-screen between rail (64px) and full (260px), so
            // ease-in-out (accelerate then settle). Disabled under reduced motion.
            "sticky top-0 w-[260px] transition-[width] duration-200 ease-in-out",
            "motion-reduce:transition-none",
            sidebarClassName,
            // Collapsed = a docked icon rail, NOT hidden. No slide-off and no
            // edge-hover peek — the rail stays put; labels move to tooltips.
            collapsed && "w-16!"
          )}
          style={{
            ...sidebarStyle,
            ...(!collapsed && sidebarWidth !== undefined
              ? { width: sidebarWidth }
              : null),
          }}
        >
          <aside
            ref={ref}
            data-collapsed={collapsed}
            data-slot="sidebar"
            className={cn(
              // overflow-hidden clips the expanded content (pinned to its full
              // width via the wrapper below) to the animating rail width, so
              // labels are revealed left-to-right instead of wrapping/reflowing
              // while the panel widens. Rail tooltips portal out, so they're
              // unaffected by this clip.
              // WDS: solid white panel (--panel) lifts off the canvas like the
              // DS sidebar. Keep the bg as a SINGLE class — the prior `bg-gray-2`
              // + `bg-gradient-to-b` sheen collapsed in tailwind-merge (the
              // gradient won), leaving the panel transparent so it blended into
              // the page. White is white for every tenant; dark tracks the ramp.
              "border-gray-a5 bg-panel absolute inset-y-0 left-0 flex w-full flex-col overflow-hidden border-r text-sm shadow-sm"
            )}
          >
            <div
              className="flex h-full w-full flex-col"
              // Pin the expanded content to its full width so labels and the
              // header keep a single-line layout while the panel width animates
              // open — the aside's overflow-hidden then reveals it cleanly. The
              // collapsed rail keeps its natural centered 64px layout (no pin).
              style={{ minWidth: collapsed ? undefined : sidebarContentWidth }}
            >
              {sidebarContent}
            </div>
          </aside>
        </div>
      )}
    </SidebarContent>
  )
}

export function DashboardLayout({
  pathname,
  defaultOpenLevel = 0,
  prefetch,
  sidebarWidth,
  sidebarContentWidth = 260,
  sidebarClassName,
  sidebarStyle,
  sidebarHeader,
  sidebarTop,
  sidebarNav,
  sidebarFooter,
  children,
  contentClassName,
  contentInnerClassName,
  mobileHeader,
  mobileTitle,
  onSearch,
}: DashboardLayoutProps) {
  const sidebarContent = useMemo(
    () => (
      <>
        {sidebarHeader}
        {sidebarTop}
        <SidebarViewport>{sidebarNav}</SidebarViewport>
        {sidebarFooter}
      </>
    ),
    [sidebarFooter, sidebarHeader, sidebarNav, sidebarTop]
  )

  const defaultMobileHeader = (
    <div className="border-gray-a5 bg-gray-1/80 sticky top-0 z-10 flex h-12 items-center justify-between gap-2 border-b pr-4 pl-6 backdrop-blur-md md:hidden">
      {mobileTitle}
      <div className="flex items-center">
        <SidebarTrigger>
          <span className="sr-only">Open sidebar</span>
          <PanelLeft className="size-4 shrink-0" />
        </SidebarTrigger>
      </div>
    </div>
  )

  return (
    <SidebarProvider
      pathname={pathname}
      defaultOpenLevel={defaultOpenLevel}
      prefetch={prefetch}
    >
      <div className={cn("flex min-h-svh", contentClassName)}>
        {/* Desktop sidebar */}
        <DesktopSidebarShell
          sidebarWidth={sidebarWidth}
          sidebarContentWidth={sidebarContentWidth}
          sidebarClassName={sidebarClassName}
          sidebarStyle={sidebarStyle}
          sidebarContent={sidebarContent}
          onSearch={onSearch}
        />

        {/* Mobile drawer */}
        <SidebarDrawerOverlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 bg-black/80 backdrop-blur-xs" />
        <SidebarDrawerContent className="bg-gray-2 flex flex-col **:data-[slot=collapse-trigger]:invisible">
          {sidebarContent}
        </SidebarDrawerContent>

        {/* Main content */}
        <main className="bg-gray-1 flex-1 overflow-auto">
          {mobileHeader ?? defaultMobileHeader}
          <div
            className={cn(
              "h-[calc(100vh-48px)] md:h-svh",
              contentInnerClassName
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
