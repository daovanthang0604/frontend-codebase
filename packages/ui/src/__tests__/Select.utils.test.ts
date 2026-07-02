import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useAriaSelectProps } from "../components/Select.utils"

describe("useAriaSelectProps", () => {
  describe("single selection mode", () => {
    it("converts object value to JSON string", () => {
      const { result } = renderHook(() =>
        useAriaSelectProps({
          value: { id: 1, name: "Test" },
          defaultValue: null,
          selectionMode: "single",
        })
      )
      expect(result.current.value).toBe(JSON.stringify({ id: 1, name: "Test" }))
    })

    it("returns null for null value", () => {
      const { result } = renderHook(() =>
        useAriaSelectProps({
          value: null,
          defaultValue: null,
          selectionMode: "single",
        })
      )
      expect(result.current.value).toBeNull()
    })

    it("parses string back to object on change", () => {
      let changed: any = null
      const { result } = renderHook(() =>
        useAriaSelectProps({
          value: null,
          onChange: (v: any) => {
            changed = v
          },
          defaultValue: null,
          selectionMode: "single",
        })
      )
      act(() => {
        result.current.onChange(JSON.stringify({ id: 1, name: "Test" }))
      })
      expect(changed).toEqual({ id: 1, name: "Test" })
    })
  })

  describe("multiple selection mode", () => {
    it("converts array of objects to JSON strings", () => {
      const { result } = renderHook(() =>
        useAriaSelectProps({
          value: [
            { id: 1, name: "A" },
            { id: 2, name: "B" },
          ],
          defaultValue: [],
          selectionMode: "multiple",
        })
      )
      expect(result.current.value).toEqual([
        JSON.stringify({ id: 1, name: "A" }),
        JSON.stringify({ id: 2, name: "B" }),
      ])
    })

    it("parses string array back to objects on change", () => {
      let changed: any = null
      const { result } = renderHook(() =>
        useAriaSelectProps({
          value: [],
          onChange: (v: any) => {
            changed = v
          },
          defaultValue: [],
          selectionMode: "multiple",
        })
      )
      act(() => {
        result.current.onChange([
          JSON.stringify({ id: 1 }),
          JSON.stringify({ id: 2 }),
        ])
      })
      expect(changed).toEqual([{ id: 1 }, { id: 2 }])
    })
  })
})
