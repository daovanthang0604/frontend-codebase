import type { ReactNode } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button as BaseUiButton } from "@workspace/base-ui/components/Button"
import { Button as UiButton } from "@workspace/ui/components/Button"

// Dev/QA surface for the Base UI migration — intentionally NOT wrapped in
// <PageShell> and NOT i18n'd, same exemption as /design-system. Each migrated
// component adds a <Compare> section here (base-ui left, @workspace/ui right).
function Compare({
  title,
  meta,
  baseui,
  ui,
}: {
  title: string
  meta?: string
  baseui: ReactNode
  ui: ReactNode
}) {
  return (
    <section className="border-gray-a4 border-t py-7">
      <header className="mb-4 flex items-baseline gap-2">
        <h2 className="text-gray-12 text-ui-lg font-semibold">{title}</h2>
        {meta ? <span className="text-gray-10 text-ui-sm">{meta}</span> : null}
      </header>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-gray-10 text-eyebrow mb-3 uppercase">base-ui</div>
          <div className="flex flex-wrap items-center gap-3">{baseui}</div>
        </div>
        <div>
          <div className="text-gray-10 text-eyebrow mb-3 uppercase">
            @workspace/ui
          </div>
          <div className="flex flex-wrap items-center gap-3">{ui}</div>
        </div>
      </div>
    </section>
  )
}

function DesignSystemBaseUiRoute() {
  return (
    <div className="bg-gray-1 min-h-svh">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6">
          <div className="text-gray-10 text-eyebrow uppercase">Migration</div>
          <h1 className="text-gray-12 text-display-sm font-semibold">
            Base&nbsp;UI catalog
          </h1>
          <p className="text-gray-11 text-ui-base mt-2 max-w-2xl">
            Each component rebuilt on Base&nbsp;UI (left) beside its
            @workspace/ui counterpart (right) for visual parity. This route grows
            one section per migrated component.
          </p>
        </header>

        <Compare
          title="Button"
          meta="facade → ui (Base UI ships no Button; Tier B)"
          baseui={<BaseUiButton>Base&nbsp;UI Button</BaseUiButton>}
          ui={<UiButton>UI Button</UiButton>}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/design-system-baseui")({
  component: DesignSystemBaseUiRoute,
})
