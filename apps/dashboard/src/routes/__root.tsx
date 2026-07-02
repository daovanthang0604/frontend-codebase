import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { NuqsAdapter } from "nuqs/adapters/tanstack-router"

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

import "@/utils/i18n"

import { getPageTitle } from "@/utils/page-title"

import { Page404 } from "@/components/Page404"

export interface MyRouterContext {
  queryClient: QueryClient
}

function RootComponent() {
  const debugMode = localStorage.getItem("debug") === "true"
  return (
    <NuqsAdapter>
      <HeadContent />
      <Outlet />
      {debugMode && (
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      )}
    </NuqsAdapter>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  head: () => ({
    meta: [{ title: getPageTitle() }],
  }),
  notFoundComponent: () => <Page404 />,
})
