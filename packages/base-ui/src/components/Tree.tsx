"use client"

import { useState, type ReactNode } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/base-ui/components/Collapsible"
import { cn } from "@workspace/base-ui/lib/utils"
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react"

// Data-driven file/nav tree. Folder nodes compose the Base UI Collapsible — its
// open state rotates the chevron and swaps Folder/FolderOpen; leaf nodes are
// selectable rows. Selection is controlled (selectedId/onSelect); expansion is
// internal, seeded from defaultExpandedIds.

interface TreeNode {
  id: string
  label: ReactNode
  icon?: ReactNode
  children?: TreeNode[]
}

interface TreeViewProps {
  data: TreeNode[]
  selectedId?: string
  onSelect?: (node: TreeNode) => void
  defaultExpandedIds?: string[]
  className?: string
}

// Shared row geometry for folder triggers and leaf rows so indentation, icon
// sizing, and hover/active treatment stay identical across both.
const rowBase = cn(
  "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm cursor-pointer",
  "outline-none focus-visible:ring-accent-8 focus-visible:ring-2 focus-visible:ring-inset",
  "[&_svg]:size-4 [&_svg]:shrink-0"
)

// Selected vs resting/hover, kept mutually exclusive so a selected row doesn't
// flip to the gray hover surface on pointer-over (mirrors SidebarItem).
const rowState = (selected: boolean) =>
  selected
    ? "bg-accent-a3 text-accent-12"
    : "text-gray-11 hover:bg-gray-3 hover:text-gray-12"

// Guide-aligned indent: one level = 16px past the 8px resting gutter.
const indentOf = (depth: number) => depth * 16 + 8

function TreeView({
  data,
  selectedId,
  onSelect,
  defaultExpandedIds,
  className,
}: TreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds)
  )

  const setNodeOpen = (id: string, open: boolean) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (open) next.add(id)
      else next.delete(id)
      return next
    })

  const renderNode = (node: TreeNode, depth: number): ReactNode => {
    const selected = node.id === selectedId
    const paddingLeft = indentOf(depth)

    // Folder: any node carrying a `children` array.
    if (node.children) {
      const open = expandedIds.has(node.id)
      return (
        <Collapsible
          key={node.id}
          open={open}
          onOpenChange={(next) => setNodeOpen(node.id, next)}
        >
          <CollapsibleTrigger
            style={{ paddingLeft }}
            className={cn(rowBase, rowState(selected))}
          >
            {/* Chevron/folder icon follow this node's own `open`, not
                group-data-[open]: nested folders each add a `group`, so a group
                variant would leak an ancestor's open state onto child rows. */}
            <ChevronRight
              className={cn(
                "transition-transform duration-200",
                open && "rotate-90"
              )}
            />
            {open ? <FolderOpen /> : <Folder />}
            <span className="min-w-0 flex-1 truncate text-left">
              {node.label}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    // Leaf: selectable row.
    return (
      <button
        key={node.id}
        type="button"
        style={{ paddingLeft }}
        aria-current={selected || undefined}
        onClick={() => onSelect?.(node)}
        className={cn(rowBase, rowState(selected))}
      >
        {node.icon ?? <File />}
        <span className="min-w-0 flex-1 truncate text-left">{node.label}</span>
      </button>
    )
  }

  return (
    <div className={cn("select-none", className)}>
      {data.map((node) => renderNode(node, 0))}
    </div>
  )
}

export { TreeView }
export type { TreeNode, TreeViewProps }
