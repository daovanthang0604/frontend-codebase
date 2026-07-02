"use client"

import React from "react"
import { Button } from "@workspace/ui/components/Button"
import { Checkbox } from "@workspace/ui/components/Checkbox"
import { fieldGroupVariants } from "@workspace/ui/components/Field"
import { SearchInput } from "@workspace/ui/components/Input"
import { Label } from "@workspace/ui/components/Label"
import { Popover, PopoverDialog } from "@workspace/ui/components/Popover"
import { useAriaSelectProps } from "@workspace/ui/components/Select.utils"
import { Spinner } from "@workspace/ui/components/Spinner"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import { cn } from "@workspace/ui/lib/utils"
import { omit } from "lodash"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import {
  Button as AriaButton,
  Select as AriaSelect,
  Autocomplete,
  AutocompleteStateContext,
  Collection,
  DialogTrigger,
  ListBox,
  ListBoxItem,
  ListBoxLoadMoreItem,
  ListLayout,
  Pressable,
  SelectStateContext,
  SelectValue,
  useFilter,
  Virtualizer,
  type PopoverProps as AriaPopoverProps,
  type SelectProps as AriaSelectProps,
  type ListBoxItemProps,
} from "react-aria-components"

import { Separator } from "./Separator"

const SELECT_ALL_KEYWORD =
  "this_is_keyword_for_select_all_checkbox_asljqdkasjdlkajsd"
const ROW_HEIGHT = 36
interface SelectOption<T = string | number> {
  id?: string
  value: T
  label: string
}
interface SelectProps<T extends SelectOption, M extends "single" | "multiple">
  extends Omit<
    AriaSelectProps<T>,
    "children" | "onChange" | "value" | "defaultValue" | "selectionMode"
  > {
  /** The selection mode for the select. */
  selectionMode?: M
  /** Initial value used when the component is uncontrolled. */
  defaultValue?: M extends "multiple" ? Array<T> : T
  /** If this prop is set, the select operates in a controlled manner and uses this value as its state. */
  value?: (M extends "multiple" ? Array<T> : T) | null
  /** If this prop is set, the select will call this function with the new value whenever the value changes. */
  onChange?: M extends "multiple"
    ? (value: Array<T>) => void
    : (value: T) => void
  /** Information for managing async option loading. */
  optionsLoader?: {
    /** Whether there are more pages of options to load. */
    hasNextPage: boolean
    /** Callback to fetch the next page of options. */
    onFetchNextPage: () => void
    /** Whether the next page of options is currently being fetched. */
    isFetching?: boolean
    /** A function to search for options. */
    onSearch?: (search: string) => void
  }
  /**
   * The array of options to display in the select dropdown.
   */
  options?: Array<T>
  /**
   * If true, enables a search field for filtering options.
   */
  isSearchable?: boolean
  /**
   * Custom render function for the selected value display.
   */
  renderValue?: (value: T) => React.ReactNode
  /**
   * Custom render function for each option in the dropdown.
   */
  renderOption?: (item: T) => React.ReactNode
  /**
   * The maximum number of badges to display. To show all badges, set to Infinity.
   */
  maxVisibleBadges?: number
  /**
   * If true, the clear button will be shown.
   */
  isClearable?: boolean
  /**
   * The message to display when there are no options found.
   */
  emptyMessage?: string
  /**
   * The label to display above the select.
   */
  label?: string
  /**
   * If true, an asterisk will be displayed next to the label.
   */
  withAsterisk?: boolean
  /**
   * The tooltip for the select.
   */
  tooltip?: React.ReactNode
  /**
   * The keyword to search for.
   */
  keyword?: keyof T
  /**
   * The action to perform when the create new button is clicked.
   */
  onCreate?: (value: string) => void
  /**
   * The class name for the trigger button.
   */
  triggerClassName?: string
  /**
   * The class name for the popover.
   */
  popoverProps?: AriaPopoverProps
}
function Select<
  T extends SelectOption,
  M extends "single" | "multiple" = "single",
>(props: SelectProps<T, M>) {
  const {
    value: controlledValue,
    onChange: controlledOnChange,
    defaultValue,
    optionsLoader,
    options,
    renderOption,
    renderValue,
    isClearable = false,
    maxVisibleBadges = 2,
    placeholder = "Select",
    isSearchable = false,
    emptyMessage = "No results found",
    label,
    withAsterisk,
    tooltip,
    keyword,
    onCreate,
    triggerClassName,
    popoverProps,
    ...restProps
  } = props
  const [isOpen, setIsOpen] = React.useState(false)
  const listBoxRef = React.useRef<HTMLDivElement>(null)
  const selectionMode = props.selectionMode || "single"
  const isAsync = Boolean(optionsLoader)
  const optionsWithId = options?.map((option) => ({
    ...option,
    id: JSON.stringify(option),
  }))
  const ariaProps = useAriaSelectProps({
    value: controlledValue,
    defaultValue: defaultValue,
    onChange: controlledOnChange,
    selectionMode: selectionMode,
  })
  // Scroll to last selected item when popover opens
  React.useEffect(() => {
    if (isOpen && listBoxRef.current) {
      queueMicrotask(() => {
        const selectedItems = listBoxRef.current?.querySelectorAll(
          '[aria-selected="true"]'
        )
        if (selectedItems && selectedItems.length > 0) {
          const lastSelectedItem = selectedItems[selectedItems.length - 1]
          lastSelectedItem?.scrollIntoView({
            block: "nearest",
          })
        }
      })
    }
  }, [isOpen])
  return (
    <AriaSelect
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsOpen(false)
          setTimeout(() => {
            optionsLoader?.onSearch?.("")
          }, 100)
        }
      }}
      aria-label="Select"
      className={cn("group relative flex w-full flex-col gap-1")}
      {...ariaProps}
      {...restProps}
    >
      {label && (
        <Label withAsterisk={withAsterisk} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <AriaButton
        className={cn(
          fieldGroupVariants(),
          "data-focus-visible:ring-ring h-auto min-h-10 cursor-pointer py-1 pr-4 data-focus-visible:ring-2 data-focused:outline-none",
          "relative flex justify-between",
          "group-data-invalid:ring-error-9! group-data-invalid:border-error-9! group-data-disabled:cursor-not-allowed group-data-disabled:opacity-70",
          "aria-expanded:ring-ring aria-expanded:border-accent-9 aria-expanded:ring-1",
          triggerClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SelectValue<T> className="truncate">
          {() => {
            const selectedItems = [ariaProps.value]
              .flat()
              .filter(Boolean)
              .map((v) => JSON.parse(v))
            const isPlaceholder = selectedItems.length === 0
            if (isPlaceholder) {
              // If placeholder is not set, return an empty div
              if (!placeholder) {
                return (
                  <div className="opacity-0" aria-hidden="true">
                    &nbsp;
                  </div>
                )
              }
              return <div className="text-gray-8">{placeholder}</div>
            }
            if (selectionMode === "single") {
              const selectedItem = selectedItems[0]
              if (!selectedItem) return null
              return renderValue
                ? renderValue(selectedItem)
                : selectedItem?.label
            }
            if (selectionMode === "multiple") {
              const selectedItemsWithId = selectedItems.map((item) => ({
                ...item,
                id: JSON.stringify(item),
              }))
              return (
                <div className="flex flex-1 flex-wrap gap-1 pr-4">
                  {selectedItemsWithId
                    ?.slice(0, maxVisibleBadges)
                    .map((item) => {
                      if (!item) return null
                      return (
                        <SelectBadge key={item?.id} title={item.label}>
                          <div className="truncate">
                            {renderValue ? renderValue(item) : item.label}
                          </div>
                          <BadgeClearButton data={item} />
                        </SelectBadge>
                      )
                    })}

                  {/* Remaining badges count */}
                  {!!selectedItemsWithId?.length &&
                    selectedItemsWithId.length > maxVisibleBadges && (
                      <RemainingBadges
                        items={selectedItemsWithId.slice(maxVisibleBadges)}
                      />
                    )}
                </div>
              )
            }
          }}
        </SelectValue>
        <ChevronDownIcon className="text-gray-11 size-4 translate-x-1" />
        {isClearable && <SelectClearButton />}
      </AriaButton>
      <Popover
        crossOffset={-1}
        className={cn(
          "w-[calc(var(--trigger-width)+2px)] overflow-hidden",
          popoverProps?.className
        )}
        animateOut={false}
        {...omit(popoverProps, "className")}
      >
        <div className="flex flex-col">
          <ItemsWrapper
            isAsync={isAsync}
            isSearchable={isSearchable}
            selectionMode={selectionMode}
            manualSearching={!!optionsLoader}
            onSearch={optionsLoader?.onSearch}
          >
            <div>
              <Virtualizer
                layout={ListLayout}
                layoutOptions={{
                  estimatedRowHeight: ROW_HEIGHT,
                }}
              >
                <ListBox
                  ref={listBoxRef}
                  className="!max-h-[250px] flex-1 scroll-pb-1 overflow-y-auto outline-hidden"
                  renderEmptyState={() => {
                    if (optionsLoader?.isFetching) return null
                    return (
                      <div className="text-gray-11 flex h-20 items-center justify-center text-center text-sm">
                        {emptyMessage}
                      </div>
                    )
                  }}
                >
                  {selectionMode === "multiple" && !isAsync && (
                    <SelectAllCheckbox
                      value={ariaProps.value}
                      onChange={ariaProps.onChange}
                      options={optionsWithId as Array<Record<string, any>>}
                    />
                  )}
                  <Collection items={optionsWithId}>
                    {(item) => (
                      <SelectItem
                        selectionMode={selectionMode}
                        renderOption={renderOption}
                        textValue={(item as any)[keyword || "label"]}
                      >
                        {item.label}
                      </SelectItem>
                    )}
                  </Collection>
                  <ListBoxLoadMoreItem
                    onLoadMore={
                      optionsLoader?.hasNextPage
                        ? optionsLoader?.onFetchNextPage
                        : undefined
                    }
                    isLoading={optionsLoader?.isFetching}
                    className="flex items-center justify-center pt-1.5"
                  >
                    <Spinner className="text-gray-11/50 size-5" />
                  </ListBoxLoadMoreItem>
                </ListBox>
              </Virtualizer>
            </div>
            <CreateNew onCreate={onCreate} />
          </ItemsWrapper>
        </div>
      </Popover>
    </AriaSelect>
  )
}
function SelectBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-gray-12 bg-gray-4 inline-flex items-center justify-center truncate rounded-sm px-2 py-0.5 text-xs font-medium",
        className
      )}
      {...props}
    />
  )
}
function RemainingBadges({
  items,
  renderValue,
}: {
  items: Array<SelectOption>
  renderValue?: (item: SelectOption) => React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <DialogTrigger>
      <Pressable>
        <SelectBadge
          role="button"
          title="Show more options"
          className="hover:bg-gray-3 focus-visible:outline-none"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
        >
          <span>{`+${items.length}`}</span>
        </SelectBadge>
      </Pressable>
      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom left"
        className="overflow-hidden rounded-md"
      >
        <PopoverDialog className="p-0">
          <div className="flex max-h-[250px] max-w-[260px] min-w-[150px] flex-col gap-1.5 overflow-y-auto p-2">
            {items.map((item) => (
              <SelectBadge
                key={item?.id}
                className="w-full shrink-0 justify-between"
              >
                <div className="truncate" title={item.label}>
                  {renderValue ? renderValue(item) : item.label}
                </div>
                <BadgeClearButton data={item} />
              </SelectBadge>
            ))}
          </div>
        </PopoverDialog>
      </Popover>
    </DialogTrigger>
  )
}
interface ItemsWrapperProps {
  children: React.ReactNode
  isSearchable: boolean
  selectionMode: "single" | "multiple"
  manualSearching?: boolean
  onSearch?: (search: string) => void
  isAsync?: boolean
}
function ItemsWrapper({
  children,
  isSearchable,
  manualSearching,
  onSearch,
}: ItemsWrapperProps) {
  const { contains } = useFilter({ sensitivity: "base" })
  const isMobile = useIsMobile()
  const customFilter = (textValue: string, inputValue: string) => {
    if (textValue === SELECT_ALL_KEYWORD) return true
    return contains(textValue, inputValue)
  }
  return isSearchable ? (
    <Autocomplete
      disableVirtualFocus={isMobile}
      filter={manualSearching ? undefined : customFilter}
    >
      <SearchInput
        autoFocus
        placeholder="Search"
        className="rounded-none border-none! ring-0!"
        onChange={onSearch}
      />
      <Separator />
      <div className="p-1.5">{children}</div>
    </Autocomplete>
  ) : (
    <div className="p-1.5">{children}</div>
  )
}
interface SelectAllCheckboxProps {
  value: Array<Record<string, any>>
  onChange: (value: Array<Record<string, any>> | null) => void
  options: Array<Record<string, any>>
}
function SelectAllCheckbox({
  value,
  onChange,
  options,
}: SelectAllCheckboxProps) {
  const isAllSelected = value?.length === options?.length
  const isIndeterminate = !!value?.length && value?.length < options?.length
  return (
    <ListBoxItem
      textValue={SELECT_ALL_KEYWORD}
      onClick={(e) => {
        e.stopPropagation()
        if (isAllSelected) {
          onChange([])
        } else {
          const ids = options.map((option) => option.id)
          onChange(ids)
        }
      }}
      className={cn(
        "group text-gray-12 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-hidden select-none",
        "data-focused:bg-gray-3"
      )}
    >
      <Checkbox
        readOnly
        reduceMotion
        isSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
      />
      Select All
    </ListBoxItem>
  )
}
interface CreateNewProps {
  onCreate?: (value: string) => void
}
function CreateNew({ onCreate }: CreateNewProps) {
  const selectState = React.useContext(SelectStateContext)
  const autocompleteState = React.useContext(AutocompleteStateContext)
  const inputValue = autocompleteState?.inputValue || ""
  if (!onCreate) return null
  return (
    <div className="py-1.5">
      <Button
        fullWidth
        variant="minimal"
        intent="secondary"
        isDisabled={!inputValue}
        onClick={() => {
          onCreate(inputValue)
          selectState?.close()
        }}
      >
        Create new
      </Button>
    </div>
  )
}
function SelectItem<T extends SelectOption>({
  children,
  renderOption,
  selectionMode = "multiple",
  ...props
}: ListBoxItemProps & {
  children: string
  renderOption?: (item: T) => React.ReactNode
  selectionMode: "single" | "multiple"
}) {
  const content = (
    <div className="flex-1 overflow-hidden text-sm font-normal">
      <div className="truncate">
        {renderOption ? renderOption(props.value as T) : children}
      </div>
    </div>
  )
  return (
    <ListBoxItem
      {...props}
      className={cn(
        "group text-gray-12 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-hidden select-none",
        "data-focused:bg-gray-3"
      )}
    >
      {({ isSelected }) => (
        <>
          {selectionMode === "single" &&
            (isSelected ? (
              <CheckIcon size={16} className="text-accent-11" />
            ) : (
              <div className="w-4" />
            ))}
          {selectionMode === "multiple" && (
            <Checkbox readOnly reduceMotion isSelected={isSelected} />
          )}
          {content}
        </>
      )}
    </ListBoxItem>
  )
}
function SelectClearButton() {
  const state = React.useContext(SelectStateContext)
  const value = state?.value as string | Array<number | string>
  if (!value || value.length === 0) return null
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation()
        state?.setValue(null)
      }}
      className={cn(
        "focus-visible:ring-2 focus-visible:outline-none",
        "bg-gray-2 text-gray-11 hover:bg-gray-3 z-10 flex size-6 cursor-pointer items-center justify-center rounded-sm",
        "absolute top-1/2 right-8 -translate-y-1/2"
      )}
    >
      <XIcon className="text-gray-11 size-3.5" />
    </div>
  )
}
function BadgeClearButton({ data }: { data: SelectOption }) {
  const state = React.useContext(SelectStateContext)
  const value = state?.value as string | Array<number | string>
  if (!Array.isArray(value)) return null
  return (
    <div
      role="button"
      tabIndex={0}
      className="hover:bg-gray-4 z-10 -mr-1.5 flex size-4! shrink-0 cursor-pointer items-center justify-center rounded-sm bg-transparent focus-visible:ring-2 focus-visible:outline-none"
      onClick={(e) => {
        e.stopPropagation()
        const newKeys = value.filter((v) => v !== data.id)
        state?.setValue(newKeys)
      }}
    >
      <XIcon className="size-2.5!" />
    </div>
  )
}
export { Select }
export type { SelectOption }
