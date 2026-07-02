import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Separator } from "../components/Separator"

describe("Separator", () => {
  it("renders horizontal separator by default", () => {
    const { container } = render(<Separator />)
    const separator = container.querySelector("[class]")
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveClass("h-px", "w-full")
  })

  it("renders vertical separator", () => {
    const { container } = render(<Separator orientation="vertical" />)
    const separator = container.querySelector("[class]")
    expect(separator).toHaveClass("h-full", "w-px")
  })

  it("applies custom className", () => {
    const { container } = render(<Separator className="my-4" />)
    const separator = container.querySelector("[class]")
    expect(separator).toHaveClass("my-4")
  })
})
