---
title: "Skeleton"
description: "Content-shaped placeholders shown while data loads, with a pulse or wave animation."
group: "feedback"
icon: "view_day"
weight: 28
example: "skeleton"
import: "Skeleton, SkeletonRegion"
mui: "https://mui.com/material-ui/react-skeleton/"
---

**Skeleton** displays a grey block shaped like content that hasn't arrived yet (text, avatar, image, card). It reduces perceived waiting and avoids layout shifts when the data appears. Use it for short loads of content with a known structure; if you don't know what shape the result will have, or the operation doesn't load content (saving, sending), use [Progress](../progress/).

```tsx
import { Skeleton, SkeletonRegion } from '@rubenchodev/materix-react';
// or only this component:
import { Skeleton, SkeletonRegion } from '@rubenchodev/materix-react/components/skeleton';
```

## Basic usage

Without a variant, `<Skeleton />` is a line of text that fills the available width and takes the height of the typography. `width` and `height` accept numbers (px) or any CSS unit.

{{< react-demo id="skeleton/01-basic" layout="block" >}}

## Variants

Four shapes, as in MUI: `text` (default, scaled down to 60% of the line height), `circular`, `rectangular` (no radius) and `rounded` (4px radius).

{{< react-demo id="skeleton/02-variants" layout="block" >}}

## Animations

`animation="pulse"` (default), `"wave"` or `false` (static; the string `"false"` is accepted too). With `prefers-reduced-motion: reduce` the animation is turned off automatically.

{{< react-demo id="skeleton/03-animations" layout="block" >}}

## Sizes

The `text` variant inherits the size of the typography it sits in: place it inside the same element that will hold the real text. Circular shapes follow the canonical Avatar sizes (24, 40 and 56px).

{{< react-demo id="skeleton/04-sizes" layout="block" >}}

## Paragraphs

`lines={3}` generates a `.mtx-skeleton-lines` block with several lines of text; the last one is shorter (60% by default, configurable with `lastWidth`). With `lines`, `variant` and `height` have no effect.

{{< react-demo id="skeleton/05-paragraphs" layout="block" >}}

## With children

When the skeleton wraps content, it takes its exact size and hides it (`visibility: hidden`, class `.mtx-skeleton--with-children`). Direct text is wrapped in `.mtx-skeleton__text` so it is hidden too instead of being transparent text that fails contrast checks.

{{< react-demo "skeleton/06-with-children" >}}

## States

### Loading region

`SkeletonRegion` is the React equivalent of `Materix.skeleton.set()`. While `loading` is `true` it renders `data-loading` and `aria-busy="true"` on the root, shows the `placeholder` (inside `[data-skeleton-placeholder]`, always `aria-hidden`) and hides the children (inside `[data-skeleton-content]`). Both wrappers stay mounted and the CSS hides the inactive one, so the content keeps its state. With `aria-live="polite"` the content is announced when loading finishes. Use `placeholderProps` and `contentProps` to style the wrappers.

{{< react-demo id="skeleton/07-states" layout="block" >}}

If you prefer to unmount the content while loading, the MUI pattern also works: `loading ? <Skeleton /> : <Content />`.

## Real-world examples

A video card and a message list while loading.

{{< react-demo id="skeleton/08-real-world" layout="block" >}}

## Grid

Blocks without a fixed width fill their column.

{{< react-demo id="skeleton/09-grid" layout="block" >}}

## Controlled usage

`variant` and `animation` are ordinary props (they replace `setVariant()` and `setAnimation()`); `SkeletonRegion` calls `onChange({ loading })` whenever `loading` changes after mounting.

{{< react-demo id="skeleton/10-controlled" layout="block" >}}

## API

### Skeleton props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'text'` \| `'circular'` \| `'rectangular'` \| `'rounded'` | `'text'` | Shape (unknown values fall back to `text`). |
| `animation` | `'pulse'` \| `'wave'` \| `false` \| `'false'` | `'pulse'` | Animation. |
| `width` | `number \| string` | — | Width (number = px). |
| `height` | `number \| string` | — | Height (number = px). |
| `lines` | `number` | — | Number of text lines (> 1). |
| `lastWidth` | `number \| string` | `'60%'` | Width of the last line. |
| `component` | `ElementType` | `'span'` (`'div'` with `lines`) | Root element or component. |
| `className` / `ref` | | — | Merged / root element. |

### SkeletonRegion props

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `true` | Loading state. |
| `placeholder` | `ReactNode` | — | Shown while loading. |
| `children` | `ReactNode` | — | Real content. |
| `placeholderProps` / `contentProps` | `HTMLAttributes<HTMLDivElement>` | — | Attributes of the wrappers. |
| `onChange` | `(detail: { loading: boolean }) => void` | — | Called when `loading` changes. |
| `component` | `ElementType` | `'div'` | Root element or component. |

Other props are forwarded to the root element.

### Callbacks

| Callback | Vanilla event | Detail |
|---|---|---|
| `SkeletonRegion.onChange` | `mtx:skeleton:change` | `{ loading }` |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-skeleton` | Block. |
| `.mtx-skeleton--text` / `--circular` / `--rectangular` / `--rounded` | Shape. |
| `.mtx-skeleton--pulse` / `--wave` / `--no-animation` | Animation. |
| `.mtx-skeleton--with-children` | Takes the size of its children. |
| `.mtx-skeleton__text` | Wrapped direct text. |
| `.mtx-skeleton-lines` | Paragraph container. |

## Accessibility

- Every skeleton is decorative (`aria-hidden="true"`).
- Announce the loading state on the container: `SkeletonRegion` sets `aria-busy` and, with `aria-live="polite"`, the content is read when it arrives.
- Animations respect `prefers-reduced-motion`.

## Vanilla equivalence

| Vanilla (`data-*`) | React |
|---|---|
| `<span data-mtx="skeleton">` | `<Skeleton />` |
| `data-variant="circular"` | `variant="circular"` |
| `data-animation="wave"` / `"false"` | `animation="wave"` / `animation={false}` |
| `data-width="40"` / `data-height="3rem"` | `width={40}` / `height="3rem"` |
| `data-lines="3"` / `data-last-width="30%"` | `lines={3}` / `lastWidth="30%"` |
| `setVariant()` / `setAnimation()` | `variant` / `animation` props |
| `[data-loading]` + `[data-skeleton-placeholder]` + `[data-skeleton-content]` | `<SkeletonRegion loading placeholder={…}>…</SkeletonRegion>` |
| `Materix.skeleton.set(el, false)` / `toggle()` | `loading={false}` (your state) |
| `mtx:skeleton:change` | `onChange` |

The rendered DOM (classes and attributes) is identical to the vanilla component after initialization.
