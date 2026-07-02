import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { SegmentedControl } from "../components/SegmentedControl"

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
]

describe("SegmentedControl", () => {
  it("marks the selected segment as pressed", () => {
    render(<SegmentedControl options={options} value="a" onChange={() => {}} />)
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByRole("button", { name: "Beta" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
  })

  it("calls onChange with the clicked segment value", () => {
    const onChange = vi.fn()
    render(<SegmentedControl options={options} value="a" onChange={onChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Beta" }))
    expect(onChange).toHaveBeenCalledWith("b")
  })
})
