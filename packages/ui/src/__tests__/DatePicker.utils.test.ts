import { describe, expect, it } from "vitest"

import { parse, toValidYear } from "../components/DatePicker.utils"

describe("parse", () => {
  it("returns null for null input", () => {
    expect(parse(null)).toBeNull()
  })

  it("returns null for undefined input", () => {
    expect(parse(undefined)).toBeNull()
  })

  it("returns null for non-Date input", () => {
    expect(parse("not a date" as any)).toBeNull()
  })

  it("parses a valid Date with day granularity", () => {
    const date = new Date("2024-06-15T10:30:00Z")
    const result = parse(date, "day")
    expect(result).not.toBeNull()
    expect(result?.toString()).toContain("2024-06-15")
  })

  it("parses a valid Date with minute granularity", () => {
    const date = new Date("2024-06-15T10:30:00Z")
    const result = parse(date, "minute")
    expect(result).not.toBeNull()
    expect(result?.toString()).toContain("2024-06-15")
  })

  it("parses a valid Date without granularity", () => {
    const date = new Date("2024-06-15T10:30:00Z")
    const result = parse(date)
    expect(result).not.toBeNull()
  })
})

describe("toValidYear", () => {
  it("returns the same date if year is in valid range", () => {
    const date = new Date("2024-06-15")
    const result = toValidYear(date)
    expect(result.getFullYear()).toBe(2024)
  })

  it("clamps year to MIN_YEAR for very old dates", () => {
    const date = new Date("1900-01-01")
    const result = toValidYear(date)
    expect(result.getFullYear()).toBe(1970)
  })

  it("clamps year to max for far future dates", () => {
    const date = new Date("2200-01-01")
    const result = toValidYear(date)
    const expectedMax = new Date().getFullYear() + 20
    expect(result.getFullYear()).toBe(expectedMax)
  })
})
