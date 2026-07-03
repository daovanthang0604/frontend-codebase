"use client"

import { useCallback, useContext, useMemo, useState } from "react"
import { SearchInput } from "@workspace/ui/components/Input"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Minus } from "lucide-react"
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  Collection,
  ListLayout,
  RootMenuTriggerStateContext,
  Virtualizer,
} from "react-aria-components"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"
import { isSelectOptionArray, type SelectOption } from "../Filter.types"
import { MenuOptionItem } from "./OptionItem"

interface FilterSelectProps {
  field?: string
  options?: SelectOption[]
  multi?: boolean
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
  placeholder?: string
  emptyMessage?: string
}

export function FilterSelect({
  field: fieldProp,
  options: optionsProp,
  multi = true,
  renderIcon,
  placeholder = "Filter...",
  emptyMessage = "No matching options",
}: FilterSelectProps) {
  const { value: filters, setFieldValue } = useFilterContext()
  const filterItem = useFilterItem()
  const onClose = useFilterItemClose()
  const menuState = useContext(RootMenuTriggerStateContext)

  const field = fieldProp ?? filterItem?.field
  const options = optionsProp ?? filterItem?.options ?? []

  if (!field) {
    throw new Error(
      "FilterSelect requires a field prop or must be used within a FilterItemProvider"
    )
  }

  const [search, setSearch] = useState("")

  const raw = filters[field]

  const selectedValues = useMemo(() => {
    if (!raw) return []
    if (isSelectOptionArray(raw)) {
      return raw.map((opt) => String(opt.value))
    }
    if (Array.isArray(raw)) {
      return raw.map(String)
    }
    return [String(raw)]
  }, [raw])

  const selectedKeys = useMemo(() => new Set(selectedValues), [selectedValues])

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const lowerSearch = search.toLowerCase()
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(lowerSearch)
    )
  }, [options, search])

  const optionsWithId = useMemo(
    () => filteredOptions.map((opt) => ({ ...opt, id: String(opt.value) })),
    [filteredOptions]
  )

  const handleSelectionChange = useCallback(
    (keys: Set<React.Key>) => {
      const selectedIds = Array.from(keys).map(String)
      const selectedOptions = options
        .filter((opt) => selectedIds.includes(String(opt.value)))
        .map(({ icon: _icon, ...rest }) => rest)

      setFieldValue(
        field,
        selectedOptions.length > 0 ? selectedOptions : undefined
      )

      if (!multi && selectedOptions.length > 0) {
        menuState?.close()
        onClose?.()
      }
    },
    [field, options, setFieldValue, multi, onClose]
  )

  const handleSelectAll = useCallback(() => {
    const isAllSelected = selectedValues.length === optionsWithId.length

    if (isAllSelected) {
      setFieldValue(field, undefined)
    } else {
      const allOptions = optionsWithId.map(({ icon: _icon, id: _id, ...rest }) => rest)
      setFieldValue(field, allOptions)
    }
  }, [field, optionsWithId, selectedValues.length, setFieldValue])

  const isAllSelected =
    selectedValues.length === optionsWithId.length && optionsWithId.length > 0
  const isIndeterminate =
    selectedValues.length > 0 && selectedValues.length < optionsWithId.length

  return (
    <div className="flex max-h-[300px] min-w-[200px] flex-col">
      <div className="border-gray-6 border-b px-3 py-2">
        <SearchInput
          placeholder={placeholder}
          className="placeholder:text-gray-8 h-7 rounded border-0 border-none! bg-transparent pl-0 text-xs ring-0!"
          onChange={setSearch}
          value={search}
        />
      </div>

      <Virtualizer
        layout={ListLayout}
        layoutOptions={{ estimatedRowHeight: 32 }}
      >
        <AriaMenu
          aria-label="Filter options"
          selectionMode={multi ? "multiple" : "single"}
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) =>
            handleSelectionChange(keys as Set<string>)
          }
          className="max-h-[250px] flex-1 overflow-auto py-1 outline-none"
          renderEmptyState={() => (
            <div className="text-gray-11 px-3 py-6 text-center text-xs">
              {emptyMessage}
            </div>
          )}
        >
          {multi && optionsWithId.length > 0 && (
            <SelectAllItem
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              onSelectAll={handleSelectAll}
            />
          )}

          <Collection items={optionsWithId}>
            {(option) => (
              <MenuOptionItem
                option={option}
                multi={multi}
                renderIcon={renderIcon}
              />
            )}
          </Collection>
        </AriaMenu>
      </Virtualizer>
    </div>
  )
}

function SelectAllItem({
  isAllSelected,
  isIndeterminate,
  onSelectAll,
}: {
  isAllSelected: boolean
  isIndeterminate: boolean
  onSelectAll: () => void
}) {
  return (
    <AriaMenuItem
      id="__select_all__"
      textValue="Select All"
      onAction={onSelectAll}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none",
        "hover:bg-gray-3 data-focused:bg-gray-3 transition-colors",
        "text-gray-11 font-medium"
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border",
          isAllSelected || isIndeterminate
            ? "bg-accent-9 border-accent-9 text-white"
            : "border-gray-7 bg-transparent"
        )}
      >
        {isAllSelected && <Check className="size-3" strokeWidth={2.5} />}
        {isIndeterminate && <Minus className="size-3" strokeWidth={2.5} />}
      </span>
      <span className="flex-1">Select All</span>
    </AriaMenuItem>
  )
}
