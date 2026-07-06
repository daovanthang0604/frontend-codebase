"use client"

import { useMemo } from "react"
import { Combobox } from "@base-ui/react/combobox"
import { cn } from "@workspace/base-ui/lib/utils"
import { Check, Minus } from "lucide-react"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"
import { isSelectOptionArray, type SelectOption } from "../Filter.types"
import { ComboboxOptionItem } from "./OptionItem"

const inputClass =
  "placeholder:text-gray-8 text-gray-12 h-7 w-full rounded border-0 bg-transparent px-0 text-xs outline-none"

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

  const field = fieldProp ?? filterItem?.field
  const options = optionsProp ?? filterItem?.options ?? []

  if (!field) {
    throw new Error(
      "FilterSelect requires a field prop or must be used within a FilterItemProvider"
    )
  }

  const raw = filters[field]

  const selectedValues = useMemo(() => {
    if (!raw) return []
    if (isSelectOptionArray(raw)) return raw.map((opt) => String(opt.value))
    if (Array.isArray(raw)) return raw.map(String)
    return [String(raw)]
  }, [raw])

  const selectedOptions = useMemo(
    () => options.filter((o) => selectedValues.includes(String(o.value))),
    [options, selectedValues]
  )

  // Strip the (non-serializable) icon before persisting to the store.
  const commit = (opts: SelectOption[]) => {
    const stripped = opts.map(({ icon: _icon, ...rest }) => rest)
    setFieldValue(field, stripped.length > 0 ? stripped : undefined)
  }

  const isItemEqualToValue = (a: SelectOption, b: SelectOption) =>
    String(a.value) === String(b.value)
  const itemToStringLabel = (o: SelectOption) => o.label

  if (!multi) {
    return (
      <Combobox.Root
        items={options}
        value={selectedOptions[0] ?? null}
        onValueChange={(opt: SelectOption | null) => {
          commit(opt ? [opt] : [])
          if (opt) onClose?.()
        }}
        isItemEqualToValue={isItemEqualToValue}
        itemToStringLabel={itemToStringLabel}
        open
        onOpenChange={() => {}}
      >
        <SelectPanel
          placeholder={placeholder}
          emptyMessage={emptyMessage}
          multi={false}
          renderIcon={renderIcon}
        />
      </Combobox.Root>
    )
  }

  const allSelected =
    options.length > 0 && selectedValues.length === options.length
  const isIndeterminate = selectedValues.length > 0 && !allSelected
  const toggleAll = () => commit(allSelected ? [] : options)

  return (
    <Combobox.Root
      items={options}
      multiple
      value={selectedOptions}
      onValueChange={(opts: SelectOption[]) => commit(opts)}
      isItemEqualToValue={isItemEqualToValue}
      itemToStringLabel={itemToStringLabel}
      open
      onOpenChange={() => {}}
    >
      <SelectPanel
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        multi
        renderIcon={renderIcon}
        selectAll={
          options.length > 0 ? (
            <button
              type="button"
              onClick={toggleAll}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none",
                "hover:bg-gray-3 text-gray-11 font-medium transition-colors"
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded border text-white",
                  allSelected || isIndeterminate
                    ? "bg-accent-9 border-accent-9"
                    : "border-gray-7 bg-transparent"
                )}
              >
                {allSelected && <Check className="size-3" strokeWidth={2.5} />}
                {isIndeterminate && (
                  <Minus className="size-3" strokeWidth={2.5} />
                )}
              </span>
              <span className="flex-1">Select All</span>
            </button>
          ) : null
        }
      />
    </Combobox.Root>
  )
}

function SelectPanel({
  placeholder,
  emptyMessage,
  multi,
  renderIcon,
  selectAll,
}: {
  placeholder: string
  emptyMessage: string
  multi: boolean
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
  selectAll?: React.ReactNode
}) {
  return (
    <div className="flex max-h-[300px] min-w-[200px] flex-col">
      <div className="border-gray-6 border-b px-3 py-2">
        <Combobox.Input placeholder={placeholder} className={inputClass} />
      </div>

      <div className="max-h-[250px] flex-1 overflow-auto py-1">
        {selectAll}
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
        <Combobox.Empty className="text-gray-11 px-3 py-6 text-center text-xs">
          {emptyMessage}
        </Combobox.Empty>
      </div>
    </div>
  )
}
