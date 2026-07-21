"use client"

import { Combobox } from "@base-ui/react/combobox"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { Check } from "lucide-react"

import type { SelectOption } from "../Filter.types"

interface OptionItemProps {
  option: SelectOption
  multi?: boolean
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
}

// Shared option row for the Combobox-based selects (FilterSelect /
// FilterAsyncSelect). Base UI sets data-selected on the chosen item and
// data-highlighted on the keyboard/pointer-active one; the check box fills off
// data-selected and Combobox.ItemIndicator renders the tick.
export function ComboboxOptionItem({
  option,
  multi = true,
  renderIcon,
}: OptionItemProps) {
  return (
    <Combobox.Item
      value={option}
      className={cn(
        "group/opt flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none",
        "data-highlighted:bg-gray-3 transition-colors",
        "text-gray-11 data-selected:text-gray-12"
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center border",
          multi ? "rounded" : "rounded-full",
          "border-gray-7 bg-transparent text-white",
          "group-data-[selected]/opt:bg-accent-9 group-data-[selected]/opt:border-accent-9"
        )}
      >
        <Combobox.ItemIndicator>
          <Check className="size-3" strokeWidth={2.5} />
        </Combobox.ItemIndicator>
      </span>

      {renderIcon ? (
        <span className="shrink-0">{renderIcon(option, true)}</span>
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
    </Combobox.Item>
  )
}
