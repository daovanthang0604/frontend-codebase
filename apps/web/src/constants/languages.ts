export const LANGUAGE_STORAGE_KEY = "language"

export const LANGUAGES = [{ value: "en", label: "English" }] as const

export type Language = (typeof LANGUAGES)[number]["value"]

export const DEFAULT_LANGUAGE: Language = "en"
