import axios, { type InternalAxiosRequestConfig } from "axios"

import { authStorage } from "./auth-storage"

const baseURL = import.meta.env.VITE_BASE_API

const api = axios.create({
  baseURL,
})

/**
 * Standard API response envelope: `{ data }`. Type an
 * `api.get<ApiEnvelope<T>>(...)` call with it and read the payload at
 * `response.data.data`.
 */
export type ApiEnvelope<T> = { data: T }

// Attach the bearer token (if any) to every request. In this template the
// token is supplied by the stub auth boundary (services/auth); wire your real
// provider by having it call `authStorage.setIdToken(...)`.
api.interceptors.request.use((config) => {
  const idToken = authStorage.getIdToken()

  config.headers = config.headers ?? {}
  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`
  }

  return config
})

// 401-refresh seam. The original app refreshed the token via its auth vendor
// here; with the vendor removed, `refreshIdToken` is a stub that returns null,
// so a 401 simply clears the session. Re-implement it against your provider to
// restore silent token refresh + request replay.
async function refreshIdToken(): Promise<string | null> {
  // TODO: call your auth provider's refresh and return a fresh token.
  return null
}

api.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config as
    | (InternalAxiosRequestConfig & { _retry?: boolean })
    | undefined

  if (
    !originalRequest ||
    originalRequest._retry ||
    error.response?.status !== 401
  ) {
    return Promise.reject(error)
  }

  const idToken = await refreshIdToken()

  if (!idToken) {
    authStorage.clear()
    return Promise.reject(error)
  }

  authStorage.setIdToken(idToken)
  originalRequest._retry = true
  originalRequest.headers = originalRequest.headers ?? {}
  originalRequest.headers.Authorization = `Bearer ${idToken}`

  return api(originalRequest)
})

export { api }
