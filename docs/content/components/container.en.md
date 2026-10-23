---
title: "Container"
description: "Centers page content with a per-breakpoint max width and responsive side gutters (16px on mobile, 24px from 600px)."
group: "layout"
icon: "crop_free"
weight: 30
example: "container"
mui: "https://mui.com/material-ui/react-container/"
---

`Container` is the most basic layout block: it centers its content horizontally, caps it at a max width and adds side padding (gutters) that grows with the screen, just like MUI's `Container`. Use it to wrap `<main>`, landing page sections or a toolbar. To split columns inside it use [Grid]({{< relref "/components/grid" >}}); to stack blocks, [Stack]({{< relref "/components/stack" >}}).

## Basic usage

A single element with `data-mtx="container"`. Without `data-max-width` the cap is `lg` (1200px), MUI's default.

{{< mtx-demo title="Default container (lg)" layout="block" >}}
<div data-mtx="container" class="mtx-bg-action-selected mtx-py-2">
  <div class="mtx-bg-paper mtx-rounded mtx-p-2 mtx-text-center">Centered content · max 1200px</div>
</div>
{{< /mtx-demo >}}

## Max width

`data-max-width` sets the cap: `xs` (444px), `sm` (600px), `md` (900px), `lg` (1200px), `xl` (1536px) or `false` to use the full available width.

{{< mtx-demo title="xs, sm, md and false" layout="column" >}}
<div data-mtx="container" data-max-width="xs" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">xs · 444px</div>
</div>
<div data-mtx="container" data-max-width="sm" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">sm · 600px</div>
</div>
<div data-mtx="container" data-max-width="md" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">md · 900px</div>
</div>
<div data-mtx="container" data-max-width="false" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">false · fluid</div>
</div>
{{< /mtx-demo >}}

## Fixed

With `data-fixed` the max width snaps to the minimum width of each breakpoint (600, 900, 1200 and 1536px) instead of growing continuously. It combines with `data-max-width`: the smaller of the two wins.

{{< mtx-demo title="Fixed width per breakpoint" layout="block" >}}
<div data-mtx="container" data-fixed class="mtx-bg-action-selected mtx-py-2">
  <div class="mtx-bg-paper mtx-rounded mtx-p-2 mtx-text-center">data-fixed · resize the window</div>
</div>
{{< /mtx-demo >}}

## Gutters

By default the container has 16px of side padding on mobile and 24px from 600px. `data-disable-gutters` removes it, for example to make an image or a table touch the edges.

{{< mtx-demo title="With and without gutters" layout="column" >}}
<div data-mtx="container" data-max-width="sm" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">With gutters</div>
</div>
<div data-mtx="container" data-max-width="sm" data-disable-gutters class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">data-disable-gutters</div>
</div>
{{< /mtx-demo >}}

## Real-world examples

Article page: a full-width header with the title in an `md` container and the reading body in `sm` to keep a comfortable line length.

{{< mtx-demo title="Article" layout="block" >}}
<header class="mtx-bg-primary mtx-py-4">
  <div data-mtx="container" data-max-width="md">
    <h2 class="mtx-typography--h5 mtx-mt-0 mtx-color-inherit">What's new in 0.1</h2>
    <p class="mtx-typography--body2">Layout utilities, Container and Stack.</p>
  </div>
</header>
<article data-mtx="container" data-max-width="sm" class="mtx-py-3">
  <p class="mtx-typography--body1 mtx-mb-2">Materix ships mobile-first utilities to build layouts without custom CSS. Container centers the content and Stack stacks blocks with even spacing.</p>
  <div data-mtx="stack" data-direction="row" data-spacing="1">
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Read more</button>
    <button class="mtx-button mtx-button--text" data-mtx="button" type="button">Share</button>
  </div>
</article>
{{< /mtx-demo >}}

## Full BEM syntax

The classes work without JavaScript:

```html
<main class="mtx-container mtx-container--md mtx-container--fixed">…</main>
<section class="mtx-container mtx-container--fluid mtx-container--disable-gutters">…</section>
```

## Programmatic usage

```javascript
const container = Materix.getInstance(document.querySelector('main'));
container.setMaxWidth('md');   // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
container.setFixed(true);
container.setGutters(false);   // same as data-disable-gutters

// Dynamically added elements
Materix.init(newElement, 'container');
```

With ES modules:

```javascript
import { Container } from '@rubenchodev/materix-ui';
const container = new Container(document.querySelector('main'));
```

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `container` | — | Initializes the component. |
| `data-max-width` | `xs`, `sm`, `md`, `lg`, `xl`, `false` | `lg` | Max width: 444, 600, 900, 1200, 1536px or unlimited. An invalid value is ignored with a warning. |
| `data-fixed` | boolean | — | The max width matches the min width of the active breakpoint. |
| `data-disable-gutters` | boolean | — | Removes the side padding. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-container` | Centered block (`margin-inline: auto`), 100% width, `lg` cap and 16px / 24px (≥ 600px) gutters. |
| `mtx-container--xs` · `--sm` · `--md` · `--lg` · `--xl` | 444, 600, 900, 1200 or 1536px cap. |
| `mtx-container--fluid` | No cap (`data-max-width="false"`). |
| `mtx-container--fixed` | Cap equal to the active breakpoint's min-width. |
| `mtx-container--disable-gutters` | No side padding. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `setMaxWidth(value)` | `void` | Replaces the cap. Throws `RangeError` for an invalid value. |
| `setFixed(bool)` | `void` | Turns the fixed width on or off. |
| `setGutters(bool)` | `void` | `false` removes the side padding. |

### Events

`Container` doesn't emit events.

### CSS variables

| Variable | Description |
|---|---|
| `--mtx-container-max` | Current width cap (set by the `--xs`…`--fluid` classes). You can override it, e.g. `--mtx-container-max: 720px`. |
| `--mtx-container-fixed` | Per-breakpoint cap of `--fixed` (100% when not applied). |
| `--mtx-spacing-2` · `--mtx-spacing-3` | Gutters on mobile and from 600px. |

## Accessibility

- Container is purely visual: it adds no roles. Put it on the right semantic element (`<main>`, `<header>`, `<section>`, `<footer>`) instead of adding an extra `<div>`.
- Gutters keep text away from the screen edges on mobile; don't disable them on text blocks.
- Capping the reading width (`sm` or `md`) improves legibility: 60–80 characters per line.
