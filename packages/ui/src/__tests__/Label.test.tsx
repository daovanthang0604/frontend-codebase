import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Label } from "../components/Label"

describe("Label", () => {
  it("renders label text", () => {
    render(<Label>Username</Label>)
    expect(screen.getByText("Username")).toBeInTheDocument()
  })

  it("renders asterisk when withAsterisk is true", () => {
    render(<Label withAsterisk>Required field</Label>)
    expect(screen.getByText("*")).toBeInTheDocument()
  })

  it("does not render asterisk by default", () => {
    const { container } = render(<Label>Optional field</Label>)
    expect(container.querySelector("span")).not.toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(<Label className="custom-label">Test</Label>)
    expect(screen.getByText("Test")).toHaveClass("custom-label")
  })
})
