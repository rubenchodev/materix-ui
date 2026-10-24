---
title: "Badge"
description: "Displays a number or a status dot at the corner of an icon, avatar or button to flag new or pending items."
group: "data-display"
icon: "notifications"
weight: 20
example: "badge"
import: "Badge"
mui: "https://mui.com/material-ui/react-badge/"
---

`Badge` wraps an element (icon, avatar, button) and places a counter or a dot at its corner. Use it to flag unread messages, pending notifications or an online status. Don't use it for standalone text labels (use [Chip](../chip/)) or for page-level status messages (use [Alert](../alert/)).

```tsx
import { Badge } from '@rubenchodev/materix-react';
// or only this component:
import { Badge } from '@rubenchodev/materix-react/components/badge';
```

## Basic usage

Wrap the content with `<Badge>` and pass the value in `badgeContent`. The component renders the `.mtx-badge__badge` node after the children and positions it.

{{< react-demo "badge/01-basic" >}}

## Variants

`standard` (default) shows the content, a number or a short text. `dot` shows an 8px dot and ignores `badgeContent`.

{{< react-demo id="badge/02-variants" layout="block" >}}

## On icons, avatars and buttons

The badge wraps any element. With an icon button it can go inside, wrapping the icon (MUI pattern), or outside, wrapping the button. The badge is decorative (`aria-hidden="true"`), so the number must be part of the button `aria-label`.

{{< react-demo "badge/03-with-icons" >}}

## Colors

Without `color` (or with `default`) the badge is a neutral gray that adapts to the theme, as in MUI. The other values use the palette with its contrast text.

{{< react-demo id="badge/04-colors" layout="block" >}}

## States

The badge is hidden (`.mtx-badge--invisible`, scale animation) when `badgeContent` is `0`, `null` or missing. `showZero` shows the zero, `invisible` always hides it and `max` (99 by default) turns larger numbers into `max+`. `max` only applies to numbers or numeric strings.

{{< react-demo id="badge/05-states" layout="block" >}}

## Inline (standalone)

`standalone` renders the badge in the text flow with no anchored element: counters in navigation, lists or tabs. Its number is then content (no `aria-hidden`). With `label`, a visually hidden `.mtx-badge__label` is added for screen readers (`{0}` is replaced by the displayed content) and the visible badge becomes decorative again.

{{< react-demo id="badge/06-standalone" layout="block" >}}

## Position

`anchor` places the badge at `top-right` (default), `top-left`, `bottom-right` or `bottom-left`. The MUI `anchorOrigin={{ vertical, horizontal }}` is also accepted and wins over `anchor`.

{{< react-demo "badge/07-position" >}}

## Overlap

`overlap="rectangular"` (default) uses the corners of the box; `circular` moves the badge closer to the edge of round shapes such as an Avatar.

{{< react-demo id="badge/08-overlap" layout="block" >}}

## Use cases

An action bar with counters and an avatar with an online status.

{{< react-demo "badge/09-use-cases" >}}

## Grid layout

Dashboard shortcuts in [Grid](../grid/): 2 columns on mobile and 4 from `md`.

{{< react-demo id="badge/10-grid" layout="block" >}}

## Controlled usage

In React the badge is driven by props: change `badgeContent` or `invisible` and the next render applies `max` and the zero rule. This replaces the vanilla `content` and `invisible` setters.

{{< react-demo id="badge/11-controlled" layout="block" >}}

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `badgeContent` | `ReactNode` | — | Content of the badge (number or short text). |
| `variant` | `'standard'` \| `'dot'` | `'standard'` | `dot` adds `.mtx-badge--dot`. |
| `color` | `'default'` \| `'primary'` \| `'secondary'` \| `'error'` \| `'warning'` \| `'info'` \| `'success'` | `'default'` | Adds `.mtx-badge--{color}`. |
| `anchor` | `'top-right'` \| `'top-left'` \| `'bottom-right'` \| `'bottom-left'` | `'top-right'` | Corner of the badge. |
| `anchorOrigin` | `{ vertical: 'top' \| 'bottom', horizontal: 'left' \| 'right' }` | — | MUI alternative to `anchor`. |
| `overlap` | `'rectangular'` \| `'circular'` | `'rectangular'` | `circular` adds `.mtx-badge--overlap-circular`. |
| `max` | `number` | `99` | Larger numeric values show `max+`. |
| `showZero` | `boolean` | `false` | Shows the badge when the content is `0`. |
| `invisible` | `boolean` | `false` | Always hides the badge. |
| `standalone` | `boolean` | `false` | Inline badge with no anchored element. |
| `label` | `string` | — | Screen reader text; `{0}` = content. |
| `component` | `ElementType` | `'span'` | Root element or component. |
| `className` | `string` | — | Merged with the component classes. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

Any other prop is forwarded to the root element. The helper `formatBadgeContent(content, max)` is also exported.

### Callbacks

Badge emits no events.

### CSS classes

| Class | Description |
|---|---|
| `.mtx-badge` | Root (relative inline-flex). |
| `.mtx-badge__badge` | The badge itself. |
| `.mtx-badge__label` | Visually hidden text (`label`). |
| `.mtx-badge--dot` | 8px dot. |
| `.mtx-badge--{color}` | Palette color (`default`, `primary`…). |
| `.mtx-badge--top-left` / `--bottom-right` / `--bottom-left` | Anchor (top-right has no class). |
| `.mtx-badge--overlap-circular` | Position for round shapes. |
| `.mtx-badge--invisible` | Hidden (scale 0). |
| `.mtx-badge--standalone` | Inline badge. |

## Accessibility

- Anchored badges are decorative (`aria-hidden="true"`): include the number in the accessible name of the wrapped control (`aria-label="Notifications, 17 unread"`).
- In `standalone` mode the number is read as content; with `label` the screen reader text replaces it.
- The badge is never focusable and the color is not the only carrier of meaning.
- The scale animation is turned off with `prefers-reduced-motion: reduce`.

## Vanilla equivalence

| Vanilla (`data-*`) | React |
|---|---|
| `<div data-mtx="badge">` | `<Badge>` |
| `data-content="4"` | `badgeContent={4}` |
| `data-variant="dot"` | `variant="dot"` |
| `data-color="error"` | `color="error"` |
| `data-anchor="bottom-left"` | `anchor="bottom-left"` |
| `data-overlap="circular"` | `overlap="circular"` |
| `data-max="9"` | `max={9}` |
| `data-show-zero` | `showZero` |
| `data-invisible` | `invisible` |
| `data-standalone` | `standalone` |
| `data-label="{0} unread"` | `label="{0} unread"` |
| `badge.content = 5` / `badge.invisible = true` | `badgeContent={5}` / `invisible` |

The rendered DOM (classes and attributes) is identical to the vanilla component after initialization. The default root is `span` (MUI); use `component="div"` to match a vanilla `div`.
