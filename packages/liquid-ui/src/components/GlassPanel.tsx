"use client"

import * as React from "react"

import { cn } from "@workspace/liquid-ui/lib/utils"

// Shared glass layer: the kit-default --glass-* tokens (which this panel's inline
// fallbacks mirror) + the .glass-overlay / .glass-scrim recipes used across the
// kit. Imported here so those shared defaults are present wherever a GlassPanel
// renders; GlassPanel.css below keeps only the panel-specific rules.
import "@workspace/liquid-ui/lib/glass"
import "./GlassPanel.css"

// GlassPanel — the reusable liquid-glass surface for the kit. An HONEST web
// approximation of frosted / "liquid" glass (backdrop blur+saturate, layered
// translucent fill, directional edge lighting, masked gradient rim, specular
// sheen, optional pointer highlight + Chromium-only refraction). It is NOT
// Apple's Liquid Glass, which is Apple-platform-only with no public web CSS.
//
// All look tunables are CSS vars with fallbacks (see GlassPanel.css). The
// defaults render a light frost that works anywhere; wrap the panel in a theme
// scope (the "liquid" theme, [data-theme="liquid"]) to retint the glass for a
// backdrop.
//
//   <GlassPanel tint="frost" elevation="hero" interactive refraction>…</GlassPanel>

type GlassTint = "frost" | "tinted" | "clear"
type GlassElevation = "flush" | "float" | "hero"

interface GlassPanelProps extends React.ComponentProps<"div"> {
  /** Fill body: neutral frost (default), accent-tinted, or barely-there. */
  tint?: GlassTint
  /** How far the panel floats off the surface. */
  elevation?: GlassElevation
  /** Pointer-tracked specular highlight. No-op under reduced motion. */
  interactive?: boolean
  /**
   * Real backdrop refraction via an SVG displacement filter. Progressive
   * enhancement: Chromium-only, behind `@supports`; other engines keep the
   * blur+saturate fallback. Reserve for one or two hero surfaces (it is costly).
   */
  refraction?: boolean
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  )
}

function GlassPanel({
  className,
  tint = "frost",
  elevation = "float",
  interactive = false,
  refraction = false,
  onPointerMove,
  children,
  ...props
}: GlassPanelProps) {
  // Track the pointer imperatively via CSS custom props — NEVER React state,
  // which would re-render the tree on every pointer frame (and jank on mobile).
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!prefersReducedMotion()) {
      const el = event.currentTarget
      const rect = el.getBoundingClientRect()
      el.style.setProperty("--glass-mx", `${event.clientX - rect.left}px`)
      el.style.setProperty("--glass-my", `${event.clientY - rect.top}px`)
    }
    onPointerMove?.(event)
  }

  return (
    <div
      data-slot="glass-panel"
      data-tint={tint}
      data-elevation={elevation}
      data-interactive={interactive ? "true" : undefined}
      data-refraction={refraction ? "true" : undefined}
      className={cn("glass-panel", className)}
      onPointerMove={interactive ? handlePointerMove : onPointerMove}
      {...props}
    >
      {refraction ? <GlassRefractionFilter /> : null}
      {children}
    </div>
  )
}

// The displacement filter referenced by `backdrop-filter: url(#glass-refraction)`.
// feTurbulence makes fractal noise; feDisplacementMap reads it as per-pixel
// offsets (R→x, G→y) so the backdrop bends. Rendered inside each refracting
// panel so the id always resolves (duplicate defs are inert — the first wins).
// Blurring the noise smooths the warp; scale is small so text stays readable.
function GlassRefractionFilter() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute size-0"
      focusable="false"
    >
      <filter
        id="glass-refraction"
        x="0"
        y="0"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01 0.012"
          numOctaves={2}
          seed={4}
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation={2} result="soft" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="soft"
          scale={14}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  )
}

export { GlassPanel }
export type { GlassPanelProps, GlassTint, GlassElevation }
