// liquid-ui re-exports base-ui's Toolbar. base-ui's Toolbar is an inline, non-
// floating bar (bg-panel + hairline, no shadow); glass material on an in-flow bar
// would blur the content behind it for no benefit (glass-on-everything slop), so it
// stays solid -- the same call made for Menubar's bar. The liquid theme re-skins it
// under [data-theme="liquid"]. Promote to a glass reproduction only if a floating
// toolbar surface is ever needed.
export * from "@workspace/base-ui/components/Toolbar"
