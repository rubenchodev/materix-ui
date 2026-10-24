---
title: "Grid"
description: "A 12-column flexbox grid with five breakpoints (xs–xl), gap-based spacing in multiples of 8px (also per breakpoint) and alignment, for responsive layouts."
group: "layout"
icon: "grid_view"
weight: 10
example: "grid"
import: "Grid"
mui: "https://mui.com/material-ui/react-grid/"
---

`Grid` splits the available width into 12 columns and lets each item declare how many it spans at each breakpoint, just like MUI's `Grid` (v2: flexbox with `gap`, no negative margins). Use it to lay out pages, forms and dashboards that change their number of columns with the screen width. To stack elements in a single direction with a fixed gap you don't need a grid: use [Stack]({{< relref "/components/stack" >}}); to center and cap the page width, [Container]({{< relref "/components/container" >}}).

```tsx
import { Grid } from '@rubenchodev/materix-react';
// or only this component
import { Grid } from '@rubenchodev/materix-react/components/grid';
```

## Basic usage

A `<Grid container>` with `spacing` and items with columns per breakpoint through `size` (MUI Grid v2 API). Resize the window: 1 column on mobile, 2 on tablet and 4 on desktop.

{{< react-demo id="grid/01-basic" layout="block" >}}

A `Grid` with neither `container` nor a size behaves as a container (same as vanilla), and a `Grid` with a size is an item. Sizes can be written as `size={{ xs: 12, md: 6 }}`, as an array `size={[12, 6]}` (from `xs`) or with the individual `xs`, `sm`, `md`, `lg`, `xl` props (the `data-xs`… attributes of vanilla); the individual props win over `size`.

## Columns

Each item takes `n/12` of the width. When the sum exceeds 12, the next items wrap to a new line.

{{< react-demo id="grid/02-columns" layout="block" >}}

## Breakpoints

Mobile-first: each value applies from its minimum width upwards. `xs` 0px · `sm` 600px · `md` 900px · `lg` 1200px · `xl` 1536px. Always declare `xs` as the base.

{{< react-demo id="grid/03-breakpoints" layout="block" >}}

## Spacing

`spacing={n}` separates rows and columns by `n × 8px` using CSS `gap`, like MUI Grid v2. There are no negative margins or item paddings, so the grid never overflows its parent and needs no `overflow: hidden` wrapper. Each column width subtracts its proportional share of the gap (`100% · n/12 − gap · (12 − n)/12`), so 12 columns always add up to 100%.

Any integer from `0` to `12` is valid, plus the half steps `0.5`, `1.5` and `2.5` (4, 12 and 20px). Values outside the scale are ignored with a warning in development. Spacing only applies to containers.

{{< react-demo id="grid/04-spacing" layout="block" >}}

### Row and column spacing

`rowSpacing` and `columnSpacing` set the vertical and horizontal gap independently.

{{< react-demo id="grid/05-row-column-spacing" layout="block" >}}

### Responsive spacing

`spacing`, `rowSpacing` and `columnSpacing` accept an object per breakpoint (or an array from `xs`).

{{< react-demo id="grid/06-responsive-spacing" layout="block" >}}

## Auto-layout

`size="grow"` (or `true`, e.g. `xs` as a boolean prop) makes the item grow and share the remaining space with the other growing items. `size="auto"` sizes the item to its content width (`flex: 0 0 auto`).

{{< react-demo id="grid/07-auto-layout" layout="block" >}}

## Alignment and direction

`justifyContent` distributes the items horizontally (`flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`) and `alignItems` aligns them vertically (`flex-start`, `center`, `flex-end`, `stretch`, `baseline`). The short aliases `start`, `end`, `between`, `around` and `evenly` are accepted too.

{{< react-demo id="grid/08-alignment" layout="block" >}}

`direction` changes the flow (`row`, `row-reverse`, `column`, `column-reverse`) and `wrap` the line wrapping (`wrap` by default, `nowrap`, `wrap-reverse`).

{{< react-demo id="grid/09-direction" layout="block" >}}

## Nested grid

An item with `container` is also a container: inside it there are 12 columns again, with their own spacing.

{{< react-demo id="grid/10-nested" layout="block" >}}

## Real-world examples

A dashboard with metrics (1 → 2 → 4 columns) and a main block with a sidebar, plus a form that stacks on mobile. `component` renders the grid as any element (`ul`, `section`, `form`…).

{{< react-demo id="grid/11-real-world" layout="block" >}}

## Controlled props

In vanilla, `setSpacing(n, bp?)`, `setRowSpacing()`, `setColumnSpacing()`, `setJustifyContent()`, `setAlignItems()` and `setDirection()` replace classes and new items are registered with `Materix.init()`. In React the props are the API and new items are just new children.

{{< react-demo id="grid/12-controlled" layout="block" >}}

## Full BEM syntax

With the classes written by hand the grid works without the component.

{{< react-demo id="grid/13-bem" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `container` | `boolean` | `false` | 12-column flex container. Without `container` or a size, Grid acts as a container. |
| `item` | `boolean` | `false` | Forces the item role without a size. |
| `size` | `GridResponsive<GridSize>` | — | Columns per breakpoint (MUI Grid v2). |
| `xs`, `sm`, `md`, `lg`, `xl` | `GridSize` | — | Columns from that breakpoint (override `size`). |
| `spacing` | `GridResponsive<GridSpacing>` | — | Row and column gap × 8px (containers only). |
| `rowSpacing` | `GridResponsive<GridSpacing>` | — | Row gap × 8px. |
| `columnSpacing` | `GridResponsive<GridSpacing>` | — | Column gap × 8px. |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` | — (`row`) | Flex direction. |
| `wrap` | `'wrap' \| 'nowrap' \| 'wrap-reverse'` | — (`wrap`) | Line wrapping. |
| `justifyContent` | `'flex-start' \| 'center' \| 'flex-end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | — | Horizontal distribution. |
| `alignItems` | `'flex-start' \| 'center' \| 'flex-end' \| 'stretch' \| 'baseline'` | — | Vertical alignment. |
| `component` | `ElementType` | `'div'` | Root element or component. |
| `className` | `string` | — | Merged with the component classes. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

`GridSize` is `1`–`12`, `true` / `'grow'` or `'auto'`. `GridSpacing` is `0`–`12`, `0.5`, `1.5` or `2.5`. `GridResponsive<T>` is `T`, `{ xs?, sm?, md?, lg?, xl? }` or an array from `xs`. Any other prop is forwarded to the root element. The helpers `normalizeGridSize()` and `normalizeGridSpacing()` are exported too.

### Equivalence with vanilla

| Vanilla | React |
|---|---|
| `data-mtx="grid"` (no size) | `<Grid>` or `<Grid container>` |
| `data-mtx="grid" data-xs="12" data-md="6"` | `<Grid size={{ xs: 12, md: 6 }}>` or `<Grid xs={12} md={6}>` |
| `data-xs="true"` / `data-xs="auto"` | `size="grow"` (or `xs`) / `size="auto"` |
| `data-container` / `data-item` | `container` / `item` |
| `data-spacing="2"` / `data-spacing-md="3"` | `spacing={2}` / `spacing={{ md: 3 }}` |
| `data-row-spacing`, `data-column-spacing` (+ `-{bp}`) | `rowSpacing`, `columnSpacing` |
| `data-direction` | `direction` |
| `data-justify` | `justifyContent` |
| `data-align` | `alignItems` |
| `mtx-grid--wrap-*` (CSS only) | `wrap` |
| `setSpacing()`, `setRowSpacing()`, `setColumnSpacing()`, `setDirection()`, `setJustifyContent()`, `setAlignItems()` | Change the matching prop. |
| `isContainer`, `isItem` | Derived from `container`, `item` and the sizes. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-grid` | Base class of every container and item. |
| `mtx-grid--container` | 12-column flex container with `gap`. |
| `mtx-grid--item` | Grid item. |
| `mtx-grid--{bp}-{1..12\|true\|auto}` | Columns from a breakpoint. |
| `mtx-grid--spacing-{n}` / `mtx-grid--{bp}-spacing-{n}` | Row and column gap (`2_5` for 2.5). |
| `mtx-grid--row-spacing-{n}`, `mtx-grid--column-spacing-{n}` (+ `{bp}-`) | Row or column gap only. |
| `mtx-grid--direction-{value}` | Flex direction. |
| `mtx-grid--wrap-{wrap\|nowrap\|reverse}` | Line wrapping. |
| `mtx-grid--justify-{value}` | Horizontal distribution. |
| `mtx-grid--align-{value}` | Vertical alignment. |

### Callbacks

`Grid` has no events of its own.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-spacing-unit` | Spacing unit (8px). |
| `--mtx-grid-parent-column-spacing` | Column gap of the parent container, subtracted from each item width. |

## Accessibility

- The grid is purely visual: it adds no roles and doesn't change semantics. Use meaningful elements (`component="main"`, `"section"`, `"form"`) for the blocks you lay out.
- Reading and tab order follow the JSX, not the visual position. With `direction="row-reverse"` or `column-reverse` the visual order is reversed but the keyboard order isn't: only use them when the order doesn't matter.
- Check that the content remains readable at a width of 320px (WCAG 1.4.10): always set `xs` so the columns stack on mobile.
