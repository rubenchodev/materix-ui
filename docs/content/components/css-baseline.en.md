---
title: "CSS Baseline"
description: "Materix global baseline: Roboto typography, theme background and text colors, box-sizing, visible focus and a light or dark color-scheme."
group: "layout"
icon: "format_paint"
weight: 20
example: "css-baseline"
mui: "https://mui.com/material-ui/react-css-baseline/"
---

`CssBaseline` marks a root element with the `mtx-root` class, which enables the Materix style baseline: Roboto typography at 16px, the theme's background and text colors, `box-sizing: border-box` across the whole tree, an accessible focus ring and a `color-scheme` consistent with the light or dark theme. Use it only once, on your application's `<body>`, or on a container if Materix lives alongside other styles. It isn't a full reset: it doesn't remove heading or list margins, nor does it normalize forms.

## Basic usage

Add `data-mtx="css-baseline"` to the `<body>`. The component adds the `mtx-root` class; writing `class="mtx-root"` directly produces the same result without JavaScript.

```html
<body data-mtx="css-baseline">
  <!-- Application -->
</body>
```

{{< callout type="tip" title="Equivalence" >}}
`<body data-mtx="css-baseline">` and `<body class="mtx-root">` are equivalent. The class is preferable if you want to avoid a visual jump before the JavaScript loads.
{{< /callout >}}

## What it applies

All rules come from `src/styles/base.css` and are scoped to `.mtx-root` and its descendants. The reduced-motion rule only touches Materix elements (`mtx-*` classes).

| Selector | Properties | Effect |
|---|---|---|
| `.mtx-root`, `.mtx-root *`, `::before`, `::after` | `box-sizing: border-box` | Padding and border are included in the width. |
| `body.mtx-root` | `margin: 0` | Removes the margin of the `<body>`. A scoped container keeps its own margin. |
| `.mtx-root` | `font-family: var(--mtx-font-family)`; `font-weight: 400`; `font-size: 1rem`; `line-height: 1.5` | Base Roboto typography (equivalent to `body1`). |
| `.mtx-root` | `color: var(--mtx-color-text-primary)`; `background-color: var(--mtx-color-background-default)` | Text and background colors of the active theme. |
| `.mtx-root` | `color-scheme: light` | Light native controls, scrollbars and autofill. |
| `.mtx-root[data-mtx-theme='dark']`, `[data-mtx-theme='dark'] .mtx-root` | `color-scheme: dark` | Dark native controls when the theme is dark. |
| `.mtx-root` | `-webkit-font-smoothing: antialiased`; `-moz-osx-font-smoothing: grayscale` | Font smoothing on macOS. |
| `.mtx-root strong`, `.mtx-root b` | `font-weight: 700` | True bold with Roboto 700. |
| `.mtx-root :focus-visible` (except `input`, `textarea`, `select` and `.mtx-menu`) | `outline: var(--mtx-focus-ring-width) solid var(--mtx-focus-ring-color)`; `outline-offset: 2px` | Focus ring for keyboard only. |
| `.mtx-root .mtx-menu-item` | `outline: none !important` | Menu items indicate focus with their background. |
| `@media (prefers-reduced-motion: reduce)` → `[class*='mtx-']` | Animations and transitions set to `0.01ms` | Respects the reduced-motion preference on Materix elements only. |
| `@media print` → `.mtx-root` | `background-color: #fff`; `color-scheme: light` | Printing on a white background. |

## Light and dark theme

The theme is chosen with `data-mtx-theme` on `<html>` (or on any ancestor). The tokens change and `.mtx-root` adopts the matching background, text and `color-scheme`, so native controls (`<input type="date">`, scrollbars) also look dark.

```html
<html data-mtx-theme="dark">
  <body data-mtx="css-baseline">…</body>
</html>
```

{{< mtx-demo title="Native controls with the active theme" layout="column" >}}
<div data-mtx="css-baseline" class="mtx-p-2">
  <p>Text with the base typography and <strong>bold at 700</strong>.</p>
  <input type="date" aria-label="Native date">
  <select aria-label="Native select"><option>Native option</option></select>
</div>
{{< /mtx-demo >}}

Switch this page's theme to see how the native date picker and `<select>` follow the `color-scheme`.

## Scoped baseline

`CssBaseline` can be applied to a container instead of the `<body>`, for example when embedding a Materix widget in a page with other styles. Only that subtree receives the typography, colors and `box-sizing`.

{{< mtx-demo title="Baseline on a container" layout="block" >}}
<section data-mtx="css-baseline" class="mtx-p-2">
  <h3>Widget with baseline</h3>
  <p>This block uses Roboto, the <code>background-default</code> background and the Materix focus ring.</p>
  <button class="mtx-button mtx-button--contained" data-mtx="button">Action</button>
</section>
{{< /mtx-demo >}}

{{< callout type="info" title="Scope" >}}
A scoped container keeps its margin (only `body.mtx-root` gets `margin: 0`). The `prefers-reduced-motion` rule only reduces the animations of elements with `mtx-*` classes; the rest of the page keeps its own.
{{< /callout >}}

## Full BEM syntax

There's no inner structure: the class is enough.

```html
<body class="mtx-root">…</body>
<!-- or scoped -->
<div class="mtx-root">…</div>
```

## Programmatic usage

```javascript
// Apply to a container created at runtime
const baseline = Materix.init(document.getElementById('widget'), 'css-baseline');

// Direct instantiation and retrieval
new Materix.CssBaseline(document.body);
Materix.getInstance(document.body);

// Change the theme (tokens and color-scheme update automatically)
document.documentElement.setAttribute('data-mtx-theme', 'dark');
```

With ES modules:

```javascript
import { CssBaseline, init } from '@rubenchodev/materix-ui';
new CssBaseline(document.body);
```

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `css-baseline` | — | Adds the `mtx-root` class to the element. |
| `data-mtx-theme` | `light`, `dark` | `light` | On `<html>` or an ancestor (not a component attribute): selects the theme and the `color-scheme`. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-root` | Enables the baseline described in "What it applies" for the element and its descendants. |

### Methods

`CssBaseline` doesn't expose its own methods.

### Events

`CssBaseline` doesn't emit events.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-font-family` | Base font family. |
| `--mtx-color-text-primary` | Text color. |
| `--mtx-color-background-default` | Background color. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | `:focus-visible` ring. |

## Accessibility

- The focus ring only appears with the keyboard (`:focus-visible`) and has a 2px offset so it doesn't cover the content. Text fields are excluded because they already indicate focus with their border.
- `color-scheme` makes native controls and scrollbars respect the contrast of the dark theme.
- With `prefers-reduced-motion: reduce`, the animations and transitions of Materix elements are reduced to 0.01ms.
- The baseline doesn't change semantics: keep using real headings, lists and landmarks.
