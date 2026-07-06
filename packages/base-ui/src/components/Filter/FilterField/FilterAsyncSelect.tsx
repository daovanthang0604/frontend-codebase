"use client"

import { useEffect, useMemo, useRef } from "react"
import { Combobox } from "@base-ui/react/combobox"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"
import {
  isSelectOptionArray,
  type OptionsLoader,
  type SelectOption,
} from "../Filter.types"
import { ComboboxOptionItem } from "./OptionItem"

const inputClass =
  "placeholder:text-gray-8 text-gray-12 h-7 w-full rounded border-0 bg-transparent px-0 text-xs outline-none"

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

  const field = fieldProp ?? filterItem?.field

  if (!field) {
    throw new Error(
      "FilterAsyncSelect requires a field prop or must be used within a FilterItemProvider"
    )
  }

  const raw = filters[field]
  const storedOptions = useMemo(
    () => (isSelectOptionArray(raw) ? raw : []),
    [raw]
  )

  const commit = (opts: SelectOption[]) => {
    const stripped = opts.map(({ icon: _icon, ...rest }) => rest)
    setFieldValue(field, stripped.length > 0 ? stripped : undefined)
  }

  const isItemEqualToValue = (a: SelectOption, b: SelectOption) =>
    String(a.value) === String(b.value)
  const itemToStringLabel = (o: SelectOption) => o.label

  const isInitialLoading = optionsLoader.isFetching && options.length === 0

  const panel = (
    <AsyncPanel
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      multi={multi}
      renderIcon={renderIcon}
      isInitialLoading={!!isInitialLoading}
      optionsLoader={optionsLoader}
    />
  )

  if (!multi) {
    return (
      <Combobox.Root
        items={options}
        value={storedOptions[0] ?? null}
        onValueChange={(opt: SelectOption | null) => {
          commit(opt ? [opt] : [])
          if (opt) onClose?.()
        }}
        isItemEqualToValue={isItemEqualToValue}
        itemToStringLabel={itemToStringLabel}
        filter={null}
        onInputValueChange={(v: string) => optionsLoader.onSearch?.(v)}
        open
        onOpenChange={() => {}}
      >
        {panel}
      </Combobox.Root>
    )
  }

  return (
    <Combobox.Root
      items={options}
      multiple
      value={storedOptions}
      onValueChange={(opts: SelectOption[]) => commit(opts)}
      isItemEqualToValue={isItemEqualToValue}
      itemToStringLabel={itemToStringLabel}
      filter={null}
      onInputValueChange={(v: string) => optionsLoader.onSearch?.(v)}
      open
      onOpenChange={() => {}}
    >
      {panel}
    </Combobox.Root>
  )
}

function AsyncPanel({
  placeholder,
  emptyMessage,
  multi,
  renderIcon,
  isInitialLoading,
  optionsLoader,
}: {
  placeholder: string
  emptyMessage: string
  multi: boolean
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
  isInitialLoading: boolean
  optionsLoader: OptionsLoader
}) {
  return (
    <div className="flex max-h-[300px] min-w-[200px] flex-col">
      <div className="border-gray-6 border-b px-3 py-2">
        <Combobox.Input placeholder={placeholder} className={inputClass} />
      </div>

      {isInitialLoading ? (
        <div className="py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonOption key={i} />
          ))}
        </div>
      ) : (
        <div className="max-h-[250px] flex-1 overflow-auto py-1">
          <Combobox.List>
            {(option: SelectOption) => (
              <ComboboxOptionItem
                key={String(option.value)}
                option={option}
                multi={multi}
                renderIcon={renderIcon}
              />
            )}
          </Combobox.List>

          {optionsLoader.hasNextPage ? (
            <LoadMore
              onLoadMore={optionsLoader.onFetchNextPage}
              isLoading={!!optionsLoader.isFetching}
            />
          ) : (
            <Combobox.Empty className="text-gray-11 px-3 py-6 text-center text-xs">
              {emptyMessage}
            </Combobox.Empty>
          )}
        </div>
      )}
    </div>
  )
}

// Auto-loads the next page when the sentinel scrolls into view (mirrors ui's
// ListBoxLoadMoreItem). react-query dedupes concurrent fetches, so the
// isLoading guard just avoids redundant calls.
function LoadMore({
  onLoadMore,
  isLoading,
}: {
  onLoadMore: () => void
  isLoading: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(isLoading)
  loadingRef.current = isLoading

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !loadingRef.current) {
        onLoadMore()
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [onLoadMore])

  return (
    <div ref={ref} className="py-1">
      <SkeletonOption />
      <SkeletonOption />
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
