import type { ReactNode } from "react"

export type FilterPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | [Date, Date]
  | (string | number)[]

export type SelectOption = {
  label: string
  value: string | number
  avatar?: string
  icon?: React.ReactNode
}

export type SerializableSelectOption = Omit<SelectOption, "icon">

export type DateFilterMode = "from" | "to" | "range"
export type DateFilterPreset = "lastWeek" | "thisWeek" | "thisMonth"

export interface DateModeFilterValue {
  mode: DateFilterMode
  from?: Date
  to?: Date
  preset?: DateFilterPreset
}

export type FilterFieldValue =
  | FilterPrimitive
  | FilterPrimitive[]
  | SerializableSelectOption[]
  | DateModeFilterValue

export type FilterValue = Record<string, FilterFieldValue>

export interface FilterContextValue {
  value: FilterValue
  onChange: (value: FilterValue) => void
  setFieldValue: (field: string, v: FilterFieldValue) => void
  clearField: (field: string) => void
  reset: () => void
}

export interface FilterProps {
  value?: FilterValue
  defaultValue?: FilterValue
  onChange?: (value: FilterValue) => void
  children: ReactNode
}

export interface OptionsLoader {
  hasNextPage: boolean
  onFetchNextPage: () => void
  isFetching?: boolean
  onSearch?: (search: string) => void
}

export type FilterRenderMode = "builder" | "row"

export interface FilterBuilderItem {
  type?: "filter"
  field: string
  label: ReactNode
  icon?: ReactNode
  description?: ReactNode
  render: (mode: FilterRenderMode) => ReactNode
  options?: SelectOption[]
  renderIcon?: (option: SelectOption, isSelected: boolean) => ReactNode
  multi?: boolean
  formatValue?: (value: unknown) => string
  isDisabled?: boolean
  renderRowValue?: (args: { value: unknown; field: string }) => React.ReactNode
}

export interface FilterBuilderSeparator {
  type: "separator"
}

export type FilterBuilderEntry = FilterBuilderItem | FilterBuilderSeparator

export interface FilterBuilderProps {
  items: FilterBuilderEntry[]
}

export function isFilterItem(
  entry: FilterBuilderEntry
): entry is FilterBuilderItem {
  return entry.type !== "separator"
}

export function isSelectOptionArray(
  value: unknown
): value is SerializableSelectOption[] {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  const first = value[0]
  return (
    typeof first === "object" &&
    first !== null &&
    "value" in first &&
    "label" in first
  )
}
