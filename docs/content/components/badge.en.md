---
title: "Badge"
description: "Displays a number or a status dot at the corner of an icon, avatar or button to flag new or pending items."
group: "data-display"
icon: "notifications"
weight: 20
example: "badge"
mui: "https://mui.com/material-ui/react-badge/"
---

`Badge` wraps an element (icon, avatar, button) and places a counter or a dot at its corner. Use it to flag unread messages, pending notifications or an online status. Don't use it for standalone text labels (use [Chip]({{< relref "/components/chip" >}})) or for page-level status messages (use [Alert]({{< relref "/components/alert" >}})).

## Basic usage

Wrap the content with `data-mtx="badge"` and set the value in `data-content`. The component creates the badge node and positions it.

{{< mtx-demo title="Counter on an icon" >}}
<div data-mtx="badge" data-content="4" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="12" data-color="error">
  <span class="material-icons" aria-hidden="true">notifications</span>
</div>
{{< /mtx-demo >}}

## Variants

`standard` (default) shows the content; `dot` shows an 8px dot with no text, useful for signaling "there's something new" without giving a number.

{{< mtx-demo title="Standard and dot" >}}
<div data-mtx="badge" data-content="4" data-color="secondary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-variant="dot" data-color="secondary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="New" data-color="success">
  <span class="material-icons" aria-hidden="true">inventory_2</span>
</div>
{{< /mtx-demo >}}

## Colors

Without `data-color` (or with `default`) the badge is an opaque neutral grey that adapts to the light and dark themes (`mtx-badge--default` class). The rest of the palette applies its contrast color to the text.

{{< mtx-demo title="Palette" >}}
<div data-mtx="badge" data-content="4">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="secondary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="error">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="warning">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="info">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="success">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
{{< /mtx-demo >}}

## Maximum value

If the content is an integer greater than `data-max` (99 by default), `{max}+` is displayed.

{{< mtx-demo title="data-max" >}}
<div data-mtx="badge" data-content="99" data-max="9" data-color="error">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="150" data-color="error">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="1000" data-max="999" data-color="error">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
{{< /mtx-demo >}}

## Badge visibility

As in MUI, the badge is hidden when the value is `0` or there's no content. `data-show-zero` shows the zero and `data-invisible` always hides it (in the `dot` variant too). When hidden, it shrinks with a transition without shifting the content.

{{< mtx-demo title="Zero, show-zero and invisible" >}}
<div data-mtx="badge" data-content="0" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="0" data-show-zero data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="5" data-invisible data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
{{< /mtx-demo >}}

## Standalone badge

`data-standalone` places the badge in the text flow with no anchored element: navigation counters, lists or tabs. With content 0 it disappears completely (unless `data-show-zero`). Standalone, the number is read as text; `data-label` (`{0}` = displayed content) also adds screen-reader-only text.

{{< mtx-demo title="Inline counters" layout="column" >}}
<div>
  <span data-mtx="badge" data-standalone data-content="4" data-color="primary"></span>
  <span data-mtx="badge" data-standalone data-content="120" data-color="error"></span>
  <span data-mtx="badge" data-standalone data-content="New"></span>
</div>
<ul data-mtx="list" aria-label="Folders">
  <li><a data-mtx="list-item-button" data-icon="inbox" href="#">Inbox <span data-mtx="badge" data-standalone data-content="4" data-color="primary" data-label="{0} unread" class="mtx-ms-auto"></span></a></li>
</ul>
{{< /mtx-demo >}}

## Badge alignment

`data-anchor` places the badge at `top-right` (default), `top-left`, `bottom-right` or `bottom-left`.

{{< mtx-demo title="Anchors" >}}
<div data-mtx="badge" data-content="3" data-anchor="top-left" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="3" data-anchor="top-right" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="3" data-anchor="bottom-left" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="3" data-anchor="bottom-right" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
{{< /mtx-demo >}}

## Badge overlap

`data-overlap="rectangular"` (default) anchors the badge to the corners of a box. On circular shapes, such as an avatar, use `data-overlap="circular"` to bring it closer to the edge of the circle.

{{< mtx-demo title="Rectangular and circular" >}}
<div data-mtx="badge" data-variant="dot" data-color="error">
  <div data-mtx="avatar" data-variant="square" data-color="primary">R</div>
</div>
<div data-mtx="badge" data-variant="dot" data-color="error" data-overlap="circular">
  <div data-mtx="avatar" data-color="primary">C</div>
</div>
<div data-mtx="badge" data-content="6" data-color="error" data-overlap="circular">
  <div data-mtx="avatar" data-color="secondary">R</div>
</div>
{{< /mtx-demo >}}

## Real-world examples

An action bar with counters on icon buttons and an avatar with an online status. The number is announced through each button's `aria-label`.

{{< callout type="tip" title="Badge with IconButton" >}}
You can place the badge inside the `IconButton`, wrapping the icon (the MUI pattern), or wrap the button with the badge and `data-overlap="circular"` so the badge sits on the edge of the round button. Either way, announce the number in the button's `aria-label`.
{{< /callout >}}

{{< mtx-demo title="Action bar" >}}
<button data-mtx="icon-button" aria-label="Mail, 4 unread messages">
  <span data-mtx="badge" data-content="4" data-color="primary"><span class="material-icons" aria-hidden="true">mail</span></span>
</button>
<div data-mtx="badge" data-content="17" data-color="error" data-overlap="circular">
  <button data-mtx="icon-button" data-icon="notifications" aria-label="Notifications, 17 new"></button>
</div>
<div data-mtx="badge" data-variant="dot" data-color="secondary" data-overlap="circular">
  <button data-mtx="icon-button" data-icon="shopping_cart" aria-label="Cart, items pending"></button>
</div>
<div data-mtx="badge" data-variant="dot" data-color="success" data-overlap="circular" data-anchor="bottom-right">
  <div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=47" data-alt="Anna Garcia, online"></div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

If the badge is already rendered (`.mtx-badge__badge`), the component reuses it and only computes visibility and the maximum value from `data-content`.

```html
<span class="mtx-badge mtx-badge--error mtx-badge--overlap-circular" data-mtx="badge" data-content="6">
  <span class="mtx-avatar mtx-avatar--secondary">R</span>
  <span class="mtx-badge__badge" aria-hidden="true">6</span>
</span>
```

## Programmatic usage

```javascript
// Initialize a dynamically created badge
const badge = Materix.init(document.getElementById('inbox-badge'));

// Direct instantiation or retrieval of the instance
const same = Materix.getInstance(document.getElementById('inbox-badge'));

// Change content and visibility
badge.content = 5;        // applies data-max and the zero rule
badge.content = null;     // no content: hidden
badge.invisible = true;   // hidden even if it has a value
```

With ES modules:

```javascript
import { Badge } from 'materix-ui';

const badge = new Badge(document.querySelector('#inbox-badge'));
badge.content = 120; // shows "99+"
```

{{< mtx-demo title="Counter controlled through the API" >}}
<div id="doc-badge" data-mtx="badge" data-content="1" data-color="primary">
  <span class="material-icons" aria-hidden="true">notifications</span>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-badge="inc">Increment</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-badge="reset">Reset to 0</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-badge="toggle">Toggle invisible</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const badge = () => Materix.getInstance(document.getElementById('doc-badge'));
  document.querySelectorAll('[data-doc-badge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.docBadge;
      if (action === 'inc') badge().content = Number(badge().content || 0) + 1;
      if (action === 'reset') badge().content = 0;
      if (action === 'toggle') badge().invisible = !badge().invisible;
    });
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-content` | Text or number | — | Badge content. With no content (`standard` variant) the badge is hidden. |
| `data-variant` | `standard`, `dot` | `standard` | `dot` shows an 8px dot and ignores the content. |
| `data-color` | `default`, `primary`, `secondary`, `error`, `warning`, `info`, `success` | `default` | Background color with contrast text. |
| `data-max` | Number | `99` | If the content is a greater integer, `{max}+` is displayed. |
| `data-standalone` | Boolean (presence) | absent | Inline badge with no anchored child (`mtx-badge--standalone`). Disappears when there is no visible content. |
| `data-label` | Text with `{0}` | — | Hidden accessible text (`mtx-badge__label`); `{0}` is replaced by the displayed content. |
| `data-show-zero` | Boolean (presence; `"false"` disables it) | absent | Shows the badge when the value is `0`. |
| `data-invisible` | Boolean (presence; `"false"` disables it) | absent | Hides the badge even if it has content. |
| `data-anchor` | `top-right`, `top-left`, `bottom-right`, `bottom-left` | `top-right` | Anchor corner. |
| `data-overlap` | `rectangular`, `circular` | `rectangular` | Adjusts the position for circular shapes. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-badge` | Relative container that wraps the child. |
| `mtx-badge__badge` | The badge itself (created automatically if missing). |
| `mtx-badge--dot` | Dot variant (8×8px). |
| `mtx-badge--primary` … `--success` | Palette color (`primary`, `secondary`, `error`, `warning`, `info`, `success`). |
| `mtx-badge--top-left` / `--bottom-right` / `--bottom-left` | Non-default anchor. |
| `mtx-badge--overlap-circular` | Position adjusted for circular shapes. |
| `mtx-badge--invisible` | Hidden badge (scale 0 with a transition). |
| `mtx-badge--default` | Neutral color (also without `data-color`). |
| `mtx-badge--standalone` | Inline badge, no anchoring or transform. |
| `mtx-badge__label` | Screen-reader-only text (from `data-label`). |

### Methods

| Property | Returns | Description |
|---|---|---|
| `content` (get/set) | `string \| null` | Current content. Setting it re-applies `data-max`, the zero rule and visibility. |
| `invisible` (get/set) | `boolean` | Reads whether it's hidden; setting it forces or clears explicit hiding. |

### Events

Badge doesn't emit events.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-text-primary`, `--mtx-color-background-paper` | Background (60% mix) and text of the `default` color. |
| `--mtx-color-{palette}`, `--mtx-color-{palette}-contrast` | Background and text of each color. |
| `--mtx-font-family` | Badge font (12px, weight 500). |
| `--mtx-duration-short`, `--mtx-easing-standard` | Show and hide transition. |

## Accessibility

- Anchored to a child, the badge has `aria-hidden="true"`: include the information in the control's accessible name, for example `aria-label="Notifications, 17 new"` on the button. In `data-standalone` mode the number is read as text; use `data-label` to give it context ("4 unread").
- Mark decorative icons with `aria-hidden="true"`.
- Don't convey information through the badge color alone: the `aria-label` text or the context must state its meaning.
- Badge isn't interactive and doesn't receive focus; if the wrapped element is a button, that button handles focus and keyboard.
