"use client"

import {
  Autocomplete as AriaAutocomplete,
  ListLayout as AriaListLayout,
  useFilter as ariaUseFilter,
  Virtualizer as AriaVirtualizer,
  type AutocompleteProps as AriaAutocompleteProps,
  type VirtualizerProps as AriaVirtualizerProps,
} from "react-aria-components"

const Virtualizer = AriaVirtualizer

const ListLayout = AriaListLayout

const Autocomplete = AriaAutocomplete

const useFilter = ariaUseFilter

export { Autocomplete, ListLayout, useFilter, Virtualizer }
export type {
  AriaAutocompleteProps as AutocompleteProps,
  AriaVirtualizerProps as VirtualizerProps,
}
