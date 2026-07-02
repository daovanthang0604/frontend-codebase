import { isAxiosError } from "axios"

// The api layer throws raw AxiosErrors (only a 401-refresh interceptor is
// installed — see services/api.ts). `error.message` on an AxiosError is the
// generic "Request failed with status code N"; the human-readable reason from
// the backend lives at `error.response.data.message`. These helpers pull the
// right value out without reaching for `any`.

export function getApiErrorMessage(error: unknown): string | undefined {
  if (isAxiosError(error)) {
    const data = error.response?.data
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message
      if (typeof message === "string" && message.trim() !== "") return message
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return undefined
}

export function getApiErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}
