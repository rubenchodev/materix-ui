---
title: "Button"
description: "Action button with text, outlined and contained variants, three canonical heights (48/40/32px), palette colors, icons and loading state."
group: "inputs"
icon: "smart_button"
weight: 10
example: "button"
import: "Button"
mui: "https://mui.com/material-ui/react-button/"
---

**Button** lets users take an action or confirm a decision with a single click: submit a form, open a dialog, send a message. Use it when the action has a text label that describes it. If the action can only be represented by an icon, use [Icon Button](../icon-button/); if it's the primary, persistent action of the whole screen, use a [Fab](../fab/). To navigate to another page, pass `href` and the button renders an `<a>`.

{{< callout type="tip" title="Button, Icon Button or Fab?" >}}
| Component | When to use it | Example |
| :--- | :--- | :--- |
| **Button** | Action with a text label; hierarchy through the variant. | "Save", "Cancel" |
| **Icon Button** | Compact action recognizable by its icon, in toolbars or rows. | Search, close, more options |
| **Fab** | The primary action of the screen, floating above the content. | Compose email, create event |
{{< /callout >}}

## Import

```tsx
import { Button } from '@rubenchodev/materix-react';
// or only this component
import { Button } from '@rubenchodev/materix-react/components/button';
```

The component imports its own CSS (`button.css` and `progress.css` for the loading spinner). Import `@rubenchodev/materix-ui/base.css` once in your app.

## Basic usage

A single `<Button>` with its `variant`. The component renders a native `<button type="button">`, adds the ripple and manages the disabled state; there's no inner structure to write.

{{< react-demo "button/01-basic" >}}

## Variants

Visual hierarchy is expressed through the variant, just like in MUI:

- **Contained** (`variant="contained"`): high emphasis, filled and elevated. Reserved for the primary action; ideally one per block.
- **Outlined** (`variant="outlined"`): medium emphasis, for important secondary actions.
- **Text** (`variant="text"`, default): low emphasis, for actions in dialogs, cards or next to a contained button.

{{< react-demo "button/02-variants" >}}

## Sizes

Three canonical heights with `size`. **Medium (40px) is the default** and matches the height of a small Text Field, so both line up in the same row.

| Size | `size` | Height | Aligns with |
| :--- | :--- | :--- | :--- |
| Large | `large` | 48px | Large Icon Button, medium Fab, extended Fab |
| Medium | `medium` (default) | 40px | Small Text Field, medium Icon Button, small Fab |
| Small | `small` | 32px | Small Icon Button, Chip |

{{< react-demo "button/03-sizes" >}}

## With icons

`startIcon` and `endIcon` accept the Material Icons ligature name (`startIcon="add"`) or any node (an `<svg>`, another icon font). The button wraps them in `<span class="mtx-button__icon mtx-button__icon--start" aria-hidden="true">` (or `--end`), adds `material-icons` when you pass a name, and moves them 4px towards the edge (2px on small) as in MUI. The icons are decorative because the text already names the action; an `<svg>` renders at 24 × 24px with `currentColor`.

With `iconOnly` the button becomes square and circular (48/40/32px depending on the size). It requires an `aria-label`. For icons without a background, [Icon Button](../icon-button/) is preferable.

{{< react-demo "button/04-icons" >}}

## Colors

Primary is the default color. `color` accepts `secondary`, `success`, `error`, `warning`, `info` and `inherit` in all three variants. With `inherit` text and outlined take the container's color: use it on dark or colored surfaces (AppBar, banners, calls to action).

### On a colored surface

`surface="primary"` (or `secondary`) adapts the button to a background of that color: contained is inverted (paper background with primary text, `mtx-button--on-primary`) and text/outlined take the container's color.

### AA contrast

Buttons meet WCAG AA (4.5:1) by default: text and outlined use `--mtx-color-{color}-text` and contained `warning`/`info` use dark text. To get MUI's exact colors, add `data-mtx-contrast="mui"` to `<html>` or a container.

{{< react-demo id="button/05-colors" layout="block" >}}

## States

Hover, visible focus (when navigating with <kbd>Tab</kbd>) and press (ripple) are applied automatically. `disabled` uses the native attribute: it dims the button, removes it from the tab order and blocks the ripple.

{{< react-demo "button/06-states" >}}

## Loading

With `loading` the button enters a loading state like MUI's `loading`: it gets disabled (`disabled`, or `aria-disabled` on links), receives `aria-busy="true"` and shows a decorative 16px [CircularProgress](../progress/) in the text color. `loadingPosition` picks the position: `center` (default; the label becomes transparent and the width doesn't change), `start` or `end` (they replace the start or end icon without changing the width; without an icon, the indicator is added on that side). `loadingIndicator` shows a text (or any node) instead of the spinner.

When `loading` goes back to `false`, the previous state returns: a button with `disabled` stays disabled. The button keeps its accessible name; to announce progress, add your own `aria-live` region.

{{< react-demo "button/07-loading" >}}

## Full width

`fullWidth` makes the button take up 100% of its container.

{{< react-demo id="button/08-full-width" layout="column" >}}

## Disable elevation

`disableElevation` removes the shadow of the contained variant in all its states.

{{< react-demo "button/09-elevation" >}}

## Uppercase

Text is displayed as written. Add `uppercase` to get the uppercase style characteristic of Material Design 2.

{{< react-demo "button/10-uppercase" >}}

## As a link

If the action navigates to another URL, pass `href`: the button renders an `<a>` and keeps link semantics (open in a new tab, copy the address) with the look of a button. Since `<a>` doesn't support `disabled`, a disabled link gets `aria-disabled="true"`, `tabindex="-1"` and its click is blocked.

To use a router link, pass it in `component` (`<Button component={RouterLink} href="/plans">`). Any other element (`component="span"`) receives `role="button"`, `tabindex="0"` and activation with <kbd>Enter</kbd>/<kbd>Space</kbd>.

{{< react-demo "button/11-as-link" >}}

## Real-world examples

A form footer with a single primary contained action and a table action bar with small buttons.

{{< react-demo id="button/12-use-cases" layout="block" >}}

## Grid layout

With `fullWidth` the buttons fill the column of a grid.

{{< react-demo id="button/13-grid" layout="block" >}}

## Programmatic usage

In React the state lives in props: `disabled`, `loading` and the rest are controlled by your state. `ref` points to the root DOM element (`focus()`, measurements). Button doesn't emit its own events: use `onClick` and the other native handlers.

{{< react-demo id="button/14-programmatic" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'text' \| 'outlined' \| 'contained'` | `'text'` | Visual variant. |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'inherit'` | `'primary'` | Palette color. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 32 / 40 / 48px. |
| `disabled` | `boolean` | `false` | Native `disabled`; `aria-disabled` + `tabindex="-1"` on links. |
| `startIcon` / `endIcon` | `ReactNode` (string = Material Icons name) | — | Decorative icon at the start / end. |
| `iconOnly` | `boolean` | `false` | Square icon-only button (`mtx-button--icon`). |
| `fullWidth` | `boolean` | `false` | 100% width. |
| `disableElevation` | `boolean` | `false` | No shadow on contained. |
| `uppercase` | `boolean` | `false` | Uppercase text. |
| `surface` | `'primary' \| 'secondary'` | — | Adapts the button to a colored background. |
| `loading` | `boolean` | `false` | Loading state (disabled, `aria-busy`, indicator). |
| `loadingPosition` | `'center' \| 'start' \| 'end'` | `'center'` | Indicator position. |
| `loadingIndicator` | `ReactNode` | spinner | Text or node instead of the spinner. |
| `disableRipple` | `boolean` | `false` | Disables the ripple. |
| `href` | `string` | — | Renders an `<a>`. |
| `component` | `ElementType` | `'button'` | Root element or component. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native type (only on `<button>`). |

Other props (`id`, `aria-*`, `data-*`, `onClick`…) go to the root element; `className` is merged and `ref` points to the root.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-button` | Base class. |
| `mtx-button--contained` · `--outlined` · `--text` | Variant. |
| `mtx-button--{color}` | Palette color or `inherit`. |
| `mtx-button--on-primary` · `--on-secondary` | On a colored surface. |
| `mtx-button--large` · `--small` | 48px / 32px height. |
| `mtx-button--full-width` · `--disable-elevation` · `--uppercase` · `--icon` | Modifiers. |
| `mtx-button__icon` · `--start` · `--end` | Icon container and MUI offset. |
| `mtx-button--loading` · `--loading-{center,start,end}` | Loading state. |
| `mtx-button__loading-indicator` · `--center` · `--start` · `--end` · `--text` | Indicator container (`aria-hidden`). |
| `mtx-button__icon--loading-hidden` | Icon replaced by the indicator. |

### CSS variables

| Variable | Usage in Button |
| :--- | :--- |
| `--mtx-color-{color}` · `--mtx-color-{color}-dark` · `--mtx-color-{color}-contrast` | Contained background, hover and text. |
| `--mtx-color-{color}-text` | Text and border in outlined and text. |
| `--mtx-size-large-height` · `--mtx-size-medium-height` · `--mtx-size-small-height` | 48 / 40 / 32px heights. |
| `--mtx-btn-bg`, `--mtx-btn-hover`, `--mtx-btn-fg`, `--mtx-btn-color` | Local variables; override them for a custom color. |

### Equivalence with the vanilla version

| Vanilla | React |
| :--- | :--- |
| `class="mtx-button mtx-button--contained"` | `variant="contained"` |
| `data-size="small"` | `size="small"` |
| `data-color="error"` / `mtx-button--error` | `color="error"` |
| `data-surface="primary"` | `surface="primary"` |
| `data-start-icon="add"` / `data-end-icon="send"` | `startIcon="add"` / `endIcon="send"` |
| `mtx-button--icon` | `iconOnly` |
| `mtx-button--full-width` · `--disable-elevation` · `--uppercase` | `fullWidth` · `disableElevation` · `uppercase` |
| `data-loading` · `data-loading-position` · `data-loading-indicator` | `loading` · `loadingPosition` · `loadingIndicator` |
| `<a class="mtx-button" href>` | `href` (or `component`) |
| `disable()` / `enable()` · `setLoading()` | `disabled` · `loading` props |

## Accessibility

- Use `<Button>` (a native `<button>`) for actions and `href` for navigation.
- Icon-only buttons (`iconOnly`) need an `aria-label`. Icons next to text have `aria-hidden="true"`.
- `disabled` removes the button from the tab order. On links, it applies `aria-disabled="true"` and `tabindex="-1"` and blocks the click.
- While loading, the button is disabled with `aria-busy="true"` and keeps its accessible name. The indicator is `aria-hidden`.
- The ripple respects `prefers-reduced-motion`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next / previous button. |
| <kbd>Enter</kbd> | Activates the button or follows the link. |
| <kbd>Space</kbd> | Activates the button. |
