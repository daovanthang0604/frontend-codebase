"use client"

import { useContext, useEffect, useRef } from "react"
import {
  Menu,
  MenuItem,
  MenuPopover,
  MenuSeparator,
  MenuSubTrigger,
} from "@workspace/ui/components/Menu"
import dayjs from "dayjs"
import { RootMenuTriggerStateContext } from "react-aria-components"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"
import type { DateModeFilterValue } from "../Filter.types"
import { FilterDateRange } from "./FilterDateRange"
import { FilterSingleDate } from "./FilterSingleDate"

function normalizeValue(value: unknown): DateModeFilterValue | null {
  if (value == null) return null

  if (typeof value === "object" && !Array.isArray(value) && "mode" in value) {
    const v = value as DateModeFilterValue
    return {
      ...v,
      from: v.from ? new Date(v.from) : undefined,
      to: v.to ? new Date(v.to) : undefined,
    }
  }

  if (Array.isArray(value) && value.length === 2) {
    const [fromRaw, toRaw] = value
    return {
      mode: "range",
      from: fromRaw ? new Date(fromRaw as any) : undefined,
      to: toRaw ? new Date(toRaw as any) : undefined,
    }
  }

  return null
}

export function FilterDateMode() {
  const { value, setFieldValue } = useFilterContext()
  const item = useFilterItem()
  const field = item?.field

  if (!field) {
    throw new Error("FilterDateMode must be used within a FilterItemProvider")
  }

  const current = normalizeValue(value[field])
  const today = dayjs()

  const updateValue = (newValue: DateModeFilterValue | undefined) => {
    setFieldValue(field, newValue)
  }

  const getDateForSingleDate = (
    targetMode: "from" | "to"
  ): Date | undefined => {
    if (!current) return undefined
    if (current.mode === targetMode) {
      return targetMode === "from" ? current.from : current.to
    }
    return undefined
  }

  const getRangeForDateRange = (): [Date, Date] | undefined => {
    if (!current) return undefined
    if (current.mode === "range" && current.from && current.to) {
      return [current.from, current.to]
    }
    return undefined
  }

  const tempFieldFrom = `${field}__temp_from`
  const tempFieldTo = `${field}__temp_to`
  const tempFieldRange = `${field}__temp_range`

  const prevCurrentRef = useRef<DateModeFilterValue | null>(null)

  const menuState = useContext(RootMenuTriggerStateContext)
  const onClose = useFilterItemClose()

  useEffect(() => {
    const currentChanged =
      (!current && prevCurrentRef.current) ||
      (current && !prevCurrentRef.current) ||
      (current &&
        prevCurrentRef.current &&
        (current.mode !== prevCurrentRef.current.mode ||
          current.from?.getTime() !== prevCurrentRef.current.from?.getTime() ||
          current.to?.getTime() !== prevCurrentRef.current.to?.getTime()))

    if (currentChanged) {
      prevCurrentRef.current = current
    }

    const dateForFrom = getDateForSingleDate("from")
    const dateForTo = getDateForSingleDate("to")
    const rangeForRange = getRangeForDateRange()
    const currentFrom = value[tempFieldFrom] as Date | undefined
    const currentTo = value[tempFieldTo] as Date | undefined
    const currentRange = value[tempFieldRange] as [Date, Date] | undefined

    if (dateForFrom?.getTime() !== currentFrom?.getTime()) {
      setFieldValue(tempFieldFrom, dateForFrom)
    }
    if (dateForTo?.getTime() !== currentTo?.getTime()) {
      setFieldValue(tempFieldTo, dateForTo)
    }
    const rangeChanged =
      (!rangeForRange && currentRange) ||
      (rangeForRange && !currentRange) ||
      (rangeForRange &&
        currentRange &&
        (rangeForRange[0]?.getTime() !== currentRange[0]?.getTime() ||
          rangeForRange[1]?.getTime() !== currentRange[1]?.getTime()))
    if (rangeChanged) {
      setFieldValue(tempFieldRange, rangeForRange)
    }
  }, [
    current,
    tempFieldFrom,
    tempFieldTo,
    tempFieldRange,
    setFieldValue,
    value,
  ])

  const applyPreset = (preset: "lastWeek" | "thisWeek" | "thisMonth") => {
    let start: dayjs.Dayjs
    let end: dayjs.Dayjs

    switch (preset) {
      case "lastWeek":
        start = today.startOf("week").subtract(1, "week")
        end = start.endOf("week")
        break
      case "thisWeek":
        start = today.startOf("week")
        end = today.endOf("week")
        break
      case "thisMonth":
        start = today.startOf("month")
        end = today.endOf("month")
        break
    }

    updateValue({
      mode: "range",
      from: start.startOf("day").toDate(),
      to: end.endOf("day").toDate(),
      preset,
    })
    menuState?.close()
    onClose?.()
  }

  return (
    <Menu aria-label="Date filter options" className="min-w-[220px]">
      <MenuSubTrigger>
        <MenuItem>From date</MenuItem>
        <MenuPopover className="p-0">
          <FilterSingleDate
            field={tempFieldFrom}
            onSelect={(date) => {
              if (!date) {
                updateValue(undefined)
                return
              }
              const fromDate = dayjs(date).startOf("day").toDate()
              updateValue({
                mode: "from",
                from: fromDate,
                to: undefined,
              })
            }}
          />
        </MenuPopover>
      </MenuSubTrigger>

      <MenuSubTrigger>
        <MenuItem>To date</MenuItem>
        <MenuPopover className="p-0">
          <FilterSingleDate
            field={tempFieldTo}
            onSelect={(date) => {
              if (!date) {
                updateValue(undefined)
                return
              }
              const toDate = dayjs(date).endOf("day").toDate()
              updateValue({
                mode: "to",
                from: undefined,
                to: toDate,
              })
            }}
          />
        </MenuPopover>
      </MenuSubTrigger>

      <MenuSubTrigger>
        <MenuItem>Custom date</MenuItem>
        <MenuPopover className="p-0">
          <FilterDateRange
            field={tempFieldRange}
            onSelectRange={(range) => {
              if (!range) {
                updateValue(undefined)
                return
              }
              updateValue({
                mode: "range",
                from: range[0],
                to: range[1],
              })
            }}
          />
        </MenuPopover>
      </MenuSubTrigger>

      <MenuSeparator />

      {/* PRESETS */}
      <MenuItem onAction={() => applyPreset("lastWeek")}>Last week</MenuItem>

      <MenuItem onAction={() => applyPreset("thisWeek")}>This week</MenuItem>

      <MenuItem onAction={() => applyPreset("thisMonth")}>This month</MenuItem>
    </Menu>
  )
}
