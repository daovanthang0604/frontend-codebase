import { describe, expect, it } from "vitest"

import {
  getCalendarMonths,
  getCalendarYears,
} from "../components/Calendar.utils"

describe("getCalendarYears", () => {
  it("returns an array of years", () => {
    const years = getCalendarYears()
    expect(Array.isArray(years)).toBe(true)
    expect(years.length).toBeGreaterThan(0)
  })

  it("starts from 1970", () => {
    const years = getCalendarYears()
    expect(years[0]).toBe(1970)
  })

  it("ends at current year + 20", () => {
    const years = getCalendarYears()
    const expectedEnd = new Date().getFullYear() + 20
    expect(years[years.length - 1]).toBe(expectedEnd)
  })

  it("returns consecutive years", () => {
    const years = getCalendarYears()
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBe(years[i - 1] + 1)
    }
  })
})

describe("getCalendarMonths", () => {
  it("returns 12 months", () => {
    const months = getCalendarMonths()
    expect(months).toHaveLength(12)
  })

  it("returns months with value and label", () => {
    const months = getCalendarMonths()
    months.forEach((month, index) => {
      expect(month.value).toBe(index + 1)
      expect(typeof month.label).toBe("string")
      expect(month.label.length).toBeGreaterThan(0)
    })
  })

  it("starts with January (value 1)", () => {
    const months = getCalendarMonths()
    expect(months[0].value).toBe(1)
  })

  it("ends with December (value 12)", () => {
    const months = getCalendarMonths()
    expect(months[11].value).toBe(12)
  })

  it("formats months in en-US by default", () => {
    const months = getCalendarMonths("en-US")
    expect(months[0].label).toBe("Jan")
    expect(months[11].label).toBe("Dec")
  })
})
