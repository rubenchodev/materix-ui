---
title: "Grid"
description: "A 12-column flexbox grid with five breakpoints (xs–xl), gap-based spacing in multiples of 8px (also per breakpoint) and alignment, for responsive layouts."
group: "layout"
icon: "grid_view"
weight: 10
example: "grid"
mui: "https://mui.com/material-ui/react-grid/"
---

`Grid` splits the available width into 12 columns and lets each item declare how many it spans at each breakpoint, just like MUI's `Grid` (v2: flexbox with `gap`, no negative margins). Use it to lay out pages, forms and dashboards that change their number of columns with the screen width. To stack elements in a single direction with a fixed gap you don't need a grid: use [Stack]({{< relref "/components/stack" >}}); to center and cap the page width, [Container]({{< relref "/components/container" >}}).

## Basic usage

A `data-mtx="grid"` container with `data-spacing` and, inside it, `data-mtx="grid"` items with the number of columns per breakpoint (`data-xs`, `data-sm`, `data-md`, `data-lg`, `data-xl`). An element with any `data-{breakpoint}` becomes an item; with none, a container.

{{< mtx-demo title="Four columns on desktop, two on tablet, one on mobile" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=12 sm=6 md=3</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=12 sm=6 md=3</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=12 sm=6 md=3</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=12 sm=6 md=3</div></div>
</div>
{{< /mtx-demo >}}

## Columns

Each item spans `n/12` of the width: `data-xs="6"` is half, `data-xs="4"` a third. If a row adds up to more than 12, the items wrap onto the next line.

{{< mtx-demo title="Fractions of 12" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="8"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=8</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=4</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=4</div></div>
  <div data-mtx="grid" data-xs="8"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=8</div></div>
</div>
{{< /mtx-demo >}}

## Breakpoints

Breakpoints are *mobile-first*: a value applies from that width upward until a larger breakpoint overrides it. If you only set `data-md="6"`, the item has no fixed width below 900px (it fits its content); always declare `data-xs` as the base.

| Breakpoint | Attribute | Minimum width | Typical device |
|---|---|---|---|
| `xs` | `data-xs` | 0px | Mobile |
| `sm` | `data-sm` | 600px | Portrait tablet |
| `md` | `data-md` | 900px | Landscape tablet and small laptop |
| `lg` | `data-lg` | 1200px | Desktop |
| `xl` | `data-xl` | 1536px | Wide monitor |

{{< mtx-demo title="Resize the window" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">A</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">B</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">C</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">D</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">E</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">F</div></div>
</div>
{{< /mtx-demo >}}

## Spacing

`data-spacing="n"` separates rows and columns by `n × 8px` using CSS `gap`, like MUI Grid v2. There are no negative margins or item paddings, so the grid never overflows its parent and needs no `overflow: hidden` wrapper. Each column width subtracts its proportional share of the gap (`100% · n/12 − gap · (12 − n)/12`), so 12 columns always add up to 100%.

Any integer from `0` to `12` is valid (`n × --mtx-spacing-unit`, 8px by default), plus the half steps of the utilities scale `0.5`, `1.5` and `2.5` (4, 12 and 20px; they can also be written `0_5`, `1_5`, `2_5`, which is the class suffix).

{{< mtx-demo title="spacing 0, 2, 4 and 7" layout="column" >}}
<div data-mtx="grid" data-spacing="0">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">0</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">0</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">0</div></div>
</div>
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">16px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">16px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">16px</div></div>
</div>
<div data-mtx="grid" data-spacing="4">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">32px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">32px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">32px</div></div>
</div>
<div data-mtx="grid" data-spacing="7">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">56px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">56px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">56px</div></div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Half steps: 0.5, 1.5 and 2.5" layout="column" >}}
<div data-mtx="grid" data-spacing="0.5">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">4px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">4px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">4px</div></div>
</div>
<div data-mtx="grid" data-spacing="1.5">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">12px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">12px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">12px</div></div>
</div>
<div data-mtx="grid" data-spacing="2.5">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">20px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">20px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">20px</div></div>
</div>
{{< /mtx-demo >}}

### Row and column spacing

`data-row-spacing` and `data-column-spacing` set each axis separately and override `data-spacing` on that axis.

{{< mtx-demo title="8px between rows, 32px between columns" layout="block" >}}
<div data-mtx="grid" data-row-spacing="1" data-column-spacing="4">
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">A</div></div>
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">B</div></div>
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">C</div></div>
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">D</div></div>
</div>
{{< /mtx-demo >}}

### Responsive spacing

Add `-{bp}` to any of the three attributes (`data-spacing-md`, `data-row-spacing-lg`, `data-column-spacing-sm`…). Like the columns, the value applies from that breakpoint up.

{{< mtx-demo title="8px on mobile, 24px from 900px, 40px from 1200px" layout="block" >}}
<div data-mtx="grid" data-spacing="1" data-spacing-md="3" data-spacing-lg="5">
  <div data-mtx="grid" data-xs="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div></div>
  <div data-mtx="grid" data-xs="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div></div>
  <div data-mtx="grid" data-xs="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div></div>
  <div data-mtx="grid" data-xs="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">4</div></div>
</div>
{{< /mtx-demo >}}

## Auto-layout

`true` makes the item grow to share the remaining space equally with the other growing items. `auto` sizes the item to the width of its content (`flex: 0 0 auto`), like MUI's `size="auto"`. You can mix both with fixed columns.

{{< mtx-demo title="Growing columns (true)" layout="column" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
</div>
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=6</div></div>
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Content-width columns (auto)" layout="column" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="auto"><div class="mtx-paper mtx-paper--outlined mtx-p-2">auto: fits its content</div></div>
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true: takes the rest</div></div>
  <div data-mtx="grid" data-xs="auto"><div class="mtx-paper mtx-paper--outlined mtx-p-2">auto</div></div>
</div>
{{< /mtx-demo >}}

## Alignment and direction

On the container, `data-justify` aligns along the main axis, `data-align` along the cross axis and `data-direction` changes the flow direction.

{{< mtx-demo title="Horizontal and vertical centering" layout="column" >}}
<div data-mtx="grid" data-spacing="2" data-justify="center">
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">center</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">center</div></div>
</div>
<div data-mtx="grid" data-spacing="2" data-justify="space-between" data-align="center">
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-1">short</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-4">tall</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-1">short</div></div>
</div>
<div data-mtx="grid" data-spacing="2" data-direction="row-reverse">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div></div>
</div>
{{< /mtx-demo >}}

`data-justify`: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`. `data-align`: `flex-start`, `center`, `flex-end`, `stretch`, `baseline`. `data-direction`: `row`, `row-reverse`, `column`, `column-reverse`. Line wrapping is controlled with the `mtx-grid--wrap-wrap`, `mtx-grid--wrap-nowrap` and `mtx-grid--wrap-reverse` classes (there's no `data-*` attribute).

{{< callout type="info" title="No offsets or ordering" >}}
Materix doesn't include offsets (`offset`) or per-breakpoint ordering. To push columns, use `data-justify` on the container or an empty item of the desired width; to reverse the order, `data-direction="row-reverse"`.
{{< /callout >}}

## Nested grid

An item can also be a container: add `data-container` next to its columns and define another 12-column grid inside it.

{{< mtx-demo title="Item that is also a container" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="8" data-container data-spacing="1">
    <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">nested 6</div></div>
    <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">nested 6</div></div>
    <div data-mtx="grid" data-xs="12"><div class="mtx-paper mtx-paper--outlined mtx-p-2">nested 12</div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">md=4</div></div>
</div>
{{< /mtx-demo >}}

## Real-world examples

Dashboard: four KPIs that go from one to four columns and, below them, a main block with a sidebar.

{{< mtx-demo title="Dashboard layout" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-lg="3">
    <div data-mtx="card"><div data-mtx="card-content"><span data-mtx="typography" data-variant="overline">Sales</span><div data-mtx="typography" data-variant="h5" data-gutter-bottom>$24,300</div></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-lg="3">
    <div data-mtx="card"><div data-mtx="card-content"><span data-mtx="typography" data-variant="overline">Orders</span><div data-mtx="typography" data-variant="h5" data-gutter-bottom>1,284</div></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-lg="3">
    <div data-mtx="card"><div data-mtx="card-content"><span data-mtx="typography" data-variant="overline">Customers</span><div data-mtx="typography" data-variant="h5" data-gutter-bottom>312</div></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-lg="3">
    <div data-mtx="card"><div data-mtx="card-content"><span data-mtx="typography" data-variant="overline">Conversion</span><div data-mtx="typography" data-variant="h5" data-gutter-bottom>3.4%</div></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="8">
    <div data-mtx="card"><div data-mtx="card-content"><div data-mtx="typography" data-variant="h6" data-gutter-bottom>Recent activity</div><p data-mtx="typography" data-variant="body2">Main block: spans 8 of 12 columns from 900px.</p></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <div data-mtx="card"><div data-mtx="card-content"><div data-mtx="typography" data-variant="h6" data-gutter-bottom>Tasks</div><p data-mtx="typography" data-variant="body2">Sidebar: 4 columns on desktop, full width on mobile.</p></div></div>
  </div>
</div>
{{< /mtx-demo >}}

A two-column form that stacks on mobile:

{{< mtx-demo title="Responsive form" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6"><input data-mtx="text-field" data-label="First name" data-variant="outlined" type="text"></div>
  <div data-mtx="grid" data-xs="12" data-sm="6"><input data-mtx="text-field" data-label="Last name" data-variant="outlined" type="text"></div>
  <div data-mtx="grid" data-xs="12" data-md="8"><input data-mtx="text-field" data-label="Email" data-variant="outlined" type="email"></div>
  <div data-mtx="grid" data-xs="12" data-md="4"><input data-mtx="text-field" data-label="Phone" data-variant="outlined" type="tel"></div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

The classes work without JavaScript. The container has `mtx-grid--container` and a spacing class; each item has `mtx-grid--item` and one class per breakpoint.

```html
<div class="mtx-grid mtx-grid--container mtx-grid--spacing-2 mtx-grid--justify-center">
  <div class="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6">…</div>
  <div class="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6">…</div>
</div>
```

The `mtx-grid-container` / `mtx-grid-item` aliases and the `data-mtx="grid-container"` / `data-mtx="grid-item"` values are also accepted.

## Programmatic usage

```javascript
// Retrieve the container and change its configuration
const grid = Materix.getInstance(document.getElementById('products'));
grid.setSpacing(3);                 // mtx-grid--spacing-3
grid.setJustifyContent('center');   // mtx-grid--justify-center
grid.setAlignItems('stretch');      // mtx-grid--align-stretch
grid.setDirection('row-reverse');   // mtx-grid--direction-row-reverse

// Add a dynamic item
const item = document.createElement('div');
item.setAttribute('data-xs', '6');
grid.element.append(item);
Materix.init(item, 'grid');
```

With ES modules:

```javascript
import { Grid, getInstance } from '@rubenchodev/materix-ui';
const grid = new Grid(document.getElementById('products'));
```

{{< mtx-demo title="Spacing and alignment through the API" layout="block" >}}
<div class="mtx-mb-2">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-grid-spacing="0">spacing 0</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-grid-spacing="2">spacing 2</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-grid-spacing="4">spacing 4</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-grid-justify="flex-end">justify flex-end</button>
</div>
<div id="doc-grid-api" data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div></div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const grid = Materix.getInstance(document.getElementById('doc-grid-api'));
  document.querySelectorAll('[data-doc-grid-spacing]').forEach((btn) => {
    btn.addEventListener('click', () => grid.setSpacing(Number(btn.dataset.docGridSpacing)));
  });
  document.querySelectorAll('[data-doc-grid-justify]').forEach((btn) => {
    btn.addEventListener('click', () => grid.setJustifyContent(btn.dataset.docGridJustify));
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `grid`, `grid-container`, `grid-item` | — | Initializes the component. `grid-container` / `grid-item` force the role. |
| `data-xs` · `data-sm` · `data-md` · `data-lg` · `data-xl` | `1`–`12`, `auto`, `true` | — | Columns from that breakpoint. Their presence makes the element an item. |
| `data-container` | boolean | — | Forces the container role (needed for an item that is also a container). |
| `data-item` | boolean | — | Forces the item role without setting columns. |
| `data-spacing` | `0`–`12`, `0.5`, `1.5`, `2.5` | — | `n × 8px` gap between rows and columns (containers only). |
| `data-row-spacing` · `data-column-spacing` | `0`–`12`, `0.5`, `1.5`, `2.5` | — | Gap on a single axis; overrides `data-spacing` on that axis. |
| `data-spacing-{bp}` · `data-row-spacing-{bp}` · `data-column-spacing-{bp}` | `0`–`12`, `0.5`, `1.5`, `2.5` | — | Same, from breakpoint `bp` (`sm`, `md`, `lg`, `xl`) up. |
| `data-justify` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | `flex-start` | Container `justify-content`. |
| `data-align` | `flex-start`, `center`, `flex-end`, `stretch`, `baseline` | `stretch` | Container `align-items`. |
| `data-direction` | `row`, `row-reverse`, `column`, `column-reverse` | `row` | Container `flex-direction`. |

An element without `data-{breakpoint}`, `data-item` or `data-container` is treated as a container.

### CSS classes

| Class | Description |
|---|---|
| `mtx-grid` | Base class (added by the JS). |
| `mtx-grid--container` · `mtx-grid-container` | Flex container with `flex-wrap: wrap` and 100% width. |
| `mtx-grid--item` · `mtx-grid-item` | Item (`box-sizing: border-box`). |
| `mtx-grid--{bp}-{1..12}` | `n/12` width from breakpoint `bp` (`xs`, `sm`, `md`, `lg`, `xl`). |
| `mtx-grid--{bp}-true` | Item that grows to share the remaining space. |
| `mtx-grid--{bp}-auto` | Item sized to its content width (`flex: 0 0 auto`). |
| `mtx-grid--spacing-{n}` | `row-gap` and `column-gap` of `n × 8px` (`0`–`12`, `0_5`, `1_5`, `2_5`). |
| `mtx-grid--row-spacing-{n}` · `mtx-grid--column-spacing-{n}` | Gap on a single axis. |
| `mtx-grid--{bp}-spacing-{n}` · `mtx-grid--{bp}-row-spacing-{n}` · `mtx-grid--{bp}-column-spacing-{n}` | Responsive variants (`sm`, `md`, `lg`, `xl`). |
| `mtx-grid--justify-{value}` | `justify-content`. |
| `mtx-grid--align-{value}` | `align-items`. |
| `mtx-grid--direction-{value}` | `flex-direction`. |
| `mtx-grid--wrap-wrap` · `--wrap-nowrap` · `--wrap-reverse` | `flex-wrap` (class only). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `setSpacing(n, bp?)` | `void` | Replaces the spacing class (of breakpoint `bp` if given). Only works on containers; accepts `0`–`12` and the half steps `0.5`, `1.5`, `2.5`; other values are ignored with a warning. |
| `setRowSpacing(n, bp?)` · `setColumnSpacing(n, bp?)` | `void` | Same for a single axis. |
| `setJustifyContent(value)` | `void` | Replaces the `mtx-grid--justify-*` class. |
| `setAlignItems(value)` | `void` | Replaces the `mtx-grid--align-*` class. |
| `setDirection(value)` | `void` | Replaces the `mtx-grid--direction-*` class. |
| `isContainer` (getter) | `boolean` | `true` if the element is a container. |
| `isItem` (getter) | `boolean` | `true` if the element is an item. |

### Events

`Grid` doesn't emit events.

### CSS variables

| Variable | Description |
|---|---|
| `--mtx-spacing-unit` | Spacing unit (8px). `data-spacing="n"` produces a gap of `n × --mtx-spacing-unit`. |
| `--mtx-grid-parent-column-spacing` | Internal: the parent's horizontal gap, set on each direct child so column widths can subtract it. Don't set it by hand. |

## Accessibility

- The grid is purely visual: it adds no roles and doesn't change semantics. Use meaningful elements (`<main>`, `<section>`, `<form>`) for the blocks you lay out.
- Reading and tab order follow the HTML, not the visual position. With `data-direction="row-reverse"` or `column-reverse` the visual order is reversed but the keyboard order isn't: only use them when the order doesn't matter.
- Check that the content remains readable at a width of 320px (WCAG 1.4.10): always set `data-xs` so the columns stack on mobile.
