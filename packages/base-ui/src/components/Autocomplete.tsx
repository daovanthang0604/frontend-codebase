"use client"

import { type ComponentProps, type ReactNode } from "react"
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete"
import { Search } from "lucide-react"

import { cn } from "@workspace/base-ui/lib/utils"

// A free-text input with a suggestion popup, built on Base UI Autocomplete.
// Unlike Combobox this is NOT a strict select: the `value` is the typed input
// string (`onValueChange` gives the string), and picking a suggestion just
// fills the input with it. Items are plain strings.
//
//   <Autocomplete items={suggestions} value={q} onValueChange={setQ}>
//     <AutocompleteInput placeholder="Search…" />
//     <AutocompleteContent emptyMessage="No suggestions">
//       {(item) => <AutocompleteItem key={item} value={item} />}
//     </AutocompleteContent>
//   </Autocomplete>

// The white paper surface + entrance recipe shared by every base-ui overlay.
const overlayPopup = cn(
  "bg-panel text-gray-12 min-w-[var(--anchor-width)] rounded-lg border shadow-lg outline-none",
  "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:duration-150"
)

interface AutocompleteProps {
  items: string[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

function Autocomplete({
  items,
  value,
  defaultValue,
  onValueChange,
  children,
}: AutocompleteProps) {
  return (
    <BaseAutocomplete.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      {children}
    </BaseAutocomplete.Root>
  )
}

function AutocompleteInput({
  className,
  ...props
}: ComponentProps<typeof BaseAutocomplete.Input>) {
  return (
    <div className="relative w-full">
      <Search className="text-gray-9 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <BaseAutocomplete.Input
        className={cn(
          // WDS Input control look: white paper, hairline border, accent focus halo.
          "bg-panel border-gray-a7 text-gray-12 placeholder:text-gray-8 h-9 w-full rounded-md border pr-3 pl-9 text-sm outline-none",
          "transition-[box-shadow,border-color] duration-150",
          "focus-visible:border-accent-8 focus-visible:ring-ring/30 focus-visible:ring-[3px]",
          className
        )}
        {...props}
      />
    </div>
  )
}

interface AutocompleteContentProps {
  children: (item: string) => ReactNode
  emptyMessage?: string
  className?: string
}

function AutocompleteContent({
  children,
  emptyMessage = "No suggestions",
  className,
}: AutocompleteContentProps) {
  return (
    <BaseAutocomplete.Portal>
      <BaseAutocomplete.Positioner
        side="bottom"
        align="start"
        sideOffset={4}
        className="z-50"
      >
        <BaseAutocomplete.Popup className={cn(overlayPopup, className)}>
          <div className="max-h-[300px] overflow-auto py-1">
            <BaseAutocomplete.List>{children}</BaseAutocomplete.List>
            <AutocompleteEmpty>{emptyMessage}</AutocompleteEmpty>
          </div>
        </BaseAutocomplete.Popup>
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  )
}

interface AutocompleteItemProps {
  value: string
  children?: ReactNode
}

// Suggestion row: same highlight/typography as the Combobox option row, but no
// selected indicator — autocomplete has no persistent selection, clicking just
// fills the input.
function AutocompleteItem({ value, children }: AutocompleteItemProps) {
  return (
    <BaseAutocomplete.Item
      value={value}
      className={cn(
        "flex w-full cursor-pointer items-center px-3 py-1.5 text-left text-sm outline-none",
        "data-highlighted:bg-gray-3 text-gray-11 transition-colors"
      )}
    >
      <span className="flex-1 truncate">{children ?? value}</span>
    </BaseAutocomplete.Item>
  )
}

function AutocompleteEmpty({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <BaseAutocomplete.Empty
      className={cn("text-gray-11 px-3 py-6 text-center text-sm", className)}
    >
      {children}
    </BaseAutocomplete.Empty>
  )
}

export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
  AutocompleteEmpty,
}
export type { AutocompleteProps }
