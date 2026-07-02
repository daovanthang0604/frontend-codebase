import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { BaseRadioGroup, Radio, RadioGroup } from "../components/RadioGroup"

describe("Radio", () => {
  it("renders radio with label", () => {
    render(
      <BaseRadioGroup>
        <Radio value="test">Option</Radio>
      </BaseRadioGroup>
    )
    expect(screen.getByText("Option")).toBeInTheDocument()
    expect(screen.getByRole("radio")).toBeInTheDocument()
  })
})

describe("RadioGroup", () => {
  const options = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
  ]

  it("renders all radio options", () => {
    render(<RadioGroup options={options} />)
    expect(screen.getByText("Option A")).toBeInTheDocument()
    expect(screen.getByText("Option B")).toBeInTheDocument()
    expect(screen.getByText("Option C")).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("renders with label", () => {
    render(<RadioGroup options={options} label="Choose one" />)
    expect(screen.getByText("Choose one")).toBeInTheDocument()
  })

  it("renders with asterisk", () => {
    render(<RadioGroup options={options} label="Required" withAsterisk />)
    expect(screen.getByText("*")).toBeInTheDocument()
  })

  it("renders card variant", () => {
    render(<RadioGroup options={options} variant="card" />)
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("renders with custom renderOption", () => {
    render(
      <RadioGroup
        options={options}
        renderOption={(option) => <strong>{option.label}!</strong>}
      />
    )
    expect(screen.getByText("Option A!")).toBeInTheDocument()
  })
})
