"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  type CollapsibleContentProps,
  type CollapsibleTriggerProps,
} from "@workspace/liquid-ui/components/Collapsible"
import { ScrollArea } from "@workspace/liquid-ui/components/ScrollArea"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { ChevronDown, ExternalLink } from "lucide-react"

import { Button } from "../Button"

interface SidebarContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setForceHover: (forceHover: boolean) => void
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  closeOnRedirect: RefObject<boolean>
  defaultOpenLevel: number
  prefetch?: boolean
  mode: "drawer" | "full"
  pathname: string
  /** Boundary elements used by helpers like `useAutoScroll` (avoid hard-coded DOM ids). */
  desktopBoundaryRef: RefObject<HTMLElement | null>
  mobileBoundaryRef: RefObject<HTMLElement | null>
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

const FolderContext = createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  depth: number
  collapsible: boolean
} | null>(null)

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return ctx
}

export function useFolder() {
  return useContext(FolderContext)
}

export function useFolderDepth() {
  return useContext(FolderContext)?.depth ?? 0
}

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQuery = window.matchMedia?.(query)
      mediaQuery?.addEventListener("change", onStoreChange)
      return () => mediaQuery?.removeEventListener("change", onStoreChange)
    },
    [query]
  )
  // Compiler-safe external-store read (no setState-in-effect); optional chaining
  // keeps getSnapshot safe under jsdom, which does not implement matchMedia.
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(query)?.matches ?? false,
    () => false
  )
}

function useOnChange<T>(value: T, callback: (value: T) => void) {
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current !== value) {
      callback(value)
      prevRef.current = value
    }
  }, [value, callback])
}

/**
 * Scroll to the element if `active` is true
 */
export function useAutoScroll(
  active: boolean,
  ref: RefObject<HTMLElement | null>
) {
  const { mode, desktopBoundaryRef, mobileBoundaryRef } = useSidebar()

  useEffect(() => {
    if (active && ref.current) {
      const boundary =
        mode === "drawer"
          ? mobileBoundaryRef.current
          : desktopBoundaryRef.current

      if (boundary) {
        const element = ref.current
        const elementRect = element.getBoundingClientRect()
        const boundaryRect = boundary.getBoundingClientRect()

        const isAbove = elementRect.top < boundaryRect.top
        const isBelow = elementRect.bottom > boundaryRect.bottom

        if (isAbove || isBelow) {
          element.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          })
        }
      }
    }
  }, [active, mode, ref])
}

export interface SidebarProviderProps {
  /**
   * Open folders by default if their level is lower or equal to a specific level
   * (Starting from 1)
   * @defaultValue 0
   */
  defaultOpenLevel?: number
  /**
   * Prefetch links
   */
  prefetch?: boolean
  /**
   * Current pathname for active state detection
   */
  pathname?: string
  children?: ReactNode
}

export function SidebarProvider({
  defaultOpenLevel = 0,
  prefetch,
  pathname = "",
  children,
}: SidebarProviderProps) {
  const closeOnRedirect = useRef(true)
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem("sidebar-collapsed")
    return stored ? JSON.parse(stored) : false
  })
  const mode = useMediaQuery("(max-width: 767px)") ? "drawer" : "full"
  const desktopBoundaryRef = useRef<HTMLElement | null>(null)
  const mobileBoundaryRef = useRef<HTMLElement | null>(null)

  const setForceHover = (forceHover: boolean) => {
    const sidebar = document.querySelector(
      '[data-slot="sidebar"]'
    ) as HTMLElement | null

    if (sidebar) {
      setTimeout(() => {
        sidebar.dataset.forceHover = forceHover.toString()
      }, 0)
    }
  }

  // Store the collapsed state in localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
  }, [collapsed])

  useOnChange(pathname, () => {
    if (closeOnRedirect.current) {
      setOpen(false)
    }
    closeOnRedirect.current = true
  })

  return (
    <SidebarContext.Provider
      value={useMemo(
        () => ({
          open,
          setOpen,
          collapsed,
          setCollapsed,
          setForceHover,
          closeOnRedirect,
          defaultOpenLevel,
          prefetch,
          mode,
          pathname,
          desktopBoundaryRef,
          mobileBoundaryRef,
        }),
        [
          open,
          collapsed,
          defaultOpenLevel,
          prefetch,
          mode,
          pathname,
          desktopBoundaryRef,
          mobileBoundaryRef,
        ]
      )}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function SidebarContent({
  children,
}: {
  children: (state: {
    ref: RefObject<HTMLElement | null>
    collapsed: boolean
    hovered: boolean
    onPointerEnter: (event: PointerEvent) => void
    onPointerLeave: (event: PointerEvent) => void
  }) => ReactNode
}) {
  const { collapsed, mode, desktopBoundaryRef } = useSidebar()
  const [hover, setHover] = useState(false)
  const timerRef = useRef(0)

  useOnChange(collapsed, () => {
    if (collapsed) setHover(false)
  })

  if (mode !== "full") return null

  function shouldIgnoreHover(e: PointerEvent): boolean {
    const element = desktopBoundaryRef.current
    if (!element) return true
    return (
      !collapsed ||
      e.pointerType === "touch" ||
      element.getAnimations().length > 0
    )
  }

  // Render-prop ref forward: the ref object (not its .current) is handed to the
  // consumer to attach; .current is only read inside the pointer handlers below,
  // never during render.
  return children({
    ref: desktopBoundaryRef,
    collapsed,
    hovered: hover,
    onPointerEnter(e) {
      if (shouldIgnoreHover(e)) return
      window.clearTimeout(timerRef.current)
      setHover(true)
    },
    onPointerLeave(e) {
      if (shouldIgnoreHover(e)) return
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(
        () => setHover(false),
        Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100
          ? 0
          : 500
      )
    },
  })
}

export function SidebarDrawerOverlay(props: ComponentProps<"div">) {
  const { open, setOpen, mode } = useSidebar()
  const [hidden, setHidden] = useState(!open)

  useEffect(() => {
    if (open) {
      // Delayed-unmount transition: reveal now, hide after the fade-out. The
      // synchronous set is intentional for this show/animate-out pattern.
      setHidden(false)
    } else {
      const timer = window.setTimeout(() => setHidden(true), 220)
      return () => window.clearTimeout(timer)
    }
  }, [open])

  if (mode !== "drawer") return null

  return (
    <div
      data-state={open ? "open" : "closed"}
      onPointerDown={() => {
        setOpen(false)
      }}
      {...props}
      className={cn(
        "fixed inset-0 z-40 bg-black/80 backdrop-blur-xs",
        // Paired with the drawer panel: same duration + ease-out.
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
        open ? "opacity-100" : "opacity-0",
        hidden && "pointer-events-none invisible",
        props.className
      )}
    />
  )
}

export function SidebarDrawerContent({
  className,
  children,
  ...props
}: ComponentProps<"aside">) {
  const { open, mode, mobileBoundaryRef } = useSidebar()
  const [hidden, setHidden] = useState(!open)

  useEffect(() => {
    if (open) {
      // Delayed-unmount transition: reveal now, hide after the fade-out. The
      // synchronous set is intentional for this show/animate-out pattern.
      setHidden(false)
    } else {
      // Fallback timeout in case onTransitionEnd doesn't fire
      const timer = window.setTimeout(() => setHidden(true), 220)
      return () => window.clearTimeout(timer)
    }
  }, [open])

  if (mode !== "drawer") return null

  return (
    <aside
      ref={mobileBoundaryRef}
      data-state={open ? "open" : "closed"}
      className={cn(
        "bg-gray-2 border-gray-6 fixed inset-y-0 end-0 z-50 flex w-[85%] max-w-[380px] flex-col border-s shadow-lg",
        "transition-transform duration-200 ease-out motion-reduce:transition-none",
        open ? "translate-x-0" : "translate-x-full",
        hidden && "pointer-events-none invisible",
        className
      )}
      onTransitionEnd={(e) => {
        // Avoid handling bubbled transition events from children.
        if (e.currentTarget !== e.target) return
        if (!open) setHidden(true)
      }}
      {...props}
    >
      {children}
    </aside>
  )
}

export interface SidebarViewportProps {
  className?: string
  children?: ReactNode
}

export function SidebarViewport({ className, children }: SidebarViewportProps) {
  const { collapsed, mode } = useSidebar()
  const isRail = collapsed && mode === "full"
  return (
    <ScrollArea className={cn("min-h-0 flex-1", className)}>
      <div
        className={cn("space-y-1 overscroll-contain", isRail ? "p-2" : "p-4")}
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, white 12px, white calc(100% - 12px), transparent)",
        }}
      >
        {children}
      </div>
    </ScrollArea>
  )
}

export function SidebarSeparator(props: ComponentProps<"p">) {
  const depth = useFolderDepth()
  const { collapsed, mode } = useSidebar()

  // Section labels don't fit the icon rail — hide them when collapsed.
  if (collapsed && mode === "full") return null

  return (
    <p
      {...props}
      className={cn(
        "text-gray-12 mt-6 mb-1.5 inline-flex items-center gap-2 px-2 text-sm font-medium empty:mb-0",
        depth === 0 && "first:mt-0",
        props.className
      )}
    >
      {props.children}
    </p>
  )
}

export interface SidebarItemProps {
  href?: string
  icon?: ReactNode
  external?: boolean
  active?: boolean
  children?: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  asChild?: boolean
}

export function SidebarItem({
  asChild,
  href = "#",
  icon,
  external,
  active: activeProp,
  className,
  children,
}: SidebarItemProps) {
  const { prefetch, pathname } = useSidebar()
  const depth = useFolderDepth()
  const isNested = depth > 0
  const computedActive =
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"))

  const active = activeProp ?? computedActive

  const baseClasses = cn(
    "flex w-full items-center gap-2 rounded-md text-sm transition-[color,background-color,transform] motion-safe:active:transform-[translateY(1px)]",
    "focus-visible:ring-accent-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset",
    isNested ? "relative min-h-9 py-2 ps-5 pe-2" : "min-h-9 px-2 py-2",
    active
      ? [
          "bg-accent-a3 text-accent-12 ring-accent-a5 font-medium ring-1 ring-inset",
          isNested && [
            "relative",
            "before:absolute before:content-['']",
            "before:left-2.5",
            "before:top-1/2 before:-translate-y-1/2",
            "before:h-5 before:w-[2px]",
            "before:rounded-full",
            "before:bg-accent-9",
          ],
        ]
      : "text-gray-11 hover:bg-gray-a3 hover:text-gray-12",
    className
  )

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<any>

    return React.cloneElement(child, {
      className: cn(baseClasses, child.props.className),
      "data-active": active,
      "data-prefetch": prefetch,
      ...(external ? { target: "_blank", rel: "noopener noreferrer" } : null),
      style: { ...child.props.style, textDecoration: "none" },
      children: (
        <>
          {icon && <span className="shrink-0 [&>svg]:size-4">{icon}</span>}
          {child.props.children}
          {external && <ExternalLink className="ms-auto size-3.5 opacity-50" />}
        </>
      ),
    })
  }

  // Base UI has no Link primitive; a plain <a> keeps the sidebar react-aria-free.
  // Client-side routing flows through the app's own link via `asChild` / the
  // SidebarNavTree/PageTree `renderLink` prop (the branch above).
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-active={active}
      data-prefetch={prefetch}
      className={baseClasses}
    >
      {icon && <span className="shrink-0 [&>svg]:size-4">{icon}</span>}
      {children}
      {external && <ExternalLink className="ms-auto size-3.5 opacity-50" />}
    </a>
  )
}
export interface SidebarFolderProps extends ComponentProps<"div"> {
  active?: boolean
  defaultOpen?: boolean
  collapsible?: boolean
}

export function SidebarFolder({
  defaultOpen: defaultOpenProp,
  collapsible = true,
  active = false,
  children,
  className,
  ...props
}: SidebarFolderProps) {
  const { defaultOpenLevel } = useSidebar()
  const depth = useFolderDepth() + 1
  const defaultOpen =
    collapsible === false ||
    active ||
    (defaultOpenProp ?? defaultOpenLevel >= depth)
  const [open, setOpen] = useState(defaultOpen)

  useOnChange(defaultOpen, (v) => {
    if (v) setOpen(v)
  })

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      disabled={!collapsible}
      className={className}
      {...props}
    >
      <FolderContext.Provider
        value={useMemo(
          () => ({ open, setOpen, depth, collapsible }),
          [collapsible, depth, open]
        )}
      >
        {children}
      </FolderContext.Provider>
    </Collapsible>
  )
}

export function SidebarFolderTrigger({
  children,
  className,
  ...props
}: CollapsibleTriggerProps) {
  const folder = useFolder()
  if (!folder) return null

  const { open, collapsible } = folder

  if (collapsible) {
    return (
      <CollapsibleTrigger
        className={cn(
          "flex min-h-9 w-full items-center gap-2 rounded-md px-2 py-2",
          "text-gray-11 text-sm transition-[color,background-color,transform] motion-safe:active:transform-[translateY(1px)]",
          "hover:bg-gray-a3 hover:text-gray-12",
          "focus-visible:ring-accent-8 focus:outline-none focus-visible:ring-2",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          data-icon
          className={cn(
            "ms-auto size-4 transition-transform",
            !open && "-rotate-90"
          )}
        />
      </CollapsibleTrigger>
    )
  }

  return (
    <div
      className={cn(
        "text-gray-11 flex min-h-9 w-full items-center gap-2 px-2 py-2 text-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

export interface SidebarFolderLinkProps extends ComponentProps<"a"> {
  href: string
  external?: boolean
  active?: boolean
}

export function SidebarFolderLink({
  children,
  href,
  external,
  active: activeProp,
  className,
  ...props
}: SidebarFolderLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const folder = useFolder()
  const { prefetch, pathname } = useSidebar()

  const computedActive =
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"))
  const active = activeProp ?? computedActive

  // Called before the early return so the hook order is stable
  // (rules-of-hooks); with no folder the <a>/ref never mounts, so it's a no-op.
  useAutoScroll(active, ref)

  if (!folder) return null

  const { open, setOpen, collapsible } = folder

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!collapsible) return

    const target = e.target as HTMLElement

    const clickedToggle = target.closest("[data-folder-toggle]")

    if (clickedToggle) {
      e.preventDefault()
      setOpen((v) => !v)
      return
    }
    setOpen(active ? !open : true)
  }

  return (
    <a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-active={active}
      data-prefetch={prefetch}
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      className={cn(
        "flex min-h-9 w-full items-center gap-2 rounded-md px-2 py-2",
        "text-sm transition-[color,background-color,transform] motion-safe:active:transform-[translateY(1px)]",
        "hover:bg-gray-a3 hover:text-gray-12",
        "focus-visible:ring-accent-8 focus:outline-none focus-visible:ring-2",
        active
          ? "bg-accent-a3 text-accent-12 ring-accent-a5 font-medium ring-1 ring-inset"
          : "text-gray-11",
        className
      )}
      {...props}
    >
      {children}

      {collapsible && (
        <span
          data-folder-toggle
          role="presentation"
          className="ms-auto inline-flex"
        >
          <ChevronDown
            className={cn("size-4 transition-transform", !open && "-rotate-90")}
          />
        </span>
      )}
    </a>
  )
}

export function SidebarFolderContent({
  className,
  children,
  ...props
}: CollapsibleContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "relative",
        "before:bg-gray-6 before:absolute before:inset-y-1 before:left-2.5 before:w-px",
        className
      )}
      {...props}
    >
      {children}
    </CollapsibleContent>
  )
}

export function SidebarTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setOpen } = useSidebar()
  const { onPress, ...restProps } = props

  return (
    <Button
      mode="icon"
      size="md"
      intent="secondary"
      variant="ghost"
      aria-label="Open Sidebar"
      tooltip="Open Sidebar"
      className={cn("text-gray-11 hover:text-gray-12", className)}
      onPress={(e) => {
        setOpen((prev) => !prev)
        onPress?.(e)
      }}
      {...restProps}
    >
      {children}
    </Button>
  )
}

export function SidebarCollapseTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { collapsed, setCollapsed } = useSidebar()
  const { onPress, ...restProps } = props

  return (
    <Button
      size="md"
      mode="icon"
      variant="ghost"
      intent="secondary"
      data-slot="collapse-trigger"
      aria-label="Collapse Sidebar"
      tooltip={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      tooltipDelay={1000}
      data-collapsed={collapsed}
      onPress={(e) => {
        setCollapsed((prev) => !prev)
        onPress?.(e)
      }}
      className={className}
      {...restProps}
    ></Button>
  )
}
