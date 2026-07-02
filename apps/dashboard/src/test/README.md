# Frontend test harness (`src/test/`)

Added for Linear 100-536 (Part B) so the CRM has a component-rendering test
setup. Before this, `vitest.config.ts` ran in a **node** environment with no
DOM — only logic/service tests (`*.test.ts`) existed.

## How the environment is selected

The vitest default environment stays **`node`** so the existing logic tests run
unchanged and fast. A test file opts into a DOM by adding a docblock on the
**first line**:

```ts
// @vitest-environment jsdom
```

Component tests are named `*.test.tsx` and live next to the component (or in a
sibling `__tests__/` folder).

## Rendering a component

Use `renderWithProviders` from `@/test/render`. It wraps the component in the
two providers every CRM screen needs — **TanStack Query** and **i18n**:

```tsx
// @vitest-environment jsdom
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/render"
import { MyComponent } from "../MyComponent"

it("does the thing", async () => {
  renderWithProviders(<MyComponent />)
  await userEvent.click(screen.getByRole("button", { name: "viewTable" }))
  expect(screen.getByRole("table")).toBeInTheDocument()
})
```

### i18n

The harness initialises a throwaway i18n instance with **no resources**, so
`t("someKey")` returns the key verbatim. Assert against keys / `aria-label`s
rather than translated copy — it keeps tests independent of the catalog.

### TanStack Query

Each render gets a fresh `QueryClient` with retries and caching disabled. Grab
it from the return value to seed or inspect the cache:

```tsx
const { queryClient } = renderWithProviders(<MyComponent />)
```

### TanStack Router

Components that read router state (`useSearch`, `useNavigate`, `useParams`,
`Route.useSearch`, `Link`) should **mock those hooks per-test** with
`vi.mock("@tanstack/react-router", …)`. The router needs a matched route tree
that is impractical to stand up generically; mocking keeps each test focused on
the single search-param / navigation interaction it asserts. See
`pages/Management/Organizations/**/__tests__/*.test.tsx` for examples.

## Files

- `setup-dom.ts` — registers `@testing-library/jest-dom` matchers on `expect`
  and polyfills the browser APIs jsdom omits (`matchMedia`,
  `IntersectionObserver`, `ResizeObserver`, `Element.scrollIntoView`) that
  `@workspace/ui` primitives need at render time (loaded globally via
  `vitest.config.ts` → `setupFiles`; the polyfills are `window`-guarded so the
  file stays inert in node-env).
- `render.tsx` — `renderWithProviders`, `createTestQueryClient`, `testI18n`.
