---
title: "Container"
description: "Centers page content with a per-breakpoint max width and responsive side gutters (16px on mobile, 24px from 600px)."
group: "layout"
icon: "crop_free"
weight: 30
example: "container"
import: "Container"
mui: "https://mui.com/material-ui/react-container/"
---

`Container` is the most basic layout block: it centers its content horizontally, caps it at a max width and adds side padding (gutters) that grows with the screen, just like MUI's `Container`. Use it to wrap `<main>`, landing page sections or a toolbar. To split columns inside it use [Grid]({{< relref "/components/grid" >}}); to stack blocks, [Stack]({{< relref "/components/stack" >}}).

```tsx
import { Container } from '@rubenchodev/materix-react';
// or only this component
import { Container } from '@rubenchodev/materix-react/components/container';
```

## Basic usage

A single `<Container>`. Without `maxWidth` the cap is `lg` (1200px), as in MUI. The shaded area is the container; the inner strip, its gutters.

{{< react-demo id="container/01-basic" layout="block" >}}

## Max width

`maxWidth` sets the cap: `xs` 444px, `sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px or `false` to take the full width.

{{< react-demo id="container/02-max-width" layout="block" >}}

## Fixed

`fixed` makes the max width jump to the minimum of each breakpoint (600, 900, 1200, 1536px) instead of growing fluidly. Useful when the design targets specific widths. Resize the window to see it.

{{< react-demo id="container/03-fixed" layout="block" >}}

## Gutters

By default the container adds 16px of side padding on mobile and 24px from 600px. `disableGutters` removes them, for example to make an image or a table touch the edges.

{{< react-demo id="container/04-gutters" layout="block" >}}

## Grid

Container bounds the width and Grid splits the columns inside it. No wrapper with `overflow` is needed: Grid spaces items with `gap`.

{{< react-demo id="container/05-grid" layout="block" >}}

## Real-world examples

An article page: a full-width header and a reading body capped at `sm` to keep a comfortable line length. `component` renders the right semantic element (`<main>`, `<article>`, `<section>`).

{{< react-demo id="container/06-real-world" layout="block" >}}

## Controlled props

In vanilla, `setMaxWidth()`, `setGutters()` and `setFixed()` swap classes on an existing element. In React the props are the API: change them from state and the component re-renders with the matching classes.

{{< react-demo id="container/07-controlled" layout="block" >}}

## Full BEM syntax

The classes work without the component (for example, in server-rendered markup).

{{< react-demo id="container/08-bem" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false` | — (`lg` in CSS) | Max width cap. `false` takes the full width (`mtx-container--fluid`). |
| `fixed` | `boolean` | `false` | The max width jumps to the minimum of each breakpoint. |
| `disableGutters` | `boolean` | `false` | Removes the 16px / 24px side padding. |
| `component` | `ElementType` | `'div'` | Root element or component (`main`, `section`, `article`…). |
| `className` | `string` | — | Merged with the component classes. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

Any other prop (`id`, `aria-*`, `data-*`, events, `style`) is forwarded to the root element.

### Equivalence with vanilla

| Vanilla | React |
|---|---|
| `data-mtx="container"` | `<Container>` |
| `data-max-width="md"` | `maxWidth="md"` |
| `data-max-width="false"` | `maxWidth={false}` |
| `data-fixed` | `fixed` |
| `data-disable-gutters` | `disableGutters` |
| `setMaxWidth(v)`, `setFixed(b)`, `setGutters(b)` | Change the matching prop. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-container` | Base block: centered, `width: 100%`, gutters. |
| `mtx-container--{xs\|sm\|md\|lg\|xl}` | Max width cap. |
| `mtx-container--fluid` | No cap (`maxWidth={false}`). |
| `mtx-container--fixed` | Width fixed per breakpoint. |
| `mtx-container--disable-gutters` | No side padding. |

### Callbacks

`Container` has no events of its own.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-container-max` | Current width cap (set by the `mtx-container--*` modifiers). |
| `--mtx-container-fixed` | Fixed width of the current breakpoint. |
| `--mtx-spacing-2`, `--mtx-spacing-3` | Gutters on mobile and from 600px. |

## Accessibility

- Container is purely visual: it adds no roles. Use `component` to render the right semantic element (`<main>`, `<header>`, `<section>`, `<footer>`) instead of adding an extra `<div>`.
- Gutters keep text away from the screen edges on mobile; don't disable them on text blocks.
- Capping the reading width (`sm` or `md`) improves legibility: 60–80 characters per line.
