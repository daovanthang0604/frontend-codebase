import {
  parseAbsoluteToLocal,
  toCalendarDate,
  toCalendarDateTime,
} from "@internationalized/date"
import { MAX_YEAR_FROM_NOW, MIN_YEAR } from "@workspace/ui/consts/config"
import dayjs from "dayjs"
import { clamp } from "lodash"

export const parse = (date?: Date | null, granularity?: "day" | "minute") => {
  if (
    !date ||
    !(date instanceof Date) ||
    typeof date.toISOString !== "function"
  ) {
    return null
  }

  const value = parseAbsoluteToLocal(date.toISOString())

  if (granularity === "day") {
    return toCalendarDate(value)
  }

  return toCalendarDateTime(value)
}

export const toValidYear = (date: Date): Date => {
  let newDate = dayjs(date)
  const validYear = clamp(
    newDate.year(),
    MIN_YEAR,
    dayjs().year() + MAX_YEAR_FROM_NOW
  )
  newDate = newDate.year(validYear)

  return newDate.toDate()
}
