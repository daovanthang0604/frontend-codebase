"use client"

import { useCallback, useContext, useMemo } from "react"
import { SearchInput } from "@workspace/ui/components/Input"
import {
  Autocomplete,
  Collection,
  ListBox,
  ListBoxLoadMoreItem,
  ListLayout,
  RootMenuTriggerStateContext,
  Virtualizer,
} from "react-aria-components"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"
import {
  isSelectOptionArray,
  type OptionsLoader,
  type SelectOption,
  type SerializableSelectOption,
} from "../Filter.types"
import { ListBoxOptionItem } from "./OptionItem"

interface FilterAsyncSelectProps {
  field?: string
  options: SelectOption[]
  multi?: boolean
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
  placeholder?: string
  emptyMessage?: string
  optionsLoader: OptionsLoader
}

export function FilterAsyncSelect({
  field: fieldProp,
  options,
  multi = true,
  renderIcon,
  placeholder = "Search...",
  emptyMessage = "No matching options",
  optionsLoader,
}: FilterAsyncSelectProps) {
  const { value: filters, setFieldValue } = useFilterContext()
  const filterItem = useFilterItem()
  const onClose = useFilterItemClose()
  const menuState = useContext(RootMenuTriggerStateContext)

  const field = fieldProp ?? filterItem?.field

  if (!field) {
    throw new Error(
      "FilterAsyncSelect requires a field prop or must be used within a FilterItemProvider"
    )
  }

  const raw = filters[field]

  const storedOptions = useMemo(() => {
    if (isSelectOptionArray(raw)) return raw
    return []
  }, [raw])

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

  const optionsWithId = useMemo(
    () => options.map((opt) => ({ ...opt, id: String(opt.value) })),
    [options]
  )

  const handleSelectionChange = useCallback(
    (keys: Set<React.Key>) => {
      const selectedIds = Array.from(keys).map(String)

      const allAvailableOptions = new Map<string, SerializableSelectOption>()

      storedOptions.forEach((opt) => {
        allAvailableOptions.set(String(opt.value), opt)
      })

      options.forEach((opt) => {
        const { icon: _icon, ...rest } = opt
        allAvailableOptions.set(String(opt.value), rest)
      })

      const selectedOptions = selectedIds
        .map((id) => allAvailableOptions.get(id))
        .filter((opt): opt is SerializableSelectOption => opt !== undefined)

      setFieldValue(
        field,
        selectedOptions.length > 0 ? selectedOptions : undefined
      )

      if (!multi && selectedOptions.length > 0) {
        menuState?.close()
        onClose?.()
      }
    },
    [field, options, storedOptions, setFieldValue, multi, onClose]
  )

  const isInitialLoading = optionsLoader.isFetching && options.length === 0

  return (
    <div className="flex max-h-[300px] min-w-[200px] flex-col">
      <Autocomplete disableVirtualFocus>
        <div className="border-gray-6 border-b px-3 py-2">
          <SearchInput
            autoFocus
            placeholder={placeholder}
            className="placeholder:text-gray-8 h-7 rounded border-0 border-none! bg-transparent pl-0 text-xs ring-0!"
            onChange={optionsLoader.onSearch}
          />
        </div>

        {isInitialLoading ? (
          <div className="py-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonOption key={i} />
            ))}
          </div>
        ) : (
          <Virtualizer
            layout={ListLayout}
            layoutOptions={{ estimatedRowHeight: 32 }}
          >
            <ListBox
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
              <Collection items={optionsWithId}>
                {(option) => (
                  <ListBoxOptionItem
                    option={option}
                    multi={multi}
                    renderIcon={renderIcon}
                  />
                )}
              </Collection>

              {optionsLoader.hasNextPage && (
                <ListBoxLoadMoreItem
                  onLoadMore={optionsLoader.onFetchNextPage}
                  isLoading={optionsLoader.isFetching}
                  className="py-1"
                >
                  <SkeletonOption />
                  <SkeletonOption />
                </ListBoxLoadMoreItem>
              )}
            </ListBox>
          </Virtualizer>
        )}
      </Autocomplete>
    </div>
  )
}

function SkeletonOption() {
  return (
    <div className="flex h-8 animate-pulse items-center gap-2.5 px-3 py-1.5">
      <div className="border-gray-6 bg-gray-4 size-4 shrink-0 rounded border" />
      <div className="bg-gray-4 h-4 max-w-[120px] flex-1 rounded" />
    </div>
  )
}
