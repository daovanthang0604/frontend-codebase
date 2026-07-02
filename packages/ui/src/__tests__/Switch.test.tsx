import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Switch } from "../components/Switch"

describe("Switch", () => {
  it("renders switch with label", () => {
    render(<Switch>Dark mode</Switch>)
    expect(screen.getByText("Dark mode")).toBeInTheDocument()
    expect(screen.getByRole("switch")).toBeInTheDocument()
  })

  it("toggles on click", () => {
    const onChange = vi.fn()
    render(<Switch onChange={onChange}>Toggle</Switch>)
    fireEvent.click(screen.getByRole("switch"))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("renders in selected state", () => {
    render(<Switch isSelected>Active</Switch>)
    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("renders in disabled state", () => {
    render(<Switch isDisabled>Disabled</Switch>)
    expect(screen.getByRole("switch")).toBeDisabled()
  })
})
