# Materix UI

**Material UI (MUI) components for any HTML page, with plain CSS and vanilla JavaScript.**

Materix UI implements the look and behavior of [MUI](https://mui.com/) (Material Design 2) without a
framework: you write regular HTML with `data-mtx` attributes and the components build and
initialize themselves, Bootstrap-style. It works the same in static pages, PHP, Laravel, Django,
Rails, ASP.NET, WordPress or any SPA.

- 45+ components: Button, TextField, Select, Autocomplete, DateTimePicker, Dialog, Drawer, Table,
  Tabs, Menu, Snackbar, Tooltip, Stepper, Slider and more.
- Single-element syntax: `<input data-mtx="text-field" data-label="Email">` generates the label,
  outline and helper text.
- Accessible by design (WAI-ARIA, keyboard, focus management), light/dark themes with design tokens,
  `prefers-reduced-motion`, English/Spanish built-in strings.
- No runtime dependencies, no Web Components, no Shadow DOM. TypeScript types included.

## Installation

### npm

```bash
npm install @rubenchodev/materix-ui
```

```js
import '@rubenchodev/materix-ui/materix.min.css';
import Materix from '@rubenchodev/materix-ui';
```

### CDN

Pin the exact version:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rubenchodev/materix-ui@0.3.1/dist/materix.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rubenchodev/materix-ui@0.3.1/dist/materix.umd.js"></script>
```

unpkg works with the same paths: `https://unpkg.com/@rubenchodev/materix-ui@0.3.1/dist/materix.umd.js`.

### Fonts

Materix uses Roboto and Material Icons; load them in your `<head>`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

## Quick start

### Declarative

Add `class="mtx-root"` to `<body>` and write the components. They are initialized when the DOM is
ready; no JavaScript is required.

```html
<body class="mtx-root">
  <input data-mtx="text-field" data-label="Email address" data-start-icon="email" type="email">
  <select data-mtx="select" data-label="Country">
    <option value="co">Colombia</option>
    <option value="mx">Mexico</option>
  </select>
  <button data-mtx="button" class="mtx-button mtx-button--contained">Subscribe</button>

  <script src="https://cdn.jsdelivr.net/npm/@rubenchodev/materix-ui@0.3.1/dist/materix.umd.js"></script>
</body>
```

### Programmatic

```js
const button = new Materix.Button(document.querySelector('#save'));
button.setLoading(true);

const dialog = Materix.getInstance(document.getElementById('confirm'));
dialog.open();

Materix.snackbar.show({ message: 'Saved', action: 'Undo', onAction: () => undo() });

// Content added later (SPA, AJAX)
Materix.initAll(container);
const observer = Materix.watch(document.body, { destroyOnRemove: true });
```

Events follow the `mtx:{component}:{action}` convention:

```js
tabs.addEventListener('mtx:tabs:change', (event) => console.log(event.detail.tab));
```

## Per-component imports

With a bundler (Vite, webpack, Rollup, esbuild) you can import only the components you use. Each
module registers itself, auto-initializes its `[data-mtx]` elements and imports its own CSS plus the
CSS of the components it uses inside. The shared core and each stylesheet are bundled once.

```js
import '@rubenchodev/materix-ui/base.css';                  // design tokens + base styles (first)
import '@rubenchodev/materix-ui/components/autocomplete';   // JS + CSS (autocomplete, text-field, chip…)
import { Button } from '@rubenchodev/materix-ui/components/button';
import { getInstance, theme } from '@rubenchodev/materix-ui/core';
import '@rubenchodev/materix-ui/utilities.css';             // optional, last
```

A page that uses only Button ships about 28 kB of JavaScript (9 kB gzip) and 30 kB of CSS
(5 kB gzip), compared with 414 kB / 373 kB for the full bundle.

The modules import `.css` files, so they need a bundler that handles CSS imports. For a `<link>`
without JavaScript, `components/{name}.bundle.css` contains a component plus its dependencies.
Do not mix the full bundle (`@rubenchodev/materix-ui`) with `@rubenchodev/materix-ui/components/*` on the same
page: each one has its own registry.

| Entry point | Contents |
|---|---|
| `@rubenchodev/materix-ui` | Full ES bundle (`dist/materix.es.js`); `require()` gets `dist/materix.umd.cjs` |
| `@rubenchodev/materix-ui/materix.min.css` | Every style (tokens, base, components, utilities) |
| `@rubenchodev/materix-ui/core` | Registry, lifecycle, `ComponentBase`, `emit`, theme, i18n, positioning |
| `@rubenchodev/materix-ui/components/{name}` | One component (ES module, imports its CSS) |
| `@rubenchodev/materix-ui/components/{name}.css` | One component's own styles (`.bundle.css`: with dependencies) |
| `@rubenchodev/materix-ui/base.css` / `utilities.css` | Tokens + base styles / utility classes |
| `@rubenchodev/materix-ui/dist/*` | Any built file, e.g. `dist/materix.umd.js` |

## TypeScript

Types are included (`types/index.d.ts`): component classes, the core API with generics and typed
`mtx:*` events.

```ts
import { getInstance, init, type Dialog } from '@rubenchodev/materix-ui';

const dialog = getInstance<Dialog>(document.getElementById('confirm'));
const select = init(element, 'select');            // typed as Select | null
element.addEventListener('mtx:table:selection-change', (e) => e.detail.selected);
```

For the UMD global, add `/// <reference types="@rubenchodev/materix-ui" />`.

## Theming

Every visual value is a CSS custom property (`--mtx-color-primary`, `--mtx-shape-radius`…).
Switch between light and dark with the theme API or declaratively:

```html
<html data-mtx-theme="dark" data-mtx-theme-persist>
  …
  <button data-mtx-theme-toggle aria-label="Toggle theme"></button>
```

```js
Materix.theme.set('system');   // 'light' | 'dark' | 'system'
document.addEventListener('mtx:theme:change', (e) => console.log(e.detail.theme));
```

## Documentation

- **Documentation site (English and Spanish), with live demos and templates:
  [qualitycode.dev/materix-ui](https://qualitycode.dev/materix-ui/vainilla/)**
  ([español](https://qualitycode.dev/materix-ui/vainilla/es/)).
- Sources in the repository: [docs](https://github.com/rubenchodev/materix-ui/tree/vainilla/docs),
  [examples](https://github.com/rubenchodev/materix-ui/tree/vainilla/examples),
  [templates](https://github.com/rubenchodev/materix-ui/tree/vainilla/templates).
- [CHANGELOG](https://github.com/rubenchodev/materix-ui/blob/vainilla/CHANGELOG.md) and [migration guide from 0.1](https://github.com/rubenchodev/materix-ui/blob/vainilla/MIGRATION.md).

## Supported browsers

Materix UI uses modern CSS (`:has()`, `color-mix()`, dynamic viewport units `dvh`) and ES2020.

| Browser | Minimum version |
|---|---|
| Chrome / Edge | 111 |
| Firefox | 121 |
| Safari (macOS and iOS) | 16.2 |

Internet Explorer and legacy Edge are not supported.

## License

[MIT](https://github.com/rubenchodev/materix-ui/blob/vainilla/LICENSE) © 2026 Rubén Sánchez LYD
