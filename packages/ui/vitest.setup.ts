/// <reference types="@testing-library/jest-dom" />
import * as matchers from "@testing-library/jest-dom/matchers"
import { cleanup } from "@testing-library/react"
import { afterEach, expect, vi } from "vitest"

expect.extend(matchers)

// Polyfill APIs not available in jsdom
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

afterEach(() => {
  cleanup()
})
