// base-ui's Provider re-exports ui's UIProvider (migration facade), so this
// build transitively compiles ui's Provider.tsx and its `import
// "nprogress/nprogress.css"`. Mirror ui's css.d.ts so that side-effect import
// resolves — TS 7 errors on unresolved side-effect imports (TS2882).
declare module "*.css"
