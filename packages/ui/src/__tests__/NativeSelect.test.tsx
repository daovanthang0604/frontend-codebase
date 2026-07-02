import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "../components/NativeSelect"

describe("NativeSelect", () => {
  it("renders select with options", () => {
    render(
      <NativeSelect aria-label="Select an option">
        <NativeSelectOption value="a">Option A</NativeSelectOption>
        <NativeSelectOption value="b">Option B</NativeSelectOption>
      </NativeSelect>
    )

    const select = screen.getByRole("combobox")
    expect(select).toBeInTheDocument()
    expect(screen.getByText("Option A")).toBeInTheDocument()
    expect(screen.getByText("Option B")).toBeInTheDocument()
  })

  it("renders with correct data-slot", () => {
    render(
      <NativeSelect aria-label="Test">
        <NativeSelectOption value="a">A</NativeSelectOption>
      </NativeSelect>
    )

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "data-slot",
      "native-select"
    )
  })

  it("renders with optgroup", () => {
    render(
      <NativeSelect aria-label="Grouped">
        <NativeSelectOptGroup label="Group 1">
          <NativeSelectOption value="a">A</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    )

    const group = screen.getByRole("group")
    expect(group).toHaveAttribute("label", "Group 1")
  })

  it("supports disabled state", () => {
    render(
      <NativeSelect aria-label="Disabled" disabled>
        <NativeSelectOption value="a">A</NativeSelectOption>
      </NativeSelect>
    )

    expect(screen.getByRole("combobox")).toBeDisabled()
  })

  it("applies custom className", () => {
    render(
      <NativeSelect aria-label="Custom" className="custom-select">
        <NativeSelectOption value="a">A</NativeSelectOption>
      </NativeSelect>
    )

    expect(screen.getByRole("combobox")).toHaveClass("custom-select")
  })
})
