"use client"

import "@workspace/liquid-ui/lib/glass"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { Combobox } from "@base-ui/react/combobox"
import { Dialog } from "@base-ui/react/dialog"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { Search } from "lucide-react"

// A ⌘K command palette on Base UI Dialog + Combobox. cmdk/raycast-style
// compositional API (Command / CommandGroup / CommandItem written as children),
// with Base UI driving the keyboard nav (arrows/enter) and the type-to-filter.
//
//   <CommandDialog open={open} onOpenChange={setOpen}>
//     <CommandInput placeholder="Type a command…" />
//     <CommandList>
//       <CommandEmpty>No results.</CommandEmpty>
//       <CommandGroup heading="Actions">
//         <CommandItem value="new-file" onSelect={run}>
//           New File <CommandShortcut>⌘N</CommandShortcut>
//         </CommandItem>
//       </CommandGroup>
//     </CommandList>
//   </CommandDialog>
//
// The one non-obvious bit: Base UI's Combobox only runs its built-in filter —
// and <Combobox.Empty> only reports emptiness — when the root is handed an
// `items` array; static <Combobox.Item> children are never auto-filtered. To
// keep the authoring API compositional, each CommandItem registers its `value`
// into a small root-level registry that feeds that `items` prop, and renders
// only while its value is in the filtered set (so a filtered-out row also drops
// out of the keyboard-nav order). Filtering therefore matches the item `value`.

// Register before paint so the root's `items` — and thus the filtered set and
// <Combobox.Empty> — are already correct on the first frame (no flash of the
// empty state when the palette opens). Falls back to useEffect on the server.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

interface CommandRegistry {
  register: (value: string) => void
  unregister: (value: string) => void
}

const CommandRegistryContext = createContext<CommandRegistry>({
  register: () => {},
  unregister: () => {},
})

interface CommandProps {
  children: ReactNode
  className?: string
}

// The inline (anchor-less, always-open) Combobox root — the list lives directly
// in the panel rather than in a portalled popup, same shape as FilterSelect.
function Command({ children, className }: CommandProps) {
  // Every mounted item's value. Base UI needs it as `items` to run its filter
  // and to power <Combobox.Empty>.
  const [items, setItems] = useState<string[]>([])
  const register = useCallback((value: string) => {
    setItems((prev) => (prev.includes(value) ? prev : [...prev, value]))
  }, [])
  const unregister = useCallback((value: string) => {
    setItems((prev) => prev.filter((v) => v !== value))
  }, [])
  const registry = useMemo(
    () => ({ register, unregister }),
    [register, unregister]
  )

  return (
    <CommandRegistryContext.Provider value={registry}>
      <Combobox.Root items={items} open onOpenChange={() => {}}>
        <div
          className={cn(
            // Liquid glass surface: glass-overlay swaps in the frosted-glass
            // material (fill + blur + rim + sheen + shadow) in place of the
            // solid bg-panel/border recipe; radius stays Tailwind's. Also used
            // standalone (no Dialog), so the glass material lives here rather
            // than on CommandDialog's Popup, which only adds elevation shadow.
            "glass-overlay text-gray-12 flex flex-col overflow-hidden rounded-xl",
            className
          )}
        >
          {children}
        </div>
      </Combobox.Root>
    </CommandRegistryContext.Provider>
  )
}

interface CommandDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

// Centered modal wrapper around a Command (Portal / Backdrop / Popup).
function CommandDialog({ open, onOpenChange, children }: CommandDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "glass-scrim fixed inset-0 z-50",
            "transition-opacity duration-200 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
          )}
        />
        <Dialog.Popup
          className={cn(
            // The Command inside supplies the glass surface + radius; the Popup
            // owns centering, width, shadow and the zoom entrance.
            "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl p-0 shadow-2xl outline-none",
            "origin-center transition-[opacity,scale] duration-200 ease-out",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150"
          )}
        >
          {/* Accessible name for the dialog; the palette shows no visible title. */}
          <Dialog.Title className="sr-only">Command Menu</Dialog.Title>
          <Command>{children}</Command>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function CommandInput({
  className,
  ...props
}: ComponentProps<typeof Combobox.Input>) {
  return (
    <div className="flex items-center gap-2 border-b px-3">
      <Search className="text-gray-9 size-4 shrink-0" />
      <Combobox.Input
        className={cn(
          "placeholder:text-gray-8 text-gray-12 h-11 w-full bg-transparent text-sm outline-none",
          className
        )}
        {...props}
      />
    </div>
  )
}

interface CommandListProps {
  children: ReactNode
  className?: string
}

function CommandList({ children, className }: CommandListProps) {
  return (
    <div className={cn("max-h-[320px] overflow-auto p-1.5", className)}>
      <Combobox.List>{children}</Combobox.List>
    </div>
  )
}

interface CommandGroupProps {
  children: ReactNode
  heading?: ReactNode
  className?: string
}

function CommandGroup({ children, heading, className }: CommandGroupProps) {
  return (
    <Combobox.Group
      // Collapse the whole group (heading included) once the filter empties it.
      className={cn("[&:not(:has([role=option]))]:hidden", className)}
    >
      {heading != null && (
        <Combobox.GroupLabel className="text-gray-11 px-2 py-1.5 text-[11px] uppercase">
          {heading}
        </Combobox.GroupLabel>
      )}
      {children}
    </Combobox.Group>
  )
}

interface CommandItemProps {
  value: string
  onSelect?: (value: string) => void
  children: ReactNode
  className?: string
}

function CommandItem({
  value,
  onSelect,
  children,
  className,
}: CommandItemProps) {
  const filtered = Combobox.useFilteredItems<string>()
  const { register, unregister } = useContext(CommandRegistryContext)

  useIsoLayoutEffect(() => {
    register(value)
    return () => unregister(value)
  }, [value, register, unregister])

  // Leave the tree (and the keyboard-nav order) while filtered out.
  if (!filtered.includes(value)) {
    return null
  }

  return (
    <Combobox.Item
      value={value}
      // Base UI fires this on pointer click and on Enter while highlighted.
      onClick={() => onSelect?.(value)}
      className={cn(
        "data-highlighted:bg-gray-3 text-gray-12 flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm outline-none select-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
    >
      {children}
    </Combobox.Item>
  )
}

function CommandEmpty({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <Combobox.Empty
      className={cn("text-gray-11 py-6 text-center text-sm", className)}
    >
      {children}
    </Combobox.Empty>
  )
}

function CommandSeparator({ className }: { className?: string }) {
  return <div className={cn("bg-gray-a5 -mx-1 my-1 h-px", className)} />
}

// Right-aligned muted hint (e.g. ⌘N) sitting inside a CommandItem.
function CommandShortcut({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn("text-gray-10 ml-auto text-xs", className)}>
      {children}
    </span>
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
export type {
  CommandDialogProps,
  CommandGroupProps,
  CommandItemProps,
  CommandListProps,
  CommandProps,
}
