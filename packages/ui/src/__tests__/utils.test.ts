import { describe, expect, it } from "vitest"

import { cn, formatCount } from "../lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  it("merges conflicting tailwind classes", () => {
    expect(cn("px-4", "px-2")).toBe("px-2")
  })
})

describe("formatCount", () => {
  it("returns the number as string when within max", () => {
    expect(formatCount(5)).toBe("5")
    expect(formatCount(9)).toBe("9")
  })

  it("returns max+ when number exceeds default max of 9", () => {
    expect(formatCount(10)).toBe("9+")
    expect(formatCount(100)).toBe("9+")
  })

  it("respects custom max value", () => {
    expect(formatCount(99, 99)).toBe("99")
    expect(formatCount(100, 99)).toBe("99+")
  })
})
