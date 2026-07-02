import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { CopyButton } from "../components/CopyButton"

describe("CopyButton", () => {
  it("renders copy button", () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("has aria-label Copy", () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy")
  })

  it("applies custom className", () => {
    render(<CopyButton text="test" className="custom" />)
    expect(screen.getByRole("button")).toHaveClass("custom")
  })
})
