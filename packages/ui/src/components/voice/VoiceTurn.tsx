"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Mic, Play, Square, Type } from "lucide-react"

export type VoiceTurnMode = "voice" | "text"

export type VoiceTurnStatus =
  | "idle"
  | "playing"
  | "recording"
  | "transcribing"
  | "error"

/**
 * The user-facing strings. English by default so the primitive works
 * standalone; a localized consumer passes translated copy (any subset — unset
 * labels fall back to the English defaults).
 */
export interface VoiceTurnLabels {
  /** aria-label + visible text for the question-audio play control. */
  playQuestion: string
  /** aria-label for the record button when idle. */
  record: string
  /** aria-label for the record button while recording. */
  stop: string
  /** Voice-mode toggle label. */
  voice: string
  /** Text-mode toggle label. */
  text: string
  /** aria-label for the voice↔text toggle group. */
  answerMode: string
  /** aria-label for the text fallback. */
  answer: string
  captionIdle: string
  captionRecording: string
  captionTranscribing: string
  captionPlaying: string
}

const DEFAULT_LABELS: VoiceTurnLabels = {
  playQuestion: "Play question",
  record: "Record answer",
  stop: "Stop recording",
  voice: "Voice",
  text: "Text",
  answerMode: "Answer mode",
  answer: "Your answer",
  captionIdle: "Tap to answer by voice",
  captionRecording: "Listening… tap to stop",
  captionTranscribing: "Transcribing…",
  captionPlaying: "Playing question…",
}

export interface VoiceTurnProps {
  /** The current interview question, shown above the controls when set. */
  questionText?: string
  /** Whether a synthesized (TTS) audio clip exists for this question. */
  hasQuestionAudio?: boolean
  /** Controlled capture mode (defaults to "voice"). */
  mode?: VoiceTurnMode
  onModeChange?: (mode: VoiceTurnMode) => void
  /**
   * Show the voice↔text toggle. Off when the consumer offers the text path
   * elsewhere (e.g. a persistent chat input) and only wants the mic hero.
   */
  showModeToggle?: boolean
  /** Turn status, driven by the parent / capture hook. */
  status?: VoiceTurnStatus
  /** Live partial transcript shown while recording / transcribing. */
  partialTranscript?: string
  /** Controlled value of the text fallback. */
  textValue?: string
  onTextChange?: (value: string) => void
  /** Placeholder for the text fallback. */
  placeholder?: string
  /** Override the English label defaults (any subset). */
  labels?: Partial<VoiceTurnLabels>
  /** Secondary caption line, shown under the caption while idle. */
  captionBody?: ReactNode
  /** Controls flanking the mic hero (voice mode) — e.g. mute / pause. */
  leftControl?: ReactNode
  rightControl?: ReactNode
  /** Fired when the play control for the TTS question audio is pressed. */
  onPlayQuestion?: () => void
  /**
   * Fired when recording starts (idle) / stops (recording). The consumer (the
   * `useVoiceCapture` hook) owns the actual mic-permission request and capture;
   * this primitive only signals intent.
   */
  onRecordStart?: () => void
  onRecordStop?: () => void
  /** Mic input level, 0..1, driving the reactive glow while recording. */
  level?: number
  /** Message shown when status is "error". */
  errorMessage?: string
  disabled?: boolean
  className?: string
}

const toggleBase =
  "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"

function captionFor(
  status: VoiceTurnStatus,
  recording: boolean,
  labels: VoiceTurnLabels
): string {
  if (recording) return labels.captionRecording
  if (status === "transcribing") return labels.captionTranscribing
  if (status === "playing") return labels.captionPlaying
  return labels.captionIdle
}

/**
 * Presentational voice-turn control: a circular mic button with a concentric
 * "sonar" pulse halo, optional controls flanking it (mute / pause), a play
 * control for the question audio, a voice↔text toggle, a live partial-transcript
 * area, and a ≥16px text fallback. Props in, events out — it does no data
 * fetching and never touches the mic itself; the parent (capture hook) drives
 * `status`, requests mic permission on `onRecordStart`, and handles the
 * record → upload → transcribe round-trip.
 */
function VoiceTurn({
  questionText,
  hasQuestionAudio,
  mode = "voice",
  onModeChange,
  showModeToggle = true,
  status = "idle",
  partialTranscript,
  textValue = "",
  onTextChange,
  placeholder,
  labels,
  captionBody,
  leftControl,
  rightControl,
  onPlayQuestion,
  onRecordStart,
  onRecordStop,
  level = 0,
  errorMessage,
  disabled,
  className,
}: VoiceTurnProps) {
  const recording = status === "recording"
  const l = { ...DEFAULT_LABELS, ...labels }

  return (
    <div
      className={cn("flex flex-col items-center gap-4 text-center", className)}
    >
      {questionText ? (
        <p className="text-gray-12 max-w-sm text-sm font-medium">
          {questionText}
        </p>
      ) : null}

      {hasQuestionAudio ? (
        <button
          type="button"
          aria-label={l.playQuestion}
          onClick={onPlayQuestion}
          disabled={disabled}
          className="text-accent-11 inline-flex items-center gap-1.5 text-sm font-medium disabled:opacity-50"
        >
          <Play aria-hidden="true" className="size-4" />
          {l.playQuestion}
        </button>
      ) : null}

      {mode === "voice" ? (
        <div className="flex flex-col items-center">
          {/* Mic hero, optionally flanked by consumer controls (mute / pause). */}
          <div className="flex items-center justify-center gap-8">
            {leftControl}

            {/* All layers share one grid cell so they stack centered; this lets
                `animate-ping`'s transform run without fighting a centering
                translate. */}
            <div className="grid size-28 place-items-center">
              {/* Resting halo — soft concentric rings, always present in voice
                  mode (matches the at-rest look). */}
              <span
                aria-hidden="true"
                className="bg-accent-3 size-28 rounded-full opacity-60 [grid-area:1/1]"
              />
              <span
                aria-hidden="true"
                className="bg-accent-4 size-20 rounded-full opacity-70 [grid-area:1/1]"
              />

              {recording ? (
                <>
                  {/* Level-reactive glow (static scale per frame — not animated). */}
                  <span
                    aria-hidden="true"
                    className="bg-accent-7/40 size-16 rounded-full blur-md [grid-area:1/1] motion-reduce:hidden"
                    style={{
                      transform: `scale(${1.5 + Math.min(level, 1) * 0.6})`,
                    }}
                  />
                  {/* Sonar pulse — two staggered ease-out rings (Tailwind ping).
                      Hidden under prefers-reduced-motion. */}
                  <span
                    aria-hidden="true"
                    className="bg-accent-7/50 size-16 animate-ping rounded-full [grid-area:1/1] motion-reduce:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="bg-accent-6/40 size-16 animate-ping rounded-full [grid-area:1/1] motion-reduce:hidden"
                    style={{ animationDelay: "0.6s" }}
                  />
                </>
              ) : null}

              <button
                type="button"
                aria-label={recording ? l.stop : l.record}
                aria-pressed={recording}
                onClick={() =>
                  recording ? onRecordStop?.() : onRecordStart?.()
                }
                disabled={disabled}
                className={cn(
                  "bg-accent-9 text-accent-contrast focus-visible:ring-ring shadow-accent-9/30 z-10 flex size-16 items-center justify-center rounded-full shadow-lg transition-transform [grid-area:1/1] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {recording ? (
                  <Square aria-hidden="true" className="size-6" />
                ) : (
                  <Mic aria-hidden="true" className="size-6" />
                )}
              </button>
            </div>

            {rightControl}
          </div>

          <div className="mt-6">
            <p className="text-accent-11 font-semibold">
              {captionFor(status, recording, l)}
            </p>

            {recording && partialTranscript ? (
              <p
                aria-live="polite"
                className="text-gray-11 bg-gray-2 mx-auto mt-2 max-w-md rounded-md px-3 py-2 text-sm italic"
              >
                {partialTranscript}
              </p>
            ) : status === "idle" && captionBody ? (
              <p className="text-gray-11 mt-1 text-sm">{captionBody}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <textarea
          aria-label={l.answer}
          placeholder={placeholder}
          value={textValue}
          onChange={(event) => onTextChange?.(event.target.value)}
          disabled={disabled}
          rows={4}
          // iOS Safari auto-zooms a focused input whose font-size is < 16px;
          // pin it explicitly so the public/mobile capture surface never zooms.
          style={{ fontSize: "16px" }}
          className="border-gray-7 text-gray-12 placeholder:text-gray-9 focus-visible:ring-ring w-full max-w-sm rounded-md border bg-transparent px-3 py-2 text-base focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
        />
      )}

      {showModeToggle ? (
        <div
          role="group"
          aria-label={l.answerMode}
          className="border-gray-7 inline-flex overflow-hidden rounded-md border"
        >
          <button
            type="button"
            aria-pressed={mode === "voice"}
            onClick={() => onModeChange?.("voice")}
            disabled={disabled}
            className={cn(
              toggleBase,
              mode === "voice" ? "bg-accent-3 text-accent-11" : "text-gray-11"
            )}
          >
            <Mic aria-hidden="true" className="size-4" />
            {l.voice}
          </button>
          <button
            type="button"
            aria-pressed={mode === "text"}
            onClick={() => onModeChange?.("text")}
            disabled={disabled}
            className={cn(
              toggleBase,
              "border-gray-7 border-l",
              mode === "text" ? "bg-accent-3 text-accent-11" : "text-gray-11"
            )}
          >
            <Type aria-hidden="true" className="size-4" />
            {l.text}
          </button>
        </div>
      ) : null}

      {status === "error" && errorMessage ? (
        <p role="alert" className="text-error-11 text-sm">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}

export { VoiceTurn }
