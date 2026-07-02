import i18n from "@/utils/i18n"
import { DashboardLayoutContent } from "@workspace/ui/components/DashboardLayout"
import { createFileRoute, Outlet } from "@tanstack/react-router"

import { RedirectToSignin } from "@/components/Auth/RedirectToSignIn"
import { SignedIn } from "@/components/Auth/SignedIn"
import { SignedOut } from "@/components/Auth/SignedOut"
import { UserButton } from "@/components/Auth/UserButton"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async () => {
    await i18n.loadNamespaces(["landing"])
  },
})

function RouteComponent() {
  return (
    <>
      <SignedOut>
        <RedirectToSignin />
      </SignedOut>

      <SignedIn>
        <DashboardLayout>
          <DashboardLayoutContent
            header={
              <div className="flex items-center justify-end gap-1">
                <ThemeModeSwitcher />
                <UserButton />
              </div>
            }
          >
            <Outlet />
          </DashboardLayoutContent>
        </DashboardLayout>
      </SignedIn>
    </>
  )
}
