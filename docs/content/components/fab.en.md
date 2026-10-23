---
title: "Fab"
description: "Floating action button for a screen's primary action: circular (56/48/40px) or extended with text (48px)."
group: "inputs"
icon: "add_circle"
weight: 30
example: "fab"
mui: "https://mui.com/material-ui/react-floating-action-button/"
---

**Fab** (Floating Action Button) represents the primary or most common action on a screen —compose, create, add— and floats above the content with high elevation. Use at most one per screen. For secondary actions use a [Button]({{< relref "/components/button" >}}); for compact actions in toolbars or rows, an [Icon Button]({{< relref "/components/icon-button" >}}).

## Basic usage

An empty `<button>` with `data-mtx="fab"` and `data-icon` generates a circular FAB; adding `data-label` turns it into an extended FAB with text. The circular FAB needs an `aria-label`.

{{< mtx-demo title="Basic usage" >}}
<button data-mtx="fab" data-icon="add" aria-label="Create"></button>
<button data-mtx="fab" data-icon="edit" data-color="secondary" aria-label="Edit"></button>
<button data-mtx="fab" data-icon="navigation" data-label="Navigate"></button>
{{< /mtx-demo >}}

## Variants

- **Circular** (default): icon only, 56px.
- **Extended** (`mtx-fab--extended`): icon and text, 48px tall. It's enabled automatically with `data-label`, or with `data-variant="extended"` if you write the content yourself. Use the extended FAB when the icon alone isn't clear enough.

{{< mtx-demo title="Circular and extended" >}}
<button data-mtx="fab" data-icon="add" aria-label="Create"></button>
<button data-mtx="fab" data-icon="add" data-label="New ticket"></button>
{{< /mtx-demo >}}

## Sizes

With `data-size`. Unlike Button, the FAB's default size is **large**.

| Size | `data-size` | Circular | Extended | Aligns with |
| :--- | :--- | :--- | :--- | :--- |
| Large | — (default) | 56px | 48px | Medium Text Field (56px) |
| Medium | `medium` | 48px | 40px | Large Button, large Icon Button |
| Small | `small` | 40px | 34px | Medium Button, small Text Field |

{{< mtx-demo title="Circular sizes" >}}
<button data-mtx="fab" data-icon="add" aria-label="Create (large)"></button>
<button data-mtx="fab" data-icon="add" data-size="medium" aria-label="Create (medium)"></button>
<button data-mtx="fab" data-icon="add" data-size="small" aria-label="Create (small)"></button>
{{< /mtx-demo >}}

{{< mtx-demo title="Extended sizes" >}}
<button data-mtx="fab" data-icon="add" data-label="Create"></button>
<button data-mtx="fab" data-icon="add" data-label="Create" data-size="medium"></button>
<button data-mtx="fab" data-icon="add" data-label="Create" data-size="small"></button>
{{< /mtx-demo >}}

## With icons

Combine `data-icon` and `data-label` depending on what you want to convey: icon only, icon and text, or text only. The generated icon is decorative (`aria-hidden="true"`); the `data-label` text is the accessible name of the extended FAB.

{{< mtx-demo title="Combinations" >}}
<button data-mtx="fab" data-icon="favorite" aria-label="Like"></button>
<button data-mtx="fab" data-icon="shopping_cart" data-label="Buy"></button>
<button data-mtx="fab" data-label="Continue"></button>
{{< /mtx-demo >}}

## Colors

Primary is the default. `data-color` accepts the palette colors and `default`, a neutral surface with a border, useful when the screen already has a lot of primary color.

{{< mtx-demo title="Colors" >}}
<button data-mtx="fab" data-icon="add" aria-label="Primary"></button>
<button data-mtx="fab" data-icon="edit" data-color="secondary" aria-label="Secondary"></button>
<button data-mtx="fab" data-icon="favorite" data-color="default" aria-label="Default"></button>
<button data-mtx="fab" data-icon="check" data-color="success" aria-label="Success"></button>
<button data-mtx="fab" data-icon="delete" data-color="error" aria-label="Error"></button>
<button data-mtx="fab" data-icon="warning" data-color="warning" aria-label="Warning"></button>
<button data-mtx="fab" data-icon="info" data-color="info" aria-label="Info"></button>
{{< /mtx-demo >}}

## States

On hover and focus the elevation rises from 6 to 12; with the keyboard a focus ring also appears. With the `disabled` attribute it loses its color and shadow.

{{< mtx-demo title="Disabled" >}}
<button data-mtx="fab" data-icon="add" aria-label="Create" disabled></button>
<button data-mtx="fab" data-icon="add" data-label="Create" disabled></button>
{{< /mtx-demo >}}

## Position

Positioning utility classes:

- `mtx-fab--fixed-br` / `mtx-fab--fixed-bl`: fixed 24px from the bottom-right / bottom-left corner of the window.
- `mtx-fab--absolute-center`: horizontally centered and straddling the top edge of its positioned container (for example, a bottom bar).

```html
<!-- Fixed to the bottom-right corner of the window -->
<button data-mtx="fab" data-icon="add" class="mtx-fab--fixed-br" aria-label="Create"></button>
```

{{< callout type="tip" >}}
A fixed FAB covers content at the end of the page: leave a bottom margin of at least 88px (56px + 24px + some slack) in the scrolling container.
{{< /callout >}}

## Real-world examples

Composing a message: the send FAB (56px) aligned with a medium Text Field of the same height.

{{< mtx-demo title="Send message" >}}
<div style="width: 280px; max-width: 100%;">
  <input data-mtx="text-field" data-label="Type a message" type="text" />
</div>
<button data-mtx="fab" data-icon="send" aria-label="Send message"></button>
{{< /mtx-demo >}}

## Full BEM syntax

The extended structure writes the base class, the modifiers and the content. The instance binds without duplicating anything.

```html
<button class="mtx-fab mtx-fab--extended mtx-fab--secondary" data-mtx="fab" type="button">
  <span class="material-icons" aria-hidden="true">add</span>
  <span>New ticket</span>
</button>
```

## Programmatic usage

`size` and `color` are read/write properties: setting them swaps the modifier classes.

```javascript
const fab = Materix.getInstance(document.querySelector('#compose'));

fab.size = 'medium';     // 'small' | 'medium' | 'large'
fab.color = 'secondary'; // any data-color value
fab.disable();
fab.enable();

// Create a new one
const el = document.createElement('button');
el.setAttribute('data-icon', 'add');
el.setAttribute('aria-label', 'Create');
document.body.appendChild(el);
Materix.init(el, 'fab');
```

With ES modules:

```javascript
import { getInstance, Fab } from 'materix-ui';
const fab = new Fab(document.querySelector('#compose'));
```

{{< mtx-demo title="size and color" >}}
<button data-mtx="fab" data-icon="bolt" aria-label="Quick action" id="doc-fab-target"></button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-fab-size">Change size</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-fab-color">Change color</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var fab = Materix.init(document.getElementById('doc-fab-target'));
  var sizes = ['large', 'medium', 'small'];
  var colors = ['primary', 'secondary', 'success', 'default'];
  document.getElementById('doc-fab-size').addEventListener('click', function () {
    fab.size = sizes[(sizes.indexOf(fab.size) + 1) % sizes.length];
  });
  document.getElementById('doc-fab-color').addEventListener('click', function () {
    fab.color = colors[(colors.indexOf(fab.color) + 1) % colors.length];
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `fab` | — | Enables automatic initialization. |
| `data-icon` | Material Icons name | — | Inserts the icon at the start if there's no `.material-icons` or `<svg>`. |
| `data-label` | text | — | Adds the label and enables the extended variant. |
| `data-variant` | `extended` | circular | Forces the extended variant. |
| `data-size` | `small` \| `medium` \| `large` | `large` | Size (see the sizes table). |
| `data-color` | `primary` \| `secondary` \| `default` \| `success` \| `error` \| `warning` \| `info` \| `inherit` | `primary` | FAB color. |

Native attributes: `aria-label` (required on the circular FAB), `disabled`, `type`. On `<a>`, `disable()` uses `aria-disabled`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-fab` | Base class: 56px circle with elevation 6. Added by the JS. |
| `mtx-fab--extended` | Extended variant (48px tall, pill-shaped corners). |
| `mtx-fab--medium` | 48px circular / 40px extended. |
| `mtx-fab--small` | 40px circular / 34px extended. |
| `mtx-fab--secondary`, `--success`, `--error`, `--warning`, `--info` | Palette colors. |
| `mtx-fab--default` | Neutral surface with a border. |
| `mtx-fab--inherit` | Inherits background and color from the container. |
| `mtx-fab--fixed-br` | Fixed at the bottom right (24px). |
| `mtx-fab--fixed-bl` | Fixed at the bottom left (24px). |
| `mtx-fab--absolute-center` | Centered over the top edge of the positioned container. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `disable()` | `void` | `disabled` on `<button>`; `aria-disabled` and `tabindex="-1"` on `<a>`. |
| `enable()` | `void` | Reverts `disable()`. |
| `disabled` (getter) | `boolean` | Disabled state. |
| `size` (get/set) | `string` | Current size; setting it changes the size class. |
| `color` (get/set) | `string` | Current color; setting it changes the color class. |
| `destroy()` | `void` | Removes the listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

Fab doesn't emit its own events. Listen for the native `click`.

### CSS variables

| Variable | Usage in Fab |
| :--- | :--- |
| `--mtx-color-{color}`, `--mtx-color-{color}-contrast`, `--mtx-color-{color}-dark` | Background, icon/text and hover. |
| `--mtx-color-background-paper`, `--mtx-color-text-primary`, `--mtx-color-divider` | `default` color. |
| `--mtx-color-action-disabled`, `--mtx-color-action-disabled-background` | Disabled state. |
| `--mtx-elevation-6`, `--mtx-elevation-12` | Shadow at rest and on hover/focus/press. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-fab-bg`, `--mtx-fab-fg`, `--mtx-fab-hover` | Local variables; override them for a custom color. |

## Accessibility

- It's a native `<button>`. The circular FAB needs an `aria-label`; the extended FAB takes its name from its text.
- Place it at a sensible point in the reading order: even though it floats visually, its position in the DOM determines the tab order.
- `disabled` removes it from the tab order.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the action. |
