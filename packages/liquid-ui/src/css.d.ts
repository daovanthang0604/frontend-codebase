// Components co-locate a `.css` file (e.g. GlassPanel.css) and import it as a
// side effect. Declare the module so the package's `tsc` build resolves the
// import (TS 7 errors on unresolved side-effect imports, TS2882).
declare module "*.css"
