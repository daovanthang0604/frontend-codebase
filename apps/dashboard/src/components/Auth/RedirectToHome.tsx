import { useEffect } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"

export function RedirectToHome() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    if (pathname !== "/dashboard") {
      navigate({ to: "/dashboard" })
    }
  }, [navigate, pathname])

  return null
}
