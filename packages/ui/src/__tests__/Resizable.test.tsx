import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/Resizable"

describe("Resizable", () => {
  it("renders panel group with panels", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Right</ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(
      container.querySelector('[data-slot="resizable-panel-group"]')
    ).toBeInTheDocument()
  })

  it("renders panels with data-slot", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Content</ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(
      container.querySelector('[data-slot="resizable-panel"]')
    ).toBeInTheDocument()
  })

  it("renders handle with data-slot", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>A</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>B</ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(
      container.querySelector('[data-slot="resizable-handle"]')
    ).toBeInTheDocument()
  })

  it("renders handle with grip when withHandle is true", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>A</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>B</ResizablePanel>
      </ResizablePanelGroup>
    )
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})
