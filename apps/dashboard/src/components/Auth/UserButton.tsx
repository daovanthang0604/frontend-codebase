import { signOut } from "@/services"
import { Button } from "@workspace/ui/components/Button"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { LogOutIcon } from "lucide-react"

// Minimal account control for the signed-in shell. The original app rendered a
// full account popover (profile, change password, avatar) backed by Cognito +
// the user service; those were removed with the backend. Rebuild richer account
// UI here once you have a real user source.
export function UserButton() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return (
    <Button
      variant="ghost"
      size="sm"
      leftIcon={<LogOutIcon />}
      onClick={() => {
        signOut()
        queryClient.clear()
        navigate({ to: "/" })
      }}
    >
      Sign out
    </Button>
  )
}
