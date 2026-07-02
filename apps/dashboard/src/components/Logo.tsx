import { APP_NAME } from "@/constants/common"
import { Link } from "@tanstack/react-router"
import { BarChart3 } from "lucide-react"

import { useBrandTheme } from "@/hooks/use-brand-theme"

type LogoProps = {
  withName?: boolean
  /**
   * When false, render the mark/name without the wrapping link. Use this when
   * Logo sits inside a parent `<Link>` — nested anchors are invalid HTML and
   * trigger a hydration error.
   */
  asLink?: boolean
}

export function Logo({ withName = true, asLink = true }: LogoProps) {
  // `useBrandTheme` returns null in this template (no backend brand source),
  // so the display name falls back to APP_NAME and the mark to the BarChart3
  // icon. Wire a brand source in the hook to override either.
  const brand = useBrandTheme()
  const displayName = brand?.companyName || APP_NAME

  const content = (
    <>
      {brand?.logoUrl ? (
        <img
          src={brand.logoUrl}
          alt={displayName}
          className="h-9 w-9 rounded-lg object-contain"
        />
      ) : (
        <div className="bg-accent-12 dark:bg-accent-3 flex h-9 w-9 items-center justify-center rounded-lg text-white">
          <BarChart3 className="h-4 w-4" />
        </div>
      )}
      {withName && <span className="text-sm font-semibold">{displayName}</span>}
    </>
  )

  if (!asLink) {
    return <span className="flex items-center gap-2">{content}</span>
  }

  return (
    <Link to="/" className="flex items-center gap-2">
      {content}
    </Link>
  )
}
