import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useIsMobile } from "../hooks/use-mobile"

describe("useIsMobile", () => {
  let listeners: Array<() => void> = []

  beforeEach(() => {
    listeners = []

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((_event: string, cb: () => void) => {
        listeners.push(cb)
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  it("returns false for desktop width", () => {
    Object.defineProperty(window, "innerWidth", { value: 1024 })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("returns true for mobile width", () => {
    Object.defineProperty(window, "innerWidth", { value: 500 })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it("respects custom breakpoint", () => {
    Object.defineProperty(window, "innerWidth", { value: 900 })
    const { result } = renderHook(() => useIsMobile({ breakpoint: 1024 }))
    expect(result.current).toBe(true)
  })

  it("updates on resize", () => {
    Object.defineProperty(window, "innerWidth", { value: 1024 })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 500 })
      listeners.forEach((cb) => cb())
    })
    expect(result.current).toBe(true)
  })
})
