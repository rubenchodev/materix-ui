---
title: "Skeleton"
description: "Content-shaped placeholders shown while data loads, with a pulse or wave animation."
group: "feedback"
icon: "view_day"
weight: 28
example: "skeleton"
mui: "https://mui.com/material-ui/react-skeleton/"
---

**Skeleton** displays a grey block shaped like content that hasn't arrived yet (text, avatar, image, card). It reduces perceived waiting and avoids layout shifts when the data appears. Use it for short loads of content with a known structure; if you don't know what shape the result will have, or the operation doesn't load content (saving, sending), use [Progress]({{< relref "/components/progress" >}}).

## Basic usage

A single element with `data-mtx="skeleton"`. Without a variant it is a text line that fills the available width and the height of the typography. `data-width` and `data-height` accept numbers (px) or any CSS unit.

{{< mtx-demo title="Simplified syntax" layout="column" >}}
<span data-mtx="skeleton"></span>
<span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
<span data-mtx="skeleton" data-variant="rectangular" data-width="210" data-height="60"></span>
<span data-mtx="skeleton" data-variant="rounded" data-width="210" data-height="60"></span>
{{< /mtx-demo >}}

## Variants

Four shapes, as in MUI: `text` (default; scaled to 60% of the line height so it keeps the vertical rhythm of text), `circular`, `rectangular` (no radius) and `rounded` (4px radius).

{{< mtx-demo title="text, circular, rectangular and rounded" layout="block" >}}
<div data-mtx="stack" data-spacing="1">
  <span data-mtx="skeleton" data-variant="text" data-width="60%"></span>
  <span data-mtx="skeleton" data-variant="circular" data-width="56" data-height="56"></span>
  <span data-mtx="skeleton" data-variant="rectangular" data-height="56"></span>
  <span data-mtx="skeleton" data-variant="rounded" data-height="56"></span>
</div>
{{< /mtx-demo >}}

## Animations

`data-animation="pulse"` (default, the opacity oscillates), `"wave"` (a highlight sweeps across the block) or `"false"` (static). With `prefers-reduced-motion: reduce` the animation is disabled automatically.

{{< mtx-demo title="pulse, wave and false" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <span data-mtx="skeleton" data-variant="rounded" data-height="56"></span>
  <span data-mtx="skeleton" data-variant="rounded" data-height="56" data-animation="wave"></span>
  <span data-mtx="skeleton" data-variant="rounded" data-height="56" data-animation="false"></span>
</div>
{{< /mtx-demo >}}

## Sizes

The `text` variant inherits the size of the typography around it: place it inside the same element that will hold the real text and it gets its exact height. Circular shapes follow the Avatar heights (24, 40 and 56px).

{{< mtx-demo title="Typography h3, h5, body1 and caption" layout="block" >}}
<div class="mtx-typography--h3"><span data-mtx="skeleton"></span></div>
<div class="mtx-typography--h5"><span data-mtx="skeleton"></span></div>
<div class="mtx-typography--body1"><span data-mtx="skeleton"></span></div>
<div class="mtx-typography--caption"><span data-mtx="skeleton" data-width="40%"></span></div>
{{< /mtx-demo >}}

{{< mtx-demo title="24, 40 and 56px circles" >}}
<span data-mtx="skeleton" data-variant="circular" data-width="24" data-height="24"></span>
<span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
<span data-mtx="skeleton" data-variant="circular" data-width="56" data-height="56"></span>
{{< /mtx-demo >}}

## Paragraphs

`data-lines="3"` generates several text lines inside the element; the last one is shorter (60% by default, configurable with `data-last-width`).

{{< mtx-demo title="data-lines" layout="block" >}}
<div data-mtx="stack" data-spacing="3">
  <div data-mtx="skeleton" data-lines="3"></div>
  <div data-mtx="skeleton" data-lines="4" data-animation="wave" data-last-width="30%"></div>
</div>
{{< /mtx-demo >}}

## With children

When the skeleton wraps content, it takes its exact size and hides it with `visibility: hidden` (like `children` in MUI). No need to repeat measurements: the Avatar, Button or heading itself becomes the mold.

{{< mtx-demo title="Infer dimensions from content" >}}
<div data-mtx="skeleton" data-variant="circular">
  <div data-mtx="avatar" data-icon="person"></div>
</div>
<div data-mtx="skeleton" data-variant="rounded">
  <button class="mtx-button mtx-button--contained" data-mtx="button">Save changes</button>
</div>
<div class="mtx-typography--h5" data-mtx="skeleton">A real-length heading</div>
{{< /mtx-demo >}}

## States

### Loading region

To switch between placeholder and content without custom JavaScript, mark the container with `data-loading` and its direct children with `data-skeleton-placeholder` (visible while loading) and `data-skeleton-content` (visible once loaded). `Materix.skeleton.set(container, bool)` changes the state, syncs `aria-busy` and emits `mtx:skeleton:change`.

{{< mtx-demo title="Toggle data-loading" layout="column" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-skeleton-toggle" aria-controls="doc-skeleton-region">Toggle loading</button>
<div id="doc-skeleton-region" aria-live="polite" data-loading aria-busy="true">
  <div data-skeleton-placeholder class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
    <div class="mtx-flex-1">
      <span data-mtx="skeleton" data-width="160"></span>
      <span data-mtx="skeleton" data-width="100"></span>
    </div>
  </div>
  <div data-skeleton-content class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <div data-mtx="avatar" data-color="secondary">LM</div>
    <div>
      <div class="mtx-typography--body1">Lucy Martin</div>
      <div class="mtx-typography--body2 mtx-color-text-secondary">Product designer</div>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

```javascript
Materix.skeleton.set('#doc-skeleton-region', false); // shows the real content
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('doc-skeleton-toggle').addEventListener('click', function () {
    Materix.skeleton.toggle('#doc-skeleton-region');
  });
});
</script>

{{< callout type="tip" title="Dynamic content" >}}
If the real content is inserted with JavaScript, call `Materix.initAll(container)` after inserting it and then `Materix.skeleton.set(container, false)`.
{{< /callout >}}

## Real-world examples

### Video card

{{< mtx-demo title="Loading card" layout="block" >}}
<div data-mtx="card" data-elevation="1" class="mtx-mw-100">
  <span data-mtx="skeleton" data-variant="rectangular" data-height="160" data-animation="wave"></span>
  <div class="mtx-p-2 mtx-d-flex mtx-gap-2">
    <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40" data-animation="wave"></span>
    <div class="mtx-flex-1">
      <span data-mtx="skeleton" data-animation="wave"></span>
      <span data-mtx="skeleton" data-width="60%" data-animation="wave"></span>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

### Message list

{{< mtx-demo title="Loading list" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
    <div class="mtx-flex-1" data-mtx="skeleton" data-lines="2"></div>
  </div>
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
    <div class="mtx-flex-1" data-mtx="skeleton" data-lines="2"></div>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR, the `mtx-skeleton--{variant}` and `mtx-skeleton--{pulse|wave|no-animation}` classes are honored on initialization, and the block already renders without JavaScript (add `aria-hidden="true"` yourself). With `data-lines`, existing lines are not duplicated.

```html
<span class="mtx-skeleton mtx-skeleton--text mtx-skeleton--wave" data-mtx="skeleton" aria-hidden="true"></span>
<span class="mtx-skeleton mtx-skeleton--rounded mtx-skeleton--pulse" data-mtx="skeleton" data-height="48" aria-hidden="true"></span>
<div class="mtx-skeleton-lines" data-mtx="skeleton" data-lines="2" aria-hidden="true">
  <span class="mtx-skeleton mtx-skeleton--text mtx-skeleton--pulse"></span>
  <span class="mtx-skeleton mtx-skeleton--text mtx-skeleton--pulse" style="width: 60%"></span>
</div>
```

## Programmatic usage

`[data-mtx="skeleton"]` elements initialize themselves; for dynamic content use `Materix.init(el)` or `new Materix.Skeleton(el)`.

```javascript
// UMD (window.Materix)
const el = document.createElement('span');
el.setAttribute('data-width', '120');
el.setAttribute('data-height', '120');
container.append(el);
const block = Materix.init(el, 'skeleton');   // or: new Materix.Skeleton(el)
block.setVariant('circular').setAnimation('wave');

// Loading region
Materix.skeleton.set('#profile', true);
fetch('/api/profile').then(() => Materix.skeleton.set('#profile', false));
document.addEventListener('mtx:skeleton:change', (e) => console.log(e.detail.loading));
```

```javascript
// ES modules
import { Skeleton, skeleton } from '@rubenchodev/materix-ui';

new Skeleton(document.querySelector('#avatar-placeholder'));
skeleton.toggle(document.querySelector('#profile'));
```

{{< mtx-demo title="setVariant() and setAnimation()" >}}
<span data-mtx="skeleton" id="doc-skeleton-api" data-variant="rounded" data-width="96" data-height="96"></span>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-skeleton-variant">Change variant</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-skeleton-animation">Change animation</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var block = Materix.getInstance(document.getElementById('doc-skeleton-api'));
  var variants = ['rounded', 'circular', 'rectangular', 'text'];
  var animations = ['pulse', 'wave', 'false'];
  var v = 0;
  var a = 0;
  document.getElementById('doc-skeleton-variant').addEventListener('click', function () {
    v = (v + 1) % variants.length;
    block.setVariant(variants[v]);
  });
  document.getElementById('doc-skeleton-animation').addEventListener('click', function () {
    a = (a + 1) % animations.length;
    block.setAnimation(animations[a]);
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `skeleton` | — | Initializes the component. |
| `data-variant` | `text`, `circular`, `rectangular`, `rounded` | `text` | Block shape. |
| `data-width` | number (px) or CSS length | container width | Block width (or paragraph width with `data-lines`). |
| `data-height` | number (px) or CSS length | line height (`text`) / `1.2em` | Block height. |
| `data-animation` | `pulse`, `wave`, `false` | `pulse` | Animation; `false` disables it. |
| `data-lines` | integer ≥ 2 | — | Generates N `text` lines inside the element. |
| `data-last-width` | number (px) or CSS length | `60%` | Width of the last line with `data-lines`. |
| `data-loading` | present / `false` | — | On a container: shows `[data-skeleton-placeholder]` and hides `[data-skeleton-content]`. |
| `data-skeleton-placeholder` | — | — | Direct child visible only while the container is loading. |
| `data-skeleton-content` | — | — | Direct child visible only when the container is not loading. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-skeleton` | Base block (`--mtx-skeleton-bg` color, `display: block`). |
| `.mtx-skeleton--text` / `--circular` / `--rectangular` / `--rounded` | Shape variants. |
| `.mtx-skeleton--pulse` / `--wave` / `--no-animation` | Animations. |
| `.mtx-skeleton--with-children` | Added when it wraps content: takes its size and hides it. |
| `.mtx-skeleton__text` | Generated around direct text so it is hidden with `visibility` (not transparent text). |
| `.mtx-skeleton-lines` | Paragraph container generated with `data-lines`. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `setVariant(variant)` | `this` | Changes the shape (no effect in `data-lines` mode). |
| `setAnimation(animation)` | `this` | Changes the animation (`'pulse'`, `'wave'`, `'false'` or `false`). |
| `variant` / `animation` | `string` | Getters for the current state. |
| `destroy()` | `void` | Releases the instance. |
| `Materix.skeleton.set(target, loading)` | `HTMLElement \| null` | Turns loading on or off for a container (element or selector): `data-loading` and `aria-busy`. |
| `Materix.skeleton.toggle(target)` | `boolean` | Toggles loading and returns the new state. |
| `Materix.skeleton.isLoading(target)` | `boolean` | Whether the container is loading. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:skeleton:change` | `{ loading: boolean }` | `Materix.skeleton.set()`/`toggle()` changes a container's state (bubbles). |

### CSS variables

| Variable | Default | Description |
|---|---|---|
| `--mtx-skeleton-bg` | `rgba(0,0,0,.11)` · dark `rgba(255,255,255,.13)` | Block color (MUI's text.primary at 11 / 13%). |
| `--mtx-skeleton-wave` | `rgba(0,0,0,.04)` · dark `rgba(255,255,255,.08)` | Highlight color of the `wave` animation. |

## Accessibility

- Every block is decorative: the component adds `aria-hidden="true"`, and `set()` also sets it on `[data-skeleton-placeholder]`.
- The loading state is communicated on the **container**: `aria-busy="true"` while loading (managed by `Materix.skeleton.set()`; in static HTML write it next to `data-loading`). With `aria-live="polite"` on that container, screen readers announce the content when `aria-busy` is removed.
- If loading may take a while, add visible text or a `mtx-visually-hidden` "Loading…" inside the placeholder for users who can't see the animation.
- `prefers-reduced-motion: reduce` stops `pulse` and `wave`; the static block still shows where the content will appear.
- No keyboard interaction: the placeholder is not focusable, and content hidden with `display: none` cannot receive focus.
