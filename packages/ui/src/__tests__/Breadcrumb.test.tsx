import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/Breadcrumb"

describe("Breadcrumb", () => {
  it("renders full breadcrumb navigation", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "breadcrumb"
    )
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Current")).toBeInTheDocument()
  })

  it("renders breadcrumb link with correct href", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const link = screen.getByText("Dashboard")
    expect(link).toHaveAttribute("href", "/dashboard")
    expect(link).toHaveAttribute("data-slot", "breadcrumb-link")
  })

  it("renders breadcrumb page with aria attributes", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const page = screen.getByText("Settings")
    expect(page).toHaveAttribute("aria-current", "page")
    expect(page).toHaveAttribute("aria-disabled", "true")
  })

  it("renders separator with default chevron icon", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>
      </Breadcrumb>
    )

    const separator = screen.getByTestId("sep")
    expect(separator).toHaveAttribute("role", "presentation")
    expect(separator).toHaveAttribute("aria-hidden", "true")
  })

  it("renders ellipsis", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByTestId("ellipsis")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
    expect(screen.getByText("More")).toBeInTheDocument() // sr-only text
  })

  it("renders link as child with asChild", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/test">Slotted Link</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByText("Slotted Link")).toBeInTheDocument()
  })
})
