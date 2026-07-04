import { useState, type ComponentType, type ReactNode } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button as BaseUiButton } from "@workspace/base-ui/components/Button"
import { Separator as BaseUiSeparator } from "@workspace/base-ui/components/Separator"
import { Switch as BaseUiSwitch } from "@workspace/base-ui/components/Switch"
import { Button as UiButton } from "@workspace/ui/components/Button"
import { Separator as UiSeparator } from "@workspace/ui/components/Separator"
import { Switch as UiSwitch } from "@workspace/ui/components/Switch"

// Dev/QA surface for the Base UI migration — intentionally NOT wrapped in
// <PageShell> and NOT i18n'd, same exemption as /design-system. Each migrated
// component adds a <Compare> section (base-ui left, @workspace/ui right).
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

type SeparatorLike = ComponentType<{
  orientation?: "horizontal" | "vertical"
  className?: string
}>

function SeparatorDemo({ Separator }: { Separator: SeparatorLike }) {
  return (
    <div className="w-48">
      <div className="text-gray-11 text-ui-sm">Above the line</div>
      <Separator className="my-3" />
      <div className="text-gray-11 text-ui-sm">Below the line</div>
      <div className="text-gray-11 text-ui-sm mt-4 flex h-8 items-center gap-3">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  )
}

type SwitchLike = ComponentType<{
  isSelected?: boolean
  onChange?: (v: boolean) => void
  isDisabled?: boolean
}>

function SwitchDemo({ Switch }: { Switch: SwitchLike }) {
  const [on, setOn] = useState(true)
  return (
    <div className="flex items-center gap-5">
      <Switch isSelected={on} onChange={setOn} />
      <Switch isSelected={false} onChange={() => {}} />
      <Switch isSelected isDisabled />
      <Switch isDisabled />
    </div>
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

        <Compare
          title="Separator"
          meta="Base UI Separator · data-orientation dimensions"
          baseui={<SeparatorDemo Separator={BaseUiSeparator} />}
          ui={<SeparatorDemo Separator={UiSeparator} />}
        />

        <Compare
          title="Switch"
          meta="Base UI Switch.Root/Thumb · react-aria props mapped · on/off/disabled"
          baseui={<SwitchDemo Switch={BaseUiSwitch} />}
          ui={<SwitchDemo Switch={UiSwitch} />}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/design-system-baseui")({
  component: DesignSystemBaseUiRoute,
})
