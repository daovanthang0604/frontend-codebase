"use client"

import { type ComponentProps, type ReactNode } from "react"
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu"
import { Check, ChevronRight } from "lucide-react"

import { cn } from "@workspace/base-ui/lib/utils"

// Right-click sibling of Menu.tsx, rebuilt on Base UI's context-menu parts. The
// context-menu namespace re-exports the same Portal/Positioner/Popup/Item/… as
// the menu, so styling mirrors Menu.tsx one-to-one — only the Root/Trigger and
// the sensible-for-a-cursor positioning defaults differ. Idiomatic shape:
//   <ContextMenu>
//     <ContextMenuTrigger>…right-clickable area…</ContextMenuTrigger>
//     <ContextMenuContent>
//       <ContextMenuItem onAction={…}>…</ContextMenuItem><ContextMenuSeparator/>
//     </ContextMenuContent>
//   </ContextMenu>
// Full anatomy is exposed: submenus (ContextMenuSub/SubTrigger/SubContent),
// ContextMenuGroup/GroupLabel, ContextMenuCheckboxItem,
// ContextMenuRadioGroup/RadioItem, and ContextMenuShortcut.

// Shared paper surface + entrance recipe for the root popup and every submenu.
const menuPopupClassName = cn(
  // WDS paper surface (same as Popover / Menu).
  "bg-panel text-gray-12 min-w-36 rounded-lg border shadow-lg outline-none",
  // Same entrance recipe as the other overlays; Base UI points
  // --transform-origin at the anchor so it grows from it.
  "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:duration-150"
)

// Shared row styling for every interactive row (item / checkbox / radio /
// submenu trigger). Base UI marks the keyboard/pointer row with data-highlighted
// and an open submenu trigger with data-popup-open.
const menuItemBase = cn(
  "text-gray-12 relative flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium outline-none select-none [&_svg]:size-4 [&_svg]:shrink-0",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "data-highlighted:bg-gray-3 data-[popup-open]:bg-gray-3"
)

// Root — owns the open state and wires up the right-click / long-press behavior.
function ContextMenu(props: ComponentProps<typeof BaseContextMenu.Root>) {
  return <BaseContextMenu.Root {...props} />
}

// The right-clickable area. Base UI renders a <div>; pass `render` to reuse an
// existing element instead of nesting one.
function ContextMenuTrigger(
  props: ComponentProps<typeof BaseContextMenu.Trigger>
) {
  return <BaseContextMenu.Trigger {...props} />
}

// The Portal/Positioner/Popup surface, shared by the root content and submenus.
// Base UI's Portal/Positioner/Popup read the nearest context-menu (or submenu)
// context, so the same wrapper serves both — only the default side differs.
function ContextMenuSurface({
  children,
  className,
  side,
  align,
  offset,
}: {
  children: ReactNode
  className?: string
  side: "top" | "bottom" | "left" | "right"
  align: "start" | "center" | "end"
  offset: number
}) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner
        side={side}
        align={align}
        sideOffset={offset}
        className="z-50"
      >
        <BaseContextMenu.Popup className={cn(menuPopupClassName, className)}>
          <div className="max-h-[inherit] overflow-auto p-1.5 outline-0">
            {children}
          </div>
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  )
}

interface ContextMenuContentProps {
  children: ReactNode
  className?: string
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  offset?: number
}

// A context menu grows down-and-right from the cursor, so its corner sits at the
// pointer (side "bottom" + align "start"), unlike a dropdown that hangs off a
// trigger edge.
function ContextMenuContent({
  children,
  className,
  side = "bottom",
  align = "start",
  offset = 4,
}: ContextMenuContentProps) {
  return (
    <ContextMenuSurface
      side={side}
      align={align}
      offset={offset}
      className={className}
    >
      {children}
    </ContextMenuSurface>
  )
}

interface ContextMenuItemProps {
  children?: ReactNode
  onAction?: () => void
  className?: string
  disabled?: boolean
  /** Keep the menu open after clicking (Base UI closes by default). */
  closeOnClick?: boolean
}

function ContextMenuItem({
  children,
  onAction,
  className,
  disabled,
  closeOnClick,
}: ContextMenuItemProps) {
  return (
    <BaseContextMenu.Item
      onClick={onAction}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menuItemBase, className)}
    >
      {children}
    </BaseContextMenu.Item>
  )
}

function ContextMenuSeparator({ className }: { className?: string }) {
  return (
    <BaseContextMenu.Separator
      className={cn("bg-gray-a5 -mx-1 my-1 h-px", className)}
    />
  )
}

function ContextMenuGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <BaseContextMenu.Group className={className}>
      {children}
    </BaseContextMenu.Group>
  )
}

// A section label. Base UI's GroupLabel throws unless it's inside a
// ContextMenu.Group; the app more often wants a standalone header, so this is a
// plain presentation div that works anywhere. Wrap it + its items in
// <ContextMenuGroup> when you want the aria grouping too.
function ContextMenuGroupLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="presentation"
      className={cn(
        "text-gray-11 px-2.5 py-1.5 text-[11px] tracking-wide uppercase",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ContextMenuCheckboxItemProps {
  children?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  /** Checkbox items stay open by default (multi-toggle); pass true to close. */
  closeOnClick?: boolean
}

function ContextMenuCheckboxItem({
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  closeOnClick = false,
}: ContextMenuCheckboxItemProps) {
  return (
    <BaseContextMenu.CheckboxItem
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menuItemBase, "pl-8", className)}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <BaseContextMenu.CheckboxItemIndicator>
          <Check className="text-accent-11 size-4" strokeWidth={2.5} />
        </BaseContextMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseContextMenu.CheckboxItem>
  )
}

interface ContextMenuRadioGroupProps {
  children: ReactNode
  value?: unknown
  defaultValue?: unknown
  onValueChange?: (value: unknown) => void
  className?: string
}

function ContextMenuRadioGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
}: ContextMenuRadioGroupProps) {
  return (
    <BaseContextMenu.RadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </BaseContextMenu.RadioGroup>
  )
}

interface ContextMenuRadioItemProps {
  children?: ReactNode
  value: unknown
  disabled?: boolean
  className?: string
  closeOnClick?: boolean
}

function ContextMenuRadioItem({
  children,
  value,
  disabled,
  className,
  closeOnClick,
}: ContextMenuRadioItemProps) {
  return (
    <BaseContextMenu.RadioItem
      value={value}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menuItemBase, "pl-8", className)}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <BaseContextMenu.RadioItemIndicator>
          {/* `block` so the span honors its size — an inline span ignores it. */}
          <span className="bg-accent-9 block size-2 rounded-full" />
        </BaseContextMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseContextMenu.RadioItem>
  )
}

// Right-aligned muted hint (e.g. ⌘P) sitting inside a ContextMenuItem.
function ContextMenuShortcut({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn("text-gray-10 ml-auto text-xs tracking-widest", className)}
    >
      {children}
    </span>
  )
}

// ── Submenus ─────────────────────────────────────────────────────────────────
// Idiomatic shadcn/9ui shape:
// <ContextMenuSub><ContextMenuSubTrigger/><ContextMenuSubContent/></ContextMenuSub>.

function ContextMenuSub(
  props: ComponentProps<typeof BaseContextMenu.SubmenuRoot>
) {
  return <BaseContextMenu.SubmenuRoot {...props} />
}

function ContextMenuSubTrigger({
  children,
  className,
  disabled,
}: {
  children: ReactNode
  className?: string
  disabled?: boolean
}) {
  return (
    <BaseContextMenu.SubmenuTrigger
      disabled={disabled}
      className={cn(menuItemBase, className)}
    >
      {children}
      <ChevronRight className="text-gray-11 ml-auto size-4" />
    </BaseContextMenu.SubmenuTrigger>
  )
}

function ContextMenuSubContent({
  children,
  className,
  side = "right",
  align = "start",
  offset = 4,
}: ContextMenuContentProps) {
  return (
    <ContextMenuSurface
      side={side}
      align={align}
      offset={offset}
      className={className}
    >
      {children}
    </ContextMenuSurface>
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
export type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
}
