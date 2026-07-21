"use client"

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"
import { Button } from "@workspace/liquid-ui/components/Button"
import { cn } from "@workspace/liquid-ui/lib/utils"

import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderTrigger,
  SidebarItem,
  useSidebar,
} from "./Sidebar"

export type SidebarNavNode = SidebarNavItem | SidebarNavFolder

export type SidebarNavItem = {
  type: "item"
  to: string
  label: ReactNode
  icon?: ReactNode
  exact?: boolean
  key?: string
}

export type SidebarNavFolder = {
  type: "folder"
  label: ReactNode
  icon?: ReactNode
  defaultOpen?: boolean
  items: SidebarNavNode[]
  key?: string
}

export function isActivePath(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === to
  return pathname === to || (to !== "/" && pathname.startsWith(to + "/"))
}

function anyActive(node: SidebarNavNode, pathname: string): boolean {
  if (node.type === "item") return isActivePath(pathname, node.to, node.exact)
  return node.items.some((n) => anyActive(n, pathname))
}

function flattenItems(nodes: SidebarNavNode[]): SidebarNavItem[] {
  return nodes.flatMap((n) => (n.type === "item" ? [n] : flattenItems(n.items)))
}

export function SidebarNavTree({
  nodes,
  pathname,
  renderLink,
  className,
}: {
  nodes: SidebarNavNode[]
  pathname: string
  renderLink?: (node: SidebarNavItem, active: boolean) => ReactElement<any>
  className?: string
}) {
  const { collapsed, mode } = useSidebar()

  // Collapsed icon rail: folder grouping and labels don't fit a 64px rail, so
  // flatten to the leaf destinations and render each as an icon button with the
  // label in a hover tooltip. Active item gets the accent-tinted treatment.
  if (collapsed && mode === "full") {
    const items = flattenItems(nodes)
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-1",
          // Soften the expanded → rail content swap: icons ease in instead of
          // hard-cutting while the column width animates.
          "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200",
          className
        )}
      >
        {items.map((node, idx) => {
          const active = isActivePath(pathname, node.to, node.exact)
          const linkEl = renderLink ? (
            renderLink(node, active)
          ) : (
            <a href={node.to}>{node.label}</a>
          )
          const iconLink = isValidElement(linkEl)
            ? cloneElement(linkEl as ReactElement<any>, {
                children: node.icon,
                "aria-current": active ? "page" : undefined,
              })
            : linkEl
          return (
            <Button
              key={node.key ?? `rail-${node.type}-${idx}`}
              asChild
              mode="icon"
              size="md"
              variant={active ? "minimal" : "ghost"}
              intent={active ? "primary" : "secondary"}
              tooltip={node.label}
              tooltipPlacement="right"
              tooltipDelay={300}
            >
              {iconLink}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={cn(
        className ?? "space-y-1",
        // Labels ease in as the rail → full-width reveal completes, mirroring
        // the collapsed rail's fade so neither direction hard-cuts the swap.
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
      )}
    >
      {nodes.map((node, idx) => (
        <SidebarNavTreeNode
          key={node.key ?? `${node.type}-${idx}`}
          node={node}
          pathname={pathname}
          renderLink={renderLink}
        />
      ))}
    </div>
  )
}

function SidebarNavTreeNode({
  node,
  pathname,
  renderLink,
}: {
  node: SidebarNavNode
  pathname: string
  renderLink?: (node: SidebarNavItem, active: boolean) => ReactElement<any>
}) {
  if (node.type === "item") {
    const active = isActivePath(pathname, node.to, node.exact)
    const linkEl = renderLink ? (
      renderLink(node, active)
    ) : (
      <a href={node.to} aria-current={active ? "page" : undefined}>
        {node.label}
      </a>
    )

    const linkWithA11y = isValidElement(linkEl)
      ? cloneElement(linkEl as ReactElement<any>, {
          "aria-current": active ? "page" : undefined,
        })
      : linkEl

    return (
      <SidebarItem asChild icon={node.icon} active={active}>
        {linkWithA11y}
      </SidebarItem>
    )
  }

  const active = anyActive(node, pathname)

  return (
    <SidebarFolder defaultOpen={node.defaultOpen} active={active}>
      <SidebarFolderTrigger className="min-h-9 py-2">
        {node.icon}
        {node.label}
      </SidebarFolderTrigger>

      <SidebarFolderContent className="mt-0.5">
        <div className="space-y-0.5">
          {node.items.map((child, idx) => (
            <SidebarNavTreeNode
              key={child.key ?? `${child.type}-${idx}`}
              node={child}
              pathname={pathname}
              renderLink={renderLink}
            />
          ))}
        </div>
      </SidebarFolderContent>
    </SidebarFolder>
  )
}
