import { StrictMode } from "react"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"

import "@/styles/app.css"
import "@workspace/shared/zod"
import "@workspace/theme/globals.css"

import { AppProviders } from "./components/AppProviders"
import * as TanStackQueryProvider from "./integrations/tanstack-query/query-provider"
import reportWebVitals from "./reportWebVitals"
import { routeTree } from "./routeTree.gen"

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: false,
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

function InnerApp() {
  return <RouterProvider router={router} />
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <AppProviders>
          <InnerApp />
        </AppProviders>
      </TanStackQueryProvider.Provider>
    </StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
