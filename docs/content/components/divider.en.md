---
title: "Divider"
description: "A thin line that separates and groups content in lists, menus and layouts, horizontally or vertically and optionally with text."
group: "data-display"
icon: "horizontal_rule"
weight: 40
example: "divider"
import: "Divider"
mui: "https://mui.com/material-ui/react-divider/"
---

**Divider** is a 1px line in the theme's `divider` color that separates groups of content. It can be horizontal or vertical, inset or with a margin on both sides, and can carry centered or aligned text.

```tsx
import { Divider } from '@rubenchodev/materix-react';
// or only this component:
import { Divider } from '@rubenchodev/materix-react/components/divider';
```

## Basic usage

`<Divider />` renders an `<hr class="mtx-divider">`, which has the `separator` role natively.

{{< react-demo id="divider/01-basic" layout="block" >}}

## Variants

`fullWidth` (default) spans the whole width; `middle` leaves 16px on each side; `inset` leaves 72px on the left to line up with the text of lists with icons.

{{< react-demo id="divider/02-variants" layout="block" >}}

## Vertical orientation

`orientation="vertical"` renders a `<div>` with `role="separator"` and `aria-orientation="vertical"`. Inside a flex row, `flexItem` stretches it to the height of the row.

{{< react-demo id="divider/03-vertical" layout="block" >}}

## With text

The `children` become the text of the divider (wrapped in `.mtx-divider__text`). `textAlign` moves it to `left` or `right`; it is centered by default.

{{< react-demo id="divider/04-with-text" layout="block" >}}

## In lists

Use `component="li"` to keep the HTML of a list valid. Like vanilla, the `<li>` keeps its list item role (a list cannot contain `role="separator"`) and, when empty, it is hidden from screen readers with `aria-hidden="true"`. `inset` lines the line up with the text. Alternatively, `divider` on each `ListItem` draws a bottom border.

{{< react-demo id="divider/05-in-lists" layout="block" >}}

## Use cases

An "or" separator between a social sign-in and the sign-in form (TextField + Button).

{{< react-demo id="divider/06-use-cases" layout="block" >}}

## Grid layout

Metrics in a grid with a divider between the figure and its description.

{{< react-demo id="divider/07-grid" layout="block" >}}

## Programmatic usage

Dividers are rendered from state like any other element; there is nothing to initialize.

{{< react-demo id="divider/08-programmatic" layout="block" >}}

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal'` \| `'vertical'` | `'horizontal'` | `vertical` adds `.mtx-divider--vertical` and `aria-orientation="vertical"`. |
| `variant` | `'fullWidth'` \| `'middle'` \| `'inset'` | `'fullWidth'` | Adds `.mtx-divider--middle` or `.mtx-divider--inset`. |
| `flexItem` | `boolean` | `false` | Adds `.mtx-divider--flex-item` (stretches in a flex row). |
| `textAlign` | `'center'` \| `'left'` \| `'right'` | `'center'` | Text position; adds `.mtx-divider--text-{left\|right}`. |
| `children` | `ReactNode` | — | Divider text: adds `.mtx-divider--text` and the `.mtx-divider__text` span. |
| `component` | `ElementType` | `'hr'` (`'div'` if vertical or with text) | Root element. `'li'` keeps the list item role. |
| `className` | `string` | — | Merged with the component classes. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

Any other prop (`role`, `aria-*`, `style`, `data-*`…) is forwarded to the root element; your own `role` or `aria-orientation` take precedence.

### Callbacks

Divider emits no events.

### CSS classes

| Class | Description |
|---|---|
| `.mtx-divider` | 1px line in `--mtx-color-divider`. |
| `.mtx-divider--vertical` | Vertical line that stretches to the height of its row. |
| `.mtx-divider--middle` / `.mtx-divider--inset` | 16px margin on both sides / 72px on the left. |
| `.mtx-divider--flex-item` | `align-self: stretch` with automatic height. |
| `.mtx-divider--text` | Line — text — line layout. |
| `.mtx-divider--text-left` / `.mtx-divider--text-right` | Text aligned to one side. |
| `.mtx-divider__text` | Text container. |

## Accessibility

- `<hr>` has the implicit `separator` role; it is the default for horizontal dividers without text.
- On a `<div>` (vertical or with text) the component adds `role="separator"` unless you pass your own `role` (for example `role="presentation"` for a purely decorative divider), and `aria-orientation="vertical"` on vertical dividers, as MUI does.
- With `component="li"` the divider keeps the list item role; if it is empty it gets `aria-hidden="true"`, and with text it stays readable.
- The text of a divider is readable content: write it meaningfully ("or", "Section 2"), not with symbols.

## Vanilla equivalence

| Vanilla (`data-*`) | React |
|---|---|
| `<hr data-mtx="divider">` | `<Divider />` |
| `data-orientation="vertical"` | `orientation="vertical"` |
| `data-variant="middle\|inset"` | `variant="middle\|inset"` |
| `data-flex-item` | `flexItem` |
| `data-text="LEFT"` / element text | `children` |
| `data-text-align="left\|right"` | `textAlign="left\|right"` |
| `<li data-mtx="divider">` inside a list | `<Divider component="li" />` |

The rendered DOM (classes, `role` and `aria-*`) is identical to the vanilla component after initialization.
