"use client"

import { useMemo, useRef, useState } from "react"
import { Popover, PopoverDialog } from "@workspace/ui/components/Popover"
import { Separator } from "@workspace/ui/components/Separator"
import { Tooltip, TooltipTrigger } from "@workspace/ui/components/Tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { XIcon } from "lucide-react"

import { FilterItemProvider, useFilterContext } from "./Filter.store"
import {
  isSelectOptionArray,
  type FilterBuilderItem,
  type FilterFieldValue,
  type SelectOption,
  type SerializableSelectOption,
} from "./Filter.types"

interface FilterRowProps {
  item: FilterBuilderItem
}

export function FilterRow({ item }: FilterRowProps) {
  const { value, clearField } = useFilterContext()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const raw = value[item.field]

  if (raw == null || (Array.isArray(raw) && raw.length === 0)) return null

  return (
    <div
      className={cn(
        "group bg-gray-3 inline-flex h-7 items-center rounded-md border text-xs"
      )}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-full items-center gap-1.5 pr-1",
          "hover:bg-gray-4 rounded-l-md transition-colors",
          "focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-inset",
          isOpen && "bg-gray-4"
        )}
      >
        <div className="flex items-center gap-1.5 pr-2 pl-3">
          {item.icon && <span className="text-gray-12">{item.icon}</span>}
          <span className="text-gray-12 text-xs font-medium">{item.label}</span>
        </div>

        <Separator orientation="vertical" className="bg-gray-6 h-4 w-px" />

        <div className="flex items-center gap-1 px-2">
          {item.renderRowValue ? (
            item.renderRowValue({ value: raw, field: item.field })
          ) : (
            <FilterValueDisplay
              field={item.field}
              value={raw}
              options={item.options}
              renderIcon={item.renderIcon}
              multi={item.multi}
              formatValue={item.formatValue}
            />
          )}
        </div>
      </button>

      <Popover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom start"
        className="overflow-hidden rounded-lg"
      >
        <PopoverDialog
          className="bg-gray-2 min-w-[260px] p-0"
          aria-label={`Filter ${item.label}`}
        >
          <FilterItemProvider
            item={item}
            mode="row"
            onClose={() => setIsOpen(false)}
          >
            {item.render("row")}
          </FilterItemProvider>
        </PopoverDialog>
      </Popover>

      <button
        type="button"
        onClick={() => clearField(item.field)}
        className={cn(
          "group mr-1 flex size-5 cursor-pointer items-center justify-center rounded-sm px-[5px]",
          "hover:bg-gray-4 transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        )}
        aria-label={`Remove ${item.field} filter`}
      >
        <XIcon className="text-gray-11 group-hover:text-gray-12 size-3.5 transition-colors" />
      </button>
    </div>
  )
}

interface FilterValueDisplayProps {
  field: string
  value: unknown
  options?: SelectOption[]
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
  multi?: boolean
  formatValue?: (value: unknown) => string
}

function FilterValueDisplay({
  field,
  value,
  options,
  renderIcon,
  multi,
  formatValue,
}: FilterValueDisplayProps) {
  const { setFieldValue } = useFilterContext()

  const isDateRange =
    Array.isArray(value) &&
    value.length === 2 &&
    value[0] instanceof Date &&
    value[1] instanceof Date

  if (isDateRange && formatValue) {
    return (
      <span className="text-gray-12 inline-flex items-center gap-1.5 text-xs font-medium">
        <span>{formatValue(value)}</span>
      </span>
    )
  }

  const storedOptions = isSelectOptionArray(value) ? value : []
  const isStoredFormat = storedOptions.length > 0

  const primitiveValues: unknown[] =
    !isStoredFormat && Array.isArray(value)
      ? value
      : !isStoredFormat && value != null
        ? [value]
        : []

  const getLabel = (item: SerializableSelectOption | unknown): string => {
    if (formatValue) {
      return formatValue(item)
    }
    if (typeof item === "object" && item !== null && "label" in item) {
      return (item as SerializableSelectOption).label
    }
    const str = String(item)
    return options?.find((o) => String(o.value) === str)?.label ?? str
  }

  const getStoredOption = (
    item: SerializableSelectOption | unknown
  ): SerializableSelectOption | undefined => {
    if (typeof item === "object" && item !== null && "label" in item) {
      return item as SerializableSelectOption
    }
    const str = String(item)
    const opt = options?.find((o) => String(o.value) === str)
    return opt
      ? { value: opt.value, label: opt.label, avatar: opt.avatar }
      : undefined
  }

  const getIcon = (
    item: SerializableSelectOption | unknown
  ): SelectOption | undefined => {
    const value =
      typeof item === "object" && item !== null && "value" in item
        ? (item as SerializableSelectOption).value
        : String(item)
    return options?.find((o) => String(o.value) === value)
  }

  const handleRemoveItem = (itemValue: string | number) => {
    if (isStoredFormat) {
      const newOptions = storedOptions.filter((opt) => opt.value !== itemValue)
      setFieldValue(field, newOptions.length > 0 ? newOptions : undefined)
    } else {
      const newValues = primitiveValues.filter(
        (v) => String(v) !== String(itemValue)
      )
      setFieldValue(
        field,
        newValues.length > 0 ? (newValues as FilterFieldValue) : undefined
      )
    }
  }

  const allItems = isStoredFormat ? storedOptions : primitiveValues

  if (allItems.length === 0) {
    return <span className="text-gray-12 font-medium">None</span>
  }

  if (!multi) {
    const item = allItems[0]
    const storedOpt = getStoredOption(item)
    const iconOpt = getIcon(item)
    const avatar = storedOpt?.avatar
    const icon = iconOpt?.icon

    return (
      <span className="text-gray-12 inline-flex items-center gap-1.5 text-xs font-medium">
        <ItemIcon
          avatar={avatar}
          icon={icon}
          label={getLabel(item)}
          renderIcon={renderIcon}
          iconOption={iconOpt}
          size="md"
        />
        <span>{getLabel(item)}</span>
      </span>
    )
  }

  const visibleItems = allItems.slice(0, 2)
  const remainingItems = allItems.slice(2)
  const hasRemaining = remainingItems.length > 0

  return (
    <div className="flex items-center gap-1">
      {visibleItems.map((item, index) => {
        const storedOpt = getStoredOption(item)
        const iconOpt = getIcon(item)
        const itemValue =
          typeof item === "object" && item !== null && "value" in item
            ? (item as SerializableSelectOption).value
            : String(item)
        return (
          <FilterBadge
            key={itemValue}
            label={getLabel(item)}
            storedOption={storedOpt}
            iconOption={iconOpt}
            renderIcon={renderIcon}
            onRemove={() => handleRemoveItem(itemValue)}
            className={index === 1 ? "hidden sm:inline-flex" : undefined}
          />
        )
      })}

      {hasRemaining && (
        <RemainingBadges
          items={remainingItems}
          extraHiddenCount={visibleItems.length > 1 ? 1 : 0}
          renderIcon={renderIcon}
          onRemove={handleRemoveItem}
          getLabel={getLabel}
          getStoredOption={getStoredOption}
          getIcon={getIcon}
        />
      )}
    </div>
  )
}

interface FilterBadgeProps {
  label: string
  storedOption?: SerializableSelectOption
  iconOption?: SelectOption
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
  onRemove: () => void
  className?: string
}

function FilterBadge({
  label,
  storedOption,
  iconOption,
  renderIcon,
  onRemove,
  className,
}: FilterBadgeProps) {
  return (
    <span
      className={cn(
        "bg-gray-5 text-gray-12 inline-flex items-center gap-1 rounded py-0.5 pr-0.5 pl-1.5 text-xs font-medium",
        className
      )}
    >
      <ItemIcon
        avatar={storedOption?.avatar}
        icon={iconOption?.icon}
        label={label}
        renderIcon={renderIcon}
        iconOption={iconOption}
        size="sm"
      />
      <span className="max-w-[80px] truncate">{label}</span>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className={cn(
          "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm",
          "hover:bg-gray-6 transition-colors",
          "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none"
        )}
        aria-label={`Remove ${label}`}
      >
        <XIcon className="size-2.5" />
      </div>
    </span>
  )
}

interface RemainingBadgesProps {
  items: (SerializableSelectOption | unknown)[]
  extraHiddenCount?: number
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
  onRemove: (value: string | number) => void
  getLabel: (v: SerializableSelectOption | unknown) => string
  getStoredOption: (
    v: SerializableSelectOption | unknown
  ) => SerializableSelectOption | undefined
  getIcon: (v: SerializableSelectOption | unknown) => SelectOption | undefined
}

function RemainingBadges({
  items,
  extraHiddenCount = 0,
  renderIcon,
  onRemove,
  getLabel,
  getStoredOption,
  getIcon,
}: RemainingBadgesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const getItemValue = (
    item: SerializableSelectOption | unknown
  ): string | number => {
    if (typeof item === "object" && item !== null && "value" in item) {
      return (item as SerializableSelectOption).value
    }
    return String(item)
  }

  const renderedTooltipItems = useMemo(
    () =>
      items.map((item) => {
        const storedOpt = getStoredOption(item)
        const iconOpt = getIcon(item)

        return (
          <span
            key={getItemValue(item)}
            className="inline-flex items-center gap-0.5 align-middle"
          >
            <ItemIcon
              avatar={storedOpt?.avatar}
              icon={iconOpt?.icon}
              label={getLabel(item)}
              renderIcon={renderIcon}
              iconOption={iconOpt}
              size="sm"
            />
            <span className="text-gray-12 text-xs">{getLabel(item)}</span>
          </span>
        )
      }),
    [items, getStoredOption, getIcon, getLabel, renderIcon, getItemValue]
  )

  const toggleOpen = () => setIsOpen((prev) => !prev)

  const handleClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation()
    toggleOpen()
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      e.stopPropagation()
      toggleOpen()
    }
  }

  return (
    <>
      <TooltipTrigger delay={200}>
        <span
          ref={triggerRef}
          role="button"
          tabIndex={0}
          aria-label={`Show ${items.length} more selected values`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            "bg-gray-5 text-gray-12 inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
            "hover:bg-gray-6 cursor-pointer transition-colors"
          )}
        >
          <span className="sm:hidden">+{items.length + extraHiddenCount}</span>
          <span className="hidden sm:inline">+{items.length}</span>
        </span>

        <Tooltip placement="bottom">
          <div className="text-gray-12 max-w-[260px] text-xs">
            {renderedTooltipItems.map((node, index) => (
              <span key={index}>
                {node}
                {index < renderedTooltipItems.length - 1 && (
                  <span className="text-gray-11">, </span>
                )}
              </span>
            ))}
          </div>
        </Tooltip>
      </TooltipTrigger>

      <Popover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom start"
        className="overflow-hidden rounded-lg"
      >
        <PopoverDialog className="bg-gray-2 max-w-[260px] min-w-[180px] p-0">
          <div className="flex max-h-[200px] flex-col gap-1 overflow-y-auto p-2">
            {items.map((item) => {
              const storedOpt = getStoredOption(item)
              const iconOpt = getIcon(item)
              const itemValue = getItemValue(item)

              return (
                <div
                  key={itemValue}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md px-2 py-1.5",
                    "hover:bg-gray-3 transition-colors"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <ItemIcon
                      avatar={storedOpt?.avatar}
                      icon={iconOpt?.icon}
                      label={getLabel(item)}
                      renderIcon={renderIcon}
                      iconOption={iconOpt}
                      size="md"
                    />
                    <span className="text-gray-12 truncate text-xs">
                      {getLabel(item)}
                    </span>
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(itemValue)
                    }}
                    className={cn(
                      "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm",
                      "hover:bg-gray-4 text-gray-11 hover:text-gray-12 transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none"
                    )}
                    aria-label={`Remove ${getLabel(item)}`}
                  >
                    <XIcon className="size-3" />
                  </div>
                </div>
              )
            })}
          </div>
        </PopoverDialog>
      </Popover>
    </>
  )
}

/* Shared icon/avatar display for filter items */
interface ItemIconProps {
  avatar?: string
  icon?: React.ReactNode
  label: string
  renderIcon?: (option: SelectOption, isSelected: boolean) => React.ReactNode
  iconOption?: SelectOption
  size?: "sm" | "md"
}

function ItemIcon({
  avatar,
  icon,
  label,
  renderIcon,
  iconOption,
  size = "md",
}: ItemIconProps) {
  const sizeClasses = size === "sm" ? "size-3" : "size-4"
  const svgSizeClasses = size === "sm" ? "[&>svg]:size-3" : "[&>svg]:size-3.5"

  if (renderIcon && iconOption) {
    return <span className="shrink-0">{renderIcon(iconOption, true)}</span>
  }
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={label}
        className={cn(sizeClasses, "shrink-0 rounded-full object-cover")}
      />
    )
  }
  if (icon) {
    return (
      <span className={cn("text-gray-11 shrink-0", svgSizeClasses)}>
        {icon}
      </span>
    )
  }
  return null
}
