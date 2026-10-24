---
title: "Stack"
description: "Stacks elements in one direction (column or row) with even spacing, alignment, wrapping, dividers and per-breakpoint changes."
group: "layout"
icon: "view_agenda"
weight: 40
example: "stack"
import: "Stack"
mui: "https://mui.com/material-ui/react-stack/"
---

`Stack` lays out its children one after another in a single direction and separates them with `gap`, like MUI's `Stack`. Use it for forms, action bars, card lists or any block that stacks on mobile and becomes a row on desktop. When content needs columns that line up across rows, use [Grid]({{< relref "/components/grid" >}}); to center and cap the page width, [Container]({{< relref "/components/container" >}}).

```tsx
import { Stack } from '@rubenchodev/materix-react';
// or only this component
import { Stack } from '@rubenchodev/materix-react/components/stack';
```

## Basic usage

A single `<Stack>`. The default direction is column (like MUI) and `spacing` sets the gap in multiples of 8px.

{{< react-demo id="stack/01-basic" layout="block" >}}

## Direction

`direction`: `column` (default), `row`, `column-reverse` or `row-reverse` (`col` is accepted as a legacy alias of `column`). Reading and tab order still follow the JSX.

{{< react-demo id="stack/02-direction" layout="block" >}}

## Spacing

Scale `0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10` (× 8px) applied with `gap`: no margins on the children. Values outside the scale are ignored (with a warning in development).

{{< react-demo id="stack/03-spacing" layout="block" >}}

## Responsive

`direction` and `spacing` accept an object per breakpoint (`sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px) or an array starting at `xs`, like MUI. Each value applies from that width up. Here: a column with 8px on mobile, a row with 16px from 600px and 32px from 900px.

{{< react-demo id="stack/04-responsive" layout="block" >}}

```tsx
<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>…</Stack>
// same thing with arrays (xs, sm, md…)
<Stack direction={['column', 'row']} spacing={[1, 2, 4]}>…</Stack>
```

## Alignment

`alignItems` aligns on the cross axis (`start`, `center`, `end`, `stretch`, `baseline`) and `justifyContent` distributes along the main axis (`start`, `center`, `end`, `between`, `around`, `evenly`). CSS values are accepted too (`flex-start`, `space-between`…).

{{< react-demo id="stack/05-alignment" layout="block" >}}

## Dividers

`divider` inserts a decorative `<hr class="mtx-divider mtx-stack__divider" aria-hidden="true">` between each pair of children: horizontal in a column and vertical in a row (also when the direction changes per breakpoint). You can also pass your own node, as in MUI: `divider={<span aria-hidden="true">·</span>}`. Dividers are recomputed automatically when children change (no `refresh()` needed).

{{< react-demo id="stack/06-dividers" layout="block" >}}

## Wrap

With `wrap` the children move to the next line when they do not fit (useful for groups of chips or buttons). The `gap` also separates the lines.

{{< react-demo id="stack/07-wrap" layout="block" >}}

## Grid

A Stack inside each Grid item: the grid splits the columns and the stack arranges the content of each one.

{{< react-demo id="stack/08-grid" layout="block" >}}

## Real-world examples

A form action bar and a profile card built only with Stack. `component="form"` renders the stack as the form itself.

{{< react-demo id="stack/09-real-world" layout="block" >}}

## Controlled props

In vanilla, `setDirection()`, `setSpacing()`, `setAlign()`, `setJustify()`, `setWrap()`, `setDivider()` and `refresh()` mutate an existing element. In React you change the props from state; dividers follow the children on every render.

{{< react-demo id="stack/10-controlled" layout="block" >}}

## Full BEM syntax

The classes work without the component; dividers must then be written by hand.

{{< react-demo id="stack/11-bem" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `StackResponsive<'row' \| 'column' \| 'row-reverse' \| 'column-reverse' \| 'col'>` | — (`column` in CSS) | Flex direction, fixed or per breakpoint. |
| `spacing` | `StackResponsive<0 \| 0.5 \| 1 \| 1.5 \| 2 \| 2.5 \| 3 \| 4 \| 5 \| 6 \| 8 \| 10>` | — | Gap × 8px, fixed or per breakpoint. |
| `alignItems` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` (+ `flex-start`, `flex-end`) | — | Cross-axis alignment. |
| `justifyContent` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` (+ CSS values) | — | Main-axis distribution. |
| `wrap` | `boolean` | `false` | Lets children wrap to new lines. |
| `divider` | `boolean \| ReactNode` | — | `true` inserts a decorative `<hr>`; a node is inserted as is. |
| `component` | `ElementType` | `'div'` | Root element or component (`form`, `nav`, `ul`…). |
| `className` | `string` | — | Merged with the component classes. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

`StackResponsive<T>` is `T`, `{ xs?, sm?, md?, lg?, xl? }` or an array `[xs, sm, md, lg, xl]`. Any other prop is forwarded to the root element.

### Equivalence with vanilla

| Vanilla | React |
|---|---|
| `data-mtx="stack"` | `<Stack>` |
| `data-direction="row"` / `data-direction-md="row"` | `direction="row"` / `direction={{ md: 'row' }}` |
| `data-spacing="2"` / `data-spacing-sm="3"` | `spacing={2}` / `spacing={{ sm: 3 }}` |
| `data-align="center"` | `alignItems="center"` |
| `data-justify="between"` | `justifyContent="between"` |
| `data-wrap` | `wrap` |
| `data-divider` | `divider` |
| `setDirection()`, `setSpacing()`, `setAlign()`, `setJustify()`, `setWrap()`, `setDivider()`, `refresh()` | Change the matching prop; dividers are recomputed on render. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-stack` | Flex container in column. |
| `mtx-stack--{row\|column\|row-reverse\|column-reverse}` | Direction from xs. |
| `mtx-stack--{bp}-{direction}` | Direction from `sm`, `md`, `lg` or `xl`. |
| `mtx-stack--spacing-{n}` / `mtx-stack--{bp}-spacing-{n}` | Gap (`1_5` for 1.5). |
| `mtx-stack--align-{start\|center\|end\|stretch\|baseline}` | Cross-axis alignment. |
| `mtx-stack--justify-{start\|center\|end\|between\|around\|evenly}` | Main-axis distribution. |
| `mtx-stack--wrap` | Line wrapping. |
| `mtx-stack__divider` | Divider between children (with `mtx-divider`). |

### Callbacks

`Stack` has no events of its own.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-spacing-{n}` | Gap values of the spacing scale. |
| `--mtx-color-divider` | Divider color. |

## Accessibility

- Stack adds no roles: use `component` to render the right semantic element (`<form>`, `<nav>`, `<ul>` with `<li>` children…).
- Generated dividers are decorative (`aria-hidden="true"`): the structure already conveys the grouping. If you pass your own `divider` node, mark it `aria-hidden` too when it is purely visual.
- With `row-reverse` / `column-reverse` the visual order flips but reading and tab order follow the JSX: use them only when the order doesn't matter.
