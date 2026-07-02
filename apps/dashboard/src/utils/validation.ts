// Lightweight, presentation-layer validators shared across feature forms.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_ALLOWED_RE = /^[+\d\s().-]+$/

/** A pragmatic email-shape check for client-side form gating (trims first). */
export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

/**
 * Loose phone check for client-side gating: only allows phone-ish characters
 * and requires at least 7 digits. Not E.164 validation — the backend owns that.
 */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim()
  const digitCount = trimmed.replace(/\D/g, "").length
  return digitCount >= 7 && PHONE_ALLOWED_RE.test(trimmed)
}
