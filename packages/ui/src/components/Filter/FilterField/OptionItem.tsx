"use client"

import { cn } from "@workspace/ui/lib/utils"
import { Check } from "lucide-react"
import { MenuItem as AriaMenuItem, ListBoxItem } from "react-aria-components"

import type { SelectOption } from "../Filter.types"

interface OptionItemProps {
  option: SelectOption
  multi?: boolean
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
}

/* Shared option item for Menu-based selects (FilterSelect) */
export function MenuOptionItem({
  option,
  multi = true,
  renderIcon,
}: OptionItemProps) {
  return (
    <AriaMenuItem
      id={String(option.value)}
      textValue={option.label}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none",
        "hover:bg-gray-3 data-focused:bg-gray-3 transition-colors",
        "data-selected:text-gray-12 text-gray-11"
      )}
    >
      {({ isSelected }) => (
        <OptionItemContent
          option={option}
          isSelected={isSelected}
          multi={multi}
          renderIcon={renderIcon}
        />
      )}
    </AriaMenuItem>
  )
}

/* Shared option item for ListBox-based selects (FilterAsyncSelect) */
export function ListBoxOptionItem({
  option,
  multi = true,
  renderIcon,
}: OptionItemProps) {
  return (
    <ListBoxItem
      id={String(option.value)}
      textValue={option.label}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none",
        "hover:bg-gray-3 data-focused:bg-gray-3 transition-colors",
        "data-selected:text-gray-12 text-gray-11"
      )}
    >
      {({ isSelected }) => (
        <OptionItemContent
          option={option}
          isSelected={isSelected}
          multi={multi}
          renderIcon={renderIcon}
        />
      )}
    </ListBoxItem>
  )
}

/* Shared content for option items */
function OptionItemContent({
  option,
  isSelected,
  multi,
  renderIcon,
}: {
  option: SelectOption
  isSelected: boolean
  multi?: boolean
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
}) {
  return (
    <>
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border",
          multi ? "rounded" : "rounded-full",
          isSelected
            ? "bg-accent-9 border-accent-9 text-white"
            : "border-gray-7 bg-transparent"
        )}
      >
        {isSelected && <Check className="size-3" strokeWidth={2.5} />}
      </span>

      {renderIcon ? (
        <span className="shrink-0">{renderIcon(option, isSelected)}</span>
      ) : option.avatar ? (
        <img
          src={option.avatar}
          alt={option.label}
          className="size-5 shrink-0 rounded-full object-cover"
        />
      ) : option.icon ? (
        <span className="text-gray-11 shrink-0">{option.icon}</span>
      ) : null}

      <span className="flex-1 truncate">{option.label}</span>
    </>
  )
}
