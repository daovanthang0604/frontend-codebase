"use client"

import "@workspace/liquid-ui/lib/glass"

import type { ComponentProps, ReactNode } from "react"
import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { ChevronDown } from "lucide-react"

// A horizontal navigation menu with dropdown content panels, built on Base UI's
// navigation-menu parts (Root/List/Item/Trigger/Content/Portal/Positioner/Popup/
// Viewport/Link). Idiomatic shape:
//   <NavigationMenu>
//     <NavigationMenuItem>
//       <NavigationMenuTrigger>Products</NavigationMenuTrigger>
//       <NavigationMenuContent>
//         <NavigationMenuLink href="…" title="…" description="…" />
//       </NavigationMenuContent>
//     </NavigationMenuItem>
//     …more items…
//     <NavigationMenuViewport />
//   </NavigationMenu>
//
// The active item's <NavigationMenuContent> is moved into the single shared
// <NavigationMenuViewport>, which cross-fades and animates its size between
// panels via Base UI's --popup-width/--popup-height CSS vars. The Viewport is
// Portal-first, so it renders to <body> regardless of where you drop it among
// the items — no need to hoist it out of the list.

// NavigationMenu — Root (renders <nav>) wrapping a horizontal List (<ul>). Root
// props (value/defaultValue/onValueChange, delay/closeDelay, orientation…) pass
// straight through.
function NavigationMenu({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.Root>) {
  return (
    <BaseNavigationMenu.Root className={cn("relative", className)} {...props}>
      <BaseNavigationMenu.List className="flex items-center gap-1">
        {children}
      </BaseNavigationMenu.List>
    </BaseNavigationMenu.Root>
  )
}

function NavigationMenuItem({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.Item>) {
  return (
    <BaseNavigationMenu.Item className={className} {...props}>
      {children}
    </BaseNavigationMenu.Item>
  )
}

// A nav pill with a chevron that flips when its panel is open. Base UI marks the
// active trigger with data-popup-open; `group` lets the chevron read it.
function NavigationMenuTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.Trigger>) {
  return (
    <BaseNavigationMenu.Trigger
      className={cn(
        "group text-gray-11 hover:bg-gray-3 hover:text-gray-12 data-[popup-open]:bg-gray-3 data-[popup-open]:text-gray-12 flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors outline-none select-none",
        "focus-visible:ring-accent-7 focus-visible:ring-2",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="text-gray-11 size-4 shrink-0 transition-transform duration-200 group-data-[popup-open]:rotate-180"
        aria-hidden
      />
    </BaseNavigationMenu.Trigger>
  )
}

// The per-item panel. Base UI moves it into the shared Viewport and drives the
// cross-fade/slide via data-starting-style / data-ending-style plus
// data-activation-direction (which side the newly-activated trigger sits on).
function NavigationMenuContent({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.Content>) {
  return (
    <BaseNavigationMenu.Content
      className={cn(
        "w-max max-w-[calc(100vw-2rem)] p-2",
        "transition-[opacity,translate] duration-200 ease-out",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        // Slide in from / out toward the side of the trigger being activated.
        "data-[starting-style]:data-[activation-direction=left]:-translate-x-2",
        "data-[starting-style]:data-[activation-direction=right]:translate-x-2",
        "data-[ending-style]:data-[activation-direction=left]:translate-x-2",
        "data-[ending-style]:data-[activation-direction=right]:-translate-x-2",
        className
      )}
      {...props}
    >
      {children}
    </BaseNavigationMenu.Content>
  )
}

interface NavigationMenuLinkProps
  extends Omit<ComponentProps<typeof BaseNavigationMenu.Link>, "title"> {
  /** Optional structured row: bold title over a muted description. */
  title?: ReactNode
  description?: ReactNode
}

// A row inside a content panel. Pass `title`/`description` for the structured
// two-line look, or plain children for anything else.
function NavigationMenuLink({
  title,
  description,
  children,
  className,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <BaseNavigationMenu.Link
      className={cn(
        "hover:bg-gray-3 focus-visible:bg-gray-3 block rounded-md p-2 text-sm no-underline transition-colors outline-none",
        className
      )}
      {...props}
    >
      {title != null ? (
        <>
          <div className="text-gray-12 font-medium">{title}</div>
          {description != null ? (
            <p className="text-gray-11 mt-0.5 text-xs leading-snug">
              {description}
            </p>
          ) : null}
        </>
      ) : (
        children
      )}
    </BaseNavigationMenu.Link>
  )
}

// The shared popup surface: Portal → Positioner → Popup → Viewport. The
// Positioner takes the fixed positioner size vars; the Popup sizes to the active
// content via --popup-width/--popup-height so it animates between panels; the
// Viewport clips the moving content. `className` styles the Popup surface.
function NavigationMenuViewport({
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.Popup> & { sideOffset?: number }) {
  return (
    <BaseNavigationMenu.Portal>
      <BaseNavigationMenu.Positioner
        sideOffset={sideOffset}
        className="z-50 box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-200 ease-out"
      >
        <BaseNavigationMenu.Popup
          className={cn(
            // Liquid glass surface: glass-overlay swaps in the frosted-glass
            // material (fill + blur + rim + sheen + shadow) in place of the
            // solid bg-panel/border/shadow-lg recipe; radius stays Tailwind's.
            "glass-overlay text-gray-12 relative h-[var(--popup-height)] w-[var(--popup-width)] rounded-lg outline-none",
            // Entrance recipe + size animation between panels. (Tailwind v4 emits
            // scale/translate as their own props, so name them here.)
            "origin-[var(--transform-origin)] transition-[opacity,scale,translate,width,height] duration-200 ease-out",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150",
            className
          )}
          {...props}
        >
          <BaseNavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
        </BaseNavigationMenu.Popup>
      </BaseNavigationMenu.Positioner>
    </BaseNavigationMenu.Portal>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuViewport,
}
export type { NavigationMenuLinkProps }
