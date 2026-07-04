// Filter type contracts live here first so DataTable (which types its filter
// props against FilterValue) can migrate ahead of the Filter components. The
// component exports (Filter / FilterBar / FilterBuilder / FilterField) are added
// when the Filter composite itself is ported.
export type {
  FilterBuilderEntry,
  FilterValue,
  FilterFieldValue,
  FilterProps,
  FilterBuilderItem,
  SelectOption,
  SerializableSelectOption,
} from "./Filter.types"

export { isSelectOptionArray } from "./Filter.types"
