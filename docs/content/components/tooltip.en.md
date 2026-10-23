---
title: "Tooltip"
description: "Short informative label shown on hover, keyboard focus or long press. Add data-mtx-tooltip to any element: no initialization required."
group: "data-display"
icon: "info"
weight: 80
example: "tooltip"
mui: "https://mui.com/material-ui/react-tooltip/"
---

A **Tooltip** shows a short text label that identifies or explains an element when the user hovers over it, focuses it with the keyboard or long-presses it on a touch screen, just like MUI's `Tooltip`. It is ideal for icon-only buttons and toolbars. Do not put essential information or interactive content in it (links, buttons): for rich content use a [Popover](../popover/), and for persistent messages a helper text or an [Alert](../alert/).

## Basic usage

Add `data-mtx-tooltip="Text"` to any element. There is nothing to initialize: a single global listener (event delegation on `document`) handles every trigger, including content added later.

{{< mtx-demo title="data-mtx-tooltip" >}}
<button data-mtx="icon-button" data-icon="delete" data-mtx-tooltip="Delete"></button>
<button data-mtx="icon-button" data-icon="favorite" data-color="error" data-mtx-tooltip="Add to favorites"></button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-tooltip="Saved to your account">Save</button>
{{< /mtx-demo >}}

{{< callout type="tip" title="Accessible name for free" >}}
If the trigger has no accessible name (an icon-only button without `aria-label`), the text is applied as its `aria-label`. If it already has one, the tooltip is linked with `aria-describedby` while visible. See [Accessibility](#accessibility).
{{< /callout >}}

## Placement

`data-tooltip-placement` accepts 12 positions: `top`, `bottom`, `left`, `right`, each with an optional `-start` or `-end`. The default is `bottom`, as in MUI. If it does not fit, it flips to the opposite side and shifts to stay inside the viewport.

{{< mtx-demo title="Placements" layout="column" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="top-start" data-tooltip-placement="top-start">top-start</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="top" data-tooltip-placement="top">top</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="top-end" data-tooltip-placement="top-end">top-end</button>
</div>
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="left" data-tooltip-placement="left">left</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="right" data-tooltip-placement="right">right</button>
</div>
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="bottom-start" data-tooltip-placement="bottom-start">bottom-start</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="bottom" data-tooltip-placement="bottom">bottom</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="bottom-end" data-tooltip-placement="bottom-end">bottom-end</button>
</div>
{{< /mtx-demo >}}

In right-to-left documents (`dir="rtl"`), `-start` and `-end` on `top`/`bottom` are mirrored, like MUI's Popper.

## Arrow

`data-tooltip-arrow` adds an arrow that points at the center of the trigger, even when the tooltip had to shift to fit.

{{< mtx-demo title="data-tooltip-arrow" >}}
<button data-mtx="icon-button" data-icon="add" data-mtx-tooltip="Add" data-tooltip-arrow></button>
<button data-mtx="icon-button" data-icon="edit" data-mtx-tooltip="Edit" data-tooltip-arrow data-tooltip-placement="top"></button>
<button data-mtx="icon-button" data-icon="arrow_back" data-mtx-tooltip="Back" data-tooltip-arrow data-tooltip-placement="left"></button>
<button data-mtx="icon-button" data-icon="arrow_forward" data-mtx-tooltip="Next" data-tooltip-arrow data-tooltip-placement="right"></button>
{{< /mtx-demo >}}

## With icons

It works on text buttons, buttons with a start or end icon and, above all, icon-only buttons (IconButton, Fab), where it also provides the accessible name.

{{< mtx-demo title="With and without icons" >}}
<button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-tooltip="Discards the changes">Cancel</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="upload" data-mtx-tooltip="PDF or PNG, 5 MB max">Upload</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-end-icon="send" data-mtx-tooltip="Sent to 3 recipients">Send</button>
<button data-mtx="icon-button" data-icon="share" data-mtx-tooltip="Share"></button>
<button data-mtx="fab" data-icon="add" data-size="small" data-mtx-tooltip="New document" data-tooltip-placement="right"></button>
{{< /mtx-demo >}}

## States

Disabled elements receive neither pointer events nor focus. As MUI recommends, wrap them in an element with `data-mtx="tooltip"` and `data-title` so you can still explain why they are unavailable.

{{< mtx-demo title="Disabled trigger" >}}
<span data-mtx="tooltip" data-title="Fill in the required fields to continue">
  <button class="mtx-button mtx-button--contained" data-mtx="button" disabled>Continue</button>
</span>
<span data-mtx="tooltip" data-title="You don't have permission to delete">
  <button data-mtx="icon-button" data-icon="delete" aria-label="Delete" disabled></button>
</span>
{{< /mtx-demo >}}

An empty `data-mtx-tooltip=""` shows nothing (handy to disable it temporarily).

## Delays

It appears after 100 ms (MUI's `enterDelay`) and hides as soon as the pointer leaves. Change both with `data-tooltip-enter-delay` and `data-tooltip-leave-delay` (ms). After a tooltip closes, the next one opens with no delay for 800 ms, so moving along a toolbar feels instant.

{{< mtx-demo title="Delays" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="Appears after 100 ms">Default</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="Appears after 500 ms" data-tooltip-enter-delay="500">enter 500 ms</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="Stays 1 s after leaving" data-tooltip-leave-delay="1000">leave 1000 ms</button>
{{< /mtx-demo >}}

## Follow cursor

`data-tooltip-follow-cursor` anchors the tooltip to the pointer while it moves over the trigger.

{{< mtx-demo title="data-tooltip-follow-cursor" layout="block" >}}
<div class="mtx-p-3 mtx-border mtx-rounded" data-mtx-tooltip="I follow the cursor" data-tooltip-follow-cursor>
  Move the pointer around this area.
</div>
{{< /mtx-demo >}}

## Touch devices

On touch screens the tooltip appears after a **long press of 700 ms** (MUI's `enterTouchDelay`) and hides **1.5 s** after releasing (`leaveTouchDelay`). It then uses a larger font (`0.875rem`) and a wider gap from the trigger (24 px). A normal tap does not show it, so the action is not interrupted.

## Real-world examples

An editor formatting bar: tooltips include the keyboard shortcut while the button keeps its short name.

{{< mtx-demo title="Toolbar" >}}
<div role="toolbar" aria-label="Text formatting">
  <button data-mtx="icon-button" data-icon="format_bold" data-size="small" aria-label="Bold" data-mtx-tooltip="Bold (Ctrl+B)"></button>
  <button data-mtx="icon-button" data-icon="format_italic" data-size="small" aria-label="Italic" data-mtx-tooltip="Italic (Ctrl+I)"></button>
  <button data-mtx="icon-button" data-icon="format_underlined" data-size="small" aria-label="Underline" data-mtx-tooltip="Underline (Ctrl+U)"></button>
  <button data-mtx="icon-button" data-icon="link" data-size="small" aria-label="Insert link" data-mtx-tooltip="Insert link (Ctrl+K)"></button>
</div>
{{< /mtx-demo >}}

Extra information next to a figure:

{{< mtx-demo title="Help next to a value" >}}
<span>Available balance: <strong>$1,240.50</strong></span>
<button data-mtx="icon-button" data-icon="info" data-size="small" data-mtx-tooltip="Includes payments pending confirmation" data-tooltip-arrow data-tooltip-placement="right"></button>
{{< /mtx-demo >}}

## Full BEM syntax

The advanced form `data-mtx="tooltip"` creates an instance registered in the registry (available with `Materix.getInstance`). It wraps the trigger (or goes directly on it), reads `data-title` and the options without the `tooltip-` prefix: `data-placement`, `data-arrow`, `data-enter-delay`, `data-leave-delay`, `data-follow-cursor`. ARIA attributes are applied to the first focusable descendant.

```html
<span data-mtx="tooltip" data-title="Export to CSV" data-placement="right" data-arrow>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="download">Export</button>
</span>
```

The generated surface is ported to `<body>` and removed after closing:

```html
<div class="mtx-tooltip mtx-tooltip--open mtx-tooltip--arrow" role="tooltip" id="mtx-tooltip-1"
     data-side="right" data-placement="right">
  <span class="mtx-tooltip__label">Export to CSV</span>
  <span class="mtx-tooltip__arrow" aria-hidden="true"></span>
</div>
```

## Programmatic usage

`Materix.tooltip` controls any trigger, declarative or advanced:

```javascript
const button = document.getElementById('copy');

Materix.tooltip.show(button);          // shows it immediately
Materix.tooltip.hide(button);          // hides it
Materix.tooltip.hideAll();             // hides every visible tooltip

const instance = Materix.tooltip.get(button); // Tooltip instance (created if needed)
instance.setTitle('Copied!');          // updates the text (and the generated aria-label)
instance.open();
instance.close();

button.addEventListener('mtx:tooltip:open', () => console.log('visible'));
```

With ES modules:

```javascript
import { Tooltip, tooltip } from 'materix-ui';

// Advanced form on a container
const instance = new Tooltip(document.getElementById('export-wrapper'));

// Programmatic options take precedence over attributes
const custom = new Tooltip(element, { title: 'Hello', placement: 'top', arrow: true });
```

{{< mtx-demo title="show(), hide() and setTitle()" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="content_copy" id="doc-tooltip-target" data-mtx-tooltip="Copy link" data-tooltip-placement="top">Copy</button>
<button class="mtx-button mtx-button--text" data-mtx="button" data-doc-tooltip="show">show()</button>
<button class="mtx-button mtx-button--text" data-mtx="button" data-doc-tooltip="hide">hide()</button>
<button class="mtx-button mtx-button--text" data-mtx="button" data-doc-tooltip="title">setTitle('Copied!')</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('doc-tooltip-target');
  document.querySelectorAll('[data-doc-tooltip]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.docTooltip;
      if (action === 'show') Materix.tooltip.show(target);
      if (action === 'hide') Materix.tooltip.hide(target);
      if (action === 'title') {
        Materix.tooltip.get(target).setTitle('Copied!');
        Materix.tooltip.show(target);
      }
    });
  });
});
</script>

## API reference

### Data attributes

**Global form** (on any element)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx-tooltip` | Text | — | Tooltip text. Empty = no tooltip. |
| `data-tooltip-placement` | `top`, `bottom`, `left`, `right` + `-start`/`-end` | `bottom` | Preferred placement (flips and shifts automatically). |
| `data-tooltip-arrow` | boolean | — | Shows the arrow. |
| `data-tooltip-enter-delay` | ms | `100` | Delay before showing on hover or focus. |
| `data-tooltip-leave-delay` | ms | `0` | Delay before hiding when the pointer leaves. |
| `data-tooltip-follow-cursor` | boolean | — | The tooltip follows the pointer. |

**Advanced form** (`data-mtx="tooltip"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-title` | Text | — | Tooltip text. |
| `data-placement`, `data-arrow`, `data-enter-delay`, `data-leave-delay`, `data-follow-cursor` | As above | As above | Same options without the `tooltip-` prefix (the prefixed ones also work). |

### CSS classes

| Class | Description |
|---|---|
| `mtx-tooltip` | Surface (`role="tooltip"`), fixed position, ported to `<body>`. |
| `mtx-tooltip--open` | Visible state (grow/fade transition). |
| `mtx-tooltip--arrow` | Tooltip with an arrow. |
| `mtx-tooltip--touch` | Opened by long press: larger font and padding. |
| `mtx-tooltip__label` | Text. |
| `mtx-tooltip__arrow` | Arrow (1em × 0.71em). |
| `[data-side]` | Final side (`top`, `bottom`, `left`, `right`) after flipping; drives the arrow and the transform origin. |

### Methods

`Materix.tooltip` (global helper):

| Method | Returns | Description |
|---|---|---|
| `show(el, options?)` | `Tooltip \| null` | Shows the tooltip of `el` immediately (`{ touch: true }` for the touch style). |
| `hide(el)` | `void` | Hides it. |
| `hideAll()` | `void` | Hides every visible tooltip. |
| `get(el)` | `Tooltip \| null` | Instance for the trigger (creates it if needed). |
| `sync(root?)` | `void` | Applies `aria-label` to unnamed triggers inside `root` (done automatically by a `MutationObserver`). |

`Tooltip` instance:

| Method | Returns | Description |
|---|---|---|
| `open(options?)` / `show()` | `boolean` | Shows it; `false` if the text is empty. |
| `close(options?)` / `hide()` | `void` | Hides it (`{ immediate: true }` without transition). |
| `toggle()` | `void` | Toggles visibility. |
| `setTitle(text)` | `void` | Changes the text and the `aria-label` generated by Materix. |
| `update()` | `void` | Recalculates the position. |
| `isOpen` | `boolean` | Visible state. |
| `destroy()` | `void` | Removes the surface, timers and the generated `aria-label`. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:tooltip:open` | `{ tooltip }` | The tooltip appears (bubbles from the trigger). |
| `mtx:tooltip:close` | `{ tooltip }` | The tooltip hides. |

### CSS variables

| Variable | Default | Usage |
|---|---|---|
| `--mtx-tooltip-bg` | `rgba(97, 97, 97, 0.92)` | Background and arrow (MUI grey 700 at 92%, same in light and dark). |
| `--mtx-tooltip-color` | `#ffffff` | Text. |
| `--mtx-tooltip-font-size` | `0.6875rem` | Font size (weight 500, line-height 1.4). |
| `--mtx-tooltip-font-size-touch` | `0.875rem` | Font size when opened by touch. |
| `--mtx-tooltip-max-width` | `300px` | Maximum width. |
| `--mtx-z-index-tooltip` | `1500` | Stacking level, above dialogs and snackbars. |

## Accessibility

- The surface has `role="tooltip"` and is linked to the trigger following the WAI-ARIA tooltip pattern:
  - If the trigger **has no accessible name** (an icon-only button without `aria-label`/`aria-labelledby`/text), the text is applied as its `aria-label` as soon as the page loads (and for content added later). This is the case for MUI's `Tooltip` by default.
  - If it **already has a name**, the name is kept and the tooltip is linked with `aria-describedby` while it is visible. If both texts are identical it is not duplicated.
- It appears on keyboard focus (`:focus-visible` heuristic: Tab yes, mouse click no) and hides on blur.
- **Hoverable** (WCAG 1.4.13): the pointer can move from the trigger onto the tooltip without it disappearing (an invisible bridge covers the gap).
- **Dismissible**: <kbd>Escape</kbd> hides it without moving focus.
- Do not put interactive content in a tooltip; use a [Popover](../popover/).
- It respects `prefers-reduced-motion` (no scale animation) and draws a border in forced-colors mode.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Focusing a trigger shows its tooltip after the delay. |
| <kbd>Escape</kbd> | Hides the visible tooltip, and only it: an open menu, popover or dialog underneath stays open until the next <kbd>Escape</kbd>. |
