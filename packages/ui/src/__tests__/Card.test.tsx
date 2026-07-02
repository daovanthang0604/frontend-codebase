import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/Card"

describe("Card", () => {
  it("renders card with all subcomponents", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card")
    expect(screen.getByText("Title")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("renders card with correct data-slot attributes", () => {
    render(
      <Card>
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">Title</CardTitle>
          <CardDescription data-testid="desc">Desc</CardDescription>
        </CardHeader>
        <CardContent data-testid="content">Body</CardContent>
      </Card>
    )

    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-slot",
      "card-header"
    )
    expect(screen.getByTestId("title")).toHaveAttribute(
      "data-slot",
      "card-title"
    )
    expect(screen.getByTestId("desc")).toHaveAttribute(
      "data-slot",
      "card-description"
    )
    expect(screen.getByTestId("content")).toHaveAttribute(
      "data-slot",
      "card-content"
    )
  })

  it("applies custom className to card", () => {
    render(
      <Card data-testid="card" className="custom-card">
        <CardContent>Test</CardContent>
      </Card>
    )
    expect(screen.getByTestId("card")).toHaveClass("custom-card")
  })
})
