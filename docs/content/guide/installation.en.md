---
title: "Installation"
description: "Install Materix UI with npm, a CDN or plain files, import only the components you use, use the TypeScript types, load Roboto and Material Icons, and start from a minimal HTML template."
weight: 10
icon: "download"
---

Materix UI ships as a **full bundle** (one CSS and one JS file) and as **per-component ES modules** for bundlers. It has no runtime dependencies. Choose npm (with a bundler), a CDN or plain files (`<link>` + `<script>`).

## Distribution files

`npm run build` generates `dist/`:

| File | Format | Use it when |
|---|---|---|
| `dist/materix.min.css` | Single CSS file with tokens, base styles, every component and the utilities | You use the full bundle. |
| `dist/materix.es.js` | ES module (`import`) with every component | You work with Vite, webpack, Rollup or `<script type="module">`. |
| `dist/materix.umd.js` | UMD: exposes the `window.Materix` global | You load the library with a classic `<script>`. |
| `dist/materix.umd.cjs` | Same UMD as CommonJS | `require('@rubenchodev/materix-ui')` (Node, Jest). |
| `dist/components/{name}.js` | One component (ES module); it imports the CSS it needs | You import only what you use. |
| `dist/components/{name}.css` / `.bundle.css` | The component's own styles / with its dependencies | Styles without the JS module. |
| `dist/core.js` | Registry, lifecycle, `ComponentBase`, `emit`, theme, i18n, positioning | Per-component usage. |
| `dist/base.css` / `dist/utilities.css` | Tokens + base styles / utility classes | Per-component usage. |
| `dist/chunks/*` | Shared code of the per-component modules | Never imported directly. |

The package also ships the TypeScript declarations in `types/`.

## With npm

```bash
npm install @rubenchodev/materix-ui
```

Import the JS and the CSS in your application's entry point:

```javascript
import Materix from '@rubenchodev/materix-ui';
import '@rubenchodev/materix-ui/materix.min.css';
```

`@rubenchodev/materix-ui` resolves to `dist/materix.es.js` (with `import`) or to `dist/materix.umd.cjs` (with `require`). `@rubenchodev/materix-ui/dist/materix.min.css` keeps working as well. You can also import by name:

```javascript
import { initAll, getInstance, Dialog, setLocale } from '@rubenchodev/materix-ui';
```

{{< callout type="info" title="Importing already initializes" >}}
Importing the library registers every component and initializes the `[data-mtx]` elements present in the document. You don't need to call `initAll()` except for content you add later. See [Initialization]({{< relref "/guide/initialization" >}}).
{{< /callout >}}

## Per-component imports

With a bundler you can ship only the components you use. Each `@rubenchodev/materix-ui/components/{name}` module registers its component, schedules an automatic `initAll()` (when the DOM is ready) and **imports its own CSS plus the CSS of the components it uses inside**. Importing the module is enough; you only add `base.css` (tokens and base styles) once.

```javascript
import '@rubenchodev/materix-ui/base.css';                    // tokens + base styles: always first
import '@rubenchodev/materix-ui/components/autocomplete';     // JS + CSS of autocomplete, text-field, chip…
import { Button } from '@rubenchodev/materix-ui/components/button';
import { getInstance, theme, watch } from '@rubenchodev/materix-ui/core';
import '@rubenchodev/materix-ui/utilities.css';               // optional: always last
```

`{name}` is the component folder: `button`, `text-field`, `date-time-picker`, `toggle-button`, `app-bar`… The shared JavaScript core and every CSS file are bundled **once**, even if several components import them (the bundler deduplicates each `components/{name}.css` module). For reference, a Vite app that uses only Button weighs about 28 kB of JS (9 kB gzip) and 30 kB of CSS (5 kB gzip); one that uses only Autocomplete, 81 kB of JS (22 kB gzip) and 72 kB of CSS (10 kB gzip). The full bundle is 414 kB / 373 kB.

The modules import `.css` files, so they need a bundler that handles CSS imports (Vite, webpack with `css-loader`, Parcel, Rollup with a CSS plugin…). Without a bundler, use the full bundle.

Available stylesheets per component:

| File | Contents | Use it when |
|---|---|---|
| `@rubenchodev/materix-ui/components/{name}.css` | Only that component's styles (no dependencies). | Fine control, or styles without the JavaScript. This is the file the module imports. |
| `@rubenchodev/materix-ui/components/{name}.bundle.css` | The component plus the components it uses inside, in dependency order (without `base.css`). | A `<link>` or a CSS-only import. Do not combine it with the JS module or with another `.bundle.css` that shares dependencies: the shared rules would be loaded twice. |

For reference, these are the stylesheets each module imports in addition to its own (generated from the import graph of `src/components` plus the markup each component renders):

| Module | Also imports the CSS of |
|---|---|
| `app-bar` | `icon-button` |
| `autocomplete` | `form-helper-text`, `icon-button`, `text-field`, `chip`, `progress` |
| `breadcrumbs` | `link` |
| `button-group` | `progress`, `button` |
| `button` | `progress` |
| `card` | `avatar`, `icon-button` |
| `checkbox` | `form-helper-text` |
| `date-time-picker` | `form-helper-text`, `icon-button`, `text-field`, `progress`, `button` |
| `drawer` | `avatar`, `icon-button` |
| `radio` | `form-helper-text`, `checkbox` |
| `speed-dial` | `tooltip`, `fab` |
| `stack` | `divider` |
| `stepper` | `progress`, `button` |
| `switch` | `form-helper-text`, `checkbox` |
| `text-field` | `form-helper-text`, `icon-button` |

{{< callout type="warning" title="Do not mix both builds" >}}
Use either the full bundle (`@rubenchodev/materix-ui`) or the per-component modules (`@rubenchodev/materix-ui/components/*` + `@rubenchodev/materix-ui/core`) in a page, not both: each one has its own registry, so `getInstance()` from one does not see the instances of the other.
{{< /callout >}}

## TypeScript

The declarations ship with the package (no `@types` package needed): every component class with its public methods, the core API with generics and the `mtx:*` events typed as `CustomEvent`.

```typescript
import { getInstance, init, type Dialog } from '@rubenchodev/materix-ui';

const dialog = getInstance<Dialog>(document.getElementById('confirm'));
dialog?.open();

const select = init(element, 'select');           // Select | null
element.addEventListener('mtx:tabs:change', (event) => {
  console.log(event.detail.tab);                  // HTMLElement
});
```

Per-component modules have their own types (`@rubenchodev/materix-ui/components/button`, `@rubenchodev/materix-ui/core`). For the UMD global in plain scripts, add `/// <reference types="@rubenchodev/materix-ui" />`.

## From a CDN

Any CDN that serves npm packages works with the same paths. Always pin the exact version:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rubenchodev/materix-ui@0.3.1/dist/materix.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rubenchodev/materix-ui@0.3.1/dist/materix.umd.js"></script>
```

With unpkg: `https://unpkg.com/@rubenchodev/materix-ui@0.3.1/dist/materix.umd.js`. The per-component JavaScript modules import CSS files, which browsers cannot load as modules: from a CDN, use the full bundle (the `components/{name}.bundle.css` files can be linked if you only need styles).

## With plain files (no bundler)

Copy `dist/materix.min.css` and `dist/materix.umd.js` into your project and link them:

```html
<link rel="stylesheet" href="/assets/materix/materix.min.css">
<!-- ... content ... -->
<script src="/assets/materix/materix.umd.js"></script>
```

The script exposes the `Materix` global with the entire public API:

```javascript
Materix.initAll();
const dialog = Materix.getInstance(document.getElementById('confirm'));
```

{{< callout type="warning" title="Script loading order" >}}
Place `materix.umd.js` **at the end of the `<body>`** (or in the `<head>` with `defer`). Your own scripts that use `Materix` must come **after** it and, if they run in the `<head>`, wrap their logic in `document.addEventListener('DOMContentLoaded', ...)`. A script that calls `Materix.getInstance()` before the library loads gets `Materix is not defined`, and one that runs before the DOM is ready gets `undefined` as the instance.
{{< /callout >}}

## Fonts: Roboto and Material Icons

The typeface (`--mtx-font-family`) is **Roboto** and icons use the **Material Icons** font (`.material-icons` class). The library does not bundle them: load them yourself in the `<head>`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

Weights 300, 400, 500 and 700 cover the whole type scale (`h1`/`h2` headings use 300, buttons and `subtitle2` use 500, `<strong>` uses 700).

Without Roboto, components still work with the `Helvetica, Arial, sans-serif` fallback. Without Material Icons, attributes such as `data-start-icon="email"` display the icon name as text.

## Minimal HTML template

Copy it, save it as `index.html` and open it in your browser:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My app with Materix UI</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="dist/materix.min.css">
</head>
<body class="mtx-root">
  <main style="max-width: 480px; margin: 48px auto; display: grid; gap: 16px;">
    <input data-mtx="text-field" data-label="Email address" data-variant="outlined" data-start-icon="email" type="email">
    <button class="mtx-button mtx-button--contained" data-mtx="button">Subscribe</button>
  </main>

  <script src="dist/materix.umd.js"></script>
</body>
</html>
```

The `mtx-root` class on `<body>` applies the library's base styles: `box-sizing: border-box`, font, text color, the theme's background color, `color-scheme` and the visible focus ring. Without it, components still render, but the rest of the page does not inherit the theme.

{{< callout type="tip" >}}
`<html lang="en">` also determines the language of the components' built-in strings (calendar, Select search box, pagination). See [Internationalization]({{< relref "/guide/i18n" >}}).
{{< /callout >}}

## Next step

Read [Quick start]({{< relref "/guide/quick-start" >}}) to understand the single-element syntax and the naming conventions.
