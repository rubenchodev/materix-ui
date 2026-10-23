# Migrating from 0.1 to 0.2

Materix UI 0.2 aligns several defaults with Material UI (MUI) and renames every custom event to the
`mtx:{component}:{action}` convention. Most pages keep working as they are; this guide lists every
behavior change, how to find the affected code and how to update it.

Quick checklist:

1. Update the package: `npm install @rubenchodev/materix-ui@0.2.0` (or change the version in your CDN URLs).
2. Go through the [behavior changes](#behavior-changes) below; each one has a search pattern to
   find the affected markup.
3. Rename your event listeners using the [event table](#renamed-events). The old names still work
   until 1.0, so you can do it gradually.
4. Optionally switch to [per-component imports](#optional-per-component-imports) and the new
   [TypeScript types](#optional-typescript).

## Behavior changes

### Typography: headings have no default margin

`h1`–`h6` (and their `data-variant` styles) no longer add a bottom margin, as in MUI.

**Detect:** headings that relied on the old spacing, e.g. search for `data-mtx="typography"` and
`mtx-typography--h` and check the layout around them.

**Migrate:** add `data-gutter-bottom` (0.35em), `data-paragraph` (16px, for body text) or a spacing
utility.

```html
<!-- 0.1 -->
<h4 data-mtx="typography">Monthly report</h4>

<!-- 0.2 -->
<h4 data-mtx="typography" data-gutter-bottom>Monthly report</h4>
<!-- or -->
<h4 class="mtx-typography--h4 mtx-mb-2">Monthly report</h4>
```

### Grid: `gap` instead of negative margins, `{bp}-auto` fits its content

Grid spacing now uses CSS `gap` (MUI Grid v2). The container no longer has negative margins, so it
no longer overflows its parent. `xs-auto`, `md-auto`, etc. now size the item to its content; before
they grew like `xs-true`.

**Detect:** CSS that compensated the old negative margins (`margin: -8px`, `overflow-x: hidden` on a
Grid parent) and items using `-auto` that were meant to fill the remaining space.

**Migrate:** remove the compensation CSS. Use `true` for items that must grow.

```html
<!-- 0.1: "auto" filled the remaining space -->
<div data-mtx="grid" data-xs="auto">Fills the row</div>

<!-- 0.2 -->
<div data-mtx="grid" data-xs="true">Fills the row</div>
<div data-mtx="grid" data-xs="auto">Fits its content</div>
```

### Card: actions are right-aligned by default

`card-actions` aligns its buttons to the end, like dialog actions.

**Detect:** search for `data-mtx="card-actions"` and `mtx-card__actions`.

**Migrate:** to keep the left (MUI) alignment, set `data-align="start"` on the row or
`data-actions-align="start"` on the card.

```html
<!-- 0.2: same layout as 0.1 / MUI -->
<div data-mtx="card-actions" data-align="start">
  <button data-mtx="button">Share</button>
</div>
```

### Stack: default direction is `column`

**Detect:** search for `data-mtx="stack"` and `mtx-stack` without `data-direction`.

**Migrate:** add `data-direction="row"` where you want a horizontal stack.

```html
<!-- 0.1 (row by default) -->
<div data-mtx="stack" data-spacing="2">…</div>

<!-- 0.2 -->
<div data-mtx="stack" data-direction="row" data-spacing="2">…</div>
```

### NativeSelect: default variant is `standard`

**Detect:** search for `data-mtx="native-select"` without `data-variant`.

**Migrate:** add `data-variant="outlined"` (or `filled`) to keep the previous look.

```html
<select data-mtx="native-select" data-variant="outlined" data-label="Age">…</select>
```

### Menu: no implicit trigger

The menu no longer opens from its previous sibling element.

**Detect:** search for `data-mtx="menu"` and check that a trigger references it.

**Migrate:** declare the trigger explicitly with `data-open-menu="#id"` (or
`data-mtx-menu-trigger`), `aria-controls="id"`, or `data-anchor="selector"` on the menu.

```html
<!-- 0.1 -->
<button data-mtx="button">Options</button>
<div data-mtx="menu" id="options">…</div>

<!-- 0.2 -->
<button data-mtx="button" data-open-menu="#options">Options</button>
<div data-mtx="menu" id="options">…</div>
```

### DateTimePicker: locale-based format and `data-picker` precedence

Without `data-format`, the date order now follows the locale (`en` → `MM/DD/YYYY`,
`es` → `DD/MM/YYYY`). `data-picker="date|time|datetime"` now wins over the mode implied by the
`data-mtx` name.

**Detect:** pickers without `data-format`, server code that parses the submitted value, and
elements that combine `data-mtx` and `data-picker`.

**Migrate:** set the format explicitly when your backend expects a fixed one; read
`event.detail.iso` instead of parsing the display value.

```html
<input data-mtx="date-picker" data-label="Due date" data-format="DD/MM/YYYY" type="text">
```

### TextField: `large` is 48px

The `large` size went from 56px to 48px so it lines up with the large Button. The default (medium)
size is still 56px.

**Detect:** `data-size="large"`, `data-large`, `mtx-text-field--large`.

**Migrate:** remove the size attribute if you wanted 56px (that is the default size).

### Utilities and `box.css`

`box.css` was removed and its utilities were merged into `utilities.css` (included in
`materix.min.css`). The `ml`/`mr`/`pl`/`pr` aliases still exist.

**Detect:** references to `box.css` in your build or HTML.

**Migrate:** remove the reference. With per-component imports, import `@rubenchodev/materix-ui/utilities.css`
last.

### Color contrast: WCAG AA by default

Text colors now reach WCAG AA (4.5:1) by default, the equivalent of MUI's
`createTheme({ palette: { contrastThreshold: 4.5 } })`. Backgrounds (contained buttons, filled
chips and alerts, badges) keep MUI's colors; what changes is text: `warning`, `info`, `success` and
`error` text on the background is darker in light mode (lighter `error` in dark mode), contained
`warning`/`info` (light) and `error` (dark) use dark text, and those buttons lighten on hover.

**Detect:** pages that must match an existing MUI app pixel by pixel, screenshots/visual tests of
`warning`, `info` and `error` components, and custom themes that set `--mtx-color-{color}` without
`-text`.

**Migrate:** nothing is required. To keep MUI's exact colors, opt out on `<html>` or a container;
`data-mtx-contrast="aa"` (0.2 pre-releases) still works and is now the default:

```html
<!-- Exact MUI colors (some combinations stay between 3 and 3.9:1) -->
<html lang="en" data-mtx-contrast="mui">
```

If your theme overrides a palette color, also set its `--mtx-color-{color}-text` and `-contrast`
(the theme builder in the docs generates them).

### Smaller visual changes

- **Avatar** fallback: grey 600 background with white text (was MUI grey 400) for AA contrast.
  Override the `--mtx-avatar-default-bg` / `--mtx-avatar-default-color` tokens if you need the old shade.
- **Dark theme** elevation: surfaces get a per-level overlay. Screenshots may differ slightly.
- **base.css**: `margin: 0` is applied only to `body.mtx-root`; add the `mtx-root` class to
  `<body>` if your page relied on it. The reduced-motion rules affect only `mtx-*` classes.
- **AppBar**: no transition on the first frame (the bar no longer animates on page load).
- **Instances** are held in a `WeakMap`; a removed node no longer keeps its instance alive. Call
  `Materix.destroy(element)` / `destroyAll(root)`, or use `Materix.watch(root, { destroyOnRemove: true })`
  in SPAs, to release document/window listeners.

### Link: underlined by default

Links now follow MUI v5 (`underline="always"`): a soft underline that becomes solid on hover, so
links inside text are distinguishable without relying on color (WCAG 1.4.1).

```html
<!-- Before: underline only on hover -->
<a data-mtx="link" href="/docs">Docs</a>

<!-- After: same look as 0.1 -->
<a data-mtx="link" data-underline="hover" href="/docs">Docs</a>
```

Breadcrumbs keep the hover-only underline.

### Chip: non-focusable delete icon

The delete control is now a non-focusable icon (`<span class="mtx-chip__delete" aria-hidden="true" title="…">`),
as in MUI; keyboard users remove a deletable chip with `Delete` or `Backspace` on the chip itself.
If you query `button.mtx-chip__delete` in your code, use `.mtx-chip__delete` instead. Pre-rendered
`<button class="mtx-chip__delete">` markup is converted automatically. `data-delete-label` now sets
the icon `title`.

### Focus handling and Escape

- Dialog, temporary Drawer and modal Popover trap `Tab`/`Shift+Tab` explicitly and return focus to
  the trigger that opened them, also in Safari.
- `Escape` closes only the topmost surface (tooltip → popover/menu → dialog). If your code closed
  several layers with one `Escape`, it now needs one key press per layer.
- ButtonGroup no longer sets `aria-orientation` on `role="group"`.

## Renamed events

All events now follow `mtx:{component}:{action}`. The old names are still dispatched with the same
`detail` (deprecated, removed in **1.0.0**).

| Old name (deprecated) | New name | `detail` |
|---|---|---|
| `mtx-select` | `mtx:list:select` | `{ item }` |
| `mtx:change` (RadioGroup) | `mtx:radio-group:change` | `{ value }` |
| `mtx:change` (DateTimePicker) | `mtx:date-time-picker:change` | `{ date, dateTime, startDate, endDate, range, time, value, iso, isRange, picker }` |
| `mtx:open` (DateTimePicker) | `mtx:date-time-picker:open` | `{ picker }` |
| `mtx:close` (DateTimePicker) | `mtx:date-time-picker:close` | `{ picker }` |
| `mtx:password-visibility` | `mtx:text-field:password-visibility` | `{ visible }` |
| `mtx:adornment-click` | `mtx:text-field:adornment-click` | `{ position, button, input }` |
| `mtx:drawer:modechange` | `mtx:drawer:mode-change` | `{ mode, previousMode }` |
| `mtx:localechange` | `mtx:locale:change` | `{ locale }` |
| `mtx:theme-change` | `mtx:theme:change` | `{ theme, mode, previous }` |
| `mtx-speed-dial-open` | `mtx:speed-dial:open` | `{ speedDial }` |
| `mtx-speed-dial-close` | `mtx:speed-dial:close` | `{ speedDial }` |

**Detect:**

```bash
grep -rnE "'(mtx-select|mtx:change|mtx:open|mtx:close|mtx:password-visibility|mtx:adornment-click|mtx:drawer:modechange|mtx:localechange|mtx:theme-change|mtx-speed-dial-(open|close))'" src/
```

**Migrate:**

```js
// 0.1
list.addEventListener('mtx-select', (e) => open(e.detail.item));
document.addEventListener('mtx:theme-change', (e) => chart.setTheme(e.detail.theme));

// 0.2
list.addEventListener('mtx:list:select', (e) => open(e.detail.item));
document.addEventListener('mtx:theme:change', (e) => chart.setTheme(e.detail.theme));
```

Do not listen to both names: the handler would run twice.

## Optional: per-component imports

The full bundle (`@rubenchodev/materix-ui`, `materix.min.css`, `materix.umd.js`) is unchanged. With a bundler you
can now import only what you use:

```js
import '@rubenchodev/materix-ui/base.css';                 // tokens + base styles (always first)
import '@rubenchodev/materix-ui/utilities.css';            // optional, always last
import { Button } from '@rubenchodev/materix-ui/components/button';
import '@rubenchodev/materix-ui/components/text-field';    // registers, auto-initializes and imports its CSS
import { getInstance, theme } from '@rubenchodev/materix-ui/core';
```

Do not mix `@rubenchodev/materix-ui` (full bundle) and `@rubenchodev/materix-ui/components/*` in the same page: each one has
its own registry.

## Optional: TypeScript

Types ship with the package; no `@types` package is needed.

```ts
import { getInstance, type Dialog } from '@rubenchodev/materix-ui';

const dialog = getInstance<Dialog>(document.getElementById('confirm'));
dialog?.open();

document.querySelector('[data-mtx="tabs"]')!
  .addEventListener('mtx:tabs:change', (event) => console.log(event.detail.tab));
```
