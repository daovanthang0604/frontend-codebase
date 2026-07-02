import { useAuthSession } from "@/services"

export function SignedIn({ children }: { children: React.ReactNode }) {
  const authSession = useAuthSession()

  if (authSession.isAuthenticated) {
    return children
  }

  return null
}
