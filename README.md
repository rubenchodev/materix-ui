# Materix UI · React

**Material UI (MUI) components for React with the exact look of [Materix UI](https://qualitycode.dev/materix-ui/vainilla/).**

Native React components written in TypeScript that reuse the CSS and design tokens of the vanilla package
[`@rubenchodev/materix-ui`](https://www.npmjs.com/package/@rubenchodev/materix-ui), so both versions look the same.

- 47 components: Button, TextField, Select, Autocomplete, DateTimePicker, Dialog, Drawer, Table, Tabs, Menu,
  Snackbar, Tooltip, Stepper, Slider and more.
- Controlled and uncontrolled APIs in the MUI style (`value`/`defaultValue`/`onChange`, `open`/`onClose`…).
- Accessible by design (WAI-ARIA, keyboard, focus management), light/dark themes, English/Spanish strings.
- SSR-safe (Next.js App Router ready with `'use client'`), tree-shakeable per-component entries, typed props.

## Installation

```bash
npm install @rubenchodev/materix-react
```

`react` and `react-dom` (>= 18) are peer dependencies. Load the base styles once, plus Roboto and Material Icons:

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Button, TextField, ThemeProvider } from '@rubenchodev/materix-react';

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <div className="mtx-root">
        <TextField label="Email" type="email" />
        <Button variant="contained">Save</Button>
      </div>
    </ThemeProvider>
  );
}
```

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

Each component imports its own stylesheet. Per-component imports are also available:
`import { Dialog } from '@rubenchodev/materix-react/components/dialog';`

## Documentation

- **[qualitycode.dev/materix-ui/react-js](https://qualitycode.dev/materix-ui/react-js/)** (English) ·
  [español](https://qualitycode.dev/materix-ui/react-js/es/): live demos, props, accessibility and the mapping
  from the vanilla `data-*` attributes to React props.
- Vanilla version: [qualitycode.dev/materix-ui/vainilla](https://qualitycode.dev/materix-ui/vainilla/).

## Development

```bash
npm install
npm run dev            # examples/ with every demo (http://localhost:5173/examples/index.html)
npm test               # vitest: components, DOM parity with vanilla, SSR + hydration
npm run test:e2e       # Playwright: smoke, axe (WCAG A/AA) and keyboard interactions
npm run build          # dist/ (ESM + .d.ts, one entry per component)
npm run docs:dev       # Hugo docs with React islands
```

Project rules for contributors and AI agents are in [AGENTS.md](./AGENTS.md).

## License

MIT
