---
title: "Backdrop"
description: "Full-screen layer that dims the page and centers an indicator while an operation runs; it does not replace a dialog."
group: "feedback"
icon: "gradient"
weight: 15
example: "backdrop"
mui: "https://mui.com/material-ui/react-backdrop/"
---

**Backdrop** covers the whole screen with a semi-transparent layer and centers its content, usually a [CircularProgress]({{< relref "/components/progress" >}}). Use it to signal that the page is busy during a short operation (saving, syncing, processing a payment). **It is not a dialog**: it has no role, doesn't trap focus and offers no title or actions; if the user must read a message or make a decision, use [Dialog]({{< relref "/components/dialog" >}}), which already includes its own backdrop.

## Basic usage

A `data-mtx="backdrop"` element with the content to center and a `data-mtx-backdrop-open="id"` trigger (toggles open/closed). With `data-close-on-click`, a click on the layer closes it. The content is white by default, so a CircularProgress with `data-color="inherit"` stands out in both themes.

{{< mtx-demo title="Simplified syntax" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-basic">Show backdrop</button>
<div data-mtx="backdrop" id="doc-backdrop-basic" data-close-on-click data-close-on-escape>
  <div data-mtx="circular-progress" data-color="inherit" data-label="Loading"></div>
</div>
{{< /mtx-demo >}}

## Variants

The layer uses `rgba(0, 0, 0, 0.5)` in both themes (`--mtx-backdrop-bg` token). `data-invisible` makes it transparent: it still captures clicks, which is handy for closing your own surfaces on an outside click.

{{< mtx-demo title="Invisible" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-invisible">Invisible backdrop</button>
<div data-mtx="backdrop" id="doc-backdrop-invisible" data-invisible data-close-on-click data-close-on-escape>
  <div data-mtx="paper" data-elevation="8" class="mtx-p-3 mtx-color-text-primary">
    <p class="mtx-typography--body1">Invisible layer: click anywhere to close.</p>
  </div>
</div>
{{< /mtx-demo >}}

## With content

The content is centered with flexbox. Pair the indicator with text that explains what is happening, or use a determinate progress bar when you know the progress.

{{< mtx-demo title="Spinner with text and linear bar" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-text">Spinner with text</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-linear">Progress bar</button>
<div data-mtx="backdrop" id="doc-backdrop-text" data-close-on-click data-close-on-escape>
  <div class="mtx-d-flex mtx-flex-column mtx-align-items-center mtx-gap-2">
    <div data-mtx="circular-progress" data-color="inherit" data-size="56" data-decorative></div>
    <span class="mtx-typography--subtitle1">Syncing 24 files…</span>
  </div>
</div>
<div data-mtx="backdrop" id="doc-backdrop-linear" data-close-on-click data-close-on-escape>
  <div class="mtx-d-flex mtx-flex-column mtx-gap-1 mtx-w-50">
    <span class="mtx-typography--subtitle1">Importing contacts</span>
    <div data-mtx="linear-progress" data-color="inherit" data-value="64" data-show-label></div>
  </div>
</div>
{{< /mtx-demo >}}

## Closing

Three optional, combinable mechanisms: `data-close-on-click` (click on the layer or on non-interactive content; buttons, links and fields inside the content don't close it), `data-close-on-escape` and any inner element with `data-mtx-backdrop-close`. With none of them, it only closes from code.

{{< mtx-demo title="Cancel button with data-mtx-backdrop-close" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-cancel">Upload photo</button>
<div data-mtx="backdrop" id="doc-backdrop-cancel" data-close-on-escape>
  <div class="mtx-d-flex mtx-flex-column mtx-align-items-center mtx-gap-2">
    <div data-mtx="circular-progress" data-color="inherit" data-label="Uploading"></div>
    <span class="mtx-typography--subtitle1">Uploading photo.jpg</span>
    <button class="mtx-button mtx-button--outlined mtx-button--inherit" data-mtx="button" data-mtx-backdrop-close>Cancel</button>
  </div>
</div>
{{< /mtx-demo >}}

## States

- `data-open`: shown open on initialization.
- `data-lock-scroll`: locks `body` scrolling while open, through the modal manager shared with Dialog and Drawer.
- `data-inert`: marks the rest of the page as `inert` (siblings of the layer and of its ancestors) so <kbd>Tab</kbd> and screen readers can't reach the covered content; restored on close.
- `data-z`: custom z-index. The default is `--mtx-backdrop-z-index` = Drawer z-index + 1 (1201), above AppBar and Drawer and below Dialog (1300) and Snackbar (1400).

{{< mtx-demo title="Scroll lock and inert (closes after 3 s)" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-lock">Process payment</button>
<div data-mtx="backdrop" id="doc-backdrop-lock" data-lock-scroll data-inert>
  <div data-mtx="circular-progress" data-color="inherit" data-label="Processing payment"></div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var lock = document.getElementById('doc-backdrop-lock');
  lock.addEventListener('mtx:backdrop:open', function () {
    setTimeout(function () { Materix.getInstance(lock).close(); }, 3000);
  });
});
</script>

{{< callout type="warning" title="Not a dialog" >}}
Backdrop has no `role="dialog"`, doesn't move or trap focus and doesn't restore it on close. If you need to block interaction with a message, buttons or a form, use **Dialog**. If you use it as a blocker, combine `data-inert` and `data-lock-scroll` and always close it from code when the operation ends.
{{< /callout >}}

## Real-world examples

### Saving a form

The backdrop covers the page while the request runs and closes when it finishes; a Snackbar then confirms the result.

{{< mtx-demo title="Save with backdrop and snackbar" layout="column" >}}
<input data-mtx="text-field" data-label="Project name" data-variant="outlined" value="Materix UI" type="text">
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-backdrop-save" data-start-icon="save">Save</button>
<div data-mtx="backdrop" id="doc-backdrop-saving" data-lock-scroll>
  <div class="mtx-d-flex mtx-flex-column mtx-align-items-center mtx-gap-2">
    <div data-mtx="circular-progress" data-color="inherit" data-decorative></div>
    <span class="mtx-typography--subtitle1" role="status">Saving changes…</span>
  </div>
</div>
{{< /mtx-demo >}}

```javascript
const saving = Materix.getInstance(document.getElementById('doc-backdrop-saving'));
saving.open();
await saveProject();
saving.close();
Materix.snackbar.show('Project saved');
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var saving = Materix.getInstance(document.getElementById('doc-backdrop-saving'));
  document.getElementById('doc-backdrop-save').addEventListener('click', function () {
    saving.open();
    setTimeout(function () {
      saving.close();
      if (Materix.snackbar) Materix.snackbar.show('Project saved');
    }, 2000);
  });
});
</script>

## Full BEM syntax

For SSR: initially closed with `hidden` and `aria-hidden="true"`. The `mtx-backdrop--open` class or `data-open` show it on initialization.

```html
<div class="mtx-backdrop" id="loading" data-mtx="backdrop" data-close-on-click hidden aria-hidden="true">
  <div data-mtx="circular-progress" data-color="inherit" data-label="Loading"></div>
</div>
```

## Programmatic usage

`[data-mtx="backdrop"]` elements initialize themselves; for dynamic content use `Materix.init(el)` or `new Materix.Backdrop(el)`.

```javascript
// UMD (window.Materix)
const backdrop = Materix.getInstance(document.getElementById('loading'));
backdrop.open();
setTimeout(() => backdrop.close(), 1500);
backdrop.toggle();
console.log(backdrop.isOpen);

document.addEventListener('mtx:backdrop:close', (e) => console.log(e.detail.reason)); // api | click | escape
```

```javascript
// ES modules
import { Backdrop } from 'materix-ui';

const el = document.createElement('div');
el.setAttribute('data-close-on-escape', '');
document.body.append(el);
const backdrop = new Backdrop(el);
backdrop.open();
```

{{< mtx-demo title="open() and close() after 1.5 s" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-backdrop-api-open">Open for 1.5 s</button>
<div data-mtx="backdrop" id="doc-backdrop-api" data-close-on-click data-close-on-escape>
  <div data-mtx="circular-progress" data-color="inherit" data-label="Loading"></div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var api = Materix.getInstance(document.getElementById('doc-backdrop-api'));
  document.getElementById('doc-backdrop-api-open').addEventListener('click', function () {
    api.open();
    setTimeout(function () { api.close(); }, 1500);
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `backdrop` | — | Initializes the component. |
| `data-open` | boolean | — | Open on initialization (reflects the state while open). |
| `data-invisible` | boolean | — | Transparent layer that still captures clicks. |
| `data-close-on-click` | boolean | — | Closes on a click on the layer or on non-interactive content. |
| `data-close-on-escape` | boolean | — | Closes with <kbd>Escape</kbd> (unless another modal is on top). |
| `data-lock-scroll` | boolean | — | Locks `body` scrolling while open. |
| `data-inert` | boolean | — | Marks the rest of the page `inert` while open. |
| `data-z` | integer | `--mtx-backdrop-z-index` (1201) | Custom z-index. |
| `data-mtx-backdrop-open` | id (with or without `#`) | — | On any element: toggles that backdrop on click. |
| `data-mtx-backdrop-close` | — | — | On an inner element: closes the backdrop on click. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-backdrop` | Full-screen fixed layer with centered content (hidden and transparent by default). |
| `.mtx-backdrop--open` | Visible state (225 ms fade in, 195 ms fade out). |
| `.mtx-backdrop--invisible` | Transparent background. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `open()` | `this` | Shows the layer and emits `mtx:backdrop:open`. |
| `close()` | `this` | Hides the layer and emits `mtx:backdrop:close` (`reason: 'api'`). |
| `toggle()` | `this` | Toggles between open and closed. |
| `isOpen` | `boolean` | Getter: `true` when open. |
| `destroy()` | `void` | Removes listeners and releases scroll lock and `inert`. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:backdrop:open` | — | The layer opens (bubbles). |
| `mtx:backdrop:close` | `{ reason: 'api' \| 'click' \| 'escape' }` | The layer closes (bubbles). |

### CSS variables

| Variable | Default | Description |
|---|---|---|
| `--mtx-backdrop-bg` | `rgba(0, 0, 0, 0.5)` | Layer color. |
| `--mtx-backdrop-color` | `#ffffff` | Content color (`inherit` spinners, text). |
| `--mtx-backdrop-z-index` | `calc(var(--mtx-z-index-drawer) + 1)` | Default z-index (1201). |

## Accessibility

- When closed, the element has `hidden` and `aria-hidden="true"`; both are removed when open.
- Backdrop has **no** role or accessible name: describe the operation with its content (`data-label` on the CircularProgress, which exposes `role="progressbar"`, or a text with `role="status"`).
- It doesn't move or trap focus. With `data-inert` the rest of the page stops being focusable and leaves the accessibility tree while open; without it, keyboard users can keep interacting with what's underneath.
- `prefers-reduced-motion: reduce` disables the fade.

| Key | Action |
|---|---|
| <kbd>Escape</kbd> | Closes the backdrop if it has `data-close-on-escape` and it is the top layer. With `data-lock-scroll` or `data-inert` but without `data-close-on-escape`, it consumes <kbd>Escape</kbd> without closing. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | On a `data-mtx-backdrop-open` trigger, toggles the backdrop. |
