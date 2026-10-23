---
title: "Popover"
description: "Floating Paper with arbitrary content anchored to a trigger. Closes on click away or Escape and returns focus to the trigger."
group: "surfaces"
icon: "picture_in_picture"
weight: 40
example: "popover"
mui: "https://mui.com/material-ui/react-popover/"
---

A **Popover** displays any content (text, forms, cards) on a floating [Paper](../paper/) surface anchored to another element, like MUI's `Popover`. Use it for filters, quick details, small confirmations or an account card. For a list of actions use a [Menu](../menu/); for a short text label, a [Tooltip](../tooltip/); for a task that blocks the page, a [Dialog](../dialog/).

## Basic usage

An element with `data-mtx="popover"` and an `id`, and a trigger with `data-open-popover="#id"`. It opens below the trigger aligned to its start edge, with elevation 8. Focus moves to the first control (or to the panel) and returns to the trigger when it closes.

{{< mtx-demo title="data-open-popover" height="200px" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-open-popover="#doc-popover-basic">Open popover</button>
<div data-mtx="popover" id="doc-popover-basic" data-label="Basic popover" class="mtx-p-2">
  The content of the popover.
</div>
{{< /mtx-demo >}}

The panel is ported to `<body>` when it opens, so ancestors with `overflow: hidden` or their own `z-index` never clip it. Content padding is up to you: use utilities such as `mtx-p-2`.

## Placement

`data-placement` uses the same engine as Tooltip (`top|bottom|left|right` with `-start|-end`; default `bottom-start`), with automatic flipping and shifting. `data-offset` sets the gap in px (0 by default, as in MUI).

{{< mtx-demo title="data-placement" height="220px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-top">top</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-end">bottom-end</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-right">right · offset 8</button>
<div data-mtx="popover" id="doc-popover-top" data-placement="top" data-offset="8" data-label="Top" class="mtx-p-2">Above, centered.</div>
<div data-mtx="popover" id="doc-popover-end" data-placement="bottom-end" data-label="Bottom end" class="mtx-p-2">Below, aligned to the end.</div>
<div data-mtx="popover" id="doc-popover-right" data-placement="right" data-offset="8" data-label="Right" class="mtx-p-2">To the right.</div>
{{< /mtx-demo >}}

## Anchor origins

MUI's API: `data-anchor-origin="vertical horizontal"` is the point on the anchor and `data-transform-origin` the point on the popover attached to it. Values are `top|center|bottom` and `left|center|right`, or pixels. The popover stays 16 px from the viewport edges (MUI's `marginThreshold`) and the grow animation starts from the transform origin.

{{< mtx-demo title="anchorOrigin / transformOrigin" height="220px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-o1">bottom left → top left</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-o2">center center → center center</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-o3">top right → bottom right</button>
<div data-mtx="popover" id="doc-popover-o1" data-anchor-origin="bottom left" data-transform-origin="top left" data-label="Origin 1" class="mtx-p-2">anchor: bottom left · transform: top left</div>
<div data-mtx="popover" id="doc-popover-o2" data-anchor-origin="center center" data-transform-origin="center center" data-label="Origin 2" class="mtx-p-2">anchor: center center · transform: center center</div>
<div data-mtx="popover" id="doc-popover-o3" data-anchor-origin="top right" data-transform-origin="bottom right" data-label="Origin 3" class="mtx-p-2">anchor: top right · transform: bottom right</div>
{{< /mtx-demo >}}

When either origin attribute is present it takes precedence over `data-placement`.

## With icons

Any button can be the trigger. Icon-only ones need an accessible name: `aria-label` or a `data-mtx-tooltip`, which provides it. The trigger gets `aria-haspopup="dialog"`, `aria-controls` and a synchronized `aria-expanded`.

{{< mtx-demo title="Triggers" height="200px" >}}
<button data-mtx="icon-button" data-icon="info" data-mtx-tooltip="Order information" data-open-popover="#doc-popover-info"></button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="tune" data-open-popover="#doc-popover-info">Details</button>
<div data-mtx="popover" id="doc-popover-info" class="mtx-p-2">
  <h3 class="mtx-typography--subtitle2">Order #48213</h3>
  <p class="mtx-typography--body2 mtx-color-text-secondary">Shipped on October 12, estimated delivery in 48 h.</p>
</div>
{{< /mtx-demo >}}

The heading inside the popover becomes its name automatically (`aria-labelledby`).

## States

A disabled trigger does not open the popover. Buttons with `data-mtx-popover-close` inside the popover close it (and return focus).

{{< mtx-demo title="Disabled trigger and close buttons" height="220px" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-open-popover="#doc-popover-confirm" disabled>Disabled</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-open-popover="#doc-popover-confirm">Archive project</button>
<div data-mtx="popover" id="doc-popover-confirm" class="mtx-p-2">
  <h3 class="mtx-typography--subtitle2 mtx-mb-1">Archive the project?</h3>
  <p class="mtx-typography--body2 mtx-mb-2">You can restore it for 30 days.</p>
  <div class="mtx-d-flex mtx-justify-content-end mtx-gap-1">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-popover-close>Cancel</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-popover-close>Archive</button>
  </div>
</div>
{{< /mtx-demo >}}

## Modal

By default the popover is **non-modal**: it does not trap focus or lock scrolling, and tabbing out of it closes it. With `data-modal` it behaves like MUI's Popover (which is built on Modal): it traps <kbd>Tab</kbd>, locks page scrolling and sets `aria-modal="true"`. `data-autofocus` on a control chooses the initial focus.

{{< mtx-demo title="data-modal" height="260px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-modal">Rename</button>
<div data-mtx="popover" id="doc-popover-modal" data-modal class="mtx-p-2">
  <h3 class="mtx-typography--subtitle2 mtx-mb-2">Rename</h3>
  <input data-mtx="text-field" data-label="Name" data-size="small" value="Q3 report" data-autofocus>
  <div class="mtx-d-flex mtx-justify-content-end mtx-gap-1 mtx-mt-2">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-popover-close>Cancel</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-popover-close>Save</button>
  </div>
</div>
{{< /mtx-demo >}}

## Anchor position

`open({ x, y })` anchors the popover to a viewport point instead of an element (MUI's `anchorPosition`), for example the cursor position in a `contextmenu` event.

```javascript
const popover = Materix.getInstance(document.getElementById('point-details'));
area.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  popover.open({ x: event.clientX, y: event.clientY });
});
```

## Real-world examples

An account card opened from the avatar in an app bar, aligned to the end:

{{< mtx-demo title="Account" height="240px" layout="center" >}}
<button class="mtx-icon-button" data-mtx="icon-button" data-open-popover="#doc-popover-profile">
  <span data-mtx="avatar" data-size="small" data-color="primary" aria-hidden="true">LG</span>
  <span class="mtx-visually-hidden">Laura Gómez's account</span>
</button>
<div data-mtx="popover" id="doc-popover-profile" data-placement="bottom-end" data-label="Account">
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-2 mtx-p-2">
    <span data-mtx="avatar" data-color="primary" aria-hidden="true">LG</span>
    <div>
      <div class="mtx-typography--subtitle2">Laura Gómez</div>
      <div class="mtx-typography--body2 mtx-color-text-secondary">laura@example.com</div>
    </div>
  </div>
  <hr data-mtx="divider">
  <div class="mtx-d-flex mtx-justify-content-end mtx-p-1">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-start-icon="logout" data-mtx-popover-close>Sign out</button>
  </div>
</div>
{{< /mtx-demo >}}

Table filters:

{{< mtx-demo title="Filters" height="260px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="filter_list" data-open-popover="#doc-popover-filters">Filters</button>
<div data-mtx="popover" id="doc-popover-filters" class="mtx-p-2">
  <h3 class="mtx-typography--subtitle2 mtx-mb-1">Filter orders</h3>
  <input type="checkbox" data-mtx="checkbox" data-label="Pending" checked>
  <input type="checkbox" data-mtx="checkbox" data-label="Shipped">
  <input type="checkbox" data-mtx="checkbox" data-label="Returned">
  <div class="mtx-d-flex mtx-justify-content-end mtx-mt-1">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-popover-close>Apply</button>
  </div>
</div>
{{< /mtx-demo >}}

## Dialog from a popover

A button inside the popover can open a [Dialog]({{< relref "/components/dialog" >}}). Both surfaces share the [layer stack]({{< relref "/guide/accessibility" >}}#escape-and-stacked-layers): interacting with the dialog is not a "click outside" for the popover, the first <kbd>Escape</kbd> closes only the dialog (focus returns to the button inside the popover) and the second one closes the popover.

{{< mtx-demo title="Dialog opened from a popover" height="300px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="tune" data-open-popover="#doc-popover-advanced">Options</button>
<div data-mtx="popover" id="doc-popover-advanced" class="mtx-p-2" data-label="Options">
  <input type="checkbox" data-mtx="checkbox" data-label="Only mine" checked>
  <div class="mtx-d-flex mtx-justify-content-end mtx-mt-1">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-open="doc-popover-dialog">Advanced…</button>
  </div>
</div>
<div data-mtx="dialog" id="doc-popover-dialog" class="mtx-dialog--max-xs" data-title="Advanced options" data-description="Press Escape once to close this dialog; the popover stays open.">
  <div data-mtx="dialog-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Close</button>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

After initialization the popover has this structure. You can write it as is for SSR: the component keeps an existing `role`, `aria-label`/`aria-labelledby` and `tabindex`. A trigger can also be declared with `aria-controls`.

```html
<button class="mtx-button mtx-button--outlined" data-mtx="button"
        aria-controls="details" aria-haspopup="dialog" aria-expanded="false">Open</button>
<div class="mtx-popover mtx-p-2" data-mtx="popover" id="details" role="dialog" tabindex="-1"
     aria-labelledby="details-title" hidden>
  <h3 class="mtx-typography--subtitle2" id="details-title">Details</h3>
  …
</div>
```

## Programmatic usage

```javascript
const el = document.getElementById('filters');
const popover = Materix.getInstance(el);   // or Materix.init(el)

popover.open(document.getElementById('filter-button')); // anchor element
popover.open({ x: 200, y: 120 });          // viewport point
popover.close();
popover.toggle(anchorButton);
popover.update();                          // recalculates the position
console.log(popover.isOpen);

el.addEventListener('mtx:popover:open', (event) => console.log(event.detail.anchor));
el.addEventListener('mtx:popover:close', (event) => console.log(event.detail.reason));
```

With ES modules:

```javascript
import { Popover, computePosition, autoUpdate } from 'materix-ui';
const popover = new Popover(document.getElementById('filters'));
```

{{< mtx-demo title="open(), toggle() and close()" height="200px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-popover="open" id="doc-popover-anchor">open(this)</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-popover="toggle">toggle(this)</button>
<span id="doc-popover-status" aria-live="polite"></span>
<div data-mtx="popover" id="doc-popover-api" data-label="Programmatic popover" class="mtx-p-2">
  <p class="mtx-mb-1">Opened from code.</p>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-doc-popover="close">close()</button>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-popover-api');
  const popover = Materix.getInstance(el);
  const status = document.getElementById('doc-popover-status');
  document.querySelectorAll('[data-doc-popover]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.docPopover;
      if (action === 'open') popover.open(button);
      if (action === 'toggle') popover.toggle(button);
      if (action === 'close') popover.close();
    });
  });
  el.addEventListener('mtx:popover:open', () => { status.textContent = 'mtx:popover:open'; });
  el.addEventListener('mtx:popover:close', (event) => { status.textContent = 'mtx:popover:close · ' + event.detail.reason; });
});
</script>

### Positioning engine

`Materix.computePosition(anchor, floating, options)` and `Materix.autoUpdate(anchor, floating, update)` are public, for your own floating surfaces:

```javascript
const { x, y, placement } = Materix.computePosition(button, panel, {
  placement: 'bottom-start', // top|bottom|left|right + -start|-end
  offset: 8,                 // gap in px
  flip: true,                // switch to the opposite side if it does not fit
  shift: true,               // keep it inside the viewport on the cross axis
  padding: 8,                // minimum distance to the viewport edge
});
panel.style.left = `${x}px`;
panel.style.top = `${y}px`;   // with position: fixed

const stop = Materix.autoUpdate(button, panel, () => { /* recalculate */ });
stop(); // removes the scroll/resize listeners and the ResizeObserver
```

The result also includes `side`, `align` (physical, after flipping and RTL) and `arrowOffset` (center of the anchor relative to the surface). The anchor can be virtual: any object with `getBoundingClientRect()`.

## API reference

### Data attributes

**Popover** (`data-mtx="popover"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `id` | Text | auto | Required for declarative triggers. |
| `data-placement` | `top`, `bottom`, `left`, `right` + `-start`/`-end` | `bottom-start` | Placement with flip and shift. |
| `data-offset` | px | `0` | Gap from the anchor (with `data-placement`). |
| `data-anchor-origin` | `"vertical horizontal"` (`top/center/bottom`, `left/center/right` or px) | `bottom left` | Point on the anchor (MUI algorithm). Takes precedence over `data-placement`. |
| `data-transform-origin` | Same | `top left` | Point on the popover attached to the anchor. |
| `data-anchor` | Selector | — | Fixed anchor element (otherwise, the trigger that opened it). |
| `data-label` | Text | — | `aria-label` of the dialog (if there is no heading). |
| `data-elevation` | `0`–`8`, `12`, `16`, `24` | `8` | Shadow (and overlay in the dark theme). |
| `data-modal` | boolean | — | Traps focus, locks scrolling and sets `aria-modal="true"`. |

**Inside and outside the popover**

| Attribute | On | Description |
|---|---|---|
| `data-open-popover="#id"` | Trigger | Opens/closes the popover (works with triggers added later). |
| `aria-controls="id"` | Trigger | Alternative to `data-open-popover`. |
| `data-mtx-popover-close` | Child | Closes the popover when clicked. |
| `data-autofocus` | Child | Control that receives initial focus. |
| `data-popover-title` | Child | Element used as the name (`aria-labelledby`) instead of the first heading. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-popover` | Surface: Paper with radius 4px, elevation 8, `max-width`/`max-height` `calc(100% - 32px)` and its own scroll. |
| `mtx-popover--open` | Visible state (grow transition from the transform origin). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `open(anchor?)` | `boolean` | Opens anchored to an element, a point `{ x, y }` or a virtual anchor. |
| `close(options?)` | `void` | Closes it; `{ restoreFocus: false }` does not return focus. |
| `toggle(anchor?)` | `void` | Toggles the state. |
| `update()` | `void` | Recalculates the position (done automatically on scroll/resize). |
| `isOpen` | `boolean` | Open state. |
| `triggers` | `HTMLElement[]` | Current declared triggers. |
| `destroy()` | `void` | Closes it, moves it back to its original place in the DOM and removes listeners. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:popover:open` | `{ popover, anchor }` | It opens. |
| `mtx:popover:close` | `{ popover, reason }` | It closes. `reason`: `escape`, `click-away`, `tab`, `trigger`, `action`, `api`. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-popover-shadow` | Shadow (set by `data-elevation`; default `--mtx-elevation-8`). |
| `--mtx-popover-overlay` | Elevation overlay in the dark theme. |
| `--mtx-color-background-paper`, `--mtx-color-text-primary` | Surface and text. |
| `--mtx-z-index-modal` | Stacking level (1300). |

## Accessibility

- The popover has `role="dialog"`. Its name comes from `data-label` (`aria-label`), from `data-popover-title` or from the first internal heading (`aria-labelledby`). With `data-modal` it also gets `aria-modal="true"`.
- The trigger gets `aria-haspopup="dialog"`, `aria-controls` and an `aria-expanded` synchronized with the state.
- When it opens, focus moves to `[data-autofocus]`, to the first focusable control or to the panel itself (`tabindex="-1"`). When it closes with <kbd>Escape</kbd>, the trigger or a close button, focus returns to the element that had it.
- When it opens from a trigger, the trigger is stored as the focus return target even if the browser does not focus it on click (WebKit/Safari), so <kbd>Escape</kbd> and close actions always return focus to it.
- Clicking outside closes it without stealing focus from the element that was clicked; if the click lands on a non-focusable area and focus would be lost, it returns to the trigger.
- If the trigger only shows an avatar or initials, name it with visually hidden text (`<span class="mtx-visually-hidden">…</span>`) instead of an `aria-label` that does not contain the visible text (WCAG 2.5.3 *Label in Name*).

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the trigger | Opens or closes the popover. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through its controls. Non-modal: leaving the popover closes it. Modal: focus cycles inside. |
| <kbd>Escape</kbd> | Closes it and returns focus to the trigger, only if it is the top layer (a visible tooltip, a menu or a dialog opened from it close first). |
