import type { ReactNode } from "react"
import { createFileRoute } from "@tanstack/react-router"

import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"
import { GlassPanel } from "@workspace/liquid-ui/components/GlassPanel"

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
              The @workspace/liquid-ui kit rendered under the liquid theme, over a
              drifting aurora sky. Every surface here is authored glass, not a
              re-skin of base-ui. Toggle light/dark to confirm both modes; this
              route grows one section per component group as the kit lands.
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
            <GlassPanel tint="tinted" elevation="hero" interactive className="p-5">
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
      </div>
    </div>
  )
}

export const Route = createFileRoute("/design-system-liquid")({
  component: DesignSystemLiquidRoute,
})
