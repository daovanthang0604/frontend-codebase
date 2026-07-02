import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { MetricRow } from "../components/MetricRow"

describe("MetricRow", () => {
  it("lays children out in a grid", () => {
    render(
      <MetricRow data-testid="row">
        <div>A</div>
        <div>B</div>
      </MetricRow>
    )
    const el = screen.getByTestId("row")
    expect(el).toHaveAttribute("data-slot", "metric-row")
    expect(el).toHaveStyle({ display: "grid" })
    expect(screen.getByText("A")).toBeInTheDocument()
    expect(screen.getByText("B")).toBeInTheDocument()
  })

  it("fixes the column count when columns is set", () => {
    render(
      <MetricRow data-testid="row" columns={3}>
        <div>A</div>
      </MetricRow>
    )
    expect(screen.getByTestId("row")).toHaveStyle({
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    })
  })

  it("indents items after the first when dividers is set", () => {
    render(
      <MetricRow dividers gap={30}>
        <div>A</div>
        <div>B</div>
      </MetricRow>
    )
    expect(screen.getByText("A").parentElement?.style.paddingLeft).toBe("")
    expect(screen.getByText("B").parentElement?.style.paddingLeft).toBe("30px")
  })
})
