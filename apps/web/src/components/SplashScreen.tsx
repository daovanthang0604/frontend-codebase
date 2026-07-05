import { Logo } from "./Logo"

export function SplashScreen() {
  return (
    <div
      className={
        "fixed z-9999 flex h-screen w-screen items-center justify-center bg-white"
      }
    >
      <Logo />
    </div>
  )
}
