---
title: "Alert"
description: "A short, prominent message that reports the outcome of an action or the state of the system without interrupting the user."
group: "feedback"
icon: "warning"
weight: 10
example: "alert"
mui: "https://mui.com/material-ui/react-alert/"
---

**Alert** displays a short, important message within the page flow, using a color and an icon to convey its severity (`success`, `info`, `warning`, `error`). Use it to confirm an operation, warn about a problem, or explain a validation error next to the affected content. Don't use it for temporary notifications that dismiss themselves (use [Snackbar]({{< relref "/components/snackbar" >}})) or for decisions that block the task (use [Dialog]({{< relref "/components/dialog" >}})).

## Basic usage

A single `<div data-mtx="alert">` is all you need. The component generates the severity icon, the `.mtx-alert__message` container and, if you set `data-title`, the title.

{{< mtx-demo title="Simplified syntax" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success">Your changes were saved successfully.</div>
  <div data-mtx="alert" data-severity="error" data-title="Error">Could not connect to the server.</div>
</div>
{{< /mtx-demo >}}

## Variants

As in MUI, there are three variants, selected with `data-variant`: `standard` (soft background, the default), `filled` (solid severity background) and `outlined` (border only).

{{< mtx-demo title="Standard" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success">Order confirmed.</div>
  <div data-mtx="alert" data-severity="info">A new version is available.</div>
  <div data-mtx="alert" data-severity="warning">Your plan expires in 3 days.</div>
  <div data-mtx="alert" data-severity="error">The payment was declined.</div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Filled" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success" data-variant="filled">Order confirmed.</div>
  <div data-mtx="alert" data-severity="info" data-variant="filled">A new version is available.</div>
  <div data-mtx="alert" data-severity="warning" data-variant="filled">Your plan expires in 3 days.</div>
  <div data-mtx="alert" data-severity="error" data-variant="filled">The payment was declined.</div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Outlined" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success" data-variant="outlined">Order confirmed.</div>
  <div data-mtx="alert" data-severity="info" data-variant="outlined">A new version is available.</div>
  <div data-mtx="alert" data-severity="warning" data-variant="outlined">Your plan expires in 3 days.</div>
  <div data-mtx="alert" data-severity="error" data-variant="outlined">The payment was declined.</div>
</div>
{{< /mtx-demo >}}

## Severities

`data-severity` sets both the color (`--mtx-color-{severity}` tokens) and the SVG icon. If omitted, `success` is applied.

| Severity | When to use it |
|---|---|
| `success` | The operation completed successfully. |
| `info` | Neutral or contextual information. |
| `warning` | Something needs attention soon, but nothing has failed yet. |
| `error` | The operation failed and the user must act. |

## With icons

The icon is generated automatically as a 22 px SVG, as in MUI, in the main severity color. To replace it, include a `.mtx-alert__icon` child (the component keeps it); to remove it, use `data-icon="false"`.

{{< mtx-demo title="Automatic, custom and no icon" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="info">Icon generated from the severity.</div>
  <div data-mtx="alert" data-severity="success">
    <span class="mtx-alert__icon"><span class="material-icons" aria-hidden="true">cloud_done</span></span>
    Backup completed.
  </div>
  <div data-mtx="alert" data-severity="warning" data-icon="false">Alert without an icon.</div>
</div>
{{< /mtx-demo >}}

## Title

`data-title` generates a bold `.mtx-alert__title` above the message (equivalent to MUI's `AlertTitle`).

{{< mtx-demo title="With title" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="info" data-title="Scheduled maintenance">The service will be paused on Sunday from 02:00 to 04:00.</div>
  <div data-mtx="alert" data-severity="error" data-variant="filled" data-title="Session expired">Sign in again to continue.</div>
</div>
{{< /mtx-demo >}}

## Actions

There is no attribute for the action: write the text inside `.mtx-alert__message` and keep the button as a sibling. When the message container already exists, the component doesn't move the other children, so the button stays aligned to the right.

{{< mtx-demo title="Alert with action" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success">
    <div class="mtx-alert__message">1 conversation was deleted.</div>
    <button class="mtx-button mtx-button--text mtx-button--small mtx-button--success" data-mtx="button">Undo</button>
  </div>
</div>
{{< /mtx-demo >}}

## Dismissible

`data-dismissible` adds a close button with an `aria-label` translated by the i18n dictionary (`Close` in English, `Cerrar` in Spanish, following the element's `lang`; change it with `data-close-label`). When clicked, the alert fades out over 200 ms, receives the `hidden` attribute (it leaves the layout, with no gap) and emits `mtx:alert:close`.

{{< mtx-demo title="With close button" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="info" data-dismissible data-close-label="Dismiss notice">You can dismiss this notice.</div>
  <div data-mtx="alert" data-severity="warning" data-variant="filled" data-title="Attention" data-dismissible>Sync has stopped.</div>
</div>
{{< /mtx-demo >}}

{{< callout type="info" title="hidden works on the alert itself" >}}
`.mtx-alert[hidden]` is `display: none`, so you can toggle `hidden` directly on the alert and a closed alert no longer takes up space. With `prefers-reduced-motion: reduce`, `close()` hides it immediately, without the fade.
{{< /callout >}}

## Real-world examples

### Form validation error

Put `hidden` on the alert and remove it on validation.

{{< mtx-demo title="Sign-in form" layout="block" >}}
<form class="mtx-stack mtx-stack--col mtx-stack--spacing-2" id="doc-alert-form" novalidate>
  <div data-mtx="alert" data-severity="error" data-title="Check the form" id="doc-alert-form-error" hidden>Email and password are required.</div>
  <input data-mtx="text-field" data-label="Email" type="email" name="email" />
  <input data-mtx="text-field" data-label="Password" type="password" name="password" />
  <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Sign in</button>
</form>
{{< /mtx-demo >}}

```javascript
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = form.elements.email.value && form.elements.password.value;
  document.getElementById('doc-alert-form-error').hidden = Boolean(valid);
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('doc-alert-form');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var valid = form.elements.email.value.trim() && form.elements.password.value.trim();
    document.getElementById('doc-alert-form-error').hidden = Boolean(valid);
  });
});
</script>

### Dashboard summary

{{< mtx-demo title="Dashboard notices" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <div data-mtx="alert" data-severity="success" data-title="Sales">+12% compared to last month.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <div data-mtx="alert" data-severity="warning" data-title="Inventory">3 products are running low on stock.</div>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or fine-grained control, write the full structure: the component reuses the existing `.mtx-alert__icon` and `.mtx-alert__message` and only adds the severity and variant classes.

```html
<div class="mtx-alert mtx-alert--warning mtx-alert--outlined" data-mtx="alert"
     data-severity="warning" data-variant="outlined" role="alert">
  <span class="mtx-alert__icon">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" focusable="false" aria-hidden="true">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  </span>
  <div class="mtx-alert__message">
    <div class="mtx-alert__title">BEM structure</div>
    Rendered on the server; no auto-scaffolding required.
  </div>
</div>
```

## Programmatic usage

`[data-mtx="alert"]` elements initialize themselves when the page loads. For dynamic content, use `Materix.init(el)` or the class directly; `Materix.getInstance(el)` returns the existing instance.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.setAttribute('data-severity', 'warning');
el.setAttribute('data-dismissible', '');
el.textContent = '2 attempts left.';
container.append(el);
Materix.init(el, 'alert');             // or: new Materix.Alert(el)

const alert = Materix.getInstance(el);
alert.close();
alert.open();

el.addEventListener('mtx:alert:close', () => console.log('closed'));
```

```javascript
// ES modules
import { Alert, getInstance } from '@rubenchodev/materix-ui';

const alert = new Alert(document.querySelector('#notice'));
alert.close();
```

{{< mtx-demo title="close() and open()" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="info" data-dismissible id="doc-alert-api">Controlled from JavaScript.</div>
  <div>
    <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-alert-close">close()</button>
    <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-alert-open">open()</button>
  </div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-alert-api');
  if (!el) return;
  document.getElementById('doc-alert-close').addEventListener('click', function () { Materix.getInstance(el).close(); });
  document.getElementById('doc-alert-open').addEventListener('click', function () { Materix.getInstance(el).open(); });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `alert` | — | Initializes the component. |
| `data-severity` | `success` \| `info` \| `warning` \| `error` | `success` | Color and icon of the alert. |
| `data-variant` | `standard` \| `filled` \| `outlined` | `standard` | Visual variant. |
| `data-title` | text | — | Generates a `.mtx-alert__title` at the start of the message. |
| `data-icon` | `false` | — | When `false`, the automatic icon is not generated. |
| `data-dismissible` | boolean (presence) | absent | Adds the `.mtx-alert__close` close button. |
| `data-close-label` | text | i18n `alert.close` (`Close` / `Cerrar`) | `aria-label` of the close button. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-alert` | Flex container (added automatically). |
| `.mtx-alert--success` / `--info` / `--warning` / `--error` | Severity color. |
| `.mtx-alert--standard` | Soft background: 10 % of the color over white (light) or black (dark), as MUI. |
| `.mtx-alert--filled` | Solid background with contrast text. |
| `.mtx-alert--outlined` | Transparent background with a colored border. |
| `.mtx-alert__icon` | Icon container (generated or custom), main severity color; the generated SVG is 22 px. |
| `.mtx-alert__message` | Text container; fills the available space. |
| `.mtx-alert__title` | Bold title (`font-weight: 500`). |
| `.mtx-alert__close` | 30 px circular close button (MUI small IconButton). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `close()` | `void` | Fades the alert out (200 ms, immediate with reduced motion), sets `hidden` on it (removes it from the layout) and emits `mtx:alert:close`. Does nothing if it already has `hidden`. |
| `open()` | `void` | Removes `hidden`, restores the opacity and emits `mtx:alert:open`. |
| `destroy()` | `void` | Cancels the timer and removes the close button listener. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:alert:close` | — | The close animation finishes (bubbles). |
| `mtx:alert:open` | — | `open()` is called (bubbles). |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-{severity}` | `filled` background, `outlined` border and base of the `standard` soft background. |
| `--mtx-alert-text-mix` / `--mtx-alert-bg-mix` | Tones mixed with the severity color in `standard`/`outlined`: text = 40 % color + `#000` (light) or `#fff` (dark); background = 10 % color + `#fff` (light) or `#000` (dark). |
| `--mtx-color-{severity}-contrast` | Text color in `filled`. |
| `--mtx-shape-radius` | Corner radius (4 px). |
| `--mtx-font-family` | Font family. |

## Accessibility

- If the element has no `role`, the component adds `role="alert"`, which screen readers announce immediately. For informational messages that shouldn't interrupt, declare `role="status"` yourself before initialization.
- Generated SVG icons have `aria-hidden="true"` and `focusable="false"`; the meaning must be in the text, not only in the color.
- The close button is a native `<button type="button">` with an `aria-label` configurable through `data-close-label`.
- If you add a custom icon, mark it with `aria-hidden="true"`.

| Key | Action |
|---|---|
| `Tab` | Moves focus to the action and the close button. |
| `Enter` / `Space` | Activates the focused button (close or action). |
