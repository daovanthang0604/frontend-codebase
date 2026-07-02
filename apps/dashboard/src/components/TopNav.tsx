import { signIn, useAuthSession } from "@/services"
import { Button } from "@workspace/ui/components/Button"
import { useNavigate } from "@tanstack/react-router"

import { UserButton } from "@/components/Auth/UserButton"
import { Logo } from "@/components/Logo"
import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"

type TopNavProps = {
  isAuthLoading?: boolean
}

export function TopNav({ isAuthLoading = false }: TopNavProps) {
  const navigate = useNavigate()
  const authSession = useAuthSession()
  const isSignedIn = !isAuthLoading && authSession.isAuthenticated

  return (
    <nav className="bg-gray-1/70 border-gray-a5 sticky top-0 z-40 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md md:px-12">
      <Logo />

      <div className="flex items-center gap-3">
        <ThemeModeSwitcher />
        {isSignedIn ? (
          <UserButton />
        ) : (
          // Stub sign-in — mints a fake token and drops the user into the
          // dashboard shell. Replace with your real auth entry point.
          <Button
            variant="solid"
            intent="primary"
            size="sm"
            onClick={() => {
              signIn()
              navigate({ to: "/dashboard" })
            }}
          >
            Sign in (demo)
          </Button>
        )}
      </div>
    </nav>
  )
}
