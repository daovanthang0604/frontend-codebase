"use client"

import { Fragment, useMemo, type FC, type ReactNode } from "react"

import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
} from "./Sidebar"

export interface PageTreeNode {
  type: "page" | "folder" | "separator"
  name: ReactNode
  url?: string
  icon?: ReactNode
  external?: boolean
}

export interface PageTreeItem extends PageTreeNode {
  type: "page"
  url: string
}

export interface PageTreeFolder extends PageTreeNode {
  type: "folder"
  children: PageTreeNode[]
  index?: PageTreeItem
  defaultOpen?: boolean
  collapsible?: boolean
}

export interface PageTreeSeparator extends PageTreeNode {
  type: "separator"
}

export interface PageTreeRoot {
  $id?: string
  children: PageTreeNode[]
}

export interface SidebarPageTreeComponents {
  Item?: FC<{ item: PageTreeItem }>
  Folder?: FC<{ item: PageTreeFolder; children: ReactNode }>
  Separator?: FC<{ item: PageTreeSeparator }>
}

interface PageTreeRendererProps {
  root: PageTreeRoot
  pathname?: string
  components?: SidebarPageTreeComponents
}

export function SidebarPageTree({
  root,
  pathname = "",
  components = {},
}: PageTreeRendererProps) {
  const { Separator, Item, Folder } = components

  return useMemo(() => {
    function isActive(url: string): boolean {
      return pathname === url
    }

    function isFolderActive(folder: PageTreeFolder): boolean {
      if (folder.index && isActive(folder.index.url)) return true
      return folder.children.some((child) => {
        if (child.type === "page") return isActive(child.url!)
        if (child.type === "folder")
          return isFolderActive(child as PageTreeFolder)
        return false
      })
    }

    function renderNode(item: PageTreeNode, index: number): ReactNode {
      if (item.type === "separator") {
        if (Separator) {
          return <Separator key={index} item={item as PageTreeSeparator} />
        }
        return (
          <SidebarSeparator key={index}>
            {item.icon}
            {item.name}
          </SidebarSeparator>
        )
      }

      if (item.type === "folder") {
        const folder = item as PageTreeFolder
        const active = isFolderActive(folder)

        if (Folder) {
          return (
            <Folder key={index} item={folder}>
              {folder.children.map(renderNode)}
            </Folder>
          )
        }

        return (
          <SidebarFolder
            key={index}
            collapsible={folder.collapsible}
            active={active}
            defaultOpen={folder.defaultOpen}
          >
            {folder.index ? (
              <SidebarFolderLink
                href={folder.index.url}
                external={folder.index.external}
                active={isActive(folder.index.url)}
              >
                {folder.icon}
                {folder.name}
              </SidebarFolderLink>
            ) : (
              <SidebarFolderTrigger>
                {folder.icon}
                {folder.name}
              </SidebarFolderTrigger>
            )}
            <SidebarFolderContent>
              {folder.children.map(renderNode)}
            </SidebarFolderContent>
          </SidebarFolder>
        )
      }

      const pageItem = item as PageTreeItem
      if (Item) {
        return <Item key={pageItem.url} item={pageItem} />
      }

      return (
        <SidebarItem
          key={pageItem.url}
          href={pageItem.url}
          external={pageItem.external}
          icon={pageItem.icon}
          active={isActive(pageItem.url)}
        >
          {pageItem.name}
        </SidebarItem>
      )
    }

    return <Fragment key={root.$id}>{root.children.map(renderNode)}</Fragment>
  }, [Folder, Item, Separator, root, pathname])
}
