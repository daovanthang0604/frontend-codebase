// Reuse base-ui's `cn` (clsx + tailwind-merge with the theme's custom font-size
// tokens registered) so liquid-ui merges classes identically to the rest of the
// kit — one tailwind-merge config across all packages.
export { cn } from "@workspace/base-ui/lib/utils"
