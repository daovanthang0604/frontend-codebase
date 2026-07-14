"use client"

import "@workspace/liquid-ui/lib/glass"

import { type ComponentProps, type ReactNode } from "react"
import { Menu as BaseMenu } from "@base-ui/react/menu"
import { Menubar as BaseMenubar } from "@base-ui/react/menubar"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { Check, ChevronRight } from "lucide-react"

// A horizontal application menubar (File / Edit / View …), rebuilt on Base UI's
// Menubar + Menu parts. Base UI's `Menubar` is the bar container (role=menubar);
// each menu inside is a plain `Menu.Root` that reads the menubar context, so its
// Trigger/Portal/Positioner/Popup parts behave as menubar dropdowns. Anatomy
// (shadcn/9ui shape):
//   <Menubar>
//     <MenubarMenu>
//       <MenubarTrigger>File</MenubarTrigger>
//       <MenubarContent>
//         <MenubarItem onAction={…}>New <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
//         <MenubarSeparator />
//         <MenubarSub>
//           <MenubarSubTrigger>Share</MenubarSubTrigger>
//           <MenubarSubContent><MenubarItem>…</MenubarItem></MenubarSubContent>
//         </MenubarSub>
//         <MenubarCheckboxItem checked>…</MenubarCheckboxItem>
//         <MenubarRadioGroup value={v}><MenubarRadioItem value="a">…</MenubarRadioItem></MenubarRadioGroup>
//       </MenubarContent>
//     </MenubarMenu>
//   </Menubar>
// Popup surface + entrance recipe and every item row reuse Menu.tsx's classes so
// menubar dropdowns are visually identical to standalone menus.

// Shared glass surface + entrance recipe for the dropdown popup and every submenu.
const menubarPopupClassName = cn(
  // Liquid glass surface: glass-overlay swaps in the frosted-glass material
  // (fill + blur + rim + sheen + shadow) in place of the solid
  // bg-panel/border/shadow-lg recipe; radius stays Tailwind's.
  "glass-overlay text-gray-12 min-w-36 rounded-lg outline-none",
  // Base UI points --transform-origin at the trigger so it grows from it.
  "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150"
)

// Shared row styling for every interactive dropdown row (item / checkbox / radio
// / submenu trigger). Base UI marks the keyboard/pointer row with data-highlighted
// and an open submenu trigger with data-popup-open.
const menubarItemBase = cn(
  "text-gray-12 relative flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium outline-none select-none [&_svg]:size-4 [&_svg]:shrink-0",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "data-highlighted:bg-gray-3 data-[popup-open]:bg-gray-3"
)

// The horizontal bar itself (role=menubar). A calm bordered strip that holds the
// per-menu triggers.
function Menubar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <BaseMenubar
      className={cn(
        "bg-panel flex items-center gap-0.5 rounded-md border p-0.5",
        className
      )}
    >
      {children}
    </BaseMenubar>
  )
}

// One menu within the bar. Menu.Root reads the enclosing Menubar context, so no
// extra wiring is needed — it just groups this menu's Trigger + Content.
function MenubarMenu({
  children,
  ...props
}: ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root {...props}>{children}</BaseMenu.Root>
}

// A top-level bar button (File / Edit / …). data-popup-open marks the button
// whose menu is open; data-highlighted is the roving-focus / hover state.
function MenubarTrigger({
  children,
  className,
  disabled,
}: {
  children: ReactNode
  className?: string
  disabled?: boolean
}) {
  return (
    <BaseMenu.Trigger
      disabled={disabled}
      className={cn(
        "text-gray-12 flex cursor-pointer items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none select-none",
        "hover:bg-gray-3 data-[popup-open]:bg-gray-3 data-highlighted:bg-gray-3",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
    >
      {children}
    </BaseMenu.Trigger>
  )
}

// The dropdown for a menu: Portal → Positioner → Popup, opening below the bar
// button. The inner div owns padding + scroll so the bordered surface never
// scrolls (same split as Menu.tsx).
function MenubarContent({
  children,
  className,
  offset = 6,
}: {
  children: ReactNode
  className?: string
  offset?: number
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side="bottom"
        align="start"
        sideOffset={offset}
        className="z-50"
      >
        <BaseMenu.Popup className={menubarPopupClassName}>
          <div
            className={cn(
              "max-h-[inherit] overflow-auto p-1.5 outline-0",
              className
            )}
          >
            {children}
          </div>
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

interface MenubarItemProps {
  children?: ReactNode
  onAction?: () => void
  className?: string
  disabled?: boolean
  /** Keep the menu open after clicking (Base UI closes by default). */
  closeOnClick?: boolean
}

function MenubarItem({
  children,
  onAction,
  className,
  disabled,
  closeOnClick,
}: MenubarItemProps) {
  return (
    <BaseMenu.Item
      onClick={onAction}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menubarItemBase, className)}
    >
      {children}
    </BaseMenu.Item>
  )
}

function MenubarSeparator({ className }: { className?: string }) {
  return (
    <BaseMenu.Separator
      className={cn("bg-gray-a5 -mx-1 my-1 h-px", className)}
    />
  )
}

// Right-aligned muted hint (e.g. ⌘P) sitting inside a MenubarItem.
function MenubarShortcut({
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

interface MenubarCheckboxItemProps {
  children?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  /** Checkbox items stay open by default (multi-toggle); pass true to close. */
  closeOnClick?: boolean
}

function MenubarCheckboxItem({
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  closeOnClick = false,
}: MenubarCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menubarItemBase, "pl-8", className)}
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

interface MenubarRadioGroupProps {
  children: ReactNode
  value?: unknown
  defaultValue?: unknown
  onValueChange?: (value: unknown) => void
  className?: string
}

function MenubarRadioGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
}: MenubarRadioGroupProps) {
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

interface MenubarRadioItemProps {
  children?: ReactNode
  value: unknown
  disabled?: boolean
  className?: string
  closeOnClick?: boolean
}

function MenubarRadioItem({
  children,
  value,
  disabled,
  className,
  closeOnClick,
}: MenubarRadioItemProps) {
  return (
    <BaseMenu.RadioItem
      value={value}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(menubarItemBase, "pl-8", className)}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <BaseMenu.RadioItemIndicator>
          {/* `block` is required — an inline span collapses the radio dot to 0h. */}
          <span className="bg-accent-9 block size-2 rounded-full" />
        </BaseMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseMenu.RadioItem>
  )
}

// ── Submenus ─────────────────────────────────────────────────────────────────
// Idiomatic shape: <MenubarSub><MenubarSubTrigger/><MenubarSubContent/></MenubarSub>.

function MenubarSub({
  children,
  ...props
}: ComponentProps<typeof BaseMenu.SubmenuRoot>) {
  return <BaseMenu.SubmenuRoot {...props}>{children}</BaseMenu.SubmenuRoot>
}

function MenubarSubTrigger({
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
      className={cn(menubarItemBase, className)}
    >
      {children}
      <ChevronRight className="text-gray-11 ml-auto size-4" />
    </BaseMenu.SubmenuTrigger>
  )
}

// Submenus open to the side of their trigger; same padded/scroll split as
// MenubarContent, only the default side differs.
function MenubarSubContent({
  children,
  className,
  offset = 4,
}: {
  children: ReactNode
  className?: string
  offset?: number
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side="right"
        align="start"
        sideOffset={offset}
        className="z-50"
      >
        <BaseMenu.Popup className={menubarPopupClassName}>
          <div
            className={cn(
              "max-h-[inherit] overflow-auto p-1.5 outline-0",
              className
            )}
          >
            {children}
          </div>
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
export type {
  MenubarCheckboxItemProps,
  MenubarItemProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
}
