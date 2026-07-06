// base-ui shares the tailwind-merge-aware `cn` with @workspace/ui — it encodes the
// theme's custom font-size tokens (text-display-*, text-ui-*, …). Re-export so
// there is one source of truth for class merging across both kits.
export { cn, formatCount } from "@workspace/ui/lib/utils"
