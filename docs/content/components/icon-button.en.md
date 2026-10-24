---
title: "Icon Button"
description: "Circular icon-only button for compact actions in toolbars, cards and table rows. Always with an aria-label."
group: "inputs"
icon: "ads_click"
weight: 20
example: "icon-button"
import: "IconButton"
mui: "https://mui.com/material-ui/react-button/#icon-button"
---

**Icon Button** triggers an action represented solely by a recognizable icon: search, close, share, open a menu. It is the right choice in toolbars, card headers and per-row actions, where space is limited. If the icon is not unambiguous, use a [Button]({{< relref "/components/button" >}}) with text; if it is the primary action of the screen, use a [Fab]({{< relref "/components/fab" >}}).

{{< callout type="warning" title="aria-label is required" >}}
An Icon Button has no visible text: without `aria-label` (or `aria-labelledby`) screen readers would only announce "button". Describe the action, not the icon: "Delete invoice", not "trash can".
{{< /callout >}}

```tsx
import { IconButton } from '@rubenchodev/materix-react';
// or only this component:
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
```

## Basic usage

Pass the Material Icons name in `icon`. The component renders `<button type="button" class="mtx-icon-button">`, the 24px glyph (with `aria-hidden="true"`) and the centered ripple.

{{< react-demo "icon-button/01-basic" >}}

## Sizes

Three sizes via `size`. The icon always keeps its native 24px grid (it is never rescaled); what changes is the touch target.

| Size | `size` | Area | Aligns with |
| :--- | :--- | :--- | :--- |
| Large | `large` | 48px | Button large, Fab medium |
| Medium | `medium` (default) | 40px | Button medium, Text Field small |
| Small | `small` | 32px | Button small, Chip |

{{< react-demo id="icon-button/02-sizes" layout="block" >}}

## Icons

`icon` accepts a Material Icons name (string) or any node: an `<svg>` (rendered at 24 × 24px with `currentColor`) or a Material Symbols glyph. You can also write the icon as `children`, which takes priority over `icon`. With `href` the root becomes an `<a>` without underline.

{{< react-demo id="icon-button/03-icons" layout="block" >}}

## Colors

Without `color` the icon uses the active action gray (`--mtx-color-action-active`), as in MUI. `color` accepts any palette color, or `inherit` to take the color of the surrounding text (dark or colored surfaces such as an AppBar).

{{< react-demo id="icon-button/04-colors" layout="block" >}}

## States

Hover shows a subtle background, keyboard focus a ring in the primary color, and a press a centered ripple. `disabled` sets the native attribute (on links, `aria-disabled="true"` and `tabIndex={-1}`, and the click is blocked).

{{< react-demo id="icon-button/05-states" layout="block" >}}

## Edge placement

`edge="start|end"` applies a negative 12px margin so the glyph is optically aligned with the content edge, like MUI's `edge` prop. Use it on the first or last item of a bar.

{{< react-demo id="icon-button/06-edge" layout="block" >}}

## With badge

Wrap the Icon Button in a [Badge]({{< relref "/components/badge" >}}) to show counters and include the number in the `aria-label`. The button does not clip its content (the ripple is clipped by an inner container), so the badge is never cut off.

{{< react-demo "icon-button/07-with-badge" >}}

## With tooltip

An icon alone is not always self-explanatory. Wrap the Icon Button in a [Tooltip]({{< relref "/components/tooltip" >}}) to show its name on hover, keyboard focus or long press. If the button has no `aria-label`, the tooltip text becomes its accessible name; if it already has one, the tooltip is linked as a description (`aria-describedby`).

{{< react-demo "icon-button/08-with-tooltip" >}}

{{< callout type="tip" title="Recommended for icon-only buttons" >}}
MUI recommends wrapping every icon-only button in a Tooltip. A disabled button does not receive pointer events: wrap it in a `<span>` inside the Tooltip.
{{< /callout >}}

## Real-world examples

An editor formatting bar (a group of small Icon Buttons with `role="toolbar"`) and per-item actions where each `aria-label` also names the object.

{{< react-demo id="icon-button/09-use-cases" layout="block" >}}

## Grid

Inside a grid the Icon Button keeps its fixed size: it never stretches.

{{< react-demo id="icon-button/10-grid" layout="block" >}}

## Programmatic usage

The vanilla methods become props: `disabled` replaces `disable()`/`enable()`, and `ref` gives you the DOM element. Icon Button emits no events of its own: use `onClick` and any other native handler.

{{< react-demo id="icon-button/11-programmatic" layout="block" >}}

## Manual BEM markup

The CSS also works with plain markup (static HTML or server templates), without the ripple:

{{< react-demo id="icon-button/12-markup" open="false" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | — | Material Icons name (`"search"`) or a node (SVG…). Ignored when there are `children`. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 32 / 40 / 48px area. |
| `color` | `'default' \| 'inherit' \| 'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'default'` | Icon color. |
| `edge` | `'start' \| 'end' \| false` | `false` | Negative 12px margin on that side. |
| `disabled` | `boolean` | `false` | Native `disabled`; `aria-disabled` on links. |
| `disableRipple` | `boolean` | `false` | Turns off the centered ripple. |
| `href` | `string` | — | Renders an `<a>`. |
| `component` | `ElementType` | `'button'` / `'a'` | Custom root element (e.g. a router link). |
| `children` | `ReactNode` | — | Own content (nested icon). |
| `className`, `style`, `ref`, `aria-*`, `on*`… | — | — | Forwarded to the root; `className` is merged. |

`type` defaults to `"button"` so it never submits a form by accident.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-icon-button` | Base class: 40px circle with a 24px icon. |
| `mtx-icon-button--small` / `--large` | 32px / 48px area. |
| `mtx-icon-button--primary`, `--secondary`, `--success`, `--error`, `--warning`, `--info` | Icon color. |
| `mtx-icon-button--inherit` | Inherits the container color. |
| `mtx-icon-button--edge-start` / `--edge-end` | -12px margin. |

### CSS variables

| Variable | Use |
| :--- | :--- |
| `--mtx-color-action-active` | Default icon color. |
| `--mtx-color-action-hover` / `--mtx-color-action-selected` | Hover and pressed backgrounds. |
| `--mtx-color-action-disabled` | Disabled icon. |
| `--mtx-size-large-height`, `--mtx-size-medium-height`, `--mtx-size-small-height` | 48 / 40 / 32px areas. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-ic-color` | Local icon color; override it for a custom color. |

## Accessibility

- It renders a native `<button>`: focusable and activable with <kbd>Enter</kbd> / <kbd>Space</kbd> without extra code.
- `aria-label` is required; the generated icon has `aria-hidden="true"`.
- For toggle buttons (favorite, bold) add `aria-pressed={pressed}`.
- The focus ring only appears during keyboard navigation (`:focus-visible`).

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next / previous element. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Triggers the action. |

## Vanilla equivalence

| Vanilla | React |
| :--- | :--- |
| `data-icon="search"` | `icon="search"` |
| `data-size="small\|large"` | `size="small\|large"` |
| `data-color="primary"` | `color="primary"` |
| `data-edge="start"` | `edge="start"` |
| `disabled` / `disable()` / `enable()` | `disabled={boolean}` |
| `<a data-mtx="icon-button" href>` | `href` or `component` |
| `Materix.getInstance(el)` | `ref` |
