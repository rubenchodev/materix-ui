---
title: "CSS Baseline"
description: "Materix global baseline: Roboto typography, theme background and text colors, box-sizing, visible focus and a light or dark color-scheme."
group: "layout"
icon: "format_paint"
weight: 20
example: "css-baseline"
import: "CssBaseline, ScopedCssBaseline"
mui: "https://mui.com/material-ui/react-css-baseline/"
---

`CssBaseline` adds the `mtx-root` class to `<body>`, which enables the Materix style baseline: Roboto typography at 16px, the theme's background and text colors, `box-sizing: border-box` across the whole tree, an accessible focus ring and a `color-scheme` consistent with the light or dark theme. It also imports `@rubenchodev/materix-ui/base.css` (tokens + baseline). Render it once at the top of your app; use `ScopedCssBaseline` instead when Materix lives alongside other styles. It isn't a full reset: it doesn't remove heading or list margins, nor does it normalize forms.

```tsx
import { CssBaseline, ScopedCssBaseline } from '@rubenchodev/materix-react';
// or only this component
import { CssBaseline } from '@rubenchodev/materix-react/components/css-baseline';
```

## Basic usage

Render `<CssBaseline />` once, next to your app. It adds `mtx-root` to `<body>` in an effect (SSR-safe) and removes it on unmount, unless the class was already there. Several instances are reference-counted: the class stays until the last one unmounts. Children, if any, are rendered as is.

```tsx
export function App() {
  return (
    <>
      <CssBaseline />
      <Main />
    </>
  );
}
```

{{< react-demo id="css-baseline/01-basic" layout="block" >}}

{{< callout type="tip" title="Equivalence" >}}
`<CssBaseline />`, `<body data-mtx="css-baseline">` and `<body class="mtx-root">` are equivalent. Writing the class in your HTML template (or using `MaterixProvider`, which renders a `.mtx-root` container) avoids a visual jump before React hydrates.
{{< /callout >}}

## With and without baseline

On the left, a block with the browser defaults; on the right, the same content inside `ScopedCssBaseline`: Roboto 16px, 1.5 line height, theme colors and bold at 700.

{{< react-demo id="css-baseline/02-comparison" layout="block" >}}

## What it applies

All rules come from `base.css` and are scoped to `.mtx-root` and its descendants. The reduced-motion rule only touches Materix elements (`mtx-*` classes).

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

## Box sizing

Inside `mtx-root` everything uses `box-sizing: border-box`: a box with `width: 100%`, 16px of padding and a 4px border does not overflow its container.

{{< react-demo id="css-baseline/03-box-sizing" layout="block" >}}

## Visible focus

Use <kbd>Tab</kbd>: buttons, links and focusable elements show the `--mtx-focus-ring-color` ring only when navigating with the keyboard. Text fields are excluded because their border already shows focus.

{{< react-demo "css-baseline/04-focus" >}}

## Light and dark theme

The theme is chosen with `data-mtx-theme` on `<html>` (or on any ancestor), usually through `ThemeProvider` / `MaterixProvider` (see [Theming]({{< relref "/guide/theming" >}})). The tokens change and `.mtx-root` adopts the matching background, text and `color-scheme`, so native controls (`<input type="date">`, scrollbars) also look dark. Switch this page's theme to see it.

{{< react-demo id="css-baseline/05-color-scheme" layout="block" >}}

## Scoped baseline

`ScopedCssBaseline` renders a `.mtx-root` container (a `div`, or the element given in `component`) instead of touching `<body>`, for example when embedding a Materix widget in a page with other styles. Only that subtree receives the typography, colors and `box-sizing`.

{{< react-demo id="css-baseline/06-scope" layout="block" >}}

{{< callout type="info" title="Scope" >}}
A scoped container keeps its margin (only `body.mtx-root` gets `margin: 0`). The `prefers-reduced-motion` rule only reduces the animations of elements with `mtx-*` classes; the rest of the page keeps its own.
{{< /callout >}}

## Apply at runtime

In vanilla, `Materix.init(el, 'css-baseline')` marks a container created at runtime. In React, render `ScopedCssBaseline` conditionally.

{{< react-demo id="css-baseline/07-dynamic" layout="block" >}}

## Full BEM syntax

There's no inner structure: the class is enough.

{{< react-demo id="css-baseline/08-bem" layout="block" >}}

## API reference

### CssBaseline props

| Prop | Type | Default | Description |
|---|---|---|---|
| `target` | `'body' \| 'html'` | `'body'` | Global element that receives `mtx-root`. |
| `children` | `ReactNode` | — | Rendered as is (optional). |

`CssBaseline` renders no element of its own, so it takes no `ref` or `className`.

### ScopedCssBaseline props

| Prop | Type | Default | Description |
|---|---|---|---|
| `component` | `ElementType` | `'div'` | Root element or component (`section`, `main`…). |
| `className` | `string` | — | Merged with `mtx-root`. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

Any other prop is forwarded to the root element.

### Equivalence with vanilla

| Vanilla | React |
|---|---|
| `<body data-mtx="css-baseline">` | `<CssBaseline />` |
| `<div data-mtx="css-baseline">` | `<ScopedCssBaseline>` |
| `<section data-mtx="css-baseline">` | `<ScopedCssBaseline component="section">` |
| `Materix.init(el, 'css-baseline')` | Render `ScopedCssBaseline` conditionally. |
| `data-mtx-theme` on an ancestor | Same attribute, usually managed by `ThemeProvider`. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-root` | Enables the baseline described in "What it applies" for the element and its descendants. |

### Callbacks

`CssBaseline` and `ScopedCssBaseline` have no events.

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
