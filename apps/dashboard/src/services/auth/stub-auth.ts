import { authStorage, useIdToken } from "@/services/auth-storage"

// ─────────────────────────────────────────────────────────────────────────
// Placeholder auth boundary (STUB).
//
// The original app authenticated with AWS Cognito (via aws-amplify) to obtain
// a real ID token. That vendor integration was removed when this template was
// extracted, but the *shape* of an auth boundary is kept so the app stays
// runnable and the routing guards (SignedIn / SignedOut / _authenticated) work:
//
//   • signIn()  — drops a fake token into authStorage (and localStorage, so a
//                 demo session survives a page refresh).
//   • signOut() — clears it.
//   • useAuthSession() — reports authentication purely from token presence.
//
// To wire real auth: replace signIn/signOut with your provider's calls so they
// store a real access/ID token via `authStorage.setIdToken(...)`, and restore
// the token-refresh logic in `services/api.ts` (see the TODO there).
// ─────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "auth.idToken"
const FAKE_TOKEN = "dev-stub-token"

// Hydrate the in-memory token store from localStorage on first load so a
// signed-in demo session survives a refresh.
if (typeof window !== "undefined") {
  const persisted = window.localStorage.getItem(STORAGE_KEY)
  if (persisted) authStorage.setIdToken(persisted)
}

export interface AuthSession {
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuthSession(): AuthSession {
  const idToken = useIdToken()
  return { isAuthenticated: Boolean(idToken), isLoading: false }
}

/** Stub sign-in: mint a fake token. Replace with your real auth provider. */
export function signIn(): void {
  authStorage.setIdToken(FAKE_TOKEN)
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, FAKE_TOKEN)
  }
}

/** Stub sign-out: clear the token. */
export function signOut(): void {
  authStorage.clear()
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}
