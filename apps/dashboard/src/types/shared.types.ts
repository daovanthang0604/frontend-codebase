import { AxiosError } from "axios"

export type LiteralUnion<T extends string> = T | (string & {})

/**
 * AG Grid-aligned filter operation — must match
 * `AgGridFilterOperation` on the backend. Lives in shared types so every
 * domain can consume it without depending on another domain's service.
 */
export type AgGridFilterOperation =
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "EQUALS"
  | "NOT_EQUAL"
  | "BEGINS_WITH"
  | "ENDS_WITH"
  | "BLANK"
  | "NOT_BLANK"

export interface AgGridFilter {
  operation: AgGridFilterOperation
  name: string
  values?: (string | number | boolean)[]
}

export interface SuccessResBody<TData = unknown> {
  data: TData
}

export interface ErrorResData<
  TErrorCode = string,
  TMessage = string,
  TDetails = Record<string, never>,
> {
  statusCode: number
  timestamp: string
  path: string
  errorService?: string
  errorCode: TErrorCode
  message: TMessage
  details?: TDetails
}

export type ErrorResBody<
  TMessage = string,
  TErrorCode = string,
  TDetails = Record<string, never>,
> = AxiosError<ErrorResData<TMessage, TErrorCode, TDetails>>
