import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Metric } from "../components/Metric"

describe("Metric", () => {
  it("renders the value and label", () => {
    render(<Metric data-testid="m" value="$45K" label="Story value" />)
    expect(screen.getByTestId("m")).toHaveAttribute("data-slot", "metric")
    expect(screen.getByText("$45K")).toBeInTheDocument()
    expect(screen.getByText("Story value")).toBeInTheDocument()
  })

  it("emphasises the figure in the accent colour", () => {
    render(<Metric value="92" label="Score" emphasis />)
    expect(screen.getByText("92")).toHaveClass("text-accent-12")
  })

  it("colours the delta by trend", () => {
    render(<Metric value="1" label="x" delta="+8%" trend="up" />)
    expect(screen.getByText("+8%")).toHaveClass("text-success-11")
  })

  it("sizes the figure", () => {
    render(<Metric value="1" label="x" size="lg" />)
    expect(screen.getByText("1")).toHaveClass("text-[35px]")
  })

  it("renders an inline sparkline for >= 2 points and omits it otherwise", () => {
    const { container, rerender } = render(
      <Metric value="1" label="x" spark={[1, 4, 2, 6]} />
    )
    expect(container.querySelector("svg path")).toBeInTheDocument()
    rerender(<Metric value="1" label="x" spark={[1]} />)
    expect(container.querySelector("svg")).toBeNull()
  })
})
