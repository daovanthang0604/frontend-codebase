export function toNormalText(str: string) {
  return (
    str
      // convert camelCase → camel Case
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // replace snake_case and kebab-case
      .replace(/[-_]/g, " ")
      // collapse repeated spaces
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
  )
}

export function removeEmoji(input: string): string {
  return (
    input
      // Remove emoji characters
      .replace(/\p{Extended_Pictographic}/gu, "")
      // Remove variation selectors (emoji modifiers)
      .replace(/\uFE0F/g, "")
      // Remove zero-width joiner (used in combined emojis)
      .replace(/\u200D/g, "")
  )
}
