"use client"

import {
  Children,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react"
import { Menu as BaseMenu } from "@base-ui/react/menu"
import { Check, ChevronRight } from "lucide-react"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Menu, rebuilt on Base UI's menu parts. The common
// dropdown usage:
//   <MenuTrigger>
//     <Button/>
//     <MenuPopover><Menu>
//       <MenuItem onAction={…}>…</MenuItem><MenuSeparator/>
//     </Menu></MenuPopover>
//   </MenuTrigger>
// react-aria's collection API (items / sections / createLink) stays deferred —
// this covers the explicit-children pattern the app uses. Beyond the drop-in
// core, the full Base UI / 9ui dropdown-menu anatomy is exposed: submenus
// (MenuSub/MenuSubTrigger/MenuSubContent), MenuGroup/MenuGroupLabel,
// MenuCheckboxItem, MenuRadioGroup/MenuRadioItem, and MenuShortcut.

// Shared paper surface + entrance recipe for the root popup and every submenu.
const menuPopupClassName = cn(
  // WDS paper surface (same as Popover).
  "bg-panel text-gray-12 min-w-36 rounded-lg border shadow-lg outline-none",
  // Same entrance recipe as the other overlays; Base UI points
  // --transform-origin at the trigger so it grows from it.
  "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:duration-150"
)

// Shared row styling for every interactive menu row (item / checkbox / radio /
// submenu trigger). Base UI marks the keyboard/pointer row with data-highlighted
// and an open submenu trigger with data-popup-open.
const menuItemBase = cn(
  "text-gray-12 relative flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium outline-none select-none [&_svg]:size-4 [&_svg]:shrink-0",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "data-highlighted:bg-gray-3 data-[popup-open]:bg-gray-3"
)

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

// The Portal/Positioner/Popup surface, shared by the root popover and submenus.
// Base UI's Portal/Positioner/Popup read the nearest menu (or submenu) context,
// so the same wrapper serves both — only the default side differs.
function MenuSurface({
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
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={offset}
        className="z-50"
      >
        <BaseMenu.Popup className={cn(menuPopupClassName, className)}>
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
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
    <MenuSurface side={side} align={align} offset={offset} className={className}>
      {children}
    </MenuSurface>
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
    <div
      className={cn("max-h-[inherit] overflow-auto p-1.5 outline-0", className)}
    >
      {children}
    </div>
  )
}

interface MenuItemProps {
  children?: ReactNode
  onAction?: () => void
  className?: string
  disabled?: boolean
  /** Keep the menu open after clicking (Base UI closes by default). */
  closeOnClick?: boolean
}

function MenuItem({
  children,
  onAction,
  className,
  disabled,
  closeOnClick,
}: MenuItemProps) {
  return (
    <BaseMenu.Item
      onClick={onAction}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menuItemBase, className)}
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

function MenuGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <BaseMenu.Group className={className}>{children}</BaseMenu.Group>
}

// A section label. Base UI's GroupLabel throws unless it's inside a Menu.Group;
// the app more often wants a standalone header (like ui's MenuHeader / the
// Filter's "Filter by"), so this is a plain presentation div that works anywhere.
// Wrap it + its items in <MenuGroup> when you want the aria grouping too.
function MenuGroupLabel({
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

interface MenuCheckboxItemProps {
  children?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  /** Checkbox items stay open by default (multi-toggle); pass true to close. */
  closeOnClick?: boolean
}

function MenuCheckboxItem({
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  closeOnClick = false,
}: MenuCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menuItemBase, "pl-8", className)}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <BaseMenu.CheckboxItemIndicator>
          <Check className="text-accent-11 size-4" strokeWidth={2.5} />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseMenu.CheckboxItem>
  )
}

interface MenuRadioGroupProps {
  children: ReactNode
  value?: unknown
  defaultValue?: unknown
  onValueChange?: (value: unknown) => void
  className?: string
}

function MenuRadioGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
}: MenuRadioGroupProps) {
  return (
    <BaseMenu.RadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </BaseMenu.RadioGroup>
  )
}

interface MenuRadioItemProps {
  children?: ReactNode
  value: unknown
  disabled?: boolean
  className?: string
  closeOnClick?: boolean
}

function MenuRadioItem({
  children,
  value,
  disabled,
  className,
  closeOnClick,
}: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem
      value={value}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menuItemBase, "pl-8", className)}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <BaseMenu.RadioItemIndicator>
          <span className="bg-accent-9 block size-2 rounded-full" />
        </BaseMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseMenu.RadioItem>
  )
}

// Right-aligned muted hint (e.g. ⌘P) sitting inside a MenuItem.
function MenuShortcut({
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
// Idiomatic shadcn/9ui shape: <MenuSub><MenuSubTrigger/><MenuSubContent/></MenuSub>.

function MenuSub({
  children,
  ...props
}: ComponentProps<typeof BaseMenu.SubmenuRoot>) {
  return <BaseMenu.SubmenuRoot {...props}>{children}</BaseMenu.SubmenuRoot>
}

function MenuSubTrigger({
  children,
  className,
  disabled,
}: {
  children: ReactNode
  className?: string
  disabled?: boolean
}) {
  return (
    <BaseMenu.SubmenuTrigger
      disabled={disabled}
      className={cn(menuItemBase, className)}
    >
      {children}
      <ChevronRight className="text-gray-11 ml-auto size-4" />
    </BaseMenu.SubmenuTrigger>
  )
}

function MenuSubContent({
  children,
  className,
  placement = "right start",
  offset = 4,
}: {
  children: ReactNode
  className?: string
  placement?: string
  offset?: number
}) {
  const [side, align = "start"] = placement.split(" ") as [
    "top" | "bottom" | "left" | "right",
    ("start" | "center" | "end")?,
  ]
  return (
    <MenuSurface side={side} align={align} offset={offset} className={className}>
      {children}
    </MenuSurface>
  )
}

export {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopover,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
}
export type {
  MenuCheckboxItemProps,
  MenuItemProps,
  MenuPopoverProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
}
