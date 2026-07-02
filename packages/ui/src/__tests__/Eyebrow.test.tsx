import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Eyebrow } from "../components/Eyebrow"

describe("Eyebrow", () => {
  it("renders children as an uppercase eyebrow", () => {
    render(<Eyebrow data-testid="eb">In this campaign</Eyebrow>)
    const el = screen.getByTestId("eb")
    expect(el).toHaveAttribute("data-slot", "eyebrow")
    expect(el).toHaveClass("uppercase", "text-eyebrow")
    expect(screen.getByText("In this campaign")).toBeInTheDocument()
  })

  it("applies the tone colour", () => {
    const { rerender } = render(<Eyebrow data-testid="eb">x</Eyebrow>)
    expect(screen.getByTestId("eb")).toHaveClass("text-gray-10") // muted default
    rerender(
      <Eyebrow data-testid="eb" tone="accent">
        x
      </Eyebrow>
    )
    expect(screen.getByTestId("eb")).toHaveClass("text-accent-11")
    rerender(
      <Eyebrow data-testid="eb" tone="faint">
        x
      </Eyebrow>
    )
    expect(screen.getByTestId("eb")).toHaveClass("text-gray-9")
  })

  it("renders a leading icon when provided", () => {
    render(<Eyebrow icon={<svg data-testid="ico" />}>x</Eyebrow>)
    expect(screen.getByTestId("ico")).toBeInTheDocument()
  })
})
