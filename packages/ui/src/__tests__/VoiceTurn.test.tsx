import { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { VoiceTurn, type VoiceTurnMode } from "../components/voice/VoiceTurn"

describe("VoiceTurn", () => {
  it("renders the question, play control, record button, and voice↔text toggle in voice mode", () => {
    render(
      <VoiceTurn
        questionText="What drew you to this cause?"
        hasQuestionAudio
        mode="voice"
        onModeChange={vi.fn()}
        textValue=""
        onTextChange={vi.fn()}
      />
    )
    expect(screen.getByText("What drew you to this cause?")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /play question/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /record/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Text" })).toBeInTheDocument()
    // No free-text input is shown while in voice mode.
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("toggling voice→text reveals the text input", () => {
    function Harness() {
      const [mode, setMode] = useState<VoiceTurnMode>("voice")
      const [text, setText] = useState("")
      return (
        <VoiceTurn
          questionText="Q1"
          mode={mode}
          onModeChange={setMode}
          textValue={text}
          onTextChange={setText}
        />
      )
    }
    render(<Harness />)
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Text" }))
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("renders the text fallback at ≥16px to avoid iOS auto-zoom", () => {
    render(
      <VoiceTurn
        questionText="Q1"
        mode="text"
        onModeChange={vi.fn()}
        textValue=""
        onTextChange={vi.fn()}
      />
    )
    // iOS Safari auto-zooms focused inputs whose font-size is < 16px.
    expect(screen.getByRole("textbox")).toHaveStyle({ fontSize: "16px" })
  })

  it("drives the text fallback as a controlled input", () => {
    const onTextChange = vi.fn()
    render(
      <VoiceTurn
        questionText="Q1"
        mode="text"
        onModeChange={vi.fn()}
        textValue="hello"
        onTextChange={onTextChange}
      />
    )
    const box = screen.getByRole("textbox")
    expect(box).toHaveValue("hello")
    fireEvent.change(box, { target: { value: "hello world" } })
    expect(onTextChange).toHaveBeenCalledWith("hello world")
  })

  it("fires onRecordStart when idle and onRecordStop while recording", () => {
    const onRecordStart = vi.fn()
    const onRecordStop = vi.fn()
    const { rerender } = render(
      <VoiceTurn
        questionText="Q1"
        mode="voice"
        status="idle"
        onModeChange={vi.fn()}
        textValue=""
        onTextChange={vi.fn()}
        onRecordStart={onRecordStart}
        onRecordStop={onRecordStop}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: /record/i }))
    expect(onRecordStart).toHaveBeenCalledTimes(1)
    expect(onRecordStop).not.toHaveBeenCalled()

    rerender(
      <VoiceTurn
        questionText="Q1"
        mode="voice"
        status="recording"
        onModeChange={vi.fn()}
        textValue=""
        onTextChange={vi.fn()}
        onRecordStart={onRecordStart}
        onRecordStop={onRecordStop}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: /stop/i }))
    expect(onRecordStop).toHaveBeenCalledTimes(1)
  })

  it("shows the live partial transcript while recording", () => {
    render(
      <VoiceTurn
        questionText="Q1"
        mode="voice"
        status="recording"
        partialTranscript="I first heard about"
        onModeChange={vi.fn()}
        textValue=""
        onTextChange={vi.fn()}
      />
    )
    expect(screen.getByText("I first heard about")).toBeInTheDocument()
  })

  it("fires onPlayQuestion when the play control is pressed", () => {
    const onPlayQuestion = vi.fn()
    render(
      <VoiceTurn
        questionText="Q1"
        hasQuestionAudio
        mode="voice"
        onModeChange={vi.fn()}
        textValue=""
        onTextChange={vi.fn()}
        onPlayQuestion={onPlayQuestion}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: /play question/i }))
    expect(onPlayQuestion).toHaveBeenCalledTimes(1)
  })

  it("surfaces an error message in the error status", () => {
    render(
      <VoiceTurn
        questionText="Q1"
        mode="voice"
        status="error"
        errorMessage="Microphone unavailable — switched to text."
        onModeChange={vi.fn()}
        textValue=""
        onTextChange={vi.fn()}
      />
    )
    expect(
      screen.getByText("Microphone unavailable — switched to text.")
    ).toBeInTheDocument()
  })

  it("renders localized labels when overridden, falling back to defaults", () => {
    render(
      <VoiceTurn
        questionText="Q1"
        mode="voice"
        onModeChange={vi.fn()}
        textValue=""
        onTextChange={vi.fn()}
        // Override a subset; unset labels keep their English default.
        labels={{ voice: "Voix", record: "Enregistrer" }}
      />
    )
    expect(screen.getByRole("button", { name: "Voix" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Enregistrer" })
    ).toBeInTheDocument()
    // Untranslated label still shows the default.
    expect(screen.getByRole("button", { name: "Text" })).toBeInTheDocument()
  })

  it("renders flanking controls + caption body and hides the toggle when asked", () => {
    render(
      <VoiceTurn
        showModeToggle={false}
        captionBody="Use the microphone or type your message below."
        leftControl={<button>mute-ctl</button>}
        rightControl={<button>pause-ctl</button>}
        labels={{ captionIdle: "Ready to Listen or Type" }}
      />
    )
    expect(screen.getByText("Ready to Listen or Type")).toBeInTheDocument()
    expect(
      screen.getByText("Use the microphone or type your message below.")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "mute-ctl" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "pause-ctl" })
    ).toBeInTheDocument()
    // The voice/text toggle is suppressed.
    expect(
      screen.queryByRole("button", { name: "Text" })
    ).not.toBeInTheDocument()
  })
})
