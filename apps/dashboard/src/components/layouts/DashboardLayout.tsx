"use client"

import { useEffect, useState, type ReactNode } from "react"
import { APP_NAME } from "@/constants/common"
import { DashboardLayout as WorkspaceDashboardLayout } from "@workspace/ui/components/DashboardLayout"
import {
  SidebarNavTree,
  SidebarSeparator,
  useSidebar,
  type SidebarNavNode,
} from "@workspace/ui/components/Sidebar"
import { Link, useRouterState } from "@tanstack/react-router"
import { LayoutDashboardIcon, PaletteIcon } from "lucide-react"

import { Logo } from "@/components/Logo"

// Starter navigation. Add your own items here — each `to` must resolve to a
// real route under `src/routes`. The original app gated items with an RBAC
// `useAuthorization()` hook; that was removed with the backend, so this is a
// plain static list.
const MAIN_NAV: SidebarNavNode[] = [
  {
    type: "item",
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon className="size-4" />,
  },
  {
    type: "item",
    to: "/design-system",
    label: "Design System",
    icon: <PaletteIcon className="size-4" />,
  },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [forceRerender, setForceRerender] = useState(0)
  const activePath = useRouterState({
    select: (state) => state.location.pathname,
  })

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="bg-gray-1 min-h-svh" suppressHydrationWarning />
  }

  return (
    <LayoutContent
      key={forceRerender}
      activePath={activePath}
      onForceRerender={() => {
        setTimeout(() => {
          setForceRerender((old) => old + 1)
        }, 0)
      }}
    >
      {children}
    </LayoutContent>
  )
}

function LayoutContent({
  activePath,
  children,
  onForceRerender,
}: {
  activePath: string
  children: ReactNode
  onForceRerender: () => void
}) {
  const sidebarNav = (
    <>
      <SidebarSeparator className="text-gray-11/50 mb-3 px-2 text-[11px] font-semibold tracking-[0.08em] uppercase">
        Main menu
      </SidebarSeparator>
      <SidebarNavTree
        nodes={MAIN_NAV}
        pathname={activePath}
        renderLink={(node) => (
          <Link
            onClick={() => {
              if (activePath === node.to) {
                onForceRerender()
              }
            }}
            to={node.to}
          >
            {node.label}
          </Link>
        )}
      />
    </>
  )

  return (
    <WorkspaceDashboardLayout
      sidebarClassName="w-[260px]"
      sidebarContentWidth={260}
      pathname={activePath}
      defaultOpenLevel={1}
      sidebarHeader={<SidebarHeader />}
      sidebarNav={sidebarNav}
      mobileTitle={<Logo />}
    >
      {children}
    </WorkspaceDashboardLayout>
  )
}

function SidebarHeader() {
  const { collapsed, mode } = useSidebar()

  if (collapsed && mode === "full") {
    return (
      <div className="flex items-center justify-center px-2 py-3.5">
        <Link to="/dashboard" aria-label={APP_NAME}>
          <Logo withName={false} asLink={false} />
        </Link>
      </div>
    )
  }

  return (
    <div className="text-gray-12 flex items-center gap-2 px-4 py-3.5">
      <Link to="/dashboard" className="flex flex-1 items-center gap-2">
        <Logo withName={false} asLink={false} />
        <div className="leading-tight">
          <p className="text-sm font-semibold">{APP_NAME}</p>
          <p className="text-gray-11/60 text-xs leading-[14px]">Starter</p>
        </div>
      </Link>
    </div>
  )
}
