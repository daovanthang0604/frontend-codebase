import { DateFormatter } from "@internationalized/date"
import { MAX_YEAR_FROM_NOW, MIN_YEAR } from "@workspace/ui/consts/config"
import dayjs from "dayjs"

export const getCalendarYears = () => {
  const startYear = MIN_YEAR
  const endYear = dayjs().year() + MAX_YEAR_FROM_NOW
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  )
  return years
}

export const getCalendarMonths = (locale = "en-US") => {
  const formatter = new DateFormatter(locale, { month: "short" })

  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: formatter.format(new Date(2020, i, 1)),
  }))
}
