---
title: "Dialog"
description: "A modal window that interrupts the task to ask for a decision or show critical information, with trapped focus and Escape to close."
group: "feedback"
icon: "open_in_browser"
weight: 20
example: "dialog"
mui: "https://mui.com/material-ui/react-dialog/"
---

**Dialog** opens a modal panel over the page: it locks scrolling, traps keyboard focus and requires a decision before continuing. Use it for confirmations, short forms or information the user must not miss. Don't use it for notices that need no response (use [Snackbar]({{< relref "/components/snackbar" >}}) or [Alert]({{< relref "/components/alert" >}})) or for side navigation (use [Drawer]({{< relref "/components/drawer" >}})).

## Basic usage

Declare the container with `data-mtx="dialog"` and `data-title`: the component generates the backdrop (`.mtx-dialog__backdrop`), the panel (`.mtx-dialog__paper`), the title and the content. Any element with `data-mtx-dialog-open="id"` opens it without writing JavaScript.

{{< mtx-demo title="Simple dialog" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-basic">Open dialog</button>

<div data-mtx="dialog" id="doc-dlg-basic" data-title="Use the device's location">
  <p>Let apps determine your location. Press Escape or click outside to close.</p>
</div>
{{< /mtx-demo >}}

## With actions

Wrap the buttons in `.mtx-dialog__actions`: the component always places them at the end of the panel, outside the content, even if you don't use `.mtx-dialog__content`. `data-description` generates the supporting text (`.mtx-dialog__content-text`, the equivalent of MUI's `DialogContentText`) and links it with `aria-describedby`. Any element with `data-mtx-dialog-close` closes the dialog. Follow the MUI convention: primary action `contained`, secondary `text`.

{{< mtx-demo title="Title, content and actions" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-actions">Open with actions</button>

<div data-mtx="dialog" id="doc-dlg-actions" data-title="Turn on sync?">
  <div class="mtx-dialog__content">Your documents will be copied to the cloud and be available on all your devices.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancel</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Turn on</button>
  </div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="data-description and actions, no content wrapper" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-description">Discard draft</button>

<div data-mtx="dialog" id="doc-dlg-description" class="mtx-dialog--max-sm" data-title="Discard draft?" data-description="The message will be deleted and can't be recovered.">
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close data-dialog-autofocus>Cancel</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Discard</button>
  </div>
</div>
{{< /mtx-demo >}}

## Action alignment

As in MUI's `DialogActions`, actions are **right-aligned** by default (`end`) in every form: single-element syntax, full BEM and `data-mtx="dialog-actions"`. Change it with `data-align="start|center|end|between"` on `.mtx-dialog__actions` (or `data-mtx="dialog-actions"`), or set it for every action row of a dialog with `data-actions-align` on the dialog; a row's own `data-align` wins. `between` places an auxiliary action on the left and the main ones on the right. `data-disable-spacing` removes the gap between buttons (MUI `disableSpacing`). The `data-align` attribute also works without JavaScript (server-rendered HTML).

{{< mtx-demo title="Action alignment" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-align-end">end (default)</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-align-start">start</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-align-center">center</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-align-between">between</button>
</div>

<div data-mtx="dialog" id="doc-dlg-align-end" class="mtx-dialog--max-sm" data-title="Right-aligned actions" data-description="With no attributes, actions are aligned to the end of the panel.">
  <div data-mtx="dialog-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancel</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>OK</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-align-start" class="mtx-dialog--max-sm" data-title="Start-aligned actions" data-description="data-actions-align=&quot;start&quot; on the dialog applies to its actions." data-actions-align="start">
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>OK</button>
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancel</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-align-center" class="mtx-dialog--max-sm" data-title="Centered action" data-description="Useful for confirmations with a single action.">
  <div data-mtx="dialog-actions" data-align="center">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Got it</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-align-between" class="mtx-dialog--max-sm" data-title="Export report" data-description="The auxiliary action sits on the left and the main ones on the right.">
  <div data-mtx="dialog-actions" data-align="between">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-start-icon="help_outline">Help</button>
    <div class="mtx-d-flex mtx-gap-1">
      <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancel</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Export</button>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

```html
<!-- Default: right-aligned -->
<div data-mtx="dialog" id="d1" data-title="Right-aligned actions">
  <div data-mtx="dialog-actions">…</div>
</div>

<!-- For the whole dialog -->
<div data-mtx="dialog" id="d2" data-title="…" data-actions-align="start">…</div>

<!-- On a single row: start | center | end | between -->
<div class="mtx-dialog__actions" data-align="between">
  <button class="mtx-button mtx-button--text" data-mtx="button">Help</button>
  <div class="mtx-d-flex mtx-gap-1">…</div>
</div>
```

## Sizes

The maximum width is set with a class on the container. The panel takes 100% of the available width up to that limit; `mtx-dialog--full` makes it full-screen (equivalent to MUI's `fullScreen`).

| Class | Maximum width |
|---|---|
| `mtx-dialog--max-sm` | 24rem |
| `mtx-dialog--max-md` | 32rem (default) |
| `mtx-dialog--max-lg` | 48rem |
| `mtx-dialog--max-xl` | 64rem |
| `mtx-dialog--full` | 100% of the width and height, no radius |

{{< mtx-demo title="Maximum widths and full screen" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-sm">SM</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-lg">LG</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-full">Full screen</button>

<div data-mtx="dialog" id="doc-dlg-sm" class="mtx-dialog--max-sm" data-title="SM size">
  <div class="mtx-dialog__content">Maximum width of 24rem.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Close</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-lg" class="mtx-dialog--max-lg" data-title="LG size">
  <div class="mtx-dialog__content">Maximum width of 48rem.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Close</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-full" class="mtx-dialog--full" data-title="Edit post">
  <div class="mtx-dialog__content">The panel fills the whole window: recommended on mobile for long tasks.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Discard</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Save</button>
  </div>
</div>
{{< /mtx-demo >}}

## Confirmation

For irreversible actions, phrase the title as a question, explain the consequence and use `mtx-button--error`. `data-dialog-autofocus` on "Cancel" makes the initial focus land on the safe option.

{{< mtx-demo title="Destructive confirmation" >}}
<button class="mtx-button mtx-button--contained mtx-button--error" data-mtx="button" data-mtx-dialog-open="doc-dlg-confirm">Delete project</button>

<div data-mtx="dialog" id="doc-dlg-confirm" class="mtx-dialog--max-sm" data-title="Delete the project?">
  <div class="mtx-dialog__content">Its 24 files will be deleted and you won't be able to recover them.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close data-dialog-autofocus>Cancel</button>
    <button class="mtx-button mtx-button--contained mtx-button--error" data-mtx="button" data-mtx-dialog-close>Delete</button>
  </div>
</div>
{{< /mtx-demo >}}

## Scrolling

`data-scroll="paper"` (default) limits the panel to the window height minus 64 px and scrolls the content inside it. `mtx-dialog__content--dividers` adds borders above and below the content, and `mtx-dialog__actions--sticky` (or `mtx-dialog__title--sticky`) makes only the content scroll. `data-scroll="body"` (MUI's `scroll="body"`) removes the height limit: the panel grows with its content and the whole dialog container scrolls, while the backdrop stays fixed.

{{< mtx-demo title="scroll = paper with dividers" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-scroll">Terms and conditions</button>

<div data-mtx="dialog" id="doc-dlg-scroll" data-scroll="paper" data-title="Terms and conditions">
  <div class="mtx-dialog__content mtx-dialog__content--dividers">
    <p>1. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    <p>2. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl.</p>
    <p>3. Aenean lacinia bibendum nulla sed consectetur. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    <p>4. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    <p>5. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl.</p>
    <p>6. Aenean lacinia bibendum nulla sed consectetur. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    <p>7. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    <p>8. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl.</p>
    <p>9. Aenean lacinia bibendum nulla sed consectetur. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    <p>10. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    <p>11. End of document.</p>
  </div>
  <div class="mtx-dialog__actions mtx-dialog__actions--sticky">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Decline</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Accept</button>
  </div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="scroll = body" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-scroll-body">Release notes</button>

<div data-mtx="dialog" id="doc-dlg-scroll-body" data-scroll="body" data-title="Release notes">
  <div class="mtx-dialog__content">
    <p class="mtx-dialog__content-text">The panel has no height limit: scroll with the wheel, the keyboard or by dragging.</p>
    <p>1. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>2. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>3. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>4. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>5. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>6. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>7. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>8. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>9. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>10. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>11. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>12. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>13. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>14. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
    <p>15. Version 1.x: performance improvements, accessibility fixes and new theme tokens for feedback components.</p>
  </div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Got it</button>
  </div>
</div>
{{< /mtx-demo >}}

## Modal behavior

By default the dialog closes on a backdrop click and on Escape. `data-disable-backdrop-close` and `data-disable-escape` disable each path to force an explicit choice. While a dialog is open, `<body>` gets `overflow: hidden`; with several stacked dialogs, only the topmost one responds to the keyboard.

{{< mtx-demo title="No backdrop or Escape close" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-strict">Open strict dialog</button>

<div data-mtx="dialog" id="doc-dlg-strict" class="mtx-dialog--max-sm" data-disable-backdrop-close data-disable-escape data-title="Accept to continue">
  <div class="mtx-dialog__content">Neither the backdrop nor Escape closes this dialog: only the button does.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Accept</button>
  </div>
</div>
{{< /mtx-demo >}}

## Real-world examples

### Form in a dialog

The first field receives focus on open (or the one marked with `data-dialog-autofocus`, which works directly on an `<input data-mtx="text-field">`) and `Tab` doesn't leave the panel. The submit button sits in the actions and is linked to the form with the `form` attribute. Use `.mtx-dialog__content-text` for the explanatory text; when the content starts directly with a field, the component adds top padding so the floating label isn't clipped.

{{< mtx-demo title="Subscription" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-form">Subscribe</button>

<div data-mtx="dialog" id="doc-dlg-form" class="mtx-dialog--max-sm" data-title="Subscribe to the newsletter">
  <div class="mtx-dialog__content">
    <form class="mtx-stack mtx-stack--col mtx-stack--spacing-2" id="doc-dlg-form-el">
      <p class="mtx-dialog__content-text">Get Materix UI news once a month.</p>
      <input data-mtx="text-field" data-label="Name" type="text" name="name" required />
      <input data-mtx="text-field" data-label="Email" type="email" name="email" required data-dialog-autofocus />
    </form>
  </div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancel</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit" form="doc-dlg-form-el">Subscribe</button>
  </div>
</div>
{{< /mtx-demo >}}

```javascript
const form = document.getElementById('doc-dlg-form-el');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  Materix.getInstance(document.getElementById('doc-dlg-form')).close('submit');
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('doc-dlg-form-el');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    Materix.getInstance(document.getElementById('doc-dlg-form')).close('submit');
    form.reset();
  });
});
</script>

### Two-column form

You can use a [Grid]({{< relref "/components/grid" >}}) inside the content; combine it with `mtx-dialog--max-lg`.

```html
<div data-mtx="dialog" id="dlg-address" class="mtx-dialog--max-lg" data-title="New address">
  <div class="mtx-dialog__content">
    <div data-mtx="grid" data-spacing="2">
      <div data-mtx="grid" data-xs="12" data-sm="6"><input data-mtx="text-field" data-label="First name" /></div>
      <div data-mtx="grid" data-xs="12" data-sm="6"><input data-mtx="text-field" data-label="Last name" /></div>
      <div data-mtx="grid" data-xs="12"><input data-mtx="text-field" data-label="Address" /></div>
    </div>
  </div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancel</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Save</button>
  </div>
</div>
```

## Full BEM syntax

Use the full structure for SSR or fine-grained control. `aria-labelledby`, `aria-describedby` and `aria-label` on the container are copied to the panel; if they are missing, the component links the panel to the existing `.mtx-dialog__title` and `.mtx-dialog__content-text` (generating ids when needed). If the panel already exists, nothing new is generated.

```html
<div class="mtx-dialog mtx-dialog--max-sm" id="dlg-bem" data-mtx="dialog"
     aria-labelledby="dlg-bem-title" aria-describedby="dlg-bem-desc">
  <div class="mtx-dialog__backdrop" data-mtx-dialog-close></div>
  <div class="mtx-dialog__paper" role="dialog" aria-modal="true">
    <h2 class="mtx-dialog__title mtx-dialog__title--sticky" id="dlg-bem-title">BEM structure</h2>
    <div class="mtx-dialog__content" id="dlg-bem-desc">Rendered on the server.</div>
    <div class="mtx-dialog__actions mtx-dialog__actions--sticky">
      <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancel</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>OK</button>
    </div>
  </div>
</div>
```

## Programmatic usage

Dialogs initialize when the page loads. For dynamic content use `Materix.init(el)` or `new Materix.Dialog(el)`, and `Materix.getInstance(el)` to retrieve the instance.

```javascript
// UMD (window.Materix)
const dialog = Materix.getInstance(document.getElementById('dlg-api'));
dialog.open();
dialog.isOpen;            // true
dialog.close('saved');    // detail.reason === 'saved'

document.addEventListener('mtx:dialog:close', (event) => {
  console.log(event.target.id, event.detail.reason);
  // 'escapeKeyDown' | 'backdropClick' | 'closeButtonClick' | 'programmatic' | custom reason
});
```

```javascript
// ES modules
import { Dialog } from 'materix-ui';

const dialog = new Dialog(document.querySelector('#my-dialog'));
dialog.open();
```

{{< mtx-demo title="open() and event log" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-dlg-api-open">open()</button>
<span class="doc-demo-status" id="doc-dlg-api-log" role="status">No events yet.</span>

<div data-mtx="dialog" id="doc-dlg-api" class="mtx-dialog--max-sm" data-title="Programmatic dialog">
  <div class="mtx-dialog__content">Close it with Escape, the backdrop or the button and check the reason.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Close</button>
  </div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-dlg-api');
  if (!el) return;
  var out = document.getElementById('doc-dlg-api-log');
  document.getElementById('doc-dlg-api-open').addEventListener('click', function () { Materix.getInstance(el).open(); });
  el.addEventListener('mtx:dialog:open', function () { out.textContent = 'mtx:dialog:open'; });
  el.addEventListener('mtx:dialog:close', function (e) { out.textContent = 'mtx:dialog:close — reason: ' + e.detail.reason; });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `dialog` | — | Initializes the component. |
| `data-title` | text | — | Generates an `<h2 class="mtx-dialog__title">` with an `id` (`{dialog id}-title`) referenced by the panel's `aria-labelledby` (auto-scaffolding only). |
| `data-description` | text | — | Generates `<p class="mtx-dialog__content-text">` at the start of the content, referenced by `aria-describedby` (auto-scaffolding only). |
| `data-scroll` | `paper` \| `body` | `paper` | Scrolling inside the panel, or a free-height panel that scrolls the dialog container. |
| `data-disable-backdrop-close` | boolean (presence) | absent | Clicking the backdrop doesn't close it. |
| `data-disable-escape` | boolean (presence) | absent | Escape doesn't close it. |
| `data-mtx-dialog-open` | dialog id | — | On any element: opens it on click. |
| `data-mtx-dialog-close` | boolean (presence) | — | On an element inside the dialog: closes it on click (`reason: 'closeButtonClick'`, or `'backdropClick'` on the backdrop). |
| `data-actions-align` | `start` \| `center` \| `end` \| `between` | `end` | Alignment applied to the dialog's action rows that don't declare their own `data-align`. |
| `data-dialog-autofocus` | boolean (presence) | — | Element that receives focus on open (by default, the first focusable element). If the marked element isn't focusable (e.g. the wrapper generated by `<input data-mtx="text-field" data-dialog-autofocus>`), focus goes to its first focusable descendant. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-dialog` | Full-screen fixed container (`--mtx-z-index-modal`, 1300). |
| `.mtx-dialog--open` | Open state (managed by the component). |
| `.mtx-dialog--scroll-paper` / `--scroll-body` | Scroll mode (based on `data-scroll`). |
| `.mtx-dialog--max-sm` / `--max-md` / `--max-lg` / `--max-xl` | Maximum width: 24 / 32 / 48 / 64rem. |
| `.mtx-dialog--full` | Full screen with no radius or margins. |
| `.mtx-dialog__backdrop` | Semi-transparent backdrop. |
| `.mtx-dialog__paper` | Panel with elevation 24 and `role="dialog"`. |
| `.mtx-dialog__title` | Title (h6 typography). |
| `.mtx-dialog__title--sticky` | Fixed title with a bottom border; only the content scrolls. |
| `.mtx-dialog__content` | Content area (body1, secondary color). Gets 16 px of top padding when it starts with a TextField/Select so the label isn't clipped. |
| `.mtx-dialog__content-text` | Supporting text (MUI `DialogContentText`): body1, secondary color, no margin. |
| `.mtx-dialog__content--dividers` | Top and bottom borders on the content. |
| `.mtx-dialog__actions` | Button row, right-aligned by default (`justify-content: flex-end`). On its own element it accepts `data-mtx="dialog-actions"`, `data-align="start\|center\|end\|between"` and `data-disable-spacing`. |
| `.mtx-dialog__actions--start` / `--center` / `--between` | Alignment of the actions (added from `data-align` / `data-actions-align`; `end` needs no class). |
| `.mtx-dialog__actions--disable-spacing` | No gap between actions (`data-disable-spacing`). |
| `.mtx-dialog__actions--sticky` | Fixed actions with a top border. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `open()` | `void` | Opens it, locks scrolling, saves the previous focus, focuses the first control and emits `mtx:dialog:open`. |
| `close(reason?)` | `void` | Closes it, restores the previous focus and emits `mtx:dialog:close`. Default `reason`: `'programmatic'`. |
| `isOpen` | `boolean` | Getter: `true` if it's open. |
| `destroy()` | `void` | Closes it if open and removes the click, keyboard and focus listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |
| `DialogActions#align` | `string` | Getter/setter of a `data-mtx="dialog-actions"` instance: `start`, `center`, `end` or `between` (throws `RangeError` for any other value). |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:dialog:open` | — | The dialog opens (bubbles). |
| `mtx:dialog:close` | `{ reason }`: `'escapeKeyDown'`, `'backdropClick'`, `'closeButtonClick'`, `'programmatic'` or the reason passed to `close()` | The dialog closes (bubbles). |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-background-paper` | Background of the panel and of sticky title/actions. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` | Title and content color. |
| `--mtx-color-divider` | `--dividers` and `--sticky` borders. |
| `--mtx-elevation-24` | Panel shadow. |
| `--mtx-overlay-elevation-24` | White overlay of the panel in the dark theme (MUI elevation 24). |
| `--mtx-shape-radius` | Panel radius. |
| `--mtx-type-h6` / `--mtx-type-body1` | Title and content typography. |
| `--mtx-duration-short` / `--mtx-easing-standard` | Enter animation (scale and opacity). |
| `--mtx-spacing-1` | Gap between actions. |
| `--mtx-z-index-modal` | Stacking level (1300). |

## Accessibility

- The panel gets `role="dialog"` and `aria-modal="true"`. Its accessible name comes from the title: `aria-labelledby` points to `.mtx-dialog__title` (generated from `data-title` or written by hand) unless the container already has `aria-labelledby` or `aria-label`, which are copied to the panel. `.mtx-dialog__content-text` (or `data-description`) becomes the `aria-describedby` description.
- On open, focus moves to the element with `data-dialog-autofocus` or to the first focusable control (or to the panel itself if there's none). On close, it returns to the element that had focus before opening; if that element was not tabbable (in WebKit/Safari a click does not focus the button), it returns to the `data-mtx-dialog-open` trigger that was clicked.
- Focus is trapped in the panel: `Tab` and `Shift+Tab` are always intercepted and focus moves explicitly through its tabbable controls (links included, also in WebKit/Safari); if focus escapes, it's brought back to the panel.
- The fixed root (`.mtx-dialog`) sets `margin: 0`, so margins from page styles (e.g. `* + * { margin-top }`) never shift the dialog or its backdrop.
- The enter animation is disabled with `prefers-reduced-motion: reduce`.

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Moves through the panel's controls without leaving it. |
| `Escape` | Closes the dialog when it is the top layer (`reason: 'escapeKeyDown'`), unless `data-disable-escape` is set. A visible tooltip, or a menu/popover opened from the dialog, closes first ([layer stack]({{< relref "/guide/accessibility" >}}#escape-and-stacked-layers)). |
| `Enter` / `Space` | Activates the focused button. |
