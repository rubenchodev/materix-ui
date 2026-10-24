---
title: "Paper"
description: "The base Material Design surface, with background, border radius and shadow, that groups content and expresses elevation."
group: "surfaces"
icon: "layers"
weight: 30
example: "paper"
import: "Paper"
mui: "https://mui.com/material-ui/react-paper/"
---

**Paper** is the physical surface of Material Design: a container with a paper background, a 4px border radius and a shadow that conveys its elevation. It is the visual foundation of Card, Dialog, Menu and AppBar. Use it to group arbitrary content on top of the page background; if the block has a header, an image and actions, use a Card directly.

```tsx
import { Paper } from '@rubenchodev/materix-react';
// or only this component:
import { Paper } from '@rubenchodev/materix-react/components/paper';
```

## Basic usage

`<Paper>` renders a `<div class="mtx-paper">` with elevation 1. Change the shadow with `elevation`.

{{< react-demo id="paper/01-basic" layout="block" >}}

## Variants

The default variant (`elevation`) sets the surface apart with a shadow. `variant="outlined"` outlines it with a 1px border (`--mtx-color-divider`) and no shadow; `elevation={0}` makes it flat.

{{< react-demo id="paper/02-variants" layout="block" >}}

## Elevations

Only MUI elevations **0 to 8, 12, 16 and 24** exist as tokens (`--mtx-elevation-*`). Any other value generates an unstyled class and the surface keeps the base elevation 1.

{{< react-demo id="paper/03-elevations" layout="block" >}}

| Typical use (MUI) | Elevation |
|---|---|
| Card at rest, base Paper | 1 |
| AppBar | 4 |
| Raised Card, Menu | 8 |
| Drawer | 16 |
| Dialog | 24 |

## Shape

Corners use `--mtx-shape-radius` (4px). `square` makes them straight, which is useful for surfaces flush with the edges of the viewport.

{{< react-demo id="paper/04-shape" layout="block" >}}

## Dark theme

Paper consumes `--mtx-color-background-paper` and `--mtx-color-text-primary`, so it follows the theme. `data-mtx-theme="dark"` also works on a specific container. In the dark theme, as in MUI, each elevation adds a white overlay (`--mtx-overlay-elevation-N`) through `background-image`, so higher surfaces look lighter; `outlined` has no overlay.

{{< react-demo id="paper/05-dark-theme" layout="block" >}}

## Grid

Paper is the usual container for grid items: the column sets the width and Paper provides the surface.

{{< react-demo id="paper/06-grid" layout="block" >}}

## Programmatic usage

There is nothing to initialize: `elevation`, `variant` and `square` are ordinary props, so changing them updates the classes on the next render.

{{< react-demo id="paper/07-programmatic" layout="block" >}}

## Semantic element and composition

`component` changes the root tag (`section`, `article`, `aside`…) without changing the look. Combine it with [Typography](../typography/) for the content.

{{< react-demo id="paper/08-composition" layout="block" >}}

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `elevation` | `0`–`8` \| `12` \| `16` \| `24` | — | Adds `.mtx-paper--elevation-{n}`. Without it the base shadow (elevation 1) applies. |
| `variant` | `'elevation'` \| `'outlined'` | `'elevation'` | `outlined` adds `.mtx-paper--outlined` (border, no shadow). |
| `square` | `boolean` | `false` | Adds `.mtx-paper--square` (no border radius). |
| `component` | `ElementType` | `'div'` | Root element or component. |
| `className` | `string` | — | Merged with the component classes. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

Any other prop (`id`, `style`, `aria-*`, `data-*`, events) is forwarded to the root element.

### Callbacks

Paper emits no events.

### CSS classes

| Class | Description |
|---|---|
| `.mtx-paper` | Paper background, primary text color, 4px radius and elevation 1. |
| `.mtx-paper--elevation-{n}` | `--mtx-elevation-{n}` shadow for n = 0–8, 12, 16, 24. |
| `.mtx-paper--outlined` | 1px `--mtx-color-divider` border, no shadow (wins over any elevation class). |
| `.mtx-paper--square` | `border-radius: 0`. |

## Accessibility

- Paper is purely visual and adds no roles or ARIA: pick the semantic element with `component` (`section`, `article`, `aside`) and give it a heading (`aria-labelledby`) when it groups relevant content.
- Elevation does not convey information on its own; use `outlined` or a heading when the surface must be clearly delimited.
- It is not interactive: if the whole surface must be clickable, use a Card with an action area.

## Vanilla equivalence

| Vanilla (`data-*`) | React |
|---|---|
| `<div data-mtx="paper">` | `<Paper>` |
| `data-elevation="8"` | `elevation={8}` |
| `data-variant="outlined"` | `variant="outlined"` |
| `data-square` | `square` |
| `Materix.init(el, 'paper')` | Not needed: render `<Paper>` |

The rendered DOM (classes and attributes) is identical to the vanilla component after initialization.
