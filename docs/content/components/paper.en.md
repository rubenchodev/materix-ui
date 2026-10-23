---
title: "Paper"
description: "The base Material Design surface, with background, border radius and shadow, that groups content and expresses elevation."
group: "surfaces"
icon: "layers"
weight: 30
example: "paper"
mui: "https://mui.com/material-ui/react-paper/"
---

**Paper** is the physical surface of Material Design: a container with a paper background, a 4px border radius and a shadow that conveys its elevation. It is the visual foundation of [Card](../card/), [Dialog](../dialog/), [Menu](../menu/) and [AppBar](../app-bar/). Use it to group arbitrary content on top of the page background; if the block has a header, an image and actions, use a [Card](../card/) directly.

## Basic usage

A `<div data-mtx="paper">` gets the `.mtx-paper` class with elevation 1. Change the shadow with `data-elevation`.

{{< mtx-demo title="Simple Paper" >}}
<div data-mtx="paper" class="mtx-p-3">Elevation 1 (default)</div>
<div data-mtx="paper" data-elevation="8" class="mtx-p-3">Elevation 8</div>
{{< /mtx-demo >}}

## Variants

The default variant sets the surface apart with a shadow. `data-variant="outlined"` outlines it with a 1px border (`--mtx-color-divider`) and no shadow; `data-elevation="0"` makes it flat.

{{< mtx-demo title="Elevation, outlined and flat" >}}
<div data-mtx="paper" class="mtx-p-3">Shadow</div>
<div data-mtx="paper" data-variant="outlined" class="mtx-p-3">Border</div>
<div data-mtx="paper" data-elevation="0" class="mtx-p-3">Flat</div>
{{< /mtx-demo >}}

## Elevations

Only MUI elevations **0 to 8, 12, 16 and 24** exist as tokens (`--mtx-elevation-*`). Any other `data-elevation` value generates an unstyled class and the surface keeps elevation 1.

{{< mtx-demo title="Elevation scale" >}}
<div data-mtx="paper" data-elevation="0" class="mtx-p-3">0</div>
<div data-mtx="paper" data-elevation="1" class="mtx-p-3">1</div>
<div data-mtx="paper" data-elevation="2" class="mtx-p-3">2</div>
<div data-mtx="paper" data-elevation="3" class="mtx-p-3">3</div>
<div data-mtx="paper" data-elevation="4" class="mtx-p-3">4</div>
<div data-mtx="paper" data-elevation="6" class="mtx-p-3">6</div>
<div data-mtx="paper" data-elevation="8" class="mtx-p-3">8</div>
<div data-mtx="paper" data-elevation="12" class="mtx-p-3">12</div>
<div data-mtx="paper" data-elevation="16" class="mtx-p-3">16</div>
<div data-mtx="paper" data-elevation="24" class="mtx-p-3">24</div>
{{< /mtx-demo >}}

| Typical use (MUI) | Elevation |
|---|---|
| Card at rest, base Paper | 1 |
| Raised Card (`raised`), Menu | 8 |
| AppBar | 4 |
| Drawer | 16 |
| Dialog | 24 |

## Shape

Corners use `--mtx-shape-radius` (4px). `data-square` makes them straight, which is useful for surfaces flush with the edges of the viewport.

{{< mtx-demo title="Rounded and square" >}}
<div data-mtx="paper" data-elevation="3" class="mtx-p-3">Rounded</div>
<div data-mtx="paper" data-elevation="3" data-square class="mtx-p-3">Square</div>
<div data-mtx="paper" data-variant="outlined" data-square class="mtx-p-3">Outlined square</div>
{{< /mtx-demo >}}

## Dark theme

Paper consumes `--mtx-color-background-paper` and `--mtx-color-text-primary`, so it follows the theme without touching the component. The `data-mtx-theme="dark"` attribute also works on a specific container. In the dark theme, as in MUI, each elevation adds a white overlay (`--mtx-overlay-elevation-N`, alpha = (4.5·ln(N+1) + 2) / 100) through `background-image`, so higher surfaces look lighter even though the shadow is barely visible. `outlined` has no overlay.

{{< mtx-demo title="Surfaces inside a dark container" layout="block" >}}
<div data-mtx-theme="dark" class="mtx-stack mtx-stack--row mtx-stack--spacing-2 mtx-p-3" style="flex-wrap: wrap; background: var(--mtx-color-background-default);">
  <div data-mtx="paper" data-elevation="0" class="mtx-p-3">Elevation 0</div>
  <div data-mtx="paper" data-elevation="1" class="mtx-p-3">Elevation 1</div>
  <div data-mtx="paper" data-elevation="4" class="mtx-p-3">Elevation 4</div>
  <div data-mtx="paper" data-elevation="8" class="mtx-p-3">Elevation 8</div>
  <div data-mtx="paper" data-elevation="24" class="mtx-p-3">Elevation 24</div>
  <div data-mtx="paper" data-variant="outlined" class="mtx-p-3">Outlined</div>
</div>
{{< /mtx-demo >}}

## Real-world examples

### Summary panel in a grid

Paper is the usual container for [Grid](../grid/) items: the column sets the width and Paper provides the surface.

{{< mtx-demo title="KPIs" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <div data-mtx="paper" class="mtx-p-3">
      <div class="mtx-typography mtx-typography--overline">Sales</div>
      <div class="mtx-typography mtx-typography--h5 mtx-typography--gutter-bottom">$12,480</div>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <div data-mtx="paper" class="mtx-p-3">
      <div class="mtx-typography mtx-typography--overline">Orders</div>
      <div class="mtx-typography mtx-typography--h5 mtx-typography--gutter-bottom">326</div>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <div data-mtx="paper" data-variant="outlined" class="mtx-p-3">
      <div class="mtx-typography mtx-typography--overline">Returns</div>
      <div class="mtx-typography mtx-typography--h5 mtx-typography--gutter-bottom">4</div>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

The classes can be written directly (SSR or templates); the component does not duplicate the ones that already exist.

```html
<div class="mtx-paper mtx-paper--elevation-2" data-mtx="paper">...</div>
<div class="mtx-paper mtx-paper--outlined mtx-paper--square" data-mtx="paper">...</div>
```

## Programmatic usage

Paper has no methods or events of its own: it only translates its `data-*` attributes into classes on initialization (once). To change the elevation afterwards, toggle the `mtx-paper--elevation-*` classes.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.setAttribute('data-elevation', '4');
container.append(el);

const paper = Materix.init(el, 'paper');   // or: new Materix.Paper(el)
Materix.getInstance(el) === paper;         // true
el.className;                              // "mtx-paper mtx-paper--elevation-4"
```

```javascript
// ES modules
import { Paper } from '@rubenchodev/materix-ui';
new Paper(document.querySelector('#panel'));
```

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `paper` | — | Initializes the component and adds `.mtx-paper`. |
| `data-elevation` | `0`–`8`, `12`, `16`, `24` | — (elevation 1 shadow) | Adds `.mtx-paper--elevation-{n}`. |
| `data-variant` | `outlined` | — | Adds `.mtx-paper--outlined` (border, no shadow). |
| `data-square` | boolean (presence) | absent | Adds `.mtx-paper--square` (no border radius). |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-paper` | Paper background, primary text color, 4px border radius and elevation 1. |
| `.mtx-paper--elevation-{n}` | `--mtx-elevation-{n}` shadow for n = 0–8, 12, 16, 24. |
| `.mtx-paper--outlined` | 1px `--mtx-color-divider` border and no shadow. |
| `.mtx-paper--square` | `border-radius: 0`. |

{{< callout type="info" >}}
The elevation classes are declared after `--outlined` in the stylesheet: if you combine `data-variant="outlined"` with `data-elevation`, the shadow comes back. Use one or the other.
{{< /callout >}}

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-background-paper` | Background. |
| `--mtx-color-text-primary` | Text color. |
| `--mtx-color-divider` | `outlined` border. |
| `--mtx-shape-radius` | Corner radius. |
| `--mtx-elevation-0` … `--mtx-elevation-8`, `--mtx-elevation-12`, `--mtx-elevation-16`, `--mtx-elevation-24` | Shadows. |
| `--mtx-overlay-elevation-{n}` | White overlay per elevation in the dark theme (`background-image`); `none` in light and in `outlined`. |
| `--mtx-duration-short` / `--mtx-easing-standard` | Shadow transition. |

## Accessibility

- Paper is purely visual and adds no roles or ARIA: use the appropriate semantic element (`<section>`, `<article>`, `<aside>`) and give it a heading if it groups relevant content.
- Elevation does not convey information on its own; in the dark theme the white overlay helps, but use `outlined` or a heading when the surface must be clearly delimited.
- It is not interactive: if the whole surface must be clickable, use a [Card](../card/) with `data-clickable` or a `CardActionArea`.
