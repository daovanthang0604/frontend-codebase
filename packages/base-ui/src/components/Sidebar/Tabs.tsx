"use client"

import { useMemo, useState, type ComponentProps, type ReactNode } from "react"
import {
  Popover,
  PopoverDialog,
  PopoverTrigger,
} from "@workspace/base-ui/components/Popover"
import { cn } from "@workspace/base-ui/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "../Button"
import { useSidebar } from "./Sidebar"

export interface SidebarTab {
  /**
   * Redirect URL of the folder, usually the index page
   */
  url: string
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /**
   * Detect from a list of urls
   */
  urls?: Set<string>
  unlisted?: boolean
}

export interface SidebarTabWithProps extends SidebarTab {
  props?: ComponentProps<"a">
}

function normalize(url: string): string {
  return url.replace(/\/$/, "")
}

function isActive(url: string, pathname: string, nested: boolean): boolean {
  const normalizedUrl = normalize(url)
  const normalizedPathname = normalize(pathname)

  if (nested) {
    return normalizedPathname.startsWith(normalizedUrl)
  }

  return normalizedPathname === normalizedUrl
}

export function isTabActive(tab: SidebarTab, pathname: string): boolean {
  if (tab.urls) return tab.urls.has(normalize(pathname))
  return isActive(tab.url, pathname, true)
}

export interface SidebarTabsDropdownProps {
  options: SidebarTabWithProps[]
  placeholder?: ReactNode
  pathname?: string
  className?: string
}

export function SidebarTabsDropdown({
  options,
  placeholder,
  pathname = "",
  className,
}: SidebarTabsDropdownProps) {
  const [open, setOpen] = useState(false)
  const { closeOnRedirect } = useSidebar()

  const selected = useMemo(() => {
    for (let i = options.length - 1; i >= 0; i--) {
      const item = options[i]
      if (item && isTabActive(item, pathname)) {
        return item
      }
    }
    return undefined
  }, [options, pathname])

  const handleClick = () => {
    // closeOnRedirect is a ref from useSidebar(); mutating .current inside an
    // event handler is valid (the compiler just can't prove it's a ref here).
    closeOnRedirect.current = false
    setOpen(false)
  }

  const selectedItem = selected ? (
    <>
      <div className="size-5 shrink-0 empty:hidden [&>svg]:size-full">
        {selected.icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium">{selected.title}</p>
      </div>
    </>
  ) : (
    placeholder
  )

  return (
    <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
      <Button
        mode="default"
        size="md"
        intent="secondary"
        variant="ghost"
        aria-label="Open Tabs Dropdown"
        className={className}
        rightIcon={
          <ChevronsUpDown className="text-gray-11 ms-auto size-4 shrink-0" />
        }
      >
        {selectedItem}
      </Button>
      <Popover placement="bottom start" className="w-[var(--anchor-width)]">
        <PopoverDialog className="flex flex-col gap-0.5 p-1">
          {options.map((item) => {
            const active = selected && item.url === selected.url
            if (!active && item.unlisted) return null

            return (
              <a
                key={item.url}
                href={item.url}
                onClick={handleClick}
                {...item.props}
                className={cn(
                  "flex items-center gap-2 rounded-md p-2 text-sm transition-colors",
                  "hover:bg-gray-4 hover:text-gray-12",
                  "focus-visible:ring-ring focus:outline-none focus-visible:ring-2",
                  active && "bg-accent-4 text-accent-11",
                  item.props?.className
                )}
              >
                <div className="size-5 shrink-0 empty:hidden [&>svg]:size-full">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="leading-none font-medium">{item.title}</p>
                  {item.description && (
                    <p className="text-gray-11 mt-1 text-xs">
                      {item.description}
                    </p>
                  )}
                </div>
                <Check
                  className={cn(
                    "text-accent-11 ms-auto size-4 shrink-0",
                    !active && "invisible"
                  )}
                />
              </a>
            )
          })}
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}
