import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Checkbox, CheckboxGroup } from "../components/Checkbox"

describe("Checkbox", () => {
  it("renders checkbox with label", () => {
    render(<Checkbox value="agree">I agree</Checkbox>)
    expect(screen.getByText("I agree")).toBeInTheDocument()
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
  })

  it("toggles on click", () => {
    const onChange = vi.fn()
    render(
      <Checkbox value="test" onChange={onChange}>
        Check me
      </Checkbox>
    )
    fireEvent.click(screen.getByRole("checkbox"))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("renders in selected state", () => {
    render(
      <Checkbox value="test" isSelected>
        Selected
      </Checkbox>
    )
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("renders in disabled state", () => {
    render(
      <Checkbox value="test" isDisabled>
        Disabled
      </Checkbox>
    )
    expect(screen.getByRole("checkbox")).toBeDisabled()
  })
})

describe("CheckboxGroup", () => {
  const options = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
  ]

  it("renders all options", () => {
    render(<CheckboxGroup options={options} />)
    expect(screen.getByText("Option A")).toBeInTheDocument()
    expect(screen.getByText("Option B")).toBeInTheDocument()
    expect(screen.getByText("Option C")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<CheckboxGroup options={options} label="Pick options" />)
    expect(screen.getByText("Pick options")).toBeInTheDocument()
  })

  it("renders with card variant", () => {
    render(<CheckboxGroup options={options} variant="card" />)
    expect(screen.getAllByRole("checkbox")).toHaveLength(3)
  })
})
