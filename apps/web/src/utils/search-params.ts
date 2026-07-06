import { LISTING_SEARCH_MAX_LENGTH } from "@/constants/common"
import type { TableState } from "@tanstack/react-table"
import { DEFAULT_PAGE_SIZE } from "@workspace/base-ui/components/DataTable"
import {
  isSelectOptionArray,
  type FilterValue,
} from "@workspace/base-ui/components/Filter"
import { isEmpty } from "lodash"
import z from "zod"

export const BaseParamsSchema = z.object({
  orderBy: z.string().optional(),
  isOrderByDesc: z.boolean().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().max(LISTING_SEARCH_MAX_LENGTH).optional(),
})
export type BaseParamsType = z.infer<typeof BaseParamsSchema>
export const BASE_PARAMS_DEFAULT: BaseParamsType = {
  orderBy: "id",
  isOrderByDesc: true,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: "",
}
export function fromTableState(state: TableState): BaseParamsType {
  return {
    orderBy: state.sorting?.[0]?.id,
    isOrderByDesc: state.sorting?.[0]?.desc,
    page: state.pagination.pageIndex + 1,
    pageSize: state.pagination.pageSize,
    search: state.globalFilter,
  }
}
export function toTableState(
  params: BaseParamsType
): Partial<TableState> | undefined {
  if (isEmpty(params)) {
    return undefined
  }
  return {
    sorting: params.orderBy
      ? [{ id: params.orderBy, desc: Boolean(params.isOrderByDesc) }]
      : [],
    pagination: {
      pageIndex: params?.page ? params.page - 1 : 0,
      pageSize: params?.pageSize ?? DEFAULT_PAGE_SIZE,
    },
    globalFilter: params.search,
  }
}
export interface FilterParamMapping {
  filterField: string
  paramKey: string
  type: "number" | "string"
  options?: {
    label: string
    value: string | number
  }[]
}
export function paramsToFilterValue(
  params: Record<string, unknown>,
  mappings: FilterParamMapping[]
): FilterValue {
  const result: FilterValue = {}
  for (const mapping of mappings) {
    const raw = params[mapping.paramKey]
    if (!Array.isArray(raw) || raw.length === 0) continue
    result[mapping.filterField] = raw.map((v) => {
      const value = mapping.type === "number" ? Number(v) : v
      const found = mapping.options?.find((o) => o.value === value)
      return { value, label: found?.label ?? String(v) }
    })
  }
  return result
}
export function filterValueToParams(
  filters: FilterValue,
  mappings: FilterParamMapping[]
): Record<string, (string | number)[] | undefined> {
  const result: Record<string, (string | number)[] | undefined> = {}
  for (const mapping of mappings) {
    const value = filters[mapping.filterField]
    if (!isSelectOptionArray(value)) {
      result[mapping.paramKey] = undefined
      continue
    }
    const converted = value.map((opt) =>
      mapping.type === "number" ? Number(opt.value) : String(opt.value)
    )
    result[mapping.paramKey] = converted.length > 0 ? converted : undefined
  }
  return result
}
