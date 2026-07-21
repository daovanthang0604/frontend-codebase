// Side-effect barrel for the shared liquid glass layer (styles/glass.css): the
// kit-default --glass-* tokens + the .glass-overlay / .glass-scrim recipes. Any
// liquid-ui glass component imports this once —
//   import "@workspace/liquid-ui/lib/glass"
// — so the recipe CSS is present wherever the component is used. Vite dedupes
// repeat imports; tsc resolves the .css via css.d.ts. Pure side effect, no exports.
import "../styles/glass.css"
