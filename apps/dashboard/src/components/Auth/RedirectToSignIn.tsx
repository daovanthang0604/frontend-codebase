import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"

export function RedirectToSignin() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({
      to: "/",
      search: {
        redirect: location.pathname,
      },
    })
  }, [navigate])

  return null
}
