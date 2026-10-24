---
title: "Chip"
description: "A compact element that represents a tag, a filter, an input or an action; it can have an icon, an avatar and a delete button."
group: "data-display"
icon: "label"
weight: 30
example: "chip"
import: "Chip"
mui: "https://mui.com/material-ui/react-chip/"
---

`Chip` represents a compact piece of information: a tag, an active filter, a recipient or a short action. Use it for tag lists, selectable filters or inputs the user can remove. For a primary action use a Button; for a counter on an icon use a Badge.

```tsx
import { Chip } from '@rubenchodev/materix-react';
// or only this component:
import { Chip } from '@rubenchodev/materix-react/components/chip';
```

## Basic usage

A single `<Chip label="…" />` is enough. `icon` adds a start icon (a Material Icons name or any node) and `onDelete` adds the delete icon.

{{< react-demo "chip/01-basic" >}}

## Variants

`filled` (default) uses a solid background; `outlined` uses a border and a transparent background.

{{< react-demo id="chip/02-variants" layout="block" >}}

## Sizes

`medium` (32px, default) lines up with the small Button; `small` (24px) suits tables and dense lists.

{{< react-demo id="chip/03-sizes" layout="block" >}}

## With icons and avatar

`icon` adds a start icon, `avatar` shows an avatar (it receives the `mtx-chip__avatar` class) and `onDelete` adds the trailing delete icon, which you can replace with `deleteIcon`.

{{< react-demo id="chip/04-icons" layout="block" >}}

## Colors

`color` accepts the whole palette; on `outlined` the color applies to the text and the border.

{{< react-demo id="chip/05-colors" layout="block" >}}

## States

A chip with `onClick` (or `clickable`) is interactive: pointer cursor, hover state, focus ring, `role="button"` and activation with Enter or Space. With `component="button"` the chip is a native `<button>` without browser border or padding. `disabled` lowers the opacity, removes focus and blocks the callbacks.

{{< react-demo id="chip/06-states" layout="block" >}}

## Deletable

`onDelete` shows the delete icon and is called when it is clicked or when Delete/Backspace is pressed while the chip has focus. The chip **doesn't remove itself**: you update your state.

{{< react-demo id="chip/07-deletable" layout="block" >}}

## Filters

Clickable chips that toggle between `outlined` (inactive) and `primary` (active), with `aria-pressed` as the accessible state.

{{< react-demo id="chip/08-filters" layout="block" >}}

## Grid

Project cards in a `Grid` with their tags: 1 column on mobile, 2 at `sm` and 3 at `md`.

{{< react-demo id="chip/09-grid" layout="block" >}}

## Programmatic usage

The label, the disabled state and the rest of the props are React state; `ref` points to the root element (for example, to focus it). The log shows the `onClick` and `onDelete` callbacks.

{{< react-demo id="chip/10-programmatic" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Chip text. If omitted, `children` is used. |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual variant. |
| `size` | `'medium' \| 'small'` | `'medium'` | 32px or 24px. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'default'` | Palette color. |
| `icon` | `ReactNode \| string` | — | Start icon. A string renders `<span class="mtx-chip__icon material-icons">`; a node receives `mtx-chip__icon`. |
| `avatar` | `ReactNode` | — | Start avatar; receives `mtx-chip__avatar`. |
| `clickable` | `boolean` | `true` if `onClick` | Makes the chip interactive. |
| `onClick` | `(event) => void` | — | Click or Enter/Space on a clickable chip. |
| `onDelete` | `(event) => void` | — | Shows the delete icon; called on click or Delete/Backspace. |
| `deleteIcon` | `ReactNode` | circled X (SVG) | Custom delete icon. |
| `deleteLabel` | `string` | i18n `chip.delete` | Tooltip (`title`) of the delete icon. |
| `disabled` | `boolean` | `false` | Disables the chip. |
| `component` | `ElementType` | `'div'` | Root element (`'button'`, `'a'`…). |
| `locale` | `string` | context | Language of the built-in texts. |

`className` is merged; `ref`, `style` and any other attribute (`id`, `aria-*`, `data-*`, handlers) go to the root element.

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onClick(event)` | `mtx:chip:click` | A clickable chip is clicked or activated with Enter/Space. |
| `onDelete(event)` | `mtx:chip:delete` | The delete icon is clicked or Delete/Backspace is pressed while the chip has focus. |

### CSS classes

| Class | Element |
|---|---|
| `.mtx-chip` | Root. |
| `.mtx-chip--outlined`, `.mtx-chip--small` | Variant and size. |
| `.mtx-chip--{color}` | Palette color. |
| `.mtx-chip--clickable`, `.mtx-chip--disabled` | States. |
| `.mtx-chip__avatar`, `.mtx-chip__icon`, `.mtx-chip__label`, `.mtx-chip__delete` | Parts. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-chip-height`, `--mtx-chip-height-small` | Heights (32px / 24px). |
| `--mtx-chip-radius`, `--mtx-chip-radius-small` | Radii (16px / 12px). |
| `--mtx-chip-font-size`, `--mtx-chip-font-size-small` | Text size. |
| `--mtx-chip-label-padding`, `--mtx-chip-label-padding-small` | Label padding. |
| `--mtx-chip-bg`, `--mtx-chip-text` | Background and text of the `default` color. |
| `--mtx-chip-delete-color`, `--mtx-chip-delete-color-hover` | Delete icon color. |
| `--mtx-chip-delete-size`, `--mtx-chip-delete-size-small` | Delete icon size. |

## Accessibility

- Static chips are text with no role. Clickable or deletable chips get `role="button"` and `tabindex="0"` (unless `component` is `button` or `a`); disabled ones get `aria-disabled="true"` and `tabindex="-1"`.
- As in MUI, the delete icon is **not** a nested control: it is a `<span aria-hidden="true">` that is never focusable. The chip is deleted with the mouse on the icon or with Delete/Backspace while it has focus, announced with `aria-keyshortcuts="Delete Backspace"`.
- The icon's `title` comes from the i18n dictionary (`Delete` / `Eliminar`); make it specific with `deleteLabel` (for example, "Remove React").
- For filters, indicate the active state with `aria-pressed`.
- String icons are rendered with `aria-hidden="true"`; mark your own icon nodes the same way.

| Key | Action |
|---|---|
| Tab / Shift+Tab | Moves focus between interactive chips. |
| Enter / Space | Activates a clickable chip (`onClick`). |
| Delete / Backspace | On a deletable chip, calls `onDelete`. |
| Escape | Removes focus from the chip. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-label="…"` | `label="…"` |
| `data-variant`, `data-size`, `data-color` | `variant`, `size`, `color` |
| `data-icon="code"` | `icon="code"` |
| child `.mtx-chip__avatar` | `avatar={…}` |
| `data-clickable` + `mtx:chip:click` | `onClick` (or `clickable`) |
| `data-deletable` + `mtx:chip:delete` | `onDelete` |
| `data-delete-icon`, `data-delete-label` | `deleteIcon`, `deleteLabel` |
| `data-disabled`, `disable()` / `enable()` | `disabled` |
| `chip.label = '…'` | `label` prop (state) |
| `<button data-mtx="chip">` | `component="button"` |
