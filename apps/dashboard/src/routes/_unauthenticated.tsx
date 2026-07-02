import { useAuthSession } from "@/services"
import { Spinner } from "@workspace/ui/components/Spinner"
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { RedirectToHome } from "@/components/Auth/RedirectToHome"
import { TopNav } from "@/components/TopNav"

export const Route = createFileRoute("/_unauthenticated")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation("landing")
  const authSession = useAuthSession()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isHomeRoute = pathname === "/"

  // Only routes that actually live inside the `_unauthenticated` tree should
  // bounce signed-in users (e.g. /forgot-password). Listing them explicitly
  // avoids a transient redirect when TanStack swaps this layout out for a
  // sibling route like /discover or /campaign-preview/$id — during the
  // transition `pathname` momentarily reads the new path while this layout
  // is still mounted, and a generic `!isHomeRoute` check would fire
  // `RedirectToHome` and yank the user to /dashboard before the new layout
  // takes over.
  const isUnauthOnlyRoute = pathname.startsWith("/forgot-password")

  if (authSession.isAuthenticated && isUnauthOnlyRoute) {
    return <RedirectToHome />
  }

  return (
    <>
      <TopNav isAuthLoading={authSession.isLoading} />
      {authSession.isLoading && !isHomeRoute ? (
        <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6">
          <div className="text-gray-11 flex items-center gap-3 text-sm">
            <Spinner className="text-accent-9 size-5" />
            <span>{t("checkingYourSession")}</span>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  )
}
