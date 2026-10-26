---
title: "Theming"
description: "Light, dark and system themes with ThemeProvider and useTheme, theme without flashes, brand themes by overriding --mtx-* tokens, and the full token reference."
weight: 40
icon: "palette"
---

Every aspect of Materix's look comes from **`--mtx-*` CSS variables** (design tokens) shipped in `@rubenchodev/materix-ui/base.css`. Components never use hard-coded colors: changing a token changes every component that consumes it. The React components use **exactly the same CSS** as the vanilla library, so a theme written for one works for the other.

## Light and dark theme

The light theme is the default. The dark theme is enabled by the `data-mtx-theme="dark"` attribute on `<html>`; the CSS does the rest, without re-rendering React:

```html
<html lang="en" data-mtx-theme="dark">
```

The `.mtx-root` class (rendered by `MaterixProvider`) paints `--mtx-color-background-default`, `--mtx-color-text-primary` and the matching `color-scheme` (dark scrollbars and native controls).

## ThemeProvider and useTheme

`ThemeProvider` manages that attribute for you. It supports three modes: `light`, `dark` and `system` (follows `prefers-color-scheme`, also when the OS changes it). `MaterixProvider` includes it, so you rarely need to render it directly.

```tsx
import { ThemeProvider, useTheme, Button } from '@rubenchodev/materix-react';

function ThemeSwitch() {
  const { mode, resolvedMode, setMode, toggle } = useTheme();
  return (
    <>
      <Button onClick={toggle}>{resolvedMode === 'dark' ? 'Light theme' : 'Dark theme'}</Button>
      <Button variant={mode === 'system' ? 'contained' : 'text'} onClick={() => setMode('system')}>
        System
      </Button>
    </>
  );
}

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <ThemeSwitch />
    </ThemeProvider>
  );
}
```

### ThemeProvider props

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultMode` | `'light' \| 'dark' \| 'system'` | `'light'` | Initial mode (uncontrolled). |
| `mode` | `'light' \| 'dark' \| 'system'` | — | Controlled mode; pair it with `onModeChange`. |
| `onModeChange` | `(mode, resolvedMode) => void` | — | Called whenever the mode changes. |
| `storageKey` | `string \| null \| false` | `'mtx-theme'` | `localStorage` key that persists the mode; `false` disables persistence. |
| `query` | `string \| false` | `'theme'` | URL parameter that forces a mode (`?theme=dark`); `false` disables it. |
| `target` | `'document' \| 'none'` | `'document'` | `document` writes `data-mtx-theme` on `<html>`; `none` writes nothing (scoped themes). |

Initial precedence (uncontrolled): `?theme=` › stored value › `defaultMode` › `light`.

### useTheme

`useTheme()` returns `{ mode, resolvedMode, setMode, toggle, target }`. `resolvedMode` is always `light` or `dark` (the effective theme when `mode` is `system`). `setMode(mode, { persist: false })` applies a mode without storing it. Outside a provider it returns `light` and no-op actions.

### Avoiding the flash on load

With server rendering, the stored theme is only known in the browser. Add the inline script returned by `getThemeScript()` (or the `<ThemeScript />` component) to `<head>` so `data-mtx-theme` is set before the first paint. See [Usage with Next.js]({{< relref "/guide/usage-with-nextjs" >}}).

## Scoped theme

`MaterixProvider` with `target="none"` does not touch `<html>`: it writes `data-mtx-theme` on its own `.mtx-root` container, so only that subtree changes theme.

```tsx
<MaterixProvider mode="dark" target="none" className="preview">
  <Button variant="contained">Dark only here</Button>
</MaterixProvider>
```

Floating layers rendered through portals under `<body>` (menus, dialogs, snackbars) take the theme of `<html>`, not the container's. For a complete theme with no surprises, keep the default `target="document"`.

## Brand theme

Override the tokens in your own stylesheet, **loaded after** `base.css`. Always declare both blocks, light and dark:

```css
/* brand.css — load after base.css */
:root {
  --mtx-color-primary: #00695c;
  --mtx-color-primary-light: #e0f2f1;
  --mtx-color-primary-dark: #004d40;
  --mtx-color-primary-contrast: #ffffff;

  --mtx-color-secondary: #ef6c00;
  --mtx-color-secondary-light: #ffa040;
  --mtx-color-secondary-dark: #b53d00;
  --mtx-color-secondary-contrast: #ffffff;

  --mtx-shape-radius: 8px;
}

[data-mtx-theme='dark'] {
  --mtx-color-primary: #4db6ac;
  --mtx-color-primary-light: #b2dfdb;
  --mtx-color-primary-dark: #00897b;
  --mtx-color-primary-contrast: rgba(0, 0, 0, 0.87);

  --mtx-color-secondary: #ffb74d;
  --mtx-color-secondary-light: #ffe0b2;
  --mtx-color-secondary-dark: #f57c00;
  --mtx-color-secondary-contrast: rgba(0, 0, 0, 0.87);
}
```

{{< callout type="warning" title="Override every token in both blocks" >}}
`:root` and `[data-mtx-theme='dark']` have the same specificity. When `<html>` carries the dark theme, both selectors match and the last one declared wins. Since your `:root` loads after Materix's CSS, a token you redefine only in `:root` will also **override the library's dark value**. If you change a color in `:root`, give it its dark value in your `[data-mtx-theme='dark']` block as well.
{{< /callout >}}

Guidelines for choosing values:

- `-contrast` is the color of text **on top of** the main color: it must have a minimum contrast ratio of 4.5:1 (WCAG AA).
- `-dark` is used for the hover state of contained buttons and FABs; `-light` for subtle backgrounds (the calendar range) and for the Snackbar action.
- `-text` (`--mtx-color-{color}-text`) is the color for text and icons of that color **on the background** (text/outlined Button, Link, Typography…). By default it reaches 4.5:1 (WCAG AA): it is the main color when that is enough, or a darker (light theme) or lighter (dark theme) shade of it; `data-mtx-contrast="mui"` restores MUI's exact values (see [Color contrast](https://qualitycode.dev/materix-ui/vainilla/guide/accessibility/#color-contrast)). If you change a main color, check its `-text` and `-contrast` too (the [theme builder](https://qualitycode.dev/materix-ui/vainilla/guide/theme-builder/) computes them).
- In dark mode, use lighter, desaturated tones of the same color, as MUI does.

Typography tokens (`--mtx-type-*`) are built from `--mtx-font-family`. Changing the font takes a single token:

```css
:root {
  --mtx-font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
}
```

## Token reference

Values taken from `src/styles/tokens.css` of `@rubenchodev/materix-ui`. "Same" means the dark theme does not redefine the token.

### Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--mtx-color-primary` | `#4818d0` | `#b388ff` | Main color: buttons, focus, selection, active controls. |
| `--mtx-color-primary-light` | `#e0d8f0` | `#e3d5ff` | Subtle primary backgrounds (calendar range, Snackbar action). |
| `--mtx-color-primary-dark` | `#3813a6` | `#7c4dff` | Hover of contained Button and Fab. |
| `--mtx-color-primary-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Text on `primary`. |
| `--mtx-color-{color}-text` | `primary`/`secondary`: the color; `error`/`info`/`success`: `-dark`; `warning`: `#ac3d00` | `error`: `-light` 70 % + white; the rest: the color | Text and icons of the color on the background, ≥ 4.5:1 (AA). `data-mtx-contrast="mui"` → `var(--mtx-color-{color})`. |
| `--mtx-color-secondary` | `#9c27b0` | `#ce93d8` | Secondary color (`--secondary` in components). |
| `--mtx-color-secondary-light` | `#ba68c8` | `#f3e5f5` | Light variant. |
| `--mtx-color-secondary-dark` | `#7b1fa2` | `#ab47bc` | Secondary hover. |
| `--mtx-color-secondary-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Text on `secondary`. |
| `--mtx-color-error` | `#d32f2f` | `#f44336` | Validation errors, destructive actions. |
| `--mtx-color-error-light` | `#ef5350` | `#e57373` | Light variant. |
| `--mtx-color-error-dark` | `#c62828` | `#d32f2f` | Hover. |
| `--mtx-color-error-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Text on `error` (dark: `#ffffff` with `data-mtx-contrast="mui"`). |
| `--mtx-color-warning` | `#ed6c02` | `#ffa726` | Warnings. |
| `--mtx-color-warning-light` | `#ff9800` | `#ffb74d` | Light variant. |
| `--mtx-color-warning-dark` | `#e65100` | `#f57c00` | Hover. |
| `--mtx-color-warning-contrast` | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` | Text on `warning` (light: `#ffffff` with `data-mtx-contrast="mui"`). |
| `--mtx-color-info` | `#0288d1` | `#64b5f6` | Informational messages. |
| `--mtx-color-info-light` | `#03a9f4` | `#90caf9` | Light variant. |
| `--mtx-color-info-dark` | `#01579b` | `#42a5f5` | Hover. |
| `--mtx-color-info-contrast` | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` | Text on `info` (light: `#ffffff` with `data-mtx-contrast="mui"`). |
| `--mtx-color-success` | `#2e7d32` | `#66bb6a` | Confirmations. |
| `--mtx-color-success-light` | `#4caf50` | `#81c784` | Light variant. |
| `--mtx-color-success-dark` | `#1b5e20` | `#388e3c` | Hover. |
| `--mtx-color-success-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Text on `success`. |
| `--mtx-color-common-white` | `#fff` | Same | Pure white (MUI `common.white`). |
| `--mtx-color-common-black` | `#000` | Same | Pure black (MUI `common.black`). |
| `--mtx-color-grey-50` | `#fafafa` | Same | Auxiliary grey. |
| `--mtx-color-grey-100` | `#f5f5f5` | Same | Breadcrumbs collapse button (light). |
| `--mtx-color-grey-200` | `#eeeeee` | Same | Auxiliary grey. |
| `--mtx-color-grey-300` | `#e0e0e0` | Same | Chip background (light). |
| `--mtx-color-grey-400` | `#bdbdbd` | Same | Auxiliary grey. |
| `--mtx-color-grey-600` | `#757575` | Same | Auxiliary grey. |
| `--mtx-color-grey-700` | `#616161` | Same | Breadcrumbs collapse button (dark). |
| `--mtx-color-grey-800` | `#424242` | Same | Chip and Avatar background (dark). |

### Text, background and dividers

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--mtx-color-text-primary` | `rgba(0, 0, 0, 0.87)` | `#ffffff` | Primary text. |
| `--mtx-color-text-secondary` | `rgba(0, 0, 0, 0.6)` | `rgba(255, 255, 255, 0.7)` | Secondary text, labels, helper text. |
| `--mtx-color-text-disabled` | `rgba(0, 0, 0, 0.38)` | `rgba(255, 255, 255, 0.5)` | Disabled text. |
| `--mtx-color-background-default` | `#f8fafc` | `#121212` | Page background (`.mtx-root`). |
| `--mtx-color-background-paper` | `#ffffff` | `#1e1e1e` | Surfaces: Paper, Card, Dialog, Menu. |
| `--mtx-color-divider` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.12)` | Divider, table and list borders. |
| `--mtx-color-input-filled` | `rgba(0, 0, 0, 0.06)` | `rgba(255, 255, 255, 0.09)` | Background of `filled` fields. |
| `--mtx-color-input-filled-hover` | `rgba(0, 0, 0, 0.09)` | `rgba(255, 255, 255, 0.13)` | Hover of `filled` fields. |

### States (action)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--mtx-color-action-active` | `rgba(0, 0, 0, 0.54)` | `rgba(255, 255, 255, 0.56)` | Active icons. |
| `--mtx-color-action-hover` | `rgba(0, 0, 0, 0.04)` | `rgba(255, 255, 255, 0.08)` | Hover overlay. |
| `--mtx-color-action-selected` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.16)` | Selected elements (lists, menus, rows). |
| `--mtx-color-action-focus` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.12)` | Focus overlay. |
| `--mtx-color-action-disabled` | `rgba(0, 0, 0, 0.26)` | `rgba(255, 255, 255, 0.3)` | Disabled content. |
| `--mtx-color-action-disabled-background` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.12)` | Disabled background (contained buttons). |
| `--mtx-disabled-opacity` | `0.38` | Same | Opacity of disabled elements. |
| `--mtx-focus-ring-width` | `2px` | Same | Width of the visible focus ring. |
| `--mtx-focus-ring-color` | `var(--mtx-color-primary)` | Same | Color of the visible focus ring. |

### Typography

Each `--mtx-type-*` token is a complete value for the `font` shorthand (weight, size/line-height and family): use it as `font: var(--mtx-type-body1)`.

| Token | Value | Usage |
|---|---|---|
| `--mtx-font-family` | `'Roboto', 'Helvetica', 'Arial', sans-serif` | Font family for the whole library. |
| `--mtx-type-h1` | `300 6rem/1.167` | Heading 1. |
| `--mtx-type-h2` | `300 3.75rem/1.2` | Heading 2. |
| `--mtx-type-h3` | `400 3rem/1.167` | Heading 3. |
| `--mtx-type-h4` | `400 2.125rem/1.235` | Heading 4. |
| `--mtx-type-h5` | `400 1.5rem/1.334` | Heading 5. |
| `--mtx-type-h6` | `500 1.25rem/1.6` | Heading 6, Dialog and Drawer titles. |
| `--mtx-type-subtitle1` | `400 1rem/1.75` | Subtitle 1. |
| `--mtx-type-subtitle2` | `500 0.875rem/1.57` | Subtitle 2. |
| `--mtx-type-body1` | `400 1rem/1.5` | Body text. |
| `--mtx-type-body2` | `400 0.875rem/1.43` | Secondary text, cells, lists. |
| `--mtx-type-button` | `500 0.875rem/1.75` | Buttons. |
| `--mtx-type-caption` | `400 0.75rem/1.66` | Helper text, captions. |
| `--mtx-type-overline` | `400 0.75rem/2.66` | Uppercase labels. |

Typography tokens don't change with the theme.

### Shape

| Token | Value | Usage |
|---|---|---|
| `--mtx-shape-radius` | `4px` | Default radius (buttons, fields, Paper, Card). |
| `--mtx-shape-small` | `8px` | Alternative radius. |
| `--mtx-shape-full` | `50%` | Circular shapes (Avatar, IconButton, Alert close button). |

### Elevation

MUI shadows. The same in both themes. Only the listed levels exist.

| Token | Typical usage |
|---|---|
| `--mtx-elevation-0` | No shadow (`none`). |
| `--mtx-elevation-1` | Paper and Card by default. |
| `--mtx-elevation-2` | Contained Button at rest. |
| `--mtx-elevation-3` … `--mtx-elevation-7` | Intermediate levels (`mtx-paper--elevation-N`). |
| `--mtx-elevation-8` | Menus and popovers. |
| `--mtx-elevation-12` | Pressed Fab. |
| `--mtx-elevation-16` | Drawer (`--mtx-drawer-elevation`). |
| `--mtx-elevation-24` | Dialog. |

There are no tokens for levels 9-11, 13-15 or 17-23.

#### Dark-theme overlay

In the dark theme, as in MUI, elevated surfaces also get a white overlay that makes them lighter the higher they are. `--mtx-overlay-elevation-0` … `--mtx-overlay-elevation-24` hold a `linear-gradient` with alpha = (4.5·ln(N+1) + 2) / 100 (0.05 at level 1, 0.12 at 8, 0.16 at 24) and are `none` in the light theme. Paper, Card, Accordion, Menu, Select's menu and Dialog apply them through `background-image`; your own surfaces can do the same:

```css
.my-panel {
  background-color: var(--mtx-color-background-paper);
  box-shadow: var(--mtx-elevation-4);
  background-image: var(--mtx-overlay-elevation-4);
}
```

### Spacing

8px base unit. Consumed by Grid, Stack and the `mtx-m-*`/`mtx-p-*` utilities (import `@rubenchodev/materix-ui/utilities.css` to use them).

| Token | Value |
|---|---|
| `--mtx-spacing-0_5` | `4px` |
| `--mtx-spacing-1` | `8px` |
| `--mtx-spacing-1_5` | `12px` |
| `--mtx-spacing-2` | `16px` |
| `--mtx-spacing-3` | `24px` |
| `--mtx-spacing-4` | `32px` |
| `--mtx-spacing-5` | `40px` |
| `--mtx-spacing-6` | `48px` |
| `--mtx-spacing-8` | `64px` |
| `--mtx-spacing-10` | `80px` |

### Control heights

| Token | Value | Usage |
|---|---|---|
| `--mtx-size-large-height` | `48px` | Large Button / IconButton. |
| `--mtx-size-medium-height` | `40px` | Medium Button / IconButton (default). |
| `--mtx-size-small-height` | `32px` | Small Button / IconButton. |
| `--mtx-field-height-medium` | `56px` | Default TextField / Select. |
| `--mtx-field-height-small` | `40px` | Small TextField / Select. |
| `--mtx-control-height-*` | alias of `--mtx-field-height-*` | Heights per variant (`outlined`, `filled`, `standard`, `borderless`). |

### Motion

| Token | Value | Usage |
|---|---|---|
| `--mtx-duration-shortest` | `150ms` | Hover, color changes. |
| `--mtx-duration-shorter` | `200ms` | Brief transitions. |
| `--mtx-duration-short` | `250ms` | Short transitions. |
| `--mtx-duration-standard` | `300ms` | Standard transition. |
| `--mtx-duration-complex` | `375ms` | Complex transitions. |
| `--mtx-duration-ripple` | `550ms` | Ripple expansion. |
| `--mtx-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default curve. |
| `--mtx-easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entering (deceleration). |
| `--mtx-easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting (acceleration). |

With `prefers-reduced-motion: reduce`, the library shortens every animation and transition to 0.01ms, regardless of these values.

### Z-index

| Token | Value | Usage |
|---|---|---|
| `--mtx-z-index-mobile-stepper` | `1000` | Reserved. |
| `--mtx-z-index-speed-dial` | `1050` | SpeedDial. |
| `--mtx-z-index-app-bar` | `1100` | AppBar. |
| `--mtx-z-index-drawer` | `1200` | Drawer. |
| `--mtx-z-index-modal` | `1300` | Dialog, Menu and the floating-layer portal. |
| `--mtx-z-index-snackbar` | `1400` | Snackbar. |
| `--mtx-z-index-tooltip` | `1500` | Tooltips. |

{{< callout type="info" >}}
AppBar, Drawer, Dialog and Snackbar read their z-index tokens. Menu, the portal and SpeedDial still use the same values hard-coded in their CSS, so overriding `--mtx-z-index-speed-dial` (or `--mtx-z-index-modal` for menus) has no effect on them yet.
{{< /callout >}}

### Component tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--mtx-drawer-width` | `300px` | Same | Drawer width. |
| `--mtx-drawer-width-tablet` | `280px` | Same | Width on tablet. |
| `--mtx-drawer-width-mobile` | `min(85vw, 320px)` | Same | Width on mobile. |
| `--mtx-drawer-width-narrow` | `200px` | Same | Narrow variant. |
| `--mtx-drawer-width-wide` | `360px` | Same | Wide variant. |
| `--mtx-drawer-elevation` | `var(--mtx-elevation-16)` | Same | Drawer shadow. |
| `--mtx-avatar-default-bg` / `--mtx-avatar-default-color` | grey 600 / `#ffffff` | Same | Default avatar (AA contrast; MUI uses grey 400). |
| `--mtx-switch-track` | `rgba(0, 0, 0, 0.38)` | `rgba(255, 255, 255, 0.3)` | Switch track when off. |
| `--mtx-switch-track-checked` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.5)` | Switch track when on. |
| `--mtx-switch-track-disabled` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.2)` | Disabled track. |
| `--mtx-switch-thumb` | `#ffffff` | `#e0e0e0` | Switch thumb. |
| `--mtx-switch-thumb-disabled` | `#fafafa` | `#757575` | Disabled thumb. |
| `--mtx-chip-height` | `32px` | Same | Medium Chip height. |
| `--mtx-chip-height-small` | `24px` | Same | Small Chip height. |
| `--mtx-chip-radius` | `16px` | Same | Medium Chip radius. |
| `--mtx-chip-radius-small` | `12px` | Same | Small Chip radius. |
| `--mtx-chip-font-size` | `0.8125rem` | Same | Medium Chip text. |
| `--mtx-chip-font-size-small` | `0.75rem` | Same | Small Chip text. |
| `--mtx-chip-label-padding` | `0 12px` | Same | Label padding. |
| `--mtx-chip-label-padding-small` | `0 8px` | Same | Padding in small. |
| `--mtx-chip-delete-size` | `22px` | Same | Delete icon. |
| `--mtx-chip-delete-size-small` | `16px` | Same | Delete icon in small. |
| `--mtx-chip-bg` | `var(--mtx-color-grey-300)` | `var(--mtx-color-grey-800)` | Background of the default filled Chip. |
| `--mtx-chip-bg-hover` | mix of grey-300 and grey-400 | mix of grey-800 and grey-700 | Chip hover. |
| `--mtx-chip-text` | `var(--mtx-color-text-primary)` | Same | Chip text. |
| `--mtx-chip-delete-color` | `rgba(0, 0, 0, 0.26)` | `rgba(255, 255, 255, 0.26)` | Delete icon. |
| `--mtx-chip-delete-color-hover` | `rgba(0, 0, 0, 0.4)` | `rgba(255, 255, 255, 0.4)` | Delete icon on hover. |
| `--mtx-breadcrumbs-collapse-bg` | `var(--mtx-color-grey-100)` | `var(--mtx-color-grey-700)` | Breadcrumbs collapse button background. |
| `--mtx-breadcrumbs-collapse-bg-hover` | `var(--mtx-color-grey-200)` | `var(--mtx-color-grey-600)` | Breadcrumbs collapse button hover. |
| `--mtx-breadcrumbs-collapse-color` | `var(--mtx-color-grey-700)` | `var(--mtx-color-grey-100)` | Breadcrumbs collapse icon. |
| `--mtx-rating-color` | `#faaf00` | Same | Filled Rating icons. |
| `--mtx-alert-text-mix` | `#000` | `#fff` | Alert `standard`/`outlined` text: 40 % severity color + this tone. |
| `--mtx-alert-bg-mix` | `#fff` | `#000` | Alert `standard` background: 10 % severity color + this tone. |
| `--mtx-snackbar-bg` | `background-default` + 80 % black | `background-default` + 80 % white | Snackbar surface (MUI `emphasize`). |
| `--mtx-snackbar-color` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Snackbar text. |
| `--mtx-snackbar-action-color` | primary + 55 % white | primary + 45 % black | Snackbar action. |

Each component page documents the tokens it consumes in its **CSS variables** section.
