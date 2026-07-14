"use client"

import type { PropsWithChildren } from "react"

import { FilterProvider } from "./Filter.store"
import type { FilterProps } from "./Filter.types"

export function Filter(props: PropsWithChildren<FilterProps>) {
  const { children, ...providerProps } = props
  return <FilterProvider {...providerProps}>{children}</FilterProvider>
}
