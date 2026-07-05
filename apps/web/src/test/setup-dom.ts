// Global vitest setup. Registers the jest-dom matchers (toBeInTheDocument,
// toHaveAttribute, …) on vitest's `expect`. This file runs for EVERY test
// regardless of environment; the matchers only touch the DOM when called, so
// it is inert for the node-env logic tests and active for the jsdom-env
// component tests.
import "@testing-library/jest-dom/vitest"

import { vi } from "vitest"

// jsdom does not implement several browser APIs that @workspace/ui primitives
// and the DisplayAdEdit page depend on at render time (matchMedia,
// IntersectionObserver, ResizeObserver, Element.scrollIntoView). Polyfill them
// here so component tests render under the jsdom environment. The whole block
// is guarded on `window` so it stays inert for the node-env logic tests, per
// the docblock above.
if (typeof window !== "undefined") {
  // matchMedia — @workspace/ui's `use-mobile` hook calls it on mount. The mock
  // always reports the non-mobile branch.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // IntersectionObserver — react-aria's Virtualizer (used by Select / Menu /
  // ListBox) needs it for the load-more sentinel.
  class MockIntersectionObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
    root = null
    rootMargin = ""
    thresholds: ReadonlyArray<number> = []
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  })
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  })

  // ResizeObserver — @workspace/ui's ScrollArea (Radix) observes its viewport
  // size on mount. Matches the polyfill packages/ui ships in its own setup.
  class MockResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: MockResizeObserver,
  })
  Object.defineProperty(globalThis, "ResizeObserver", {
    writable: true,
    value: MockResizeObserver,
  })

  // Element.scrollIntoView — @workspace/ui's Select calls it inside a
  // queueMicrotask when its popover opens; the DisplayAdEdit thumbnail strip
  // calls it when the active asset changes.
  if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function scrollIntoView() {}
  }
}
