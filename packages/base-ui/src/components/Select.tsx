"use client"

import type { ComponentProps, ReactNode } from "react"
import { Select as BaseSelect } from "@base-ui/react/select"
import { Check, ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"

import { cn } from "@workspace/base-ui/lib/utils"

// Styled single-select on Base UI's Select parts (Root/Trigger/Value/Icon/
// Portal/Positioner/Popup/List/Item/ItemIndicator/Group/GroupLabel/Separator +
// ScrollUp/DownArrow). API mirrors shadcn's Select naming while keeping Base UI's
// prop names on the Root:
//   <Select value={v} onValueChange={setV} items={items}>
//     <SelectTrigger placeholder="Pick one" />
//     <SelectContent>
//       <SelectItem value="a">A</SelectItem>
//     </SelectContent>
//   </Select>

// The trigger looks like the Input control (h-9 paper tray, hairline border,
// accent focus ring) rather than Input's h-11 field-group.
const triggerClassName = cn(
  "bg-panel border-gray-a7 text-gray-12 flex h-9 w-full items-center gap-2 rounded-md border px-3 text-sm outline-none transition-[box-shadow,border-color] duration-150",
  "focus-visible:border-accent-8 focus-visible:ring-accent-8 focus-visible:ring-2 focus-visible:ring-inset",
  "data-[popup-open]:border-accent-8",
  "data-disabled:cursor-not-allowed data-disabled:opacity-60"
)

// Shared paper surface + entrance recipe (same as Popover/Menu overlays). Base UI
// points --transform-origin at the trigger so it grows from it. (Tailwind v4 emits
// scale/translate as their own props, so name them — never transition-transform.)
const popupClassName = cn(
  "bg-panel text-gray-12 relative min-w-[var(--anchor-width)] rounded-lg border shadow-lg outline-none",
  "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:duration-150"
)

// Hover-to-scroll affordance shown only when the list overflows. Base UI renders
// it position:absolute; we pin it to the top/bottom edge and mask the list behind.
const scrollArrowClassName = cn(
  "bg-panel text-gray-11 absolute inset-x-0 z-10 flex h-6 cursor-default items-center justify-center [&_svg]:size-4"
)

// Root — pass-through alias so all Base UI props (value/defaultValue/
// onValueChange/items/multiple/…) and their generics stay intact.
const Select = BaseSelect.Root

interface SelectTriggerProps
  extends Omit<ComponentProps<typeof BaseSelect.Trigger>, "children"> {
  placeholder?: ReactNode
}

function SelectTrigger({ placeholder, className, ...props }: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger className={cn(triggerClassName, className)} {...props}>
      <BaseSelect.Value
        placeholder={placeholder}
        className="min-w-0 flex-1 truncate text-left data-[placeholder]:text-gray-8"
      />
      <BaseSelect.Icon className="text-gray-9 flex shrink-0">
        <ChevronsUpDown className="size-4" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

interface SelectContentProps extends ComponentProps<typeof BaseSelect.Popup> {
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
}

function SelectContent({
  children,
  className,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        // Position like a normal dropdown below the trigger instead of overlapping
        // it, so the entrance animation reads from the trigger.
        alignItemWithTrigger={false}
        className="z-50"
      >
        <BaseSelect.Popup className={cn(popupClassName, className)} {...props}>
          <BaseSelect.ScrollUpArrow className={cn(scrollArrowClassName, "top-0")}>
            <ChevronUp />
          </BaseSelect.ScrollUpArrow>
          <BaseSelect.List className="max-h-[var(--available-height)] overflow-y-auto overscroll-contain p-1 outline-none">
            {children}
          </BaseSelect.List>
          <BaseSelect.ScrollDownArrow
            className={cn(scrollArrowClassName, "bottom-0")}
          >
            <ChevronDown />
          </BaseSelect.ScrollDownArrow>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

function SelectItem({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      className={cn(
        "text-gray-12 relative flex cursor-pointer items-center rounded-sm py-2 pr-2.5 pl-8 text-sm outline-none select-none",
        "data-highlighted:bg-gray-3",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <BaseSelect.ItemIndicator>
          <Check className="text-accent-11 size-4" strokeWidth={2.5} />
        </BaseSelect.ItemIndicator>
      </span>
      <BaseSelect.ItemText className="truncate">{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}

function SelectGroup({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Group>) {
  return <BaseSelect.Group className={className} {...props} />
}

// GroupLabel throws outside a Select.Group — only render it inside <SelectGroup>.
function SelectGroupLabel({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      className={cn(
        "text-gray-11 px-2.5 py-1.5 text-[11px] tracking-wide uppercase",
        className
      )}
      {...props}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Separator>) {
  return (
    <BaseSelect.Separator
      className={cn("bg-gray-a5 my-1 h-px", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
}
export type { SelectContentProps, SelectTriggerProps }
