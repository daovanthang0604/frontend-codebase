import {
  useCanGoBack,
  useNavigate,
  useRouter,
  type LinkProps,
} from "@tanstack/react-router"

export function useGoBack({ to }: { to: LinkProps["to"] }) {
  const canGoBack = useCanGoBack()
  const router = useRouter()
  const navigate = useNavigate()
  return () => {
    if (canGoBack) {
      router.history.back()
    } else {
      navigate({ to: to })
    }
  }
}
