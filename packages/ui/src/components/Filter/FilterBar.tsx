"use client"

import { useEffect } from "react"

import { useFilterContext } from "./Filter.store"
import { isFilterItem, type FilterBuilderEntry } from "./Filter.types"
import { FilterBuilder } from "./FilterBuilder"
import { FilterRow } from "./FilterRow"

interface FilterBarProps {
  items: FilterBuilderEntry[]
}

export function FilterBar({ items }: FilterBarProps) {
  const { value, clearField } = useFilterContext()

  // Auto-clear values for disabled filters
  useEffect(() => {
    for (const entry of items) {
      if (!isFilterItem(entry)) continue
      if (entry.isDisabled && value[entry.field] != null) {
        clearField(entry.field)
      }
    }
  }, [items, value, clearField])

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((entry) => {
        if (!isFilterItem(entry)) return null
        if (value[entry.field] == null) return null
        return <FilterRow key={entry.field} item={entry} />
      })}
      <FilterBuilder items={items} />
    </div>
  )
}
