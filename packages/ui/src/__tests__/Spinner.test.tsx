import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Spinner } from "../components/Spinner"

describe("Spinner", () => {
  it("renders an svg element", () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })

  it("applies default animation class", () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveClass("animate-spin")
  })

  it("applies custom className", () => {
    const { container } = render(<Spinner className="size-10" />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveClass("size-10")
  })
})
