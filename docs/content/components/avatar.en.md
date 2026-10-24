---
title: "Avatar"
description: "Represents a person or entity with an image, initials or an icon; AvatarGroup stacks several and summarizes the overflow."
group: "data-display"
icon: "account_circle"
weight: 10
example: "avatar"
import: "Avatar, AvatarGroup"
mui: "https://mui.com/material-ui/react-avatar/"
---

`Avatar` shows the identity of a person or entity in a compact space: a photo, their initials or an icon. Use it in user lists, card headers, comments or app bars. If you need a removable or clickable text label, use [Chip](../chip/); for a numeric indicator on top of an icon, use [Badge](../badge/).

```tsx
import { Avatar, AvatarGroup } from '@rubenchodev/materix-react';
// or only this component:
import { Avatar, AvatarGroup } from '@rubenchodev/materix-react/components/avatar';
```

## Basic usage

Initials go as children, `src` renders the image and `icon` inserts a Material icon (a string is the icon name; any node, such as an SVG, is also accepted).

{{< react-demo "avatar/01-basic" >}}

## Variants

`variant` sets the shape: `circular` (default), `rounded` (4px radius) or `square`.

{{< react-demo id="avatar/02-variants" layout="block" >}}

## Sizes

Canonical sizes of 24, 40 (default) and 56px with `size="small|medium|large"`. A number sets a custom size in pixels (width, height and a font size of 45%).

{{< react-demo id="avatar/03-sizes" layout="block" >}}

## Image, letters and icon

Content is resolved in order: `src` (with `srcSet`, `sizes` and `imgProps` for the `<img>`), `icon` and, if there is neither, the children. Icons keep their native 24px grid.

{{< react-demo id="avatar/04-content" layout="block" >}}

## Colors

Without `color`, grey 600 with white text is used (`--mtx-avatar-default-bg` / `--mtx-avatar-default-color`, 4.6:1 AA contrast; MUI uses grey 400 at 1.8:1). `color` applies any palette color with its contrast text.

{{< react-demo "avatar/05-colors" >}}

## States

Avatar is not interactive: its states are about content. Without an image or icon it is in fallback mode (`.mtx-avatar--fallback`) and shows the children. If the image fails to load, the `<img>` gets `hidden`, the root switches to fallback mode and, when there are no children, a `.mtx-avatar__fallback` with the initial of `alt` is added (`●` without `alt`), exactly like vanilla. A new `src` retries the load.

{{< react-demo id="avatar/06-states" layout="block" >}}

## Grouping

`AvatarGroup` overlaps its avatars. `max` (5 by default, minimum 2) also counts the `+N` indicator; `total` counts users that are not rendered; `spacing` sets the overlap (`medium` = 8px, `small` = 16px, or pixels). Overflowing avatars stay mounted with `hidden`. The `+N` indicator has a translated `aria-label` (`{count} more`) that `surplusLabel` replaces.

{{< react-demo id="avatar/07-grouping" layout="block" >}}

## Use cases

Online status with Badge and comment authors in a list.

{{< react-demo id="avatar/08-use-cases" layout="block" >}}

## Grid layout

Team directory in [Grid](../grid/): 1 column on mobile, 2 at `sm` and 3 at `md`.

{{< react-demo id="avatar/09-grid" layout="block" >}}

## Controlled usage

The group recalculates on every render, so changing `max`, `total` or the children replaces the vanilla `max`/`total` setters and `refresh()`.

{{< react-demo id="avatar/10-controlled" layout="block" >}}

## API

### Avatar props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image source. |
| `alt` | `string` | — | Alternative text; its initial is the fallback when the image fails. |
| `srcSet` / `sizes` | `string` | — | Responsive image attributes. |
| `imgProps` | `ImgHTMLAttributes` | — | Extra attributes of the `<img>` (`onError` is still called). |
| `icon` | `ReactNode` | — | Icon when there is no image: Material Icons name or a node. |
| `variant` | `'circular'` \| `'rounded'` \| `'square'` | `'circular'` | Shape. |
| `color` | `'primary'` \| `'secondary'` \| `'error'` \| `'warning'` \| `'info'` \| `'success'` | — | Background color. |
| `size` | `'small'` \| `'medium'` \| `'large'` \| `number` | — | Canonical size or pixels. |
| `component` | `ElementType` | `'div'` | Root element or component. |
| `className` / `ref` | | — | Merged / root element. |

### AvatarGroup props

| Prop | Type | Default | Description |
|---|---|---|---|
| `max` | `number` | `5` | Visible items, including `+N` (minimum 2). |
| `total` | `number \| null` | — | Logical total of users. |
| `spacing` | `'small'` \| `'medium'` \| `number` | `'medium'` | Overlap (`--mtx-avatar-group-overlap`). |
| `label` | `string` | — | Accessible name of the group (`aria-label`). |
| `surplusLabel` | `string` | translated | Template of the `+N` label; `{count}` = amount. |
| `locale` | `string` | — | Local language of the texts. |
| `className` / `ref` | | — | Merged / root `<div>`. |

Other props are forwarded to the root element. The helpers `getAvatarInitial(alt)` and `getAvatarGroupLayout(count, max, total)` are also exported.

### Callbacks

Avatar and AvatarGroup emit no events (use `imgProps.onError` to know when an image fails).

### CSS classes

| Class | Description |
|---|---|
| `.mtx-avatar` | Root (40px, circular). |
| `.mtx-avatar--fallback` | No image (or broken image). |
| `.mtx-avatar__fallback` | Generated initial when the image fails. |
| `.mtx-avatar--rounded` / `--square` | Shape. |
| `.mtx-avatar--small` / `--medium` / `--large` | 24 / 40 / 56px. |
| `.mtx-avatar--{color}` | Palette background. |
| `.mtx-avatar-group` | Group. |
| `.mtx-avatar--surplus` | `+N` indicator. |

## Accessibility

- With an image, `alt` describes the person; use `alt=""` when the name is already next to it.
- Icon avatars that convey meaning need `role="img"` and an `aria-label`; the generated icon is `aria-hidden`.
- Give `AvatarGroup` a `label` and keep the `+N` `aria-label` meaningful (`surplusLabel`).
- The default background meets AA contrast (4.6:1).

## Vanilla equivalence

| Vanilla (`data-*`) | React |
|---|---|
| `<div data-mtx="avatar">RD</div>` | `<Avatar>RD</Avatar>` |
| `data-src` / `data-alt` | `src` / `alt` |
| `data-srcset` / `data-sizes` | `srcSet` / `sizes` |
| `data-icon="folder"` | `icon="folder"` |
| `data-variant="rounded"` | `variant="rounded"` |
| `data-color="primary"` | `color="primary"` |
| `data-size="large"` / `data-size="72"` | `size="large"` / `size={72}` |
| `<div data-mtx="avatar-group">` | `<AvatarGroup>` |
| `data-max` / `data-total` / `data-spacing` | `max` / `total` / `spacing` |
| `data-label` / `data-surplus-label` | `label` / `surplusLabel` |
| `group.max = 3`, `group.refresh()` | `max={3}` (recomputed on render) |

The rendered DOM (classes and attributes) is identical to the vanilla component after initialization.
