import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NumberInput } from "../components/NumberInput"

describe("NumberInput", () => {
  it("renders number input", () => {
    render(<NumberInput aria-label="Quantity" />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<NumberInput label="Amount" />)
    expect(screen.getByText("Amount")).toBeInTheDocument()
  })

  it("renders with asterisk", () => {
    render(<NumberInput label="Price" withAsterisk />)
    expect(screen.getByText("*")).toBeInTheDocument()
  })

  it("renders stepper buttons when showStepper is true", () => {
    render(<NumberInput aria-label="Count" showStepper />)
    expect(screen.getByLabelText("Increment")).toBeInTheDocument()
    expect(screen.getByLabelText("Decrement")).toBeInTheDocument()
  })

  it("does not render steppers by default", () => {
    render(<NumberInput aria-label="Count" />)
    expect(screen.queryByLabelText("Increment")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Decrement")).not.toBeInTheDocument()
  })
})
