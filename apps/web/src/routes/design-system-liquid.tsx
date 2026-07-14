import { useState, type ReactNode } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Checkbox } from "@workspace/liquid-ui/components/Checkbox"
import { GlassPanel } from "@workspace/liquid-ui/components/GlassPanel"
import {
  Input,
  PasswordInput,
  SearchInput,
  TextArea,
} from "@workspace/liquid-ui/components/Input"
import { NumberInput } from "@workspace/liquid-ui/components/NumberInput"
import { Progress } from "@workspace/liquid-ui/components/Progress"
import { RadioGroup } from "@workspace/liquid-ui/components/RadioGroup"
import { Slider } from "@workspace/liquid-ui/components/Slider"
import { Switch } from "@workspace/liquid-ui/components/Switch"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@workspace/liquid-ui/components/Tabs"

import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"

// Dev/QA surface for the @workspace/liquid-ui glass kit — the parallel to
// /design-system-baseui. Intentionally NOT wrapped in <PageShell> and NOT i18n'd
// (same exemption as the other catalog routes). The whole page is scoped to
// [data-theme="liquid"] over the .liquid-aurora sky. App light/dark mode
// (next-themes' .dark class) drives the compound theme selectors, so toggle the
// mode switch to verify BOTH modes on this one route. Sections grow one per
// component group as the kit lands (Phase 0 ships the GlassPanel surface).

function LiquidSection({
  title,
  meta,
  children,
}: {
  title: string
  meta?: string
  children: ReactNode
}) {
  return (
    <section className="border-gray-a5 border-t py-7">
      <header className="mb-4 flex flex-col gap-1">
        <h2 className="text-gray-12 text-ui-lg font-semibold">{title}</h2>
        {meta ? <span className="text-gray-11 text-ui-sm">{meta}</span> : null}
      </header>
      {children}
    </section>
  )
}

const radioOptions = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
]

// Phase 1 proof: the M2 re-skin. Every control below is imported from
// @workspace/liquid-ui but is base-ui's component re-exported unchanged. Under
// [data-theme="liquid"] the theme repoints --accent-*/--gray-*, so they render
// cyan-on-slate with zero per-component code. They sit ON a GlassPanel to show
// controls stay solid and legible over glass (glass material would hurt inputs).
function ThemedControlsSection() {
  const [search, setSearch] = useState("")
  const [subscribed, setSubscribed] = useState(true)
  const [notify, setNotify] = useState(false)
  const [volume, setVolume] = useState<number | number[]>(40)
  const [channel, setChannel] = useState(radioOptions[0])

  return (
    <LiquidSection
      title="Themed controls"
      meta="re-exported from base-ui unchanged; the liquid theme re-skins them (cyan accent, cool slate) with zero per-component code. Kept solid on purpose; glass hurts legibility on inputs."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <GlassPanel elevation="float" className="space-y-4 p-5">
          <div className="text-gray-12 text-ui-sm font-medium">Text fields</div>
          <Input label="Email" placeholder="you@example.com" />
          <PasswordInput label="Password" placeholder="••••••••" />
          <TextArea label="Notes" placeholder="Write something…" />
          <SearchInput
            placeholder="Search…"
            value={search}
            onChange={setSearch}
          />
          <NumberInput
            label="Budget"
            placeholder="0"
            showStepper
            defaultValue={100}
          />
        </GlassPanel>

        <GlassPanel elevation="float" className="space-y-5 p-5">
          <div className="text-gray-12 text-ui-sm font-medium">
            Selection and feedback
          </div>
          <div className="flex items-center gap-6">
            <Checkbox
              isSelected={subscribed}
              onChange={setSubscribed}
              aria-label="Subscribe"
            />
            <Checkbox isIndeterminate aria-label="Indeterminate" />
            <Checkbox isSelected isDisabled aria-label="Disabled" />
            <Switch isSelected={notify} onChange={setNotify} />
          </div>
          <Slider
            value={volume}
            onChange={setVolume}
            minValue={0}
            maxValue={100}
            label="Volume"
          />
          <RadioGroup
            options={radioOptions}
            value={channel}
            onChange={(o) => o && setChannel(o)}
            label="Notifications"
          />
          <Progress value={40} label="Uploading" showValue />
        </GlassPanel>
      </div>

      <div className="mt-5">
        <Tabs defaultSelectedKey="overview" className="w-full">
          <TabList>
            <Tab id="overview">Overview</Tab>
            <Tab id="activity">Activity</Tab>
            <Tab id="settings">Settings</Tab>
          </TabList>
          <TabPanel id="overview">
            <p className="text-gray-11 text-ui-sm pt-3">
              Tabs re-exported from base-ui, re-skinned by the liquid theme.
            </p>
          </TabPanel>
          <TabPanel id="activity">
            <p className="text-gray-11 text-ui-sm pt-3">
              The active indicator picks up the cyan accent under the scope.
            </p>
          </TabPanel>
          <TabPanel id="settings">
            <p className="text-gray-11 text-ui-sm pt-3">
              No per-component code; the token re-point does the work.
            </p>
          </TabPanel>
        </Tabs>
      </div>
    </LiquidSection>
  )
}

function DesignSystemLiquidRoute() {
  return (
    <div data-theme="liquid" className="liquid-aurora text-gray-12 min-h-svh">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-gray-11 text-eyebrow uppercase">
              Liquid glass
            </div>
            <h1 className="text-gray-12 text-display-sm font-semibold">
              Liquid&nbsp;UI catalog
            </h1>
            <p className="text-gray-11 text-ui-base mt-2 max-w-2xl">
              The @workspace/liquid-ui kit rendered under the liquid theme, over
              a drifting aurora sky. Surfaces and overlays are authored glass;
              controls and composites are base-ui re-exports the theme re-skins.
              Toggle light/dark to confirm both modes; this route grows one
              section per component group as the kit lands.
            </p>
          </div>
          <ThemeModeSwitcher />
        </header>

        <LiquidSection
          title="GlassPanel"
          meta="the shared liquid-glass surface: tint (frost / tinted / clear), elevation (flush / float / hero), optional pointer sheen"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <GlassPanel elevation="float" className="p-5">
              <div className="text-gray-12 text-ui-base font-medium">
                Frost, float
              </div>
              <p className="text-gray-11 text-ui-sm mt-1">
                The neutral default surface for panels and cards.
              </p>
            </GlassPanel>
            <GlassPanel
              tint="tinted"
              elevation="hero"
              interactive
              className="p-5"
            >
              <div className="text-gray-12 text-ui-base font-medium">
                Tinted, hero
              </div>
              <p className="text-gray-11 text-ui-sm mt-1">
                Accent-tinted and lifted, with a sheen that tracks the pointer.
              </p>
            </GlassPanel>
            <GlassPanel tint="clear" elevation="flush" className="p-5">
              <div className="text-gray-12 text-ui-base font-medium">
                Clear, flush
              </div>
              <p className="text-gray-11 text-ui-sm mt-1">
                Barely-there chrome that lets the sky read straight through.
              </p>
            </GlassPanel>
          </div>
        </LiquidSection>

        <ThemedControlsSection />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/design-system-liquid")({
  component: DesignSystemLiquidRoute,
})
