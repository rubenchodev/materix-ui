---
title: "Avatar"
description: "Represents a person or entity with an image, initials or an icon; AvatarGroup stacks several and summarizes the overflow."
group: "data-display"
icon: "account_circle"
weight: 10
example: "avatar"
mui: "https://mui.com/material-ui/react-avatar/"
---

`Avatar` displays the identity of a person or entity in a compact space: a photo, their initials or an icon. Use it in user lists, card headers, comments or app bars. If you need a text label that can be deleted or clicked, use [Chip]({{< relref "/components/chip" >}}); for a numeric indicator over an icon, use [Badge]({{< relref "/components/badge" >}}).

## Basic usage

A single element with `data-mtx="avatar"`. Write the initials as content, or use `data-src` for an image and `data-icon` for a Material Icons icon.

{{< mtx-demo title="Initials, icon and image" >}}
<div data-mtx="avatar" data-color="primary">RD</div>
<div data-mtx="avatar" data-icon="folder" data-color="secondary" role="img" aria-label="Folder"></div>
<div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=47" data-alt="Anna Garcia"></div>
{{< /mtx-demo >}}

## Variants

`data-variant` sets the shape: `circular` (default), `rounded` (4px radius) or `square` (no radius).

{{< mtx-demo title="Shapes" >}}
<div data-mtx="avatar" data-color="primary">CI</div>
<div data-mtx="avatar" data-variant="rounded" data-color="secondary">RO</div>
<div data-mtx="avatar" data-variant="square" data-color="success">SQ</div>
<div data-mtx="avatar" data-variant="rounded" data-icon="assignment" data-color="info" role="img" aria-label="Tasks"></div>
{{< /mtx-demo >}}

## Sizes

There are three canonical sizes: `small` (24px), `medium` (40px, default) and `large` (56px). For one-off cases, `data-size` also accepts a number in pixels; the font size is computed as 45% of the side.

{{< mtx-demo title="Canonical and custom" >}}
<div data-mtx="avatar" data-size="small" data-color="primary">S</div>
<div data-mtx="avatar" data-size="medium" data-color="primary">M</div>
<div data-mtx="avatar" data-size="large" data-color="primary">L</div>
<div data-mtx="avatar" data-size="72" data-color="secondary">72</div>
{{< /mtx-demo >}}

{{< callout type="warning" title="Icons in small avatars" >}}
Material Icons keep their native **24px** grid and are not resized. At the `small` size (24px) the icon fills the whole avatar; prefer initials for that size.
{{< /callout >}}

## With image, letters or icon

Content is resolved in this order: a child `<img>`, then `data-src` (which generates the `<img>`, with `data-srcset` and `data-sizes` support), then `data-icon` and, if none of the above is present, the element's text.

{{< mtx-demo title="Content types" >}}
<div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=12" data-alt="Charles Reed"></div>
<div data-mtx="avatar" data-color="warning">CR</div>
<div data-mtx="avatar" data-icon="person" role="img" aria-label="User"></div>
<div data-mtx="avatar">
  <img src="https://i.pravatar.cc/120?img=32" alt="Lucy Morgan">
</div>
{{< /mtx-demo >}}

## Colors

Without `data-color`, the avatar uses a neutral grey (`--mtx-avatar-default-bg`) with white text (`--mtx-avatar-default-color`). `data-color` applies any palette color with its contrast text.

{{< callout type="info" title="Deviation from MUI: AA contrast" >}}
MUI's default avatar uses grey 400 (`#bdbdbd`) with the background color as text, a 1.8:1 contrast that fails WCAG AA. Materix uses grey 600 (`#757575`) with white text in both themes (4.6:1, AA). To restore MUI's look, override `--mtx-avatar-default-bg: var(--mtx-color-grey-400)` and `--mtx-avatar-default-color: var(--mtx-color-background-default)`.
{{< /callout >}}

{{< mtx-demo title="Palette" >}}
<div data-mtx="avatar">DF</div>
<div data-mtx="avatar" data-color="primary">PR</div>
<div data-mtx="avatar" data-color="secondary">SE</div>
<div data-mtx="avatar" data-color="error">ER</div>
<div data-mtx="avatar" data-color="warning">WA</div>
<div data-mtx="avatar" data-color="info">IN</div>
<div data-mtx="avatar" data-color="success">SU</div>
{{< /mtx-demo >}}

## States

Avatar isn't interactive: its states are about content. If there's no image or icon, the avatar enters fallback mode (`mtx-avatar--fallback` class) and shows the initials or the element's text.

{{< mtx-demo title="With and without image" >}}
<div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=47" data-alt="Anna Garcia"></div>
<div data-mtx="avatar">AG</div>
<div data-mtx="avatar" data-icon="person" role="img" aria-label="User without a photo"></div>
{{< /mtx-demo >}}

When an image errors, the component hides the broken `<img>` (`hidden`), adds `mtx-avatar--fallback` and shows the alt text's first letter (or the element's text) instead.

## Grouping

`data-mtx="avatar-group"` overlaps the avatars with a border in the surface color. `data-max` limits the visible items **including** the `+N` indicator, and `data-total` lets you announce more users than are mounted in the DOM.

{{< callout type="info" title="Group children" >}}
The group counts its `mtx-avatar` children and also the `data-mtx="avatar"` children that are not initialized yet, so `data-max` works with the simplified syntax.
{{< /callout >}}

{{< mtx-demo title="AvatarGroup with max and total" >}}
<div data-mtx="avatar-group" data-max="4" data-label="Participants">
  <div class="mtx-avatar" data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=5" data-alt="Anna Garcia"></div>
  <div class="mtx-avatar" data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=12" data-alt="Charles Reed"></div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">LM</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">JP</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">OT</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="warning">AS</div>
</div>
<div data-mtx="avatar-group" data-max="3" data-total="24" data-label="Design team">
  <div class="mtx-avatar" data-mtx="avatar" data-color="info">RD</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="error">JM</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">LC</div>
</div>
{{< /mtx-demo >}}

`data-spacing` controls the overlap: `medium` (8px, default), `small` (16px, more compact) or a number of pixels.

{{< mtx-demo title="Spacing" >}}
<div data-mtx="avatar-group" data-spacing="medium" data-label="Medium spacing">
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">A</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">B</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">C</div>
</div>
<div data-mtx="avatar-group" data-spacing="small" data-label="Small spacing">
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">A</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">B</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">C</div>
</div>
<div data-mtx="avatar-group" data-spacing="0" data-label="No overlap">
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">A</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">B</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">C</div>
</div>
{{< /mtx-demo >}}

## Real-world examples

An avatar with an online status indicator (combined with [Badge]({{< relref "/components/badge" >}})) and a list of comment authors (combined with [List]({{< relref "/components/list" >}})).

{{< mtx-demo title="Online status and author list" layout="column" >}}
<div data-mtx="badge" data-variant="dot" data-color="success" data-overlap="circular" data-anchor="bottom-right">
  <div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=47" data-alt="Anna Garcia"></div>
</div>
<ul data-mtx="list" aria-label="Recent comments">
  <li data-mtx="list-item" data-secondary="Commented 5 minutes ago">
    <span class="mtx-list-item-icon"><span data-mtx="avatar" data-color="secondary" data-alt="">CR</span></span>
    Charles Reed
  </li>
  <li data-mtx="list-item" data-secondary="Commented 1 hour ago">
    <span class="mtx-list-item-icon"><span data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=32" data-alt=""></span></span>
    Lucy Morgan
  </li>
</ul>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or fine-grained control, render the classes directly. The component reuses the existing `<img>` and doesn't duplicate nodes.

```html
<div class="mtx-avatar mtx-avatar--primary mtx-avatar--large" data-mtx="avatar">RD</div>

<div class="mtx-avatar mtx-avatar--rounded" data-mtx="avatar">
  <img src="/users/anna.jpg" alt="Anna Garcia">
</div>

<div class="mtx-avatar-group" data-mtx="avatar-group" data-max="4" data-total="8"
     aria-label="Participants">
  <div class="mtx-avatar" data-mtx="avatar">RD</div>
  <div class="mtx-avatar mtx-avatar--primary" data-mtx="avatar">JM</div>
  <div class="mtx-avatar mtx-avatar--secondary" data-mtx="avatar">LC</div>
</div>
```

## Programmatic usage

Declarative avatars initialize themselves when the page loads. For dynamic content:

```javascript
// Initialize a dynamically created element
const avatar = Materix.init(document.getElementById('user-avatar'));

// Direct instantiation
const group = new Materix.AvatarGroup(document.getElementById('team'));

// Retrieve an existing instance
const sameGroup = Materix.getInstance(document.getElementById('team'));

// Initialize everything inside a container
Materix.initAll(document.getElementById('user-list'));
```

With ES modules:

```javascript
import { Avatar, AvatarGroup, getInstance } from 'materix-ui';

const group = getInstance(document.getElementById('team'));
group.max = 3;     // shows 2 avatars + "+N"
group.total = 12;  // logical total, even if only 4 are mounted
group.refresh();   // recalculates after adding or removing children
```

{{< mtx-demo title="AvatarGroup controlled through the API" >}}
<div id="doc-avatar-group" data-mtx="avatar-group" data-max="5" data-label="Team">
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">A</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">B</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">C</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="info">D</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="warning">E</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="error">F</div>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-avatar-max="3">max = 3</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-avatar-max="5">max = 5</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-doc-avatar-max]').forEach((btn) => {
    btn.addEventListener('click', () => {
      Materix.getInstance(document.getElementById('doc-avatar-group')).max = Number(btn.dataset.docAvatarMax);
    });
  });
});
</script>

## API reference

### Data attributes

**Avatar** (`data-mtx="avatar"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-src` | URL | — | Generates an inner `<img>` if the element doesn't contain one. |
| `data-srcset` | `srcset` list | — | `srcset` of the image generated from `data-src`. |
| `data-sizes` | `sizes` list | — | `sizes` of the image generated from `data-src`. |
| `data-alt` | Text | `""` | Alternative text of the image (also copied to a child `<img>` without `alt`). |
| `data-icon` | Material Icons name | — | Inserts a decorative icon (`aria-hidden`). Ignored if there's an image. |
| `data-variant` | `circular`, `rounded`, `square` | `circular` | Avatar shape. |
| `data-color` | `primary`, `secondary`, `error`, `warning`, `info`, `success` | neutral grey | Background color with contrast text. |
| `data-size` | `small`, `medium`, `large` or a number (px) | `medium` | 24px, 40px, 56px or a free size in pixels. |

**AvatarGroup** (`data-mtx="avatar-group"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-max` | Integer ≥ 2 | `5` | Visible items, including the `+N` indicator. |
| `data-total` | Integer ≥ 0 | number of children | Logical total of users; the overflow is computed from it. |
| `data-spacing` | `medium`, `small` or a number (px) | `medium` | Overlap: 8px, 16px or the given value. |
| `data-label` | Text | — | Copied to `aria-label` if the group doesn't have one. |
| `data-surplus-label` | Template with `{count}` | i18n `avatarGroup.surplus` (`{count} more` / `{count} más`) | Accessible label of the `+N` indicator. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-avatar` | Base block (40×40px, circular, neutral grey). |
| `mtx-avatar--rounded` | Corners with the shape radius (`4px`). |
| `mtx-avatar--square` | No radius. |
| `mtx-avatar--small` / `--medium` / `--large` | 24px / 40px / 56px. |
| `mtx-avatar--primary` … `--success` | Palette color (`primary`, `secondary`, `error`, `warning`, `info`, `success`). |
| `mtx-avatar--fallback` | Added when the avatar has no image (initials or text). |
| `mtx-avatar-group` | Container that overlaps avatars. |
| `mtx-avatar--surplus` | `+N` indicator generated by the group. |

### Methods

**Avatar**

| Method | Returns | Description |
|---|---|---|
| `destroy()` | `void` | Removes the image error listener and unlinks the instance from the registry. |

**AvatarGroup**

| Method / property | Returns | Description |
|---|---|---|
| `max` (get/set) | `number` | Maximum visible (minimum 2). Setting it updates `data-max` and recalculates. |
| `total` (get/set) | `number` | Logical total. Setting `null` goes back to counting the children. |
| `refresh()` | `void` | Recalculates which avatars are hidden and the `+N` indicator. |
| `destroy()` | `void` | Removes the indicator and shows all avatars again. |

### Events

Avatar and AvatarGroup don't emit events.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-avatar-group-overlap` | Overlap between avatars in the group (set by `data-spacing`). |
| `--mtx-avatar-default-bg` / `--mtx-avatar-default-color` | Background and text of the default avatar (grey 600 + white in both themes). |
| `--mtx-color-grey-300` / `--mtx-color-grey-800` | `+N` indicator background in light / dark theme. |
| `--mtx-color-background-paper` | Separating border inside the group. |
| `--mtx-shape-full`, `--mtx-shape-radius` | Circular and rounded radius. |
| `--mtx-color-{palette}`, `--mtx-color-{palette}-contrast` | Background and text of each color. |

## Accessibility

- Images keep their `alt`: use `data-alt` with the person's name. If the name already appears next to the avatar, you can leave `data-alt=""` so it's decorative.
- Icons generated with `data-icon` have `aria-hidden="true"`. If an icon avatar conveys information, add `role="img"` and `aria-label` to the container.
- Initials are read letter by letter; when they aren't decorative, add `role="img"` and `aria-label="Full name"`.
- AvatarGroup copies `data-label` to `aria-label` and gives the `+N` indicator a label built from `data-surplus-label` (by default `3 more` / `3 más` from the i18n dictionary, following the element's `lang`; make it specific with something like `data-surplus-label="{count} more members"`). Overflow avatars are hidden with `hidden`, so they aren't announced either.
- The component isn't interactive; if an avatar opens a profile, wrap it in an `<a>` or `<button>` with an accessible name.
