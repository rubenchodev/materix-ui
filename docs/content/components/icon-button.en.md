---
title: "Icon Button"
description: "Circular icon-only button for compact actions in toolbars, cards and table rows. Always with an aria-label."
group: "inputs"
icon: "ads_click"
weight: 20
example: "icon-button"
mui: "https://mui.com/material-ui/react-button/#icon-button"
---

**Icon Button** triggers an action represented solely by a recognizable icon: search, close, share, open a menu. It is the right choice in toolbars, card headers and per-row actions, where space is limited. If the icon is not unambiguous, use a [Button](../button/) with text; if it is the primary action of the screen, use a [Fab](../fab/).

{{< callout type="warning" title="aria-label is required" >}}
An Icon Button has no visible text: without `aria-label` (or `aria-labelledby`) screen readers would only announce "button". Describe the action, not the icon: "Delete invoice", not "trash can".
{{< /callout >}}

## Basic usage

An empty `<button>` with `data-mtx="icon-button"` and `data-icon`. The library adds the `mtx-icon-button` class, injects the Material Icons glyph (24px, with `aria-hidden="true"`) and the centered ripple.

{{< mtx-demo title="Basic usage" >}}
<button data-mtx="icon-button" data-icon="search" aria-label="Search"></button>
<button data-mtx="icon-button" data-icon="favorite" data-color="error" aria-label="Add to favorites"></button>
<button data-mtx="icon-button" data-icon="share" data-color="primary" aria-label="Share"></button>
<button data-mtx="icon-button" data-icon="delete" aria-label="Delete"></button>
{{< /mtx-demo >}}

## Sizes

Three sizes via `data-size`. The icon always keeps its native 24px grid (it is never rescaled); what changes is the touch target.

| Size | `data-size` | Area | Aligns with |
| :--- | :--- | :--- | :--- |
| Large | `large` | 48px | Button large, Fab medium |
| Medium | — (default) | 40px | Button medium, Text Field small |
| Small | `small` | 32px | Button small, Chip |

{{< mtx-demo title="Sizes" >}}
<button data-mtx="icon-button" data-icon="edit" data-size="large" aria-label="Edit (large)"></button>
<button data-mtx="icon-button" data-icon="edit" aria-label="Edit"></button>
<button data-mtx="icon-button" data-icon="edit" data-size="small" aria-label="Edit (small)"></button>
{{< /mtx-demo >}}

{{< mtx-demo title="Alignment with small Text Field and Button (40px)" >}}
<div style="width: 280px; max-width: 100%;">
  <input data-mtx="text-field" data-label="Search files" data-size="small" type="search" />
</div>
<button data-mtx="icon-button" data-icon="filter_list" aria-label="Filter"></button>
<button class="mtx-button mtx-button--outlined" data-mtx="button">Upload</button>
{{< /mtx-demo >}}

## Icons

You can set the icon with `data-icon` or write it inside the button (useful for Material Symbols or another icon family). If the button already has content, `data-icon` is ignored.

{{< mtx-demo title="data-icon and nested icon" >}}
<button data-mtx="icon-button" data-icon="print" aria-label="Print"></button>
<button data-mtx="icon-button" aria-label="Download">
  <span class="material-icons" aria-hidden="true">download</span>
</button>
<a href="#icons" data-mtx="icon-button" data-icon="open_in_new" aria-label="Open in a new tab"></a>
{{< /mtx-demo >}}

An `<svg>` inside the button renders at 24 × 24px with `currentColor` (MUI's native grid). As an `<a>`, the button is not underlined.

{{< mtx-demo title="SVG icon" >}}
<button data-mtx="icon-button" aria-label="GitHub">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
</button>
{{< /mtx-demo >}}

## Colors

Without `data-color` the icon uses the active action gray (`--mtx-color-action-active`), as in MUI. `data-color` accepts any palette color, or `inherit` to take the color of the surrounding text.

{{< mtx-demo title="Colors" >}}
<button data-mtx="icon-button" data-icon="star" aria-label="Default"></button>
<button data-mtx="icon-button" data-icon="star" data-color="primary" aria-label="Primary"></button>
<button data-mtx="icon-button" data-icon="star" data-color="secondary" aria-label="Secondary"></button>
<button data-mtx="icon-button" data-icon="star" data-color="success" aria-label="Success"></button>
<button data-mtx="icon-button" data-icon="star" data-color="error" aria-label="Error"></button>
<button data-mtx="icon-button" data-icon="star" data-color="warning" aria-label="Warning"></button>
<button data-mtx="icon-button" data-icon="star" data-color="info" aria-label="Info"></button>
{{< /mtx-demo >}}

`data-color="inherit"` is the option for dark or colored surfaces (AppBar, banners): the icon takes the container's color.

{{< mtx-demo title="Inherit on a colored surface" layout="block" >}}
<div class="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
  <button data-mtx="icon-button" data-icon="menu" data-color="inherit" aria-label="Open menu"></button>
  <span class="mtx-flex-1">Dashboard</span>
  <button data-mtx="icon-button" data-icon="search" data-color="inherit" aria-label="Search"></button>
</div>
{{< /mtx-demo >}}

## States

Hover shows a subtle background, keyboard focus a ring in the primary color, and a press a centered ripple. Disable it with the native `disabled` attribute.

{{< mtx-demo title="Enabled and disabled" >}}
<button data-mtx="icon-button" data-icon="lock_open" aria-label="Unlock"></button>
<button data-mtx="icon-button" data-icon="lock" aria-label="Locked" disabled></button>
<button data-mtx="icon-button" data-icon="lock" data-color="primary" aria-label="Locked (primary)" disabled></button>
{{< /mtx-demo >}}

## Edge placement

`data-edge="start|end"` (or the `mtx-icon-button--edge-start` and `mtx-icon-button--edge-end` classes) apply a negative 12px margin so the glyph is optically aligned with the content edge, like MUI's `edge` prop. Use them on the first or last item of a bar.

{{< mtx-demo title="edge-start" >}}
<button data-mtx="icon-button" data-icon="menu" data-edge="start" aria-label="Open menu"></button>
<span>Inbox</span>
{{< /mtx-demo >}}

## With badge

Wrap the Icon Button in a [Badge](../badge/) to show counters. Include the number in the `aria-label`. The button does not clip its content (the ripple is clipped by an inner container), so the badge can also sit inside the button.

{{< mtx-demo title="With badge" >}}
<div data-mtx="badge" data-content="4" data-color="error">
  <button data-mtx="icon-button" data-icon="notifications" aria-label="Notifications: 4 unread"></button>
</div>
{{< /mtx-demo >}}

## With tooltip

An icon alone is not always self-explanatory. Add `data-mtx-tooltip` to show its name on hover, keyboard focus or long press (see [Tooltip](../tooltip/)); no initialization required. If the button has no `aria-label`, the tooltip text becomes its accessible name; if it already has one, the tooltip is linked as a description (`aria-describedby`).

{{< mtx-demo title="data-mtx-tooltip" >}}
<button data-mtx="icon-button" data-icon="delete" data-mtx-tooltip="Delete"></button>
<button data-mtx="icon-button" data-icon="archive" aria-label="Archive" data-mtx-tooltip="Archive (E)"></button>
<button data-mtx="icon-button" data-icon="more_vert" data-mtx-tooltip="More options" data-tooltip-placement="top" data-tooltip-arrow></button>
{{< /mtx-demo >}}

{{< callout type="tip" title="Recommended for icon-only buttons" >}}
MUI recommends wrapping every icon-only button in a Tooltip. With Materix it is one attribute: `data-mtx-tooltip="Action"`. A disabled button does not receive pointer events: wrap it in `<span data-mtx="tooltip" data-title="…">`.
{{< /callout >}}

## Real-world examples

An editor formatting bar: a group of small Icon Buttons with `role="toolbar"`.

{{< mtx-demo title="Toolbar" >}}
<div role="toolbar" aria-label="Text formatting">
  <button data-mtx="icon-button" data-icon="format_bold" data-size="small" aria-label="Bold"></button>
  <button data-mtx="icon-button" data-icon="format_italic" data-size="small" aria-label="Italic"></button>
  <button data-mtx="icon-button" data-icon="format_underlined" data-size="small" aria-label="Underline"></button>
  <button data-mtx="icon-button" data-icon="link" data-size="small" aria-label="Insert link"></button>
</div>
{{< /mtx-demo >}}

Actions for a list item: each `aria-label` also names the object.

{{< mtx-demo title="Per-item actions" >}}
<span>quarterly-report.pdf</span>
<button data-mtx="icon-button" data-icon="download" aria-label="Download quarterly-report.pdf"></button>
<button data-mtx="icon-button" data-icon="delete" data-color="error" aria-label="Delete quarterly-report.pdf"></button>
{{< /mtx-demo >}}

## Full BEM syntax

The extended structure writes out the base class, the modifiers and the nested icon. Useful for SSR or templates.

```html
<button class="mtx-icon-button mtx-icon-button--large mtx-icon-button--primary"
        data-mtx="icon-button" type="button" aria-label="Edit">
  <span class="material-icons" aria-hidden="true">edit</span>
</button>
```

## Programmatic usage

```javascript
// Initialize a dynamically created element
const el = document.createElement('button');
el.setAttribute('data-icon', 'bookmark');
el.setAttribute('aria-label', 'Add to bookmarks');
toolbar.appendChild(el);
const iconButton = Materix.init(el, 'icon-button');

// Instantiate directly or retrieve an existing instance
const other = new Materix.IconButton(element);
const instance = Materix.getInstance(element);

instance.disable();
instance.enable();
```

With ES modules:

```javascript
import { init, getInstance, IconButton } from 'materix-ui';
```

{{< mtx-demo title="disable() / enable()" >}}
<button data-mtx="icon-button" data-icon="favorite" data-color="error" aria-label="Like" id="doc-icon-button-target"></button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-icon-button-disable">disable()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-icon-button-enable">enable()</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var target = document.getElementById('doc-icon-button-target');
  document.getElementById('doc-icon-button-disable').addEventListener('click', function () {
    Materix.getInstance(target).disable();
  });
  document.getElementById('doc-icon-button-enable').addEventListener('click', function () {
    Materix.getInstance(target).enable();
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `icon-button` | — | Enables auto-initialization. |
| `data-icon` | Material Icons name | — | Injects `<span class="material-icons" aria-hidden="true">` if the button is empty. |
| `data-size` | `small` \| `large` | medium (40px) | Adds `mtx-icon-button--{size}` (32 / 48px). |
| `data-color` | `primary` \| `secondary` \| `success` \| `error` \| `warning` \| `info` \| `inherit` | action gray | Adds `mtx-icon-button--{color}`. `inherit` takes the container color (dark surfaces). |
| `data-edge` | `start` \| `end` | — | Adds `mtx-icon-button--edge-{edge}` (negative 12px margin). |

Native attributes: `aria-label` (required), `disabled`, `type`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-icon-button` | Base class: 40px circle with a 24px icon (also `<svg>` at 24px). It does not clip its content; as an `<a>` it is not underlined. Added by the JS if missing. |
| `mtx-icon-button--small` | 32px area. |
| `mtx-icon-button--large` | 48px area. |
| `mtx-icon-button--primary`, `--secondary`, `--success`, `--error`, `--warning`, `--info` | Icon color. |
| `mtx-icon-button--inherit` | Inherits the container color. |
| `mtx-icon-button--edge-start` | -12px left margin. |
| `mtx-icon-button--edge-end` | -12px right margin. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `disable()` | `void` | Sets the native `disabled` attribute. |
| `enable()` | `void` | Removes `disabled`. |
| `disabled` (getter) | `boolean` | Disabled state of the `<button>`. |
| `destroy()` | `void` | Removes the ripple listener. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

Icon Button emits no events of its own. Listen to the native `click`.

### CSS variables

| Variable | Use in Icon Button |
| :--- | :--- |
| `--mtx-color-action-active` | Default icon color. |
| `--mtx-color-action-hover` | Hover background. |
| `--mtx-color-action-selected` | Background when pressed. |
| `--mtx-color-action-disabled` | Disabled icon. |
| `--mtx-color-{primary,secondary,success,error,warning,info}` | `data-color` colors. |
| `--mtx-size-large-height`, `--mtx-size-medium-height`, `--mtx-size-small-height` | 48 / 40 / 32px areas. |
| `--mtx-shape-full` | Circular shape. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-ic-color` | Local variable holding the icon color; override it for a custom color. |

## Accessibility

- It is a native `<button>`: it can be focused and activated from the keyboard with no extra JavaScript.
- `aria-label` is required; the generated icon has `aria-hidden="true"`.
- For buttons that toggle a state (favorite, bold) add `aria-pressed="true|false"` and update it in your code.
- The focus ring uses `--mtx-focus-ring-color` and only appears during keyboard navigation (`:focus-visible`).

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next / previous element. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Triggers the action. |
