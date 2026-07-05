import { getPageTitle } from "@/utils/page-title"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/Card"
import { createFileRoute } from "@tanstack/react-router"

import { PageShell } from "@/components/PageShell"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: getPageTitle("Dashboard") }],
  }),
})

function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="Placeholder authenticated page — replace it with your app."
    >
      <Card>
        <CardHeader>
          <CardTitle>You're signed in</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-11 text-sm">
          <p>
            The layout, sidebar, theming, i18n, and auth boundary are wired up.
            Start building by adding routes under <code>src/routes</code> and
            composing components from <code>@workspace/ui</code>. Browse the
            Design System entry in the sidebar for available primitives.
          </p>
        </CardContent>
      </Card>
    </PageShell>
  )
}
