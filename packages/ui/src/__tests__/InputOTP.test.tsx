import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/InputOTP"

describe("InputOTP", () => {
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
