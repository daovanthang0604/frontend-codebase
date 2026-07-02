export interface PasswordRule {
  key: string
  label: string
  isValid: boolean
}

export function buildPasswordRules(password: string): PasswordRule[] {
  return [
    {
      key: "length",
      label: "At least 8 characters length",
      isValid: password.length >= 8,
    },
    {
      key: "uppercase",
      label: "At least 1 uppercase letter",
      isValid: /[A-Z]/.test(password),
    },
    {
      key: "lowercase",
      label: "At least 1 lowercase letter",
      isValid: /[a-z]/.test(password),
    },
    {
      key: "number",
      label: "At least 1 number",
      isValid: /\d/.test(password),
    },
    {
      key: "special",
      label: "At least 1 special character",
      isValid: /[^A-Za-z0-9]/.test(password),
    },
    {
      key: "whitespace",
      label: "Whitespace not allowed",
      isValid: !/\s/.test(password),
    },
  ]
}

export function isPasswordValid(password: string): boolean {
  return buildPasswordRules(password).every((rule) => rule.isValid)
}
