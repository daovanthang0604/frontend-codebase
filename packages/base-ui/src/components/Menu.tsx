"use client"

import { Children, type ReactElement, type ReactNode } from "react"
import { Menu as BaseMenu } from "@base-ui/react/menu"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Menu — the common dropdown usage:
//   <MenuTrigger>
//     <Button/>
//     <MenuPopover><Menu>
//       <MenuItem onAction={…}>…</MenuItem><MenuSeparator/>
//     </Menu></MenuPopover>
//   </MenuTrigger>
// react-aria's collection API (items / selectionMode / sections / submenus /
// createLink) is deferred — this covers the explicit-children pattern the app
// uses. MenuTrigger splits children: first = trigger (Base UI render prop), rest
// = the popover. onAction maps to Base UI's onClick (items close on click).

interface MenuTriggerProps {
  children: ReactNode
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function MenuTrigger({
  children,
  isOpen,
  defaultOpen,
  onOpenChange,
}: MenuTriggerProps) {
  const [trigger, ...content] = Children.toArray(children)
  return (
    <BaseMenu.Root
      open={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <BaseMenu.Trigger render={trigger as ReactElement} />
      {content}
    </BaseMenu.Root>
  )
}

interface MenuPopoverProps {
  children: ReactNode
  className?: string
  placement?: string
  offset?: number
}

function MenuPopover({
  children,
  className,
  placement = "bottom start",
  offset = 4,
}: MenuPopoverProps) {
  const [side, align = "start"] = placement.split(" ") as [
    "top" | "bottom" | "left" | "right",
    ("start" | "center" | "end")?,
  ]
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={offset}
        className="z-50"
      >
        <BaseMenu.Popup
          className={cn(
            // WDS paper surface (same as Popover).
            "bg-panel text-gray-12 min-w-36 rounded-lg border shadow-lg outline-none",
            // Same entrance recipe as the other overlays.
            "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
            "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
            "data-[starting-style]:data-[side=bottom]:-translate-y-1 data-[starting-style]:data-[side=top]:translate-y-1",
            "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:duration-150",
            className
          )}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

function Menu({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("max-h-[inherit] overflow-auto p-1.5 outline-0", className)}>
      {children}
    </div>
  )
}

interface MenuItemProps {
  children?: ReactNode
  onAction?: () => void
  className?: string
  disabled?: boolean
}

function MenuItem({ children, onAction, className, disabled }: MenuItemProps) {
  return (
    <BaseMenu.Item
      onClick={onAction}
      disabled={disabled}
      className={cn(
        "text-gray-12 relative flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium outline-none select-none [&_svg]:size-4 [&_svg]:shrink-0",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        // Base UI marks the keyboard/pointer-highlighted item with data-highlighted.
        "data-highlighted:bg-gray-3",
        className
      )}
    >
      {children}
    </BaseMenu.Item>
  )
}

function MenuSeparator({ className }: { className?: string }) {
  return (
    <BaseMenu.Separator className={cn("bg-gray-a5 -mx-1 my-1 h-px", className)} />
  )
}

export { Menu, MenuItem, MenuPopover, MenuSeparator, MenuTrigger }
export type { MenuItemProps, MenuPopoverProps }
