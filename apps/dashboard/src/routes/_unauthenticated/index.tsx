import { getPageTitle } from "@/utils/page-title"
import { Button } from "@workspace/ui/components/Button"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { z } from "zod"

import { signIn } from "@/services"

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export type LandingSearchParams = z.infer<typeof searchSchema>

export const Route = createFileRoute("/_unauthenticated/")({
  component: LandingPage,
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [{ title: getPageTitle() }],
  }),
})

function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-gray-12 text-4xl font-semibold text-balance">
        Frontend starter template
      </h1>
      <p className="text-gray-11 max-w-xl text-balance">
        A React + TanStack Router app wired with the shared UI kit, theming,
        i18n, and a stubbed auth boundary. Sign in to explore the dashboard
        shell, or jump straight to the design system.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="solid"
          intent="primary"
          onClick={() => {
            signIn()
            navigate({ to: "/dashboard" })
          }}
        >
          Sign in (demo)
        </Button>
        <Button
          variant="ghost"
          intent="secondary"
          onClick={() => navigate({ to: "/design-system" })}
        >
          View design system
        </Button>
      </div>
    </main>
  )
}
