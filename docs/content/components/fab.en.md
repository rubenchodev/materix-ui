---
title: "Fab"
description: "Floating action button for a screen's primary action: circular (56/48/40px) or extended with text (48px)."
group: "inputs"
icon: "add_circle"
weight: 30
example: "fab"
import: "Fab"
mui: "https://mui.com/material-ui/react-floating-action-button/"
---

**Fab** (Floating Action Button) represents the primary or most common action on a screen —compose, create, add— and floats above the content with high elevation. Use at most one per screen. For secondary actions use a [Button]({{< relref "/components/button" >}}); for compact actions in toolbars or rows, an [Icon Button]({{< relref "/components/icon-button" >}}).

```tsx
import { Fab } from '@rubenchodev/materix-react';
// or only this component:
import { Fab } from '@rubenchodev/materix-react/components/fab';
```

## Basic usage

`icon` generates a circular FAB; adding `label` turns it into an extended FAB with text. The circular FAB needs an `aria-label`.

{{< react-demo "fab/01-basic" >}}

## Variants

- **Circular** (default): icon only, 56px.
- **Extended** (`mtx-fab--extended`): icon and text, 48px tall. It is enabled automatically with `label`, or with `variant="extended"` if you write the content yourself as `children`.

{{< react-demo id="fab/02-variants" layout="block" >}}

## Sizes

With `size`. Unlike Button, the FAB's default size is **large**.

| Size | `size` | Circular | Extended | Aligns with |
| :--- | :--- | :--- | :--- | :--- |
| Large | `large` (default) | 56px | 48px | Medium Text Field (56px) |
| Medium | `medium` | 48px | 40px | Large Button, large Icon Button |
| Small | `small` | 40px | 34px | Medium Button, small Text Field |

{{< react-demo id="fab/03-sizes" layout="block" >}}

## With icons

Combine `icon` and `label`: icon only, icon and text, or text only. A string icon is decorative (`aria-hidden="true"`); `icon` also accepts a node such as an `<svg>` (24px). The `label` text is the accessible name of the extended FAB.

{{< react-demo id="fab/04-with-icons" layout="block" >}}

## Colors

Primary is the default. `color` accepts the palette colors and `default`, a neutral surface with a border, useful when the screen already has a lot of primary color. `inherit` takes background and color from the container.

{{< react-demo id="fab/05-colors" layout="block" >}}

## States

Hover raises the elevation from 6 to 12, a press shows the ripple and keyboard focus a ring. `disabled` removes the elevation and color (on links it uses `aria-disabled="true"`, `tabIndex={-1}` and blocks the click).

{{< react-demo id="fab/06-states" layout="block" >}}

## Position

`position="fixed-br"` and `"fixed-bl"` pin the FAB 24px from the bottom-right or bottom-left corner of the window (z-index of the SpeedDial layer). `"absolute-center"` centers it over the top edge of its positioned container, as in a bottom bar.

{{< react-demo id="fab/07-position" layout="block" >}}

```tsx
<Fab icon="add" position="fixed-br" aria-label="Create" />
```

## Grid layout

Inside a grid the FAB keeps its size; use it as the primary action of each card or column.

{{< react-demo id="fab/08-grid" layout="block" >}}

## Programmatic usage

The vanilla `size`/`color` setters and `disable()`/`enable()` become props driven by your state. `ref` gives you the DOM element. Fab emits no events of its own: use `onClick`.

{{< react-demo id="fab/09-programmatic" layout="block" >}}

## Manual BEM markup

The CSS also works with plain markup (static HTML or server templates), without the ripple:

{{< react-demo id="fab/10-markup" open="false" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | — | Leading icon: Material Icons name (`"add"`) or a node (SVG…). |
| `label` | `ReactNode` | — | Text in a `<span>`; makes the FAB extended. |
| `variant` | `'circular' \| 'extended'` | `'circular'` | Forces the extended variant (always extended with `label`). |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | See the sizes table. |
| `color` | `'primary' \| 'secondary' \| 'default' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'inherit'` | `'primary'` | FAB color. |
| `position` | `'fixed-br' \| 'fixed-bl' \| 'absolute-center'` | — | Floating position. |
| `disabled` | `boolean` | `false` | Native `disabled`; `aria-disabled` on links. |
| `disableRipple` | `boolean` | `false` | Turns off the ripple. |
| `href` | `string` | — | Renders an `<a>`. |
| `component` | `ElementType` | `'button'` / `'a'` | Custom root element. |
| `children` | `ReactNode` | — | Extra content after the icon and the label. |
| `className`, `style`, `ref`, `aria-*`, `on*`… | — | — | Forwarded to the root; `className` is merged. |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-fab` | Base class: 56px circle with elevation 6. |
| `mtx-fab--extended` | Extended variant (48px tall, pill-shaped corners). |
| `mtx-fab--medium` / `--small` | 48 / 40px circular; 40 / 34px extended. |
| `mtx-fab--secondary`, `--success`, `--error`, `--warning`, `--info` | Palette colors. |
| `mtx-fab--default` / `--inherit` | Neutral surface with a border / inherited colors. |
| `mtx-fab--fixed-br` / `--fixed-bl` | Fixed at the bottom right / left (24px). |
| `mtx-fab--absolute-center` | Centered over the top edge of the positioned container. |

### CSS variables

| Variable | Use |
| :--- | :--- |
| `--mtx-color-{color}`, `--mtx-color-{color}-contrast`, `--mtx-color-{color}-dark` | Background, icon/text and hover. |
| `--mtx-color-action-disabled`, `--mtx-color-action-disabled-background` | Disabled state. |
| `--mtx-elevation-6`, `--mtx-elevation-12` | Shadow at rest and on hover/focus/press. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-fab-bg`, `--mtx-fab-fg`, `--mtx-fab-hover` | Local variables; override them for a custom color. |

## Accessibility

- It renders a native `<button>` with `type="button"`. The circular FAB needs an `aria-label`; the extended FAB takes its name from its text.
- Place it at a sensible point of the reading order: even though it floats visually, its position in the DOM sets the tab order.
- `disabled` removes it from the tab order.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the action. |

## Vanilla equivalence

| Vanilla | React |
| :--- | :--- |
| `data-icon="add"` | `icon="add"` |
| `data-label="Create"` | `label="Create"` |
| `data-variant="extended"` | `variant="extended"` |
| `data-size` / `fab.size = …` | `size` |
| `data-color` / `fab.color = …` | `color` |
| `class="mtx-fab--fixed-br"` | `position="fixed-br"` |
| `disabled` / `disable()` / `enable()` | `disabled={boolean}` |
| `Materix.getInstance(el)` | `ref` |
