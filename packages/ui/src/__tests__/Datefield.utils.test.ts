import { Time } from "@internationalized/date"
import { describe, expect, it } from "vitest"

import { parseTime } from "../components/Datefield.utils"

describe("parseTime", () => {
  it("parses HH:MM format", () => {
    const result = parseTime("14:30")
    expect(result).toBeInstanceOf(Time)
    expect(result?.hour).toBe(14)
    expect(result?.minute).toBe(30)
  })

  it("parses HH:MM:SS format", () => {
    const result = parseTime("09:15:45")
    expect(result).toBeInstanceOf(Time)
    expect(result?.hour).toBe(9)
    expect(result?.minute).toBe(15)
    expect(result?.second).toBe(45)
  })

  it("returns Time with NaN hour for invalid input", () => {
    // parseTime splits on ":" and passes to Time constructor
    // "invalid" splits to ["invalid"] → NaN values
    const result = parseTime("invalid")
    expect(result?.hour).toBeNaN()
  })

  it("parses midnight", () => {
    const result = parseTime("00:00")
    expect(result?.hour).toBe(0)
    expect(result?.minute).toBe(0)
  })
})
