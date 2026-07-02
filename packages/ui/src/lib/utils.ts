import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The theme defines custom font-size tokens (text-display-*, text-ui-*, text-eyebrow,
// text-prose). tailwind-merge doesn't know they are font sizes, so by default it
// classifies them as text COLORS and strips them whenever a real text-<color> class is
// also present (e.g. `cn("text-gray-12 text-display-md")` would drop the size).
// Registering them in the font-size group keeps both size and colour on the element.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-lg",
            "display-md",
            "display-sm",
            "ui-lg",
            "ui-base",
            "ui-sm",
            "ui-xs",
            "eyebrow",
            "prose",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCount(num: number, max = 9): string {
  return num > max ? `${max}+` : num.toString()
}
