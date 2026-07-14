"use client"

import { useMemo, useState } from "react"
import { Button } from "@workspace/liquid-ui/components/Button"
import { SearchInput } from "@workspace/liquid-ui/components/Input"
import {
  Menu,
  MenuGroupLabel,
  MenuPopover,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@workspace/liquid-ui/components/Menu"
import { ListFilter as FilterIcon } from "lucide-react"

import { FilterItemProvider, useFilterContext } from "./Filter.store"
import {
  isFilterItem,
  type FilterBuilderItem,
  type FilterBuilderProps,
} from "./Filter.types"

export function FilterBuilder({ items }: FilterBuilderProps) {
  const { value: filters } = useFilterContext()
  const [search, setSearch] = useState("")
  // Controlled so a single-select field can close the whole menu (Base UI has no
  // react-aria RootMenuTriggerState; close is driven through the store's onClose).
  const [open, setOpen] = useState(false)

  const visibleItems = useMemo(
    () =>
      items.filter((entry) => {
        if (!isFilterItem(entry)) return !search
        if (!search) return true
        const text =
          typeof entry.label === "string"
            ? entry.label.toLowerCase()
            : entry.field.toLowerCase()
        return text.includes(search.toLowerCase())
      }),
    [items, search]
  )

  return (
    <MenuTrigger
      isOpen={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) setSearch("")
      }}
    >
      <Button
        size="sm"
        variant="ghost"
        intent="secondary"
        aria-label="Filter"
        tooltip="Filter"
      >
        <FilterIcon aria-hidden />
      </Button>

      <MenuPopover placement="bottom start" className="p-0">
        <div className="flex max-h-[400px] min-w-[200px] flex-col">
          <div className="border-gray-6 border-b p-2">
            <SearchInput
              placeholder="Filter..."
              className="placeholder:text-gray-8 h-7 rounded border-0 border-none! bg-transparent px-2 text-xs ring-0!"
              value={search}
              onChange={setSearch}
            />
          </div>

          {visibleItems.length === 0 ? (
            <div className="text-gray-11 px-3 py-4 text-center text-xs">
              No matching filters
            </div>
          ) : (
            <Menu className="flex-1 overflow-auto">
              <MenuGroupLabel>Filter by</MenuGroupLabel>

              {visibleItems.map((entry, index) => {
                if (!isFilterItem(entry)) {
                  return <MenuSeparator key={`separator-${index}`} />
                }

                const hasValue = filters[entry.field] != null
                const isDisabled = entry.isDisabled ?? false

                return (
                  <MenuSub key={entry.field}>
                    <MenuSubTrigger disabled={isDisabled}>
                      <span className="flex items-center gap-2">
                        {entry.icon && (
                          <span className="text-gray-12">{entry.icon}</span>
                        )}
                        <span
                          className={hasValue ? "text-gray-12" : "text-gray-11"}
                        >
                          {entry.label}
                        </span>
                      </span>
                    </MenuSubTrigger>
                    <MenuSubContent className="p-0">
                      <FilterSubmenu
                        item={entry}
                        onClose={() => setOpen(false)}
                      />
                    </MenuSubContent>
                  </MenuSub>
                )
              })}
            </Menu>
          )}
        </div>
      </MenuPopover>
    </MenuTrigger>
  )
}

function FilterSubmenu({
  item,
  onClose,
}: {
  item: FilterBuilderItem
  onClose: () => void
}) {
  return (
    <FilterItemProvider item={item} mode="builder" onClose={onClose}>
      {item.render("builder")}
    </FilterItemProvider>
  )
}
