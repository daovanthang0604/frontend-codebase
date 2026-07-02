import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Sparkline } from "../components/Sparkline"

describe("Sparkline", () => {
  it("draws a normalized polyline for a known series", () => {
    const { container } = render(
      <Sparkline data={[0, 10]} width={100} height={20} />
    )
    const polyline = container.querySelector("polyline")
    expect(polyline).not.toBeNull()
    // min=0, max=10, range=10, stepX=100. First point bottom-left, last top-right.
    expect(polyline?.getAttribute("points")).toBe("0.00,20.00 100.00,0.00")
    expect(polyline?.getAttribute("stroke")).toBe("currentColor")
  })

  it("collapses a flat series to a centred horizontal line (no divide-by-zero)", () => {
    const { container } = render(
      <Sparkline data={[5, 5, 5]} width={100} height={20} />
    )
    const points = container.querySelector("polyline")?.getAttribute("points")
    // range falls back to 1, (v-min)=0 → y = height for every point.
    expect(points).toBe("0.00,20.00 50.00,20.00 100.00,20.00")
  })

  it("renders nothing for an empty series (no fake line)", () => {
    const { container } = render(<Sparkline data={[]} />)
    expect(container.querySelector("svg")).toBeNull()
  })

  it("renders nothing for a single-point series", () => {
    const { container } = render(<Sparkline data={[42]} />)
    expect(container.querySelector("svg")).toBeNull()
  })

  it("is decorative (aria-hidden) without a label, and an img with one", () => {
    const { container, rerender } = render(<Sparkline data={[1, 2, 3]} />)
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    )

    rerender(<Sparkline data={[1, 2, 3]} aria-label="Revenue trend" />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("role", "img")
    expect(svg).toHaveAttribute("aria-label", "Revenue trend")
    expect(svg).not.toHaveAttribute("aria-hidden")
  })

  it("renders nothing for a series containing a non-finite value", () => {
    const { container } = render(<Sparkline data={[1, Number.NaN, 3]} />)
    expect(container.querySelector("svg")).toBeNull()
  })

  it("introduces no charting-library runtime dependency (hand-rolled SVG only)", () => {
    const pkgPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../package.json"
    )
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
      peerDependencies?: Record<string, string>
    }
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
    }
    const chartingLibs = [
      "recharts",
      "chart.js",
      "react-chartjs-2",
      "victory",
      "d3",
      "@nivo/core",
      "apexcharts",
      "react-apexcharts",
      "react-sparklines",
      "@visx/visx",
    ]
    for (const lib of chartingLibs) {
      expect(allDeps).not.toHaveProperty(lib)
    }
  })
})
