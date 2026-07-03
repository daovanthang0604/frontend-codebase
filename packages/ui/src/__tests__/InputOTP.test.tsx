import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/InputOTP"

describe("InputOTP", () => {
  // input-otp starts an internal polling timer on mount (password-manager
  // detection). Under load that real-timer callback can fire after this file's
  // jsdom is torn down, surfacing as an intermittent "Unhandled Error" that
  // fails the whole ui suite even though every test passes. Fake timers keep it
  // from ever firing; we unmount + clear them before restoring real timers.
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it("renders OTP input", () => {
    render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
      </InputOTP>
    )
    const input = document.querySelector('[data-slot="input-otp"]')
    expect(input).toBeInTheDocument()
  })

  it("renders slot group with correct data-slot", () => {
    render(
      <InputOTP maxLength={4}>
        <InputOTPGroup data-testid="group">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    )
    expect(screen.getByTestId("group")).toHaveAttribute(
      "data-slot",
      "input-otp-group"
    )
  })

  it("renders separator", () => {
    render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
        <InputOTPSeparator data-testid="sep" />
        <InputOTPGroup>
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    )
    expect(screen.getByTestId("sep")).toHaveAttribute("role", "separator")
  })
})
