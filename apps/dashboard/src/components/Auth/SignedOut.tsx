import { useAuthSession } from "@/services"

export function SignedOut({ children }: { children: React.ReactNode }) {
  const authSession = useAuthSession()

  if (authSession.isLoading) {
    return null
  }

  if (authSession.isAuthenticated) {
    return null
  }

  return children
}
