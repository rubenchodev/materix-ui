---
title: "Button Group"
description: "Groups related buttons into a single piece with joined borders, separators and inherited variant, size and color."
group: "inputs"
icon: "view_week"
weight: 15
example: "button-group"
import: "Button, ButtonGroup"
mui: "https://mui.com/material-ui/react-button-group/"
---

**Button Group** joins related [Buttons](../button/) into a single piece: shared borders, separators between them and the same variant, size and color. Use it for sets of actions of the same level (text alignment, period filters, export formats) and for the *split button* pattern.

## Import

```tsx
import { Button, ButtonGroup } from '@rubenchodev/materix-react';
```

## Basic usage

A `<ButtonGroup>` with `<Button>` children: the group passes its variant (outlined by default) to the buttons through context, computes their position (`first` / `middle` / `last`) and renders `role="group"`. Give it a name with `label` or `aria-label`.

{{< react-demo "button-group/01-basic" >}}

## Variants

`variant="outlined|contained|text"`, as in MUI. Outlined overlaps the borders; contained separates with the dark shade of the color and moves the elevation to the group; text separates with a 50% line.

{{< react-demo id="button-group/02-variants" layout="column" >}}

## Sizes

`size="small|medium|large"` is inherited by every button (32, 40 and 48px).

{{< react-demo id="button-group/03-sizes" layout="column" >}}

## With icons

Each child accepts the Button props (`startIcon`, `endIcon`). For icon-only buttons, put a `.material-icons` span as the only child and an `aria-label`: the group compacts their padding.

{{< react-demo id="button-group/04-icons" layout="column" >}}

## Colors

`color` accepts the palette colors and `inherit`; a child with its own `color` (or `variant`, `size`) keeps it.

{{< react-demo id="button-group/05-colors" layout="column" >}}

## Orientation

`orientation="vertical"` stacks the buttons. It keeps `role="group"`, which doesn't allow `aria-orientation`; with `role="toolbar"` the group adds `aria-orientation="vertical"`.

{{< react-demo "button-group/06-orientation" >}}

## Full width

`fullWidth` takes the full width and splits the space evenly.

{{< react-demo id="button-group/07-full-width" layout="block" >}}

## States

`disabled` disables every button of the group and sets `aria-disabled="true"` on it; a single child can be disabled on its own. `disableElevation` removes the shadow of the contained group.

{{< react-demo id="button-group/08-states" layout="column" >}}

## Split button

MUI pattern: the primary action plus an arrow button that opens a menu with the alternatives. Give the arrow an `aria-label` and `aria-haspopup="menu"`; the Menu adds `aria-expanded` and `aria-controls`, and should anchor to the group so it aligns with its full width. In this demo the arrow opens a [Menu](../menu/) anchored to the group (`matchWidth`); choosing an option makes it the primary action and focus returns to the arrow.

{{< react-demo id="button-group/09-split-button" layout="block" >}}

## Grid layout

With `fullWidth` the group adapts to the grid column.

{{< react-demo id="button-group/10-grid" layout="block" >}}

## Programmatic usage

The group is declarative: change `disabled` or render more children and the positions are recomputed on every render (no `refresh()` needed).

{{< react-demo id="button-group/11-programmatic" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'outlined' \| 'contained' \| 'text'` | `'outlined'` | Variant inherited by the buttons. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Inherited size. |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'inherit'` | `'primary'` | Inherited color. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `fullWidth` | `boolean` | `false` | Full width; also passed to the buttons. |
| `disabled` | `boolean` | `false` | Disables every button. |
| `disableElevation` | `boolean` | `false` | No shadow in contained. |
| `label` | `string` | — | Accessible name (`aria-label`). |
| `role` | `string` | `'group'` | Root role (`toolbar` if you add arrow-key navigation). |

Other props go to the root `<div>`; `className` is merged and `ref` points to it.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-button-group` | Container. |
| `mtx-button-group--{outlined,contained,text}` | Variant. |
| `mtx-button-group--horizontal` · `--vertical` | Orientation. |
| `mtx-button-group--{color}` · `--small` · `--large` | Color and size. |
| `mtx-button-group--full-width` · `--disable-elevation` · `--disabled` | Modifiers. |
| `mtx-button-group__grouped` | Every child button. |
| `mtx-button-group__first` · `__middle` · `__last` | Child position (borders and separators). |

### Equivalence with the vanilla version

| Vanilla | React |
| :--- | :--- |
| `data-variant` · `data-size` · `data-color` | `variant` · `size` · `color` |
| `data-orientation="vertical"` | `orientation="vertical"` |
| `data-full-width` · `data-disable-elevation` · `data-disabled` | `fullWidth` · `disableElevation` · `disabled` |
| `data-label` | `label` |
| `disable()` / `enable()` · `refresh()` | `disabled` prop · automatic on render |
| `<button data-open-menu>` + Menu | arrow `<Button>` + Menu (`onClick`) |

There is no "Manual BEM usage" section: the group always renders the full BEM structure and computes the position classes on every render.

## Accessibility

- The container renders `role="group"`; name it with `label` or `aria-label` so screen readers announce the purpose of the set.
- Each child is a native `<button>` (or `<a>`): tab order is the natural one, without roving tabindex.
- Icon-only buttons need `aria-label`; the icon, `aria-hidden="true"`.
- `disabled` uses the native `disabled` (or `aria-disabled` on links) and sets `aria-disabled="true"` on the group.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus between the group's buttons. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused button. |
