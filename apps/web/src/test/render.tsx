import type { ReactElement, ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react"
import i18n from "i18next"
import { I18nextProvider, initReactI18next } from "react-i18next"

// A throwaway i18n instance with NO resources. With missing-key fallback,
// `t("someKey")` returns "someKey" — deterministic, and lets component tests
// assert on stable translation keys / aria-labels without shipping a copy of
// the translation catalog into the test suite.
const testI18n: ReturnType<typeof i18n.createInstance> = i18n.createInstance()
void testI18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {},
  interpolation: { escapeValue: false },
})
/**
 * Fresh QueryClient per render with retries and caching disabled so tests are
 * deterministic and a failed query/mutation surfaces immediately instead of
 * being retried on a timer.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      // gcTime: Infinity keeps seeded/inactive query data alive for the
      // duration of a test (with gcTime: 0, data set via setQueryData with no
      // active observer is collected before an async mutation can read it).
      queries: { retry: false, gcTime: Infinity, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}
interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /** Supply your own client to inspect/seed the cache; defaults to a fresh one. */
  queryClient?: QueryClient
}
export interface RenderWithProvidersResult extends RenderResult {
  queryClient: QueryClient
}
/**
 * Render a component inside the providers every CRM screen depends on:
 * TanStack Query (server state) and i18n (translations). Components that also
 * read TanStack Router state (`useSearch`, `useNavigate`, `useParams`) should
 * mock those hooks per-test — the router needs a matched route tree that is
 * impractical to stand up generically, and mocking keeps each test focused on
 * the one search-param / navigation interaction it asserts.
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {}
): RenderWithProvidersResult {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    )
  }
  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
export { testI18n }
