"use client"

import type { ReactNode } from "react"

import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
} from "./Sidebar"

export type LinkItemType =
  | {
      type: "main"
      url: string
      text: ReactNode
      icon?: ReactNode
      external?: boolean
    }
  | {
      type: "menu"
      text: ReactNode
      icon?: ReactNode
      url?: string
      external?: boolean
      items: LinkItemType[]
    }
  | { type: "custom"; children: ReactNode }
  | {
      type: "icon"
      url: string
      icon: ReactNode
      text: string
      external?: boolean
    }

interface SidebarLinkItemProps {
  item: Exclude<LinkItemType, { type: "icon" }>
  pathname?: string
  className?: string
}

export function SidebarLinkItem({
  item,
  pathname = "",
  className,
}: SidebarLinkItemProps) {
  function isActive(url: string): boolean {
    return pathname === url
  }

  if (item.type === "custom") {
    return <div className={className}>{item.children}</div>
  }

  if (item.type === "menu") {
    const active = item.url ? isActive(item.url) : false

    return (
      <SidebarFolder active={active} className={className}>
        {item.url ? (
          <SidebarFolderLink
            href={item.url}
            external={item.external}
            active={active}
          >
            {item.icon}
            {item.text}
          </SidebarFolderLink>
        ) : (
          <SidebarFolderTrigger>
            {item.icon}
            {item.text}
          </SidebarFolderTrigger>
        )}
        <SidebarFolderContent>
          {item.items
            .filter(
              (child): child is Exclude<LinkItemType, { type: "icon" }> =>
                child.type !== "icon"
            )
            .map((child, i) => (
              <SidebarLinkItem key={i} item={child} pathname={pathname} />
            ))}
        </SidebarFolderContent>
      </SidebarFolder>
    )
  }

  return (
    <SidebarItem
      href={item.url}
      icon={item.icon}
      external={item.external}
      active={isActive(item.url)}
      className={className}
    >
      {item.text}
    </SidebarItem>
  )
}
