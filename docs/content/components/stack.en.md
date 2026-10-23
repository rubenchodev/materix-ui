---
title: "Stack"
description: "Stacks elements in one direction (column or row) with even spacing, alignment, wrapping, dividers and per-breakpoint changes."
group: "layout"
icon: "view_agenda"
weight: 40
example: "stack"
mui: "https://mui.com/material-ui/react-stack/"
---

`Stack` lays out its children one after another in a single direction and separates them with `gap`, like MUI's `Stack`. Use it for forms, action bars, card lists or any block that stacks on mobile and becomes a row on desktop. When content needs columns that line up across rows, use [Grid]({{< relref "/components/grid" >}}); for standalone flex helpers, see the [utilities guide]({{< relref "/guide/utilities" >}}).

## Basic usage

A single `data-mtx="stack"` element. The default direction is column (like MUI) and `data-spacing` sets the gap in multiples of 8px.

{{< mtx-demo title="Column with a 16px gap" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Item 1</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Item 2</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Item 3</div>
</div>
{{< /mtx-demo >}}

## Direction

`data-direction`: `column` (default), `row`, `column-reverse` or `row-reverse`.

{{< mtx-demo title="row and row-reverse" layout="column" >}}
<div data-mtx="stack" data-direction="row" data-spacing="1">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div>
</div>
<div data-mtx="stack" data-direction="row-reverse" data-spacing="1">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div>
</div>
{{< /mtx-demo >}}

## Spacing

Scale `0`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `5`, `6`, `8`, `10` (× 8px). In class names decimals use an underscore (`mtx-stack--spacing-1_5`).

{{< mtx-demo title="0.5, 2 and 4" layout="column" >}}
<div data-mtx="stack" data-direction="row" data-spacing="0.5">
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">4px</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">4px</div>
</div>
<div data-mtx="stack" data-direction="row" data-spacing="2">
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">16px</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">16px</div>
</div>
<div data-mtx="stack" data-direction="row" data-spacing="4">
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">32px</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">32px</div>
</div>
{{< /mtx-demo >}}

## Responsive

`data-direction-{bp}` and `data-spacing-{bp}` (`sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px) change the direction and gap from that width up, mobile-first.

{{< mtx-demo title="Column on mobile, row from 600px" layout="block" >}}
<div data-mtx="stack" data-spacing="1" data-direction-sm="row" data-spacing-sm="2" data-spacing-md="4">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">One</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Two</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Three</div>
</div>
{{< /mtx-demo >}}

## Alignment

`data-align` aligns on the cross axis (`start`, `center`, `end`, `stretch`, `baseline`) and `data-justify` distributes on the main axis (`start`, `center`, `end`, `between`, `around`, `evenly`). CSS values (`flex-start`, `space-between`…) are accepted too.

{{< mtx-demo title="center + between" layout="block" >}}
<div data-mtx="stack" data-direction="row" data-align="center" data-justify="between" class="mtx-border mtx-rounded mtx-p-1">
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">short</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-4">tall</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">short</div>
</div>
{{< /mtx-demo >}}

## Dividers

`data-divider` inserts a `Divider` between each pair of children: horizontal in a column, vertical in a row (also when the direction changes per breakpoint).

{{< mtx-demo title="Row with dividers" layout="block" >}}
<div data-mtx="stack" data-direction="row" data-spacing="2" data-divider>
  <span class="mtx-typography--body2">Inbox</span>
  <span class="mtx-typography--body2">Sent</span>
  <span class="mtx-typography--body2">Spam</span>
</div>
{{< /mtx-demo >}}

## Wrap

`data-wrap` lets children move to the next line; the gap also separates the lines.

{{< mtx-demo title="Wrapping chips" layout="block" >}}
<div data-mtx="stack" data-direction="row" data-spacing="1" data-wrap>
  <div data-mtx="chip" data-label="JavaScript"></div>
  <div data-mtx="chip" data-label="CSS"></div>
  <div data-mtx="chip" data-label="Accessibility"></div>
  <div data-mtx="chip" data-label="Material UI"></div>
  <div data-mtx="chip" data-label="Design tokens"></div>
  <div data-mtx="chip" data-label="Vanilla"></div>
</div>
{{< /mtx-demo >}}

## Real-world examples

A form with right-aligned actions and a profile card, built only with Stack, utilities and components.

{{< mtx-demo title="Form and profile" layout="block" >}}
<div data-mtx="stack" data-spacing="3" data-direction-md="row">
  <form data-mtx="stack" data-spacing="2" class="mtx-flex-1">
    <input data-mtx="text-field" data-label="Name" data-variant="outlined" type="text">
    <input data-mtx="text-field" data-label="Email" data-variant="outlined" type="email">
    <div data-mtx="stack" data-direction="row" data-spacing="1" data-justify="end">
      <button class="mtx-button mtx-button--text" data-mtx="button" type="reset">Cancel</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Save</button>
    </div>
  </form>
  <div data-mtx="stack" data-direction="row" data-spacing="2" data-align="center" class="mtx-flex-1 mtx-mw-100 mtx-align-self-md-start mtx-paper mtx-paper--outlined mtx-p-2">
    <div data-mtx="avatar">LH</div>
    <div data-mtx="stack" class="mtx-flex-1 mtx-min-w-0">
      <span class="mtx-typography--subtitle1 mtx-text-truncate">Lucía Herrera</span>
      <span class="mtx-typography--body2 mtx-color-text-secondary mtx-text-truncate">Product designer · Madrid</span>
    </div>
    <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button">Follow</button>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

The classes work without JavaScript. Automatic dividers need JS; without it, write them by hand:

```html
<div class="mtx-stack mtx-stack--column mtx-stack--sm-row mtx-stack--spacing-1 mtx-stack--sm-spacing-3 mtx-stack--align-center">
  <div>…</div>
  <hr class="mtx-divider mtx-stack__divider" aria-hidden="true">
  <div>…</div>
</div>
```

## Programmatic usage

```javascript
const stack = Materix.getInstance(document.getElementById('actions'));
stack.setDirection('column');
stack.setDirection('row', 'md');   // from 900px
stack.setSpacing(1.5);
stack.setAlign('center');
stack.setJustify('between');
stack.setWrap(true);
stack.setDivider(true);

// After adding or removing children, rebuild the dividers
stack.element.append(newChild);
stack.refresh();
```

With ES modules:

```javascript
import { Stack } from '@rubenchodev/materix-ui';
const stack = new Stack(document.getElementById('actions'));
```

{{< mtx-demo title="Direction and dividers through the API" layout="block" >}}
<div data-mtx="stack" data-direction="row" data-spacing="1" class="mtx-mb-2">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-stack="direction">Toggle direction</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-stack="divider">Toggle dividers</button>
</div>
<div id="doc-stack-api" data-mtx="stack" data-direction="row" data-spacing="2">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const stack = Materix.getInstance(document.getElementById('doc-stack-api'));
  let row = true;
  let divider = false;
  document.querySelector('[data-doc-stack="direction"]').addEventListener('click', () => {
    row = !row;
    stack.setDirection(row ? 'row' : 'column');
  });
  document.querySelector('[data-doc-stack="divider"]').addEventListener('click', () => {
    divider = !divider;
    stack.setDivider(divider);
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `stack` | — | Initializes the component. |
| `data-direction` | `column`, `row`, `column-reverse`, `row-reverse` | `column` | Flow direction. |
| `data-direction-{bp}` | same | — | Direction from breakpoint `sm`, `md`, `lg` or `xl`. |
| `data-spacing` | `0`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `5`, `6`, `8`, `10` | — | `n × 8px` gap. |
| `data-spacing-{bp}` | same | — | Gap from that breakpoint. |
| `data-align` | `start`, `center`, `end`, `stretch`, `baseline` | `stretch` | `align-items`. |
| `data-justify` | `start`, `center`, `end`, `between`, `around`, `evenly` | `start` | `justify-content`. |
| `data-wrap` | boolean | — | `flex-wrap: wrap`. |
| `data-divider` | boolean | — | Inserts a divider between each pair of children. |

Invalid `data-direction` and `data-spacing` values are ignored with a console warning.

### CSS classes

| Class | Description |
|---|---|
| `mtx-stack` | Column flex (`min-width: 0`). |
| `mtx-stack--{row,column,row-reverse,column-reverse}` | Direction. `mtx-stack--col` is kept as an alias of `column`. |
| `mtx-stack--{bp}-{direction}` | Direction from `sm`, `md`, `lg` or `xl`. |
| `mtx-stack--spacing-{n}` · `mtx-stack--{bp}-spacing-{n}` | Gap (`n` = `0`, `0_5`, `1`, `1_5`, `2`, `2_5`, `3`, `4`, `5`, `6`, `8`, `10`). |
| `mtx-stack--align-{start,center,end,stretch,baseline}` | `align-items`. |
| `mtx-stack--justify-{start,center,end,between,around,evenly}` | `justify-content`. |
| `mtx-stack--wrap` | Wrapping. |
| `mtx-stack__divider` | Divider between children: horizontal in a column, vertical in a row. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `setDirection(dir, bp?)` | `void` | Replaces the direction (of `bp` if given). Throws `RangeError` if invalid. |
| `setSpacing(n, bp?)` | `void` | Replaces the gap. Throws `RangeError` outside the scale. |
| `setAlign(value)` | `void` | Replaces the alignment; an unknown value removes it. |
| `setJustify(value)` | `void` | Replaces the distribution; an unknown value removes it. |
| `setWrap(bool)` | `void` | Turns wrapping on or off. |
| `setDivider(bool)` | `void` | Turns dividers on or off and rebuilds them. |
| `refresh()` | `void` | Rebuilds the dividers after the children change (idempotent). |

### Events

`Stack` doesn't emit events.

### CSS variables

| Variable | Description |
|---|---|
| `--mtx-spacing-{n}` | Spacing scale tokens. |
| `--mtx-color-divider` | Divider color (inherited from `Divider`). |

## Accessibility

- Stack adds no roles: use the right semantic element (`<form>`, `<nav>`, `<ul>` with `<li>`…).
- Generated dividers are decorative (`aria-hidden="true"`): the HTML structure already conveys the grouping.
- With `row-reverse` / `column-reverse` the visual order flips but reading and tab order follow the HTML: use them only when the order doesn't matter.
