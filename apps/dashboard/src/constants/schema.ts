import { z } from "zod"

export const DEFAULT_PAGINATION = {
  pageIndex: 0,
  pageSize: 10,
}
export const PAGINATION_SCHEMA = z.object({
  pageIndex: z.number(),
  pageSize: z.number(),
})

export const SORTING_SCHEMA = z.object({
  id: z.string(),
  desc: z.boolean(),
})
export const DEFAULT_SORTING = {
  id: "createdAt",
  desc: true,
}

export const FILTER_SCHEMA = z.object({
  value: z.string(),
  label: z.string(),
})
