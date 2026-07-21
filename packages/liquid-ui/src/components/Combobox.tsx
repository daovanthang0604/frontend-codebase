"use client"

import "@workspace/liquid-ui/lib/glass"

import { createContext, useContext, type ReactNode } from "react"
import { Combobox as BaseCombobox } from "@base-ui/react/combobox"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { Check, ChevronsUpDown, Search } from "lucide-react"

// A STANDALONE searchable single-select, built on Base UI Combobox. Unlike the
// Filter's always-open inline combobox (FilterSelect), this owns a trigger that
// looks like the Input control and opens a portalled popup with an in-popup
// search field + a scrollable, filtered list. Item values are `{ value, label }`
// objects; selection is matched by `value` and the label drives display/search.
//
//   <Combobox items={opts} value={v} onValueChange={setV} placeholder="Pick one">
//     <ComboboxTrigger />
//     <ComboboxContent searchPlaceholder="Search…" emptyMessage="No results">
//       {(item) => <ComboboxItem key={item.value} item={item} />}
//     </ComboboxContent>
//   </Combobox>

interface ComboboxOption {
  value: string
  label: string
}

// The trigger and root are separate components, so the placeholder set on the
// root is shared down to the trigger's value display via context.
const ComboboxContext = createContext<{ placeholder?: string }>({})

// Liquid glass surface: glass-overlay swaps in the frosted-glass material
// (fill + blur + rim + sheen + shadow) in place of the solid bg-panel/border/
// shadow-lg recipe; radius stays Tailwind's. Same entrance recipe as every
// other base-ui overlay.
const overlayPopup = cn(
  "glass-overlay text-gray-12 min-w-[var(--anchor-width)] rounded-lg outline-none",
  "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150"
)

interface ComboboxProps {
  items: ComboboxOption[]
  value?: ComboboxOption | null
  defaultValue?: ComboboxOption | null
  onValueChange?: (value: ComboboxOption | null) => void
  placeholder?: string
  children: ReactNode
}

function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  children,
}: ComboboxProps) {
  return (
    <ComboboxContext.Provider value={{ placeholder }}>
      <BaseCombobox.Root
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        // Object items don't match referentially across renders, so compare by
        // value; label is what shows in the input and drives the filter.
        isItemEqualToValue={(a: ComboboxOption, b: ComboboxOption) =>
          a.value === b.value
        }
        itemToStringLabel={(o: ComboboxOption) => o.label}
      >
        {children}
      </BaseCombobox.Root>
    </ComboboxContext.Provider>
  )
}

interface ComboboxTriggerProps {
  disabled?: boolean
  className?: string
}

function ComboboxTrigger({ disabled, className }: ComboboxTriggerProps) {
  const { placeholder } = useContext(ComboboxContext)
  return (
    <BaseCombobox.Trigger
      disabled={disabled}
      className={cn(
        // WDS Input control look: white paper, hairline border, accent focus halo.
        "bg-panel border-gray-a7 text-gray-12 flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm outline-none",
        "transition-[box-shadow,border-color] duration-150",
        "focus-visible:border-accent-8 focus-visible:ring-ring/30 focus-visible:ring-[3px]",
        "data-[popup-open]:border-accent-8",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      <BaseCombobox.Value>
        {(selected: ComboboxOption | null) =>
          selected ? (
            <span className="truncate">{selected.label}</span>
          ) : (
            <span className="text-gray-8 truncate">{placeholder}</span>
          )
        }
      </BaseCombobox.Value>
      <ChevronsUpDown className="text-gray-9 size-4 shrink-0" />
    </BaseCombobox.Trigger>
  )
}

interface ComboboxContentProps {
  children: (item: ComboboxOption) => ReactNode
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
}

function ComboboxContent({
  children,
  searchPlaceholder = "Search…",
  emptyMessage = "No results",
  className,
}: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        side="bottom"
        align="start"
        sideOffset={4}
        className="z-50"
      >
        <BaseCombobox.Popup className={cn(overlayPopup, className)}>
          <div className="border-gray-6 flex items-center gap-2 border-b px-3">
            <Search className="text-gray-9 size-4 shrink-0" />
            <BaseCombobox.Input
              placeholder={searchPlaceholder}
              className="placeholder:text-gray-8 text-gray-12 h-9 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="max-h-[300px] overflow-auto py-1">
            <BaseCombobox.List>{children}</BaseCombobox.List>
            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          </div>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  )
}

interface ComboboxItemProps {
  item: ComboboxOption
}

// Option row ported from the Filter's OptionItem: highlight on keyboard/pointer,
// darker text when selected, trailing Check via ItemIndicator (single-select).
function ComboboxItem({ item }: ComboboxItemProps) {
  return (
    <BaseCombobox.Item
      value={item}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm outline-none",
        "data-highlighted:bg-gray-3 transition-colors",
        "text-gray-11 data-selected:text-gray-12"
      )}
    >
      <span className="flex-1 truncate">{item.label}</span>
      <BaseCombobox.ItemIndicator className="text-accent-9">
        <Check className="size-4" strokeWidth={2.5} />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  )
}

function ComboboxEmpty({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <BaseCombobox.Empty
      className={cn("text-gray-11 px-3 py-6 text-center text-sm", className)}
    >
      {children}
    </BaseCombobox.Empty>
  )
}

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
}
export type { ComboboxOption, ComboboxProps }
