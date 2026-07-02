import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EGDateField } from "../components/Datefield"

describe("EGDateField", () => {
  it("renders date field", () => {
    render(<EGDateField />)
    expect(screen.getByLabelText("Date Field")).toBeInTheDocument()
  })

  it("renders with a controlled value", () => {
    render(<EGDateField value="2024-06-15" />)
    // Date segments should render the date parts
    expect(screen.getByText("6")).toBeInTheDocument() // month
    expect(screen.getByText("15")).toBeInTheDocument() // day
    expect(screen.getByText("2024")).toBeInTheDocument() // year
  })

  it("renders with a default value", () => {
    render(<EGDateField defaultValue="2024-01-01" />)
    // Both month and day are "1", so use getAllByText
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("2024")).toBeInTheDocument()
  })

  it("renders in disabled state", () => {
    const { container } = render(<EGDateField isDisabled />)
    const group = container.querySelector("[data-disabled]")
    expect(group).toBeInTheDocument()
  })
})
