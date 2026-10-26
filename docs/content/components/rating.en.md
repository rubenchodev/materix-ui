---
title: "Rating"
description: "Star rating to review a product or display an average score, accessible through native radios and the keyboard."
group: "inputs"
icon: "star_half"
weight: 55
example: "rating"
import: "Rating"
mui: "https://mui.com/material-ui/react-rating/"
---

**Rating** lets the user pick a score from 1 to N icons (stars by default) or displays an average in read-only mode. As in MUI, it is backed by hidden native radios with labels ("3 Stars"), so it works with the keyboard, screen readers and forms without extra code. For a long numeric scale use a [Slider](../slider/) or a [Native Select](../native-select/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Rating } from '@rubenchodev/materix-react';

<Rating defaultValue={3} name="product-score" aria-label="Product rating" />
```

## Basic usage

A single `<Rating />` renders five stars. `defaultValue` sets the initial value and `name` the radios' `name` (submitted with the form; generated when omitted). Clicking the current value clears it (`null`).

{{< react-demo "rating/01-basic" >}}

## Precision

`precision={0.5}` allows half stars: each star contains two radios and its left half picks the x.5 value. Other fractions of 1 such as `0.25` also work; values are rounded to the precision.

{{< react-demo "rating/02-precision" >}}

## Sizes

MUI sizes through `size`: small 18px, medium 24px (default) and large 30px.

{{< callout type="info" title="Icons and size" >}}
The built-in icons (`star`, `star_border`, `star_outline`, `favorite`, `favorite_border`, `thumb_up`, `thumb_up_off_alt`, `circle`, `radio_button_unchecked`) are drawn as **SVG**, which scales without losing sharpness. Any other name uses the Material Icons glyph at its native 24px in every size: its `font-size` is never forced (Materix iconography rule). A custom SVG passed as a node scales with `--mtx-rating-icon-size`.
{{< /callout >}}

{{< react-demo "rating/03-sizes" >}}

## Icons

`icon` (filled) and `emptyIcon` (empty) accept a Material Icons name or any React node (for example your own `<svg>`). If you only set `icon`, the empty state uses the same icon in gray. Customize the color with `--mtx-rating-color`.

{{< react-demo "rating/04-icons" >}}

## States

Hovering previews the value (the active star grows 1.2×); with <kbd>Tab</kbd> and the arrow keys it changes with a visible focus ring. `readOnly` displays a fixed rating (`role="img"`) and `disabled` dims it.

{{< react-demo "rating/05-states" >}}

## Highlight selected only and max

`highlightSelectedOnly` highlights only the chosen icon (satisfaction scales) and `max` changes the number of icons.

{{< react-demo "rating/06-highlight-max" >}}

## Hover feedback

`onChangeActive(event, value)` reports the value under the pointer or the focused radio (`null` on leave) so you can show a descriptive label, like MUI's *hover feedback* demo. `getLabelText` customizes each radio's accessible label.

{{< react-demo "rating/07-hover-feedback" >}}

## Real-world examples

A product summary with the read-only average and a review form that submits the value like any other radio.

{{< react-demo id="rating/08-use-cases" layout="block" >}}

## Grid

Several rating criteria spread across responsive [Grid](../grid/) columns, each named through `aria-labelledby`.

{{< react-demo "rating/09-grid" >}}

## Controlled usage

With `value` + `onChange` the parent owns the value; the vanilla instance members become state changes (`rating.value = 5` → `setValue(5)`, `disable()` → `disabled`).

{{< react-demo "rating/10-controlled" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number \| null` | — | Value (controlled); `null` = no rating. |
| `defaultValue` | `number \| null` | `null` | Initial value (uncontrolled). |
| `onChange` | `(event, value: number \| null) => void` | — | The user changes or clears the rating. |
| `onChangeActive` | `(event, value: number \| null) => void` | — | The value under the pointer or the focused radio changes (`null` on leave). |
| `max` | `number` | `5` | Number of icons. |
| `precision` | `number` | `1` | Minimum step (`0.5`, `0.25`…; must divide 1). |
| `readOnly` | `boolean` | `false` | No radios, `role="img"` and `aria-label` "Rated X out of N" (an explicit `aria-label` or `label` takes precedence). |
| `disabled` | `boolean` | `false` | Disables the radios and dims the component. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 18 / 24 / 30px SVG icons. |
| `icon` | `string \| ReactNode` | `'star'` | Filled icon. |
| `emptyIcon` | `string \| ReactNode` | `'star_border'` (or `icon` when set) | Empty icon. |
| `highlightSelectedOnly` | `boolean` | `false` | Highlights only the selected icon. |
| `name` | `string` | generated | The radios' `name`. |
| `label` | `string` | — | Accessible name of the group (`aria-label`). |
| `getLabelText` | `(value: number) => string` | "3 Stars" (translated) | Accessible label of each value. |
| `emptyLabelText` | `string` | "Empty" (translated) | Label of the "no rating" radio. |
| `locale` | `string` | context | Language of the labels (overrides `I18nProvider`). |
| `ref` | `Ref<HTMLSpanElement>` | — | Ref to the root `<span>`. |

`className`, `style`, `aria-*` and any other attribute go to the root `<span>`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `.mtx-rating` | Container (inline-flex, `#faaf00` color). |
| `.mtx-rating--small`, `--large` | 18 and 30px sizes. |
| `.mtx-rating--read-only`, `--disabled` | States. |
| `.mtx-rating--hovering` | While previewing with the pointer. |
| `.mtx-rating__item` | One icon; `--decimal` when precision is below 1; `--active` the item under the pointer (1.2 scale). |
| `.mtx-rating__label` | `<label>` (or `<span>` when read-only) with `data-rating-value`; `--filled` filled; `--partial` fraction clip; `--hover` value under the pointer. |
| `.mtx-rating__icon`, `__icon--filled`, `__icon--empty` | Filled and empty icons (one is shown depending on the state). |
| `.mtx-rating__input`, `__input--empty` | Hidden native radios; the empty one represents "no rating". |
| `.mtx-rating__visually-hidden` | Screen-reader-only text. |

### CSS variables

| Variable | Use |
| :--- | :--- |
| `--mtx-rating-color` | Color of the filled icons (`#faaf00`). |
| `--mtx-rating-empty-color` | Color of the empty icons (`--mtx-color-action-disabled`). |
| `--mtx-rating-icon-size` | Size of the SVG icons (18 / 24 / 30px). |
| `--mtx-disabled-opacity` | Opacity of the disabled state. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<span data-mtx="rating" data-value="3">` | `<Rating defaultValue={3} />` |
| `data-max`, `data-precision`, `data-name` | `max`, `precision`, `name` |
| `data-read-only` / `data-disabled` | `readOnly` / `disabled` |
| `data-size="large"` | `size="large"` |
| `data-icon` / `data-empty-icon` | `icon` / `emptyIcon` (also React nodes) |
| `data-highlight-selected-only` | `highlightSelectedOnly` |
| `data-label` | `label` (or `aria-label`) |
| `rating.value = 4` | Update the `value` state |
| `disable()` / `enable()` | `disabled` |
| `mtx:rating:change` | `onChange(event, value)` |
| `mtx:rating:active` | `onChangeActive(event, value)` (also on keyboard focus) |

## Accessibility

- Interactive: native radios sharing a `name`, each with a translated label ("1 Star", "3 Stars"; "3 estrellas" in Spanish) plus an "Empty" radio. The browser handles mutual exclusion and the arrow keys.
- When the component has a name (`label`, `aria-label` or `aria-labelledby`) it gets `role="radiogroup"`.
- Read-only: `role="img"` with a translated `aria-label` ("Rated 4 out of 5" / "Valoración: 4 de 5"); the icons are decorative.
- Keyboard focus is shown as a ring around the focused icon.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Enters the rating (on the checked value) or leaves it. |
| <kbd>←</kbd> / <kbd>→</kbd> (<kbd>↑</kbd> / <kbd>↓</kbd>) | Moves to the previous / next value and selects it. |
