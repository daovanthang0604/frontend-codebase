"use client"

import { useState } from "react"
import { Button } from "@workspace/base-ui/components/Button"
import { Calendar, type DateRange } from "@workspace/base-ui/components/Calendar"
import dayjs from "dayjs"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"

interface FilterDateRangeProps {
  field?: string
  onSelectRange?: (range: [Date, Date] | undefined) => void
}

export function FilterDateRange({
  field: fieldProp,
  onSelectRange,
}: FilterDateRangeProps) {
  const { value, setFieldValue } = useFilterContext()
  const filterItem = useFilterItem()
  const onClose = useFilterItemClose()
  const field = fieldProp ?? filterItem?.field
  if (!field) {
    throw new Error(
      "FilterDateRange requires a field prop or must be used within a FilterItemProvider"
    )
  }

  const raw = value[field] as [Date, Date] | null | undefined
  const [startDate, endDate] = raw ?? []

  const [draftRange, setDraftRange] = useState<DateRange | undefined>(
    startDate && endDate ? { from: startDate, to: endDate } : undefined
  )

  const applyRange = (range: [Date, Date] | undefined) => {
    if (onSelectRange) {
      onSelectRange(range)
    } else {
      setFieldValue(field, range)
    }
  }

  const commitDraft = () => {
    if (!draftRange?.from || !draftRange?.to) {
      applyRange(undefined)
      onClose?.()
      return
    }
    applyRange([
      dayjs(draftRange.from).startOf("day").toDate(),
      dayjs(draftRange.to).endOf("day").toDate(),
    ])
    onClose?.()
  }

  const handleClear = () => {
    setDraftRange(undefined)
    applyRange(undefined)
  }

  return (
    <div className="flex min-w-[280px] flex-col p-2">
      <Calendar
        mode="range"
        selected={draftRange}
        onSelect={setDraftRange}
        className="w-full p-0"
      />

      <div className="border-gray-6 mt-2 flex justify-center gap-2 border-t pt-2">
        <Button
          size="sm"
          variant="ghost"
          intent="primary"
          onClick={commitDraft}
          isDisabled={!draftRange?.from || !draftRange?.to}
        >
          Apply
        </Button>
        <Button
          size="sm"
          variant="ghost"
          intent="secondary"
          onClick={handleClear}
          isDisabled={!raw}
          className="ml-2"
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
