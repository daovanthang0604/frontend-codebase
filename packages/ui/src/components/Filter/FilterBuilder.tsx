"use client"

import { useMemo, useState } from "react"
import { Button } from "@workspace/ui/components/Button"
import { SearchInput } from "@workspace/ui/components/Input"
import {
  Menu,
  MenuHeader,
  MenuItem,
  MenuPopover,
  MenuSeparator,
  MenuSubTrigger,
  MenuTrigger,
} from "@workspace/ui/components/Menu"
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

  const disabledKeys = useMemo(
    () =>
      visibleItems
        .filter(
          (entry): entry is FilterBuilderItem =>
            isFilterItem(entry) && entry.isDisabled === true
        )
        .map((entry) => entry.field),
    [visibleItems]
  )

  return (
    <MenuTrigger
      onOpenChange={(isOpen) => {
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
              autoFocus
              placeholder="Filter..."
              className="placeholder:text-gray-8 h-7 rounded border-0 border-none! bg-transparent px-2 text-xs ring-0!"
              onChange={(value) => setSearch(value)}
            />
          </div>

          {visibleItems.length === 0 ? (
            <div className="text-gray-11 px-3 py-4 text-center text-xs">
              No matching filters
            </div>
          ) : (
            <Menu className="flex-1 overflow-auto" disabledKeys={disabledKeys}>
              <MenuHeader inset={false} separator={false}>
                <span className="text-gray-11 text-[11px] tracking-wide uppercase">
                  Filter by
                </span>
              </MenuHeader>

              {visibleItems.map((entry, index) => {
                if (!isFilterItem(entry)) {
                  return <MenuSeparator key={`separator-${index}`} />
                }

                const hasValue = filters[entry.field] != null
                const isDisabled = entry.isDisabled ?? false

                return (
                  <MenuSubTrigger key={entry.field}>
                    <MenuItem id={entry.field} className="data-open:bg-gray-3">
                      <div className="flex items-center gap-2">
                        {entry.icon && (
                          <span
                            className={
                              isDisabled
                                ? "text-gray-11 opacity-50"
                                : "text-gray-12"
                            }
                          >
                            {entry.icon}
                          </span>
                        )}
                        <span
                          className={
                            isDisabled
                              ? "text-gray-11 opacity-50"
                              : hasValue
                                ? "text-gray-12"
                                : "text-gray-11"
                          }
                        >
                          {entry.label}
                        </span>
                      </div>
                    </MenuItem>
                    <MenuPopover className="p-0">
                      <FilterSubmenu item={entry} />
                    </MenuPopover>
                  </MenuSubTrigger>
                )
              })}
            </Menu>
          )}
        </div>
      </MenuPopover>
    </MenuTrigger>
  )
}

function FilterSubmenu({ item }: { item: FilterBuilderItem }) {
  return (
    <FilterItemProvider item={item} mode="builder">
      {item.render("builder")}
    </FilterItemProvider>
  )
}
