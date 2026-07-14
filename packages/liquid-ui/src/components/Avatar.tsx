"use client"

import "@workspace/liquid-ui/lib/glass"

import type { ComponentProps } from "react"
import { Avatar as BaseAvatar } from "@base-ui/react/avatar"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/liquid-ui/Avatar, rebuilt on Base UI (Root/Image/Fallback). ui
// used Radix; Base UI's avatar has the same image-load/fallback behavior.
// Badge/Group/GroupCount carry no primitive behavior — copied verbatim. Fallback
// + badge use accent-solid (navy) to match the other controls, not ui's accent-9.
// Light glass touch only (avatars are small, no GlassPanel/backdrop-blur here;
// the image itself is never touched) — see the Root ring and Fallback
// background below.

function Avatar({
  className,
  size = "default",
  ...props
}: ComponentProps<typeof BaseAvatar.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <BaseAvatar.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        // Hairline glass rim around the whole avatar (image or fallback). Not
        // clipped by the overflow-hidden above — an element's own box-shadow/
        // ring is never subject to that SAME element's overflow, only its
        // children's are, so this stays visible flush against the circle.
        "ring-1 ring-[var(--glass-rim)]",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof BaseAvatar.Image>) {
  return (
    <BaseAvatar.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof BaseAvatar.Fallback>) {
  return (
    <BaseAvatar.Fallback
      data-slot="avatar-fallback"
      className={cn(
        // Frosted fill: the shared --glass-fill-top/bot sheen layered OVER the
        // existing accent-solid color, as ONE arbitrary `background` property
        // rather than `bg-accent-solid` + a separate `bg-gradient-to-*` class.
        // tailwind-merge collapses that pair into one class and drops the
        // color (see DashboardLayout.tsx's documented bg-gray-2/bg-gradient-to-b
        // gotcha), which would leave the fallback transparent.
        "[background:linear-gradient(180deg,var(--glass-fill-top),var(--glass-fill-bot)),var(--color-accent-solid)]",
        "text-gray-1 flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "bg-accent-solid text-accent-contrast ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "*:data-[slot=avatar]:ring-gray-6 group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "bg-gray-11 text-gray-1 ring-gray-6 relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
}
