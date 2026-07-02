import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { FieldGroup } from "../components/Field"

describe("FieldGroup", () => {
  it("renders group element", () => {
    const { container } = render(<FieldGroup data-testid="field" />)
    expect(container.firstElementChild).toBeInTheDocument()
  })

  it("renders children", () => {
    const { container } = render(
      <FieldGroup>
        <input />
      </FieldGroup>
    )
    expect(container.querySelector("input")).toBeInTheDocument()
  })

  it("applies default variant styles", () => {
    const { container } = render(<FieldGroup />)
    const group = container.firstElementChild
    expect(group?.className).toContain("rounded-md")
  })

  it("applies ghost variant", () => {
    const { container } = render(<FieldGroup variant="ghost" />)
    const group = container.firstElementChild
    expect(group?.className).not.toContain("border")
  })
})
