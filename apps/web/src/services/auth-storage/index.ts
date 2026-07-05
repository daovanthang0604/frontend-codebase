import { useSyncExternalStore } from "react"

let idToken: string | null = null
const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const authStorage = {
  setIdToken(token: string) {
    idToken = token
    emitChange()
  },

  getIdToken(): string | null {
    return idToken
  },

  clear() {
    idToken = null
    emitChange()
  },
}

export function useIdToken() {
  return useSyncExternalStore(
    subscribe,
    () => authStorage.getIdToken(),
    () => null
  )
}
