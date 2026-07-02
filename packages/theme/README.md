# @workspace/theme

Internal theme package for Workspace applications.

## Usage

```tsx
import { ThemeProvider } from "@workspace/theme"

function App() {
  return <ThemeProvider>{/* Your app */}</ThemeProvider>
}
```

## Exports

- `@workspace/theme` - Main export (ThemeProvider, ThemeStyle, etc.)
- `@workspace/theme/provider` - Provider-focused export for app setup
- `@workspace/theme/globals.css` - Global CSS styles (includes generated.css and semantic.css)
- `@workspace/theme/generated.css` - Generated CSS variables
- `@workspace/theme/semantic.css` - Semantic color tokens
- `@workspace/theme/postcss.config` - PostCSS configuration

## License

MIT
