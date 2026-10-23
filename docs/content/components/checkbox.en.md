---
title: "Checkbox"
description: "A box for selecting one or more options from a list or confirming a condition; supports an indeterminate state."
group: "inputs"
icon: "check_box"
weight: 40
example: "checkbox"
mui: "https://mui.com/material-ui/react-checkbox/"
---

**Checkbox** lets users select zero, one or several options from a set, or confirm a condition ("I accept the terms"). It keeps a native `<input type="checkbox">`, so it works in forms, with the keyboard and with screen readers without extra code. If the option applies a change immediately, use a [Switch]({{< relref "/components/switch" >}}); if only one option can be chosen, use [Radio]({{< relref "/components/radio" >}}).

{{< callout type="tip" title="Checkbox, Switch or Radio?" >}}
| Component | When to use it |
| :--- | :--- |
| **Checkbox** | Several independent options, or a confirmation applied when a form is submitted. |
| **Switch** | Turning a preference on/off with an immediate effect, without a "Save" button. |
| **Radio** | Choosing exactly one option from a small, visible group. |
{{< /callout >}}

## Basic usage

Write just the input with `data-mtx="checkbox"` and `data-label`. The library wraps it in a `<label class="mtx-checkbox">`, draws the box and the label, and keeps `id`, `name`, `value`, `checked`, `required` and the rest of the attributes.

{{< mtx-demo title="Basic usage" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Remember me" checked />
<input type="checkbox" data-mtx="checkbox" data-label="Receive updates" />
{{< /mtx-demo >}}

## Sizes

Two sizes, as in MUI: **medium** (18px box, default) and **small** (16px with 14px text) via `data-size="small"`, for tables and dense forms.

{{< mtx-demo title="Sizes" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Medium" checked />
<input type="checkbox" data-mtx="checkbox" data-label="Small" data-size="small" checked />
{{< /mtx-demo >}}

## With and without a label

Without `data-label`, only the box is drawn. In that case give it an accessible name with `aria-label` or `aria-labelledby`, for example in a table's selection column.

{{< mtx-demo title="Box only" >}}
<input type="checkbox" data-mtx="checkbox" aria-label="Select row 1" checked />
<input type="checkbox" data-mtx="checkbox" aria-label="Select row 2" />
{{< /mtx-demo >}}

## Colors

Primary is the default. Use `data-color` on the input (`secondary`, `success`, `error`, `warning`, `info`) or the `mtx-checkbox--{color}` class, which is appended to the generated container.

{{< mtx-demo title="Colors" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Primary" checked />
<input type="checkbox" data-color="secondary" data-mtx="checkbox" data-label="Secondary" checked />
<input type="checkbox" data-color="success" data-mtx="checkbox" data-label="Success" checked />
<input type="checkbox" data-color="error" data-mtx="checkbox" data-label="Error" checked />
<input type="checkbox" data-color="warning" data-mtx="checkbox" data-label="Warning" checked />
<input type="checkbox" data-color="info" data-mtx="checkbox" data-label="Info" checked />
{{< /mtx-demo >}}

## States

Unchecked, checked and indeterminate, each enabled or with `disabled`. Hover colors the border, pressing shows a ripple centered on the box and keyboard focus shows a ring.

{{< mtx-demo title="Enabled and disabled" layout="column" >}}
<div>
  <input type="checkbox" data-mtx="checkbox" data-label="Unchecked" />
  <input type="checkbox" data-mtx="checkbox" data-label="Checked" checked />
  <input type="checkbox" data-mtx="checkbox" data-label="Indeterminate" data-indeterminate />
</div>
<div>
  <input type="checkbox" data-mtx="checkbox" data-label="Unchecked" disabled />
  <input type="checkbox" data-mtx="checkbox" data-label="Checked" checked disabled />
</div>
{{< /mtx-demo >}}

For a validation error use `data-error` (or `setError()`): it sets `aria-invalid`, paints the border red and shows the message linked with `aria-describedby` (see [Helper and error text](#helper-and-error-text-formhelpertext)):

{{< mtx-demo title="Error and helper text" layout="column" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Terms of service" data-error="You must accept the terms." required />
<input type="checkbox" data-mtx="checkbox" data-label="Disabled indeterminate" data-indeterminate disabled />
{{< /mtx-demo >}}

{{< callout type="info" >}}
The native `<input type="checkbox">` doesn't support `readonly`. To show a checkbox the user can't change, use `disabled`.
{{< /callout >}}

## Helper and error text (FormHelperText)

`data-helper-text` wraps the checkbox in `.mtx-form-control` and adds a `.mtx-form-helper-text` below it, linked with `aria-describedby`. An empty `data-error` turns on the error while keeping the helper text; with text, the message replaces it. The input gets `aria-invalid="true"` and the unchecked border turns red. From code: `setError()`, `clearError()` and `setHelperText()`.

{{< mtx-demo title="Helper text, error and validation" layout="column" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Email me the receipt" data-helper-text="It will be sent to ana@example.com" checked />
<input type="checkbox" data-mtx="checkbox" data-label="I confirm I am of legal age" data-helper-text="Legal requirement" data-error />
<input type="checkbox" id="doc-cb-consent" data-mtx="checkbox" data-label="I accept the terms" data-error="You must accept the terms." required />
{{< /mtx-demo >}}

```javascript
const consent = Materix.getInstance(document.getElementById('doc-cb-consent'));
form.addEventListener('submit', (event) => {
  if (!consent.checked) {
    event.preventDefault();
    consent.setError('You must accept the terms.');
  } else {
    consent.clearError();
  }
});
```

`.mtx-form-helper-text` also works with CSS only (or with `data-mtx="form-helper-text"`, which adds an `id`). If you write the wrapper by hand, the control links the existing helper automatically:

{{< mtx-demo title="Manual FormHelperText" >}}
<div class="mtx-form-control">
  <label class="mtx-checkbox" data-mtx="checkbox">
    <input type="checkbox" />
    <span class="mtx-checkbox__box"></span>
    <span class="mtx-checkbox__label">Subscribe to the newsletter</span>
  </label>
  <p class="mtx-form-helper-text">One email a month, no spam.</p>
</div>
{{< /mtx-demo >}}

| Class / attribute | Description |
| :--- | :--- |
| `mtx-form-control` | Column grouping `mtx-form-label` (optional), the control and the helper. `--error` and `--disabled` color the label and helper. |
| `mtx-form-label` | Group label (FormLabel): body1, text-secondary; primary on focus and error when invalid. |
| `mtx-form-helper-text` | Caption, 3px top margin, text-secondary. |
| `mtx-form-helper-text--error` | Error color. |
| `mtx-form-helper-text--contained` | 14px inset to line up with an outlined/filled TextField. |
| `mtx-form-helper-text--disabled` | text-disabled color (automatic inside a disabled control). |
| `data-mtx="form-helper-text"` + `data-error` | Optional initialization; the `Materix.FormHelperText` instance exposes `setText(text)` and `error` (get/set). |

## Indeterminate

The indeterminate state indicates that only some of the child options are checked (the "select all" pattern). It's declared with `data-indeterminate` or the `indeterminate` property, and the library syncs `aria-checked="mixed"`. It's purely visual: on click, the browser clears it and applies checked/unchecked.

{{< mtx-demo title="Select all" layout="column" >}}
<input type="checkbox" data-mtx="checkbox" data-label="All permissions" id="doc-checkbox-parent" data-indeterminate />
<input type="checkbox" class="doc-checkbox-child" data-mtx="checkbox" data-label="Read" checked />
<input type="checkbox" class="doc-checkbox-child" data-mtx="checkbox" data-label="Write" />
{{< /mtx-demo >}}

```javascript
const parent = Materix.getInstance(document.getElementById('doc-checkbox-parent'));
const children = [...document.querySelectorAll('input.doc-checkbox-child')].map(Materix.getInstance);

function syncParent() {
  const marked = children.filter((c) => c.checked).length;
  parent.indeterminate = marked > 0 && marked < children.length;
  parent.checked = marked === children.length;
}
parent.input.addEventListener('change', () => {
  children.forEach((c) => { c.checked = parent.checked; });
  syncParent();
});
children.forEach((c) => c.input.addEventListener('change', syncParent));
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  // Materix.init is idempotent: it guarantees the instance even if this script runs before auto-initialization.
  var parent = Materix.init(document.getElementById('doc-checkbox-parent'));
  var children = Array.prototype.map.call(document.querySelectorAll('input.doc-checkbox-child'), function (el) {
    return Materix.init(el);
  });
  function syncParent() {
    var marked = children.filter(function (c) { return c.checked; }).length;
    parent.indeterminate = marked > 0 && marked < children.length;
    parent.checked = marked === children.length;
  }
  parent.input.addEventListener('change', function () {
    children.forEach(function (c) { c.checked = parent.checked; });
    syncParent();
  });
  children.forEach(function (c) { c.input.addEventListener('change', syncParent); });
});
</script>

## Grouping

Group related checkboxes in a `<fieldset>` with a `<legend>`: screen readers announce the legend when entering the group. Share the `name` to submit them together in a form.

{{< mtx-demo title="Group with legend" layout="column" >}}
<fieldset>
  <legend>Email notifications</legend>
  <input type="checkbox" name="notify" value="comments" data-mtx="checkbox" data-label="Comments" checked />
  <input type="checkbox" name="notify" value="mentions" data-mtx="checkbox" data-label="Mentions" checked />
  <input type="checkbox" name="notify" value="digest" data-mtx="checkbox" data-label="Weekly digest" />
</fieldset>
{{< /mtx-demo >}}

## Real-world examples

Sign-in form with a "Remember me" checkbox.

{{< mtx-demo title="Sign-in form" layout="column" >}}
<input data-mtx="text-field" data-label="Email" data-start-icon="email" type="email" />
<input data-mtx="text-field" data-label="Password" data-start-icon="lock" type="password" />
<input type="checkbox" name="remember" data-mtx="checkbox" data-label="Remember me on this device" />
<button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button">Sign in</button>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or fine-grained control, declare the container `<label>` with `data-mtx`, the input, the visual box and the label. The library reuses the existing nodes.

```html
<label class="mtx-checkbox mtx-checkbox--secondary" data-mtx="checkbox">
  <input type="checkbox" name="terms" checked />
  <span class="mtx-checkbox__box"></span>
  <span class="mtx-checkbox__label">I accept the terms</span>
</label>
```

## Programmatic usage

`Materix.getInstance()` accepts the input or the generated `<label>`. Changes made from code don't fire events; user interactions emit the input's native `change` event.

```javascript
const checkbox = Materix.getInstance(document.querySelector('#remember'));

checkbox.checked = true;
checkbox.indeterminate = false;
checkbox.toggle();
checkbox.disable();
checkbox.enable();
checkbox.focus();

checkbox.input.addEventListener('change', (event) => {
  console.log('checked:', event.target.checked);
});

// Initialize a dynamically created input
Materix.init(newInput, 'checkbox');
```

With ES modules:

```javascript
import { init, getInstance, Checkbox } from '@rubenchodev/materix-ui';
const checkbox = new Checkbox(document.querySelector('#remember'));
```

{{< mtx-demo title="toggle()" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Controlled checkbox" id="doc-checkbox-target" />
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-checkbox-toggle">toggle()</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('doc-checkbox-toggle').addEventListener('click', function () {
    Materix.getInstance(document.getElementById('doc-checkbox-target')).toggle();
  });
});
</script>

## API reference

### Data attributes

They can be written on the input (simplified syntax) or on the `<label>` (BEM).

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `checkbox` | — | Enables automatic initialization. |
| `data-label` | text | — | Creates `.mtx-checkbox__label` with that text. `label` is also accepted. |
| `data-size` | `small` | medium | Compact size (`mtx-checkbox--small`). |
| `data-small` | boolean | — | Shortcut for `data-size="small"`. |
| `data-indeterminate` | boolean | — | Starts in the indeterminate state. |
| `data-disable-ripple` | boolean | — | Disables the ripple. |
| `data-color` | `primary` \| `secondary` \| `success` \| `error` \| `warning` \| `info` | `primary` | Color of the checked state (adds `mtx-{component}--{color}`). |
| `data-helper-text` | text | — | Creates a `.mtx-form-helper-text` below the control inside `.mtx-form-control`, linked with `aria-describedby`. |
| `data-error` | text \| empty \| `true` | — | Error state: `aria-invalid="true"` and red helper text. With text, the message replaces the helper text. |

Configuration `data-*` attributes are read from the input and are **not** copied to the generated `<label>`; the input's class is appended (never replaced).

Preserved native attributes: `id`, `name`, `value`, `checked`, `disabled`, `required`, `aria-*`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-checkbox` | `<label>` container. |
| `mtx-checkbox__input` | Native input, invisible and overlaid (added by the JS). |
| `mtx-checkbox__box` | 18px visual box with the check mark or dash. |
| `mtx-checkbox__label` | Label text. |
| `mtx-checkbox--small` | 16px box and 14px text. |
| `mtx-checkbox--secondary`, `--success`, `--error`, `--warning`, `--info` | Color of the checked state. |
| `mtx-form-control` | Generated (or hand-written) wrapper grouping the control and `.mtx-form-helper-text`; `--error` / `--disabled` reflect the state. |
| `mtx-form-helper-text` / `--error` | Helper or error text (MUI FormHelperText). |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `checked` (get/set) | `boolean` | Checked state; setting it syncs `aria-checked`. |
| `indeterminate` (get/set) | `boolean` | Indeterminate state; setting it syncs `aria-checked="mixed"`. |
| `toggle()` | `void` | Toggles `checked` if it isn't disabled. |
| `disable()` / `enable()` | `void` | Changes the input's `disabled`. |
| `disabled` (getter) | `boolean` | Disabled state of the input. |
| `focus()` | `void` | Focuses the input. |
| `input` (property) | `HTMLInputElement` | Native input. |
| `setHelperText(text)` | `void` | Creates or changes the helper text (empty removes it). |
| `setError(message?)` | `void` | Turns on the error state (`aria-invalid`); with text, the message replaces the helper text. |
| `clearError()` | `void` | Clears the error and restores the helper text. |
| `error` (getter) | `boolean` | Whether it is in the error state. |
| `destroy()` | `void` | Removes the listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

Checkbox doesn't emit its own events. Use the input's native `change` event (it bubbles), which only fires on user interaction.

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `change` (native) | — (read `event.target.checked`) | The user checks or unchecks the box. |

### CSS variables

| Variable | Usage in Checkbox |
| :--- | :--- |
| `--mtx-color-{color}`, `--mtx-color-{color}-contrast` | Fill and mark in the checked/indeterminate state. |
| `--mtx-color-text-secondary` | Unchecked border. |
| `--mtx-color-text-primary`, `--mtx-type-body1` | Label. |
| `--mtx-color-action-disabled`, `--mtx-color-text-disabled` | Disabled state. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-cb-color`, `--mtx-cb-check` | Local variables (fill and mark color) for customization. |

## Accessibility

- The native input stays in the DOM: it keeps form submission, `required` and checkbox semantics.
- The whole row (`<label>`) is clickable. Without `data-label`, use `aria-label` or `aria-labelledby`.
- `aria-checked` is synced with `checked` and `indeterminate` (`mixed`).
- The helper text stays **outside** the `<label>` (so it is not merged into the accessible name) and is linked with `aria-describedby`, keeping any existing ids. `setError()` adds `aria-invalid="true"` and `clearError()` removes it (only when the library set it).
- Group related options with `<fieldset>` and `<legend>`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next / previous checkbox. |
| <kbd>Space</kbd> | Checks or unchecks the focused checkbox. |
