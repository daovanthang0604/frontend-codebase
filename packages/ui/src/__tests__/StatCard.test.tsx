import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { StatCard, type StatCardColor } from "../components/StatCard"

describe("StatCard (v2)", () => {
  it("renders without crashing for every theme color", () => {
    const colors: StatCardColor[] = ["accent", "blue", "grass", "amber"]
    for (const color of colors) {
      const { unmount } = render(
        <StatCard label={`m-${color}`} value="1" color={color} />
      )
      expect(screen.getByText(`m-${color}`)).toBeInTheDocument()
      unmount()
    }
  })

  it("renders the value, label and sublabel", () => {
    render(
      <StatCard label="Total stories" value="128" sublabel="all statuses" />
    )
    expect(screen.getByText("128")).toBeInTheDocument()
    expect(screen.getByText("Total stories")).toBeInTheDocument()
    expect(screen.getByText("all statuses")).toBeInTheDocument()
  })

  it("renders the optional icon and trend slots", () => {
    render(
      <StatCard
        label="Revenue"
        value="$1,200"
        icon={<span data-testid="icon" />}
        trend={<span data-testid="trend" />}
      />
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
    expect(screen.getByTestId("trend")).toBeInTheDocument()
  })

  it("hides the value behind a placeholder while loading", () => {
    render(<StatCard label="Pending" value="99" isLoading />)
    expect(screen.queryByText("99")).not.toBeInTheDocument()
    expect(screen.getByText("Pending")).toBeInTheDocument()
  })
})
