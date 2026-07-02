import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"

import type {
  FilterBuilderItem,
  FilterContextValue,
  FilterFieldValue,
  FilterProps,
  FilterRenderMode,
  FilterValue,
} from "./Filter.types"

const FilterContext = createContext<FilterContextValue | undefined>(undefined)

export function useFilterContext() {
  const ctx = useContext(FilterContext)
  if (!ctx) {
    throw new Error("Filter components must be used within <Filter>")
  }
  return ctx
}

export function FilterProvider({
  value: controlledValue,
  defaultValue,
  onChange,
  children,
}: PropsWithChildren<FilterProps>) {
  const isControlled = controlledValue !== undefined

  const [uncontrolledValue, setUncontrolledValue] = useState<FilterValue>(
    defaultValue ?? {}
  )

  const value = isControlled ? controlledValue! : uncontrolledValue

  const setValue = (next: FilterValue) => {
    if (!isControlled) setUncontrolledValue(next)
    onChange?.(next)
  }

  const setFieldValue = (field: string, fieldValue: FilterFieldValue) => {
    setValue({
      ...value,
      [field]: fieldValue,
    })
  }

  const clearField = (field: string) => {
    if (!(field in value)) return
    const { [field]: _removed, ...rest } = value
    setValue(rest)
  }

  const reset = () => {
    setValue({})
  }

  const ctxValue = useMemo<FilterContextValue>(
    () => ({
      value,
      onChange: setValue,
      setFieldValue,
      clearField,
      reset,
    }),
    [value]
  )

  return (
    <FilterContext.Provider value={ctxValue}>{children}</FilterContext.Provider>
  )
}

/** Context for the current filter item being rendered. */
interface FilterItemContextValue {
  item: FilterBuilderItem
  mode: FilterRenderMode
  onClose?: () => void
}

const FilterItemContext = createContext<FilterItemContextValue | undefined>(
  undefined
)

export function FilterItemProvider({
  item,
  mode,
  onClose,
  children,
}: PropsWithChildren<{
  item: FilterBuilderItem
  mode: FilterRenderMode
  onClose?: () => void
}>) {
  const value = useMemo(() => ({ item, mode, onClose }), [item, mode, onClose])
  return (
    <FilterItemContext.Provider value={value}>
      {children}
    </FilterItemContext.Provider>
  )
}

export function useFilterItem() {
  const ctx = useContext(FilterItemContext)
  return ctx?.item
}

export function useFilterItemMode() {
  const ctx = useContext(FilterItemContext)
  return ctx?.mode
}

export function useFilterItemClose() {
  const ctx = useContext(FilterItemContext)
  return ctx?.onClose
}
