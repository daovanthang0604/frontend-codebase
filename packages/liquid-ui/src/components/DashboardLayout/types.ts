import type { CSSProperties, ReactNode } from "react"

export interface DashboardLayoutProps {
  /** Current pathname (used for active link detection inside sidebar components) */
  pathname: string
  defaultOpenLevel?: number
  prefetch?: boolean

  /**
   * Desktop sidebar reserved width (the column width).
   *
   * Prefer using `sidebarClassName` for width (Tailwind classes) so the layout
   * can stay purely class-driven
   */
  sidebarWidth?: number | string
  sidebarClassName?: string

  /**
   * Desktop sidebar panel width (the actual sidebar content width).
   */
  sidebarContentWidth?: number

  /** Optional style override for the sidebar placeholder/outer container. */
  sidebarStyle?: CSSProperties

  /** Sidebar slots */
  sidebarHeader?: ReactNode
  sidebarTop?: ReactNode
  sidebarNav: ReactNode
  sidebarFooter?: ReactNode

  /** Main content */
  children: ReactNode
  contentClassName?: string
  contentInnerClassName?: string

  /** Mobile header (defaults to a simple header with hamburger + title) */
  mobileHeader?: ReactNode
  mobileTitle?: ReactNode

  onSearch?: () => void

  /** Floating panel (shown when collapsed and not hovered). If omitted, a default is rendered. */
  floatingPanel?: ReactNode
}
