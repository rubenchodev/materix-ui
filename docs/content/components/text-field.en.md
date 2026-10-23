---
title: "Text Field"
description: "Text field with a floating label, MUI variants, icons, counters, input masks and validation, declared with a single element."
group: "inputs"
icon: "edit"
weight: 70
example: "text-field"
mui: "https://mui.com/material-ui/react-text-field/"
---

`TextField` lets users enter and edit text in forms: name, email, password, amounts or long comments. It is declared with a single `<input>` or `<textarea>`, and Materix builds the floating label, the notched border (*NotchedOutline*), the icons and the helper text. To choose from a closed set of options use [Select](../select/) or [NativeSelect](../native-select/); for dates and times, use [DateTimePicker](../date-time-picker/).

## Basic usage

Write only the native element with `data-mtx="text-field"` and `data-label`. All native attributes (`id`, `name`, `type`, `value`, `required`, `disabled`, `readonly`, `maxlength`, `autocomplete`…) are preserved.

{{< mtx-demo title="Simplified syntax" >}}
<input data-mtx="text-field" data-label="Full name" type="text" />
{{< /mtx-demo >}}

If you omit `data-label`, the `placeholder` text is used as the label. The `data-mtx="input"` and `data-mtx="textarea"` aliases initialize the same component.

{{< mtx-demo title="Label from placeholder and aliases" >}}
<input data-mtx="input" placeholder="Email" type="email" />
<textarea data-mtx="textarea" data-label="Comment"></textarea>
{{< /mtx-demo >}}

## Variants

`outlined` (default, with border and notch), `filled` (background and bottom line) and `standard` (bottom line only). The `no-label` variant draws a full border with no label or notch, intended for search boxes and filters.

{{< mtx-demo title="Variants" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="text-field" data-label="Outlined" data-variant="outlined" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="text-field" data-label="Filled" data-variant="filled" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="text-field" data-label="Standard" data-variant="standard" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="text-field" data-variant="no-label" data-start-icon="search" placeholder="Search…" aria-label="Search" type="search" />
  </div>
</div>
{{< /mtx-demo >}}

## Sizes

Canonical heights: **medium 56px** (default, MUI), **small 40px** (`data-size="small"` or `data-small`) and **large 48px** (`data-size="large"` or `data-large`). Small lines up 1:1 with a 40px medium Button and large with a 48px large Button.

{{< mtx-demo title="Medium 56px, small 40px and large 48px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Large · 48px" data-size="large" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Filled large" data-variant="filled" data-size="large" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Medium · 56px" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Small · 40px" data-size="small" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Filled small" data-variant="filled" data-size="small" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Standard small" data-variant="standard" data-size="small" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Alignment with Button (40px)" layout="block" >}}
<div data-mtx="grid" data-spacing="2" data-align="center">
  <div data-mtx="grid" data-xs="8">
    <input data-mtx="text-field" data-label="Coupon" data-size="small" type="text" />
  </div>
  <div data-mtx="grid" data-xs="4">
    <button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button" type="button">Apply</button>
  </div>
</div>
{{< /mtx-demo >}}

## With icons

`data-start-icon` and `data-end-icon` accept the name of a Material Icons glyph or an image URL (`http(s)://`, `/`, `./`, `../`, `data:image/` or a `.png`, `.jpg`, `.svg`, `.webp`, `.gif`, `.avif` or `.ico` extension). With a start icon, the label shifts to align with the typed text.

{{< mtx-demo title="No icon, start, end, both and image" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="No icon" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Username" data-start-icon="account_circle" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Password" data-end-icon="lock" type="password" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Amount" data-start-icon="payments" data-end-icon="info" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Phone" data-start-icon="https://flagcdn.com/w20/co.png" type="tel" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Filled with icon" data-variant="filled" data-start-icon="email" type="email" />
  </div>
</div>
{{< /mtx-demo >}}

## Interactive adornments

They are the equivalent of MUI's `InputAdornment` + `IconButton`. `data-password-toggle` (only on `type="password"`) adds an end IconButton that shows or hides the password: it toggles `aria-pressed`, swaps the icon (`visibility` / `visibility_off`) and has a translated accessible name ("Show password"). Masks, the counter and validation keep working. For other actions, `data-start-action` / `data-end-action` take the icon name and `data-start-action-label` / `data-end-action-label` its accessible name; clicking them fires `mtx:text-field:adornment-click`. The button's icon sits exactly where a static icon would, so the label stays aligned with the text. Inside `.mtx-text-field`, the browser's native clear button for `type="search"` (and Edge's password reveal when there is a password toggle) is hidden, so only the library action is shown.

{{< mtx-demo title="Show password and actions" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Password" type="password" data-password-toggle autocomplete="new-password" data-helper-text="At least 8 characters" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Password" data-variant="filled" data-start-icon="lock" type="password" data-password-toggle autocomplete="new-password" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="PIN" type="password" data-password-toggle maxlength="6" inputmode="numeric" autocomplete="off" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input id="doc-tf-clear" data-mtx="text-field" data-label="Search" data-start-icon="search" data-end-action="close" data-end-action-label="Clear search" value="Materix" type="search" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Location" data-variant="standard" data-start-action="my_location" data-start-action-label="Use my location" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

```javascript
document.addEventListener('mtx:text-field:adornment-click', (event) => {
  const { position, input } = event.detail;
  if (input.id === 'doc-tf-clear' && position === 'end') {
    Materix.getInstance(input).value = '';
    input.focus();
  }
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('mtx:text-field:adornment-click', function (event) {
    var input = event.detail.input;
    if (input.id === 'doc-tf-clear' && event.detail.position === 'end') {
      Materix.getInstance(input).value = '';
      input.focus();
    }
  });
});
</script>

{{< callout type="tip" title="Button label" >}}
The password button keeps a fixed name and uses `aria-pressed` for its state (toggle button pattern) instead of changing its text. Override the name with `data-password-toggle-label` (for example "Show passwords" when the button controls several fields).
{{< /callout >}}

## Colors

`data-color` changes the color of the label, border and focus line: `primary` (default), `secondary`, `success`, `warning` and `info`. Click each field to see it.

{{< mtx-demo title="Focus colors" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Primary" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Secondary" data-color="secondary" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Success" data-color="success" data-variant="filled" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Warning" data-color="warning" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Info" data-color="info" data-variant="standard" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## States

States are expressed with native attributes (`disabled`, `readonly`, `required`) or with `data-error`: with text (`data-error="message"`) it paints the field red, replaces the helper text with the message and sets `aria-invalid="true"`; empty (or `"true"`) it turns on the error while keeping the helper text, like MUI's boolean `error` prop. `required` adds the asterisk to the label. Hover to see the *hover* state and press <kbd>Tab</kbd> for focus.

{{< mtx-demo title="Helper text, error, required, disabled and read-only" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="With helper text" data-helper-text="Exactly as it appears on your ID" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Email" data-error="Enter a valid email address" value="ana@" type="email" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Required" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Disabled" value="Not editable" disabled type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Read-only" value="ID-2026-0042" readonly type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Filled with error" data-variant="filled" data-error="This field is required" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Phone" data-helper-text="The helper text turns red" data-error value="12" type="tel" />
  </div>
</div>
{{< /mtx-demo >}}

## Static, hidden and borderless label

BEM modifiers applied by putting the class on the `<input>` itself (it is transferred to the container):

- `mtx-text-field--static-label`: the label always stays on top and the `placeholder` is visible (equivalent to MUI's `shrink`).
- `mtx-text-field--hidden-label`: hides the label and the notch; add an `aria-label`.
- `mtx-text-field--borderless`: outlined without a border, to integrate the field inside a Paper or a bar.

{{< mtx-demo title="Label and border modifiers" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input class="mtx-text-field--static-label" data-mtx="text-field" data-label="Static label" placeholder="Type here" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input class="mtx-text-field--hidden-label" data-mtx="text-field" data-label="City" placeholder="City" aria-label="City" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input class="mtx-text-field--borderless" data-mtx="text-field" data-variant="no-label" data-start-icon="search" placeholder="Borderless search" aria-label="Search" type="search" />
  </div>
</div>
{{< /mtx-demo >}}

## Multiline and auto-resize

Use a `<textarea>` (or `data-multiline` on an `<input>`, which is converted into a `<textarea>`). `rows`/`data-rows` sets the initial rows (3 by default). With `data-auto-resize` the field grows as you type; `data-max-rows` limits the growth and enables vertical scrolling beyond that number of rows.

{{< mtx-demo title="Textarea" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Fixed rows (rows=3)" rows="3"></textarea>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Auto-resize" data-auto-resize rows="2" data-helper-text="Grows as you type"></textarea>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Auto-resize up to 5 rows" data-variant="filled" data-auto-resize data-max-rows="5" rows="2"></textarea>
  </div>
</div>
{{< /mtx-demo >}}

## Counters and limits

`data-counter` shows a counter in the bottom-right corner: `characters`, `words` or `both`. The `data-max-characters` (or `maxlength`) and `data-max-words` limits trigger the error state when exceeded. If you only set a limit, the counter type is inferred from it.

{{< mtx-demo title="Characters, words and both" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="text-field" data-label="Title" data-counter="characters" data-max-characters="25" data-helper-text="25 characters max" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Summary" data-max-words="15" data-helper-text="15 words max" rows="3"></textarea>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <textarea data-mtx="text-field" data-label="Comment" data-counter="both" data-max-words="30" data-max-characters="150" rows="3"></textarea>
  </div>
</div>
{{< /mtx-demo >}}

Counter format: `n / max` with a limit, `n` (characters) or `n words` without a limit, and `p/max words | c/max chars` in `both` mode. The suffixes follow the component locale (`data-locale`, `lang` or `Materix.setLocale()`); in Spanish they read `n palabras` and `p/max pal. | c/max car.`. Override them with `Materix.updateLocale('en', { textField: { counterWords: '{count} words' } })`.

## Input masks

`data-mask` formats the value as you type and preserves the caret position. Pattern tokens: `0` digit, `a` letter (lowercased), `A` letter (uppercased), `*` alphanumeric; any other character is a literal that is inserted automatically.

| Preset | Pattern |
| :--- | :--- |
| `credit-card` | `0000 0000 0000 0000` |
| `date` | `00/00/0000` |
| `date-short` | `00/00` |
| `time` | `00:00` |
| `time-ampm` | `00:00 AA` |
| `time-seconds` | `00:00:00` |
| `phone` | `(000) 000-0000` |
| `phone-intl` | `+00 (000) 000-0000` |
| `cpf` | `000.000.000-00` |
| `cnpj` | `00.000.000/0000-00` |
| `zip` | `00000-000` |
| `postal-code` | `00000-0000` |

{{< mtx-demo title="Patterns and presets" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Phone" data-mask="phone" data-start-icon="phone" type="tel" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="Card" data-mask="credit-card" data-start-icon="credit_card" inputmode="numeric" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <input data-mtx="text-field" data-label="License plate" data-mask="AAA-000" data-helper-text="Pattern AAA-000" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

With `data-mask="currency"` (alias `money`) the value is typed right to left as an amount. It is configured with `data-currency-prefix` (default `"$ "`), `data-currency-suffix` (`""`), `data-thousands` (`","`), `data-decimal` (`"."`) and `data-precision` (`2`).

{{< mtx-demo title="Currency" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Price (USD)" data-mask="currency" inputmode="numeric" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Amount (EUR)" data-mask="currency" data-currency-prefix="" data-currency-suffix=" €" data-thousands="." data-decimal="," inputmode="numeric" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

Read the clean value with `field.unmaskedValue` (`"3001234567"`, `"1250.50"`) and check whether the pattern is complete with `field.isMaskComplete`.

## Validation

The component does not validate by itself: combine the native validation API (`required`, `type`, `pattern`, `checkValidity()`) with `setError()` and `clearError()`.

{{< mtx-demo title="Validate on submit" layout="block" >}}
<form class="doc-tf-validate" novalidate>
  <div data-mtx="grid" data-spacing="2" data-align="flex-start">
    <div data-mtx="grid" data-xs="12" data-sm="8">
      <input id="doc-tf-email" data-mtx="text-field" data-label="Email" data-helper-text="We'll send you the confirmation" required type="email" />
    </div>
    <div data-mtx="grid" data-xs="12" data-sm="4">
      <button class="mtx-button mtx-button--contained mtx-button--large mtx-button--full-width" data-mtx="button" type="submit">Validate</button>
    </div>
  </div>
</form>
{{< /mtx-demo >}}

```javascript
const field = Materix.getInstance(document.getElementById('doc-tf-email'));
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (field.input.checkValidity()) field.clearError();
  else field.setError(field.value ? 'Invalid email address' : 'Email is required');
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.doc-tf-validate');
  const input = document.getElementById('doc-tf-email');
  if (!form || !input || !window.Materix) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const field = Materix.getInstance(input);
    if (!field) return;
    if (field.input.checkValidity()) field.clearError();
    else field.setError(field.value ? 'Invalid email address' : 'Email is required');
  });
});
</script>

## Real-world examples

A sign-up form in a grid combining variants, icons, a mask, a counter and a Button.

{{< mtx-demo title="Sign up" layout="block" >}}
<form data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="First name" data-start-icon="person" autocomplete="given-name" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Last name" autocomplete="family-name" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Email" data-start-icon="email" autocomplete="email" required type="email" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="text-field" data-label="Phone" data-mask="phone" data-start-icon="phone" autocomplete="tel" type="tel" />
  </div>
  <div data-mtx="grid" data-xs="12">
    <textarea data-mtx="text-field" data-label="About you" data-max-characters="200" data-auto-resize rows="2"></textarea>
  </div>
  <div data-mtx="grid" data-xs="12">
    <div class="mtx-d-flex mtx-justify-content-end mtx-gap-1">
      <button class="mtx-button mtx-button--text" data-mtx="button" type="reset">Cancel</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Create account</button>
    </div>
  </div>
</form>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or full control of the markup. The component reuses the existing nodes and only adds what is missing (the notch `fieldset` in outlined, the counter…).

```html
<div class="mtx-text-field mtx-text-field--outlined mtx-text-field--adorned-start" data-mtx="text-field">
  <label class="mtx-text-field__label" for="email">Email</label>
  <div class="mtx-text-field__container">
    <span class="mtx-text-field__adornment mtx-text-field__adornment--start material-icons" aria-hidden="true">email</span>
    <input class="mtx-text-field__input" id="email" type="email" placeholder=" " />
    <!-- fieldset.mtx-text-field__outline > legend.mtx-text-field__legend > span (generated by the JS) -->
  </div>
  <div class="mtx-text-field__supporting-text">
    <span class="mtx-text-field__helper-text">We'll never share your email</span>
    <span class="mtx-text-field__counter" aria-live="polite"></span>
  </div>
</div>
```

`placeholder=" "` is required in manual markup for the label to float correctly.

## Programmatic usage

Components with `data-mtx` initialize themselves on page load. For dynamic content:

```javascript
// A specific element (detects data-mtx or forces the name)
const field = Materix.init(document.getElementById('first-name'), 'text-field');

// Direct instance
const other = new Materix.TextField(document.querySelector('#last-name'));

// Retrieve the instance (works with the original <input> or the generated container)
const same = Materix.getInstance(document.getElementById('first-name'));

// Initialize a whole container inserted via AJAX/SPA (idempotent)
Materix.initAll(document.getElementById('signup-form'));
```

With ES modules:

```javascript
import { TextField, init, initAll, getInstance } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="Live API" >}}
<input id="doc-tf-api" data-mtx="text-field" data-label="Controlled field" data-mask="currency" data-helper-text="Try the buttons" type="text" />
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="value">unmaskedValue = 125000</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="error">setError()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="clear">clearError()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="toggle">disable() / enable()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-tf="focus">focus()</button>
<output id="doc-tf-api-out">unmaskedValue: —</output>
{{< /mtx-demo >}}

```javascript
const field = Materix.getInstance(document.getElementById('doc-tf-api'));
field.unmaskedValue = '125000';   // shows "$ 1,250.00"
field.setError('Amount out of range');
field.clearError();
field.disabled ? field.enable() : field.disable();
field.focus();
console.log(field.value, field.unmaskedValue, field.isMaskComplete);
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('doc-tf-api');
  const out = document.getElementById('doc-tf-api-out');
  if (!input || !window.Materix) return;
  const field = Materix.getInstance(input);
  if (!field) return;
  const report = () => { out.textContent = 'value: "' + field.value + '" · unmaskedValue: "' + field.unmaskedValue + '" · isMaskComplete: ' + field.isMaskComplete; };
  field.input.addEventListener('input', report);
  document.querySelectorAll('[data-doc-tf]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-doc-tf');
      if (action === 'value') field.unmaskedValue = '125000';
      if (action === 'error') field.setError('Amount out of range');
      if (action === 'clear') field.clearError();
      if (action === 'toggle') { if (field.disabled) field.enable(); else field.disable(); }
      if (action === 'focus') field.focus();
      report();
    });
  });
});
</script>

## API reference

### Data attributes

They can be set on the `<input>`/`<textarea>` (simplified syntax) or on the `.mtx-text-field` container.

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `text-field` \| `input` \| `textarea` | — | Initializes the component (the three names are equivalent). |
| `data-label` | text | `placeholder` | Floating label text. The `label` attribute is also accepted. If missing, `placeholder` is used. |
| `data-variant` | `outlined` \| `filled` \| `standard` \| `no-label` | `outlined` | Visual variant. `no-label` = outlined without label or notch. |
| `data-size` | `small` \| `medium` \| `large` | `medium` | `small` = 40px, `medium` = 56px, `large` = 48px. `compact` is also an alias of `small`. |
| `data-small` / `data-large` | boolean | — | Shortcuts for `data-size="small"` / `"large"`. |
| `data-color` | `primary` \| `secondary` \| `success` \| `warning` \| `info` | `primary` | Focus color of the label, border and line. |
| `data-start-icon` | icon \| URL | — | Material Icons glyph or image at the start. |
| `data-end-icon` | icon \| URL | — | Material Icons glyph or image at the end. |
| `data-helper-text` | text | — | Helper text below the field (linked with `aria-describedby`). |
| `data-error` | text \| empty \| `true` \| `false` | — | Starts in the error state. With text, the message replaces the helper text; empty or `true`, error without a message (the helper text turns red); `false`, no effect. |
| `data-password-toggle` | boolean \| `false` | — | On `type="password"`, adds the end show/hide IconButton (takes precedence over `data-end-icon` and `data-end-action`). |
| `data-password-toggle-label` | text | i18n `textField.showPassword` | Accessible name of the password button. |
| `data-start-action` / `data-end-action` | icon | — | Creates a start / end IconButton with that Material Icon that fires `mtx:text-field:adornment-click`. |
| `data-start-action-label` / `data-end-action-label` | text | — | Accessible name (`aria-label`) of the action button. Required in practice. |
| `data-multiline` | boolean | — | Converts the `<input>` into a `<textarea>`. A `<textarea>` is already multiline. |
| `data-rows` | number | `3` | Initial rows if the element has no `rows`. |
| `data-auto-resize` | boolean \| `false` | disabled | Fits the height to the content. Aliases: `data-autoresize`, `data-autosize`. |
| `data-max-rows` | number | — | Maximum rows with auto-resize; beyond that a scrollbar appears. |
| `data-counter` | `characters` \| `words` \| `both` | inferred | Shows the counter. If omitted and there is a limit, it is chosen based on the limit. |
| `data-max-characters` | number | `maxlength` | Character limit (alias `data-max-chars`). Exceeding it triggers the error. |
| `data-max-words` | number | — | Word limit. Exceeding it triggers the error. |
| `data-mask` | pattern \| preset \| `currency` \| `money` | — | Input mask (see the presets table). |
| `data-currency-prefix` | text | `"$ "` | Currency mask prefix. |
| `data-currency-suffix` | text | `""` | Currency mask suffix. |
| `data-thousands` | character | `","` | Thousands separator. |
| `data-decimal` | character | `"."` | Decimal separator. |
| `data-precision` | number | `2` | Number of decimal places. |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-text-field` | Root container. |
| `mtx-text-field--outlined` / `--filled` / `--standard` | Variants. |
| `mtx-text-field--no-label` | Outlined without label or notch. |
| `mtx-text-field--small` / `--medium` / `--large` | Height 40px / 56px / 48px. |
| `mtx-text-field--secondary` / `--success` / `--warning` / `--info` | Focus color. |
| `mtx-text-field--error` | Error state. |
| `mtx-text-field--has-value` | The field has a value (the label floats). Managed by the JS. |
| `mtx-text-field--adorned-start` / `--adorned-end` | There is a start / end icon. Managed by the JS. |
| `mtx-text-field--multiline` | Multiline field. |
| `mtx-text-field--auto-resize` | Multiline with automatic height. |
| `mtx-text-field--select` | Wraps a native `<select>` (adds the chevron). |
| `mtx-text-field--static-label` | Label always on top and `placeholder` visible. |
| `mtx-text-field--hidden-label` | Hides the label and notch. |
| `mtx-text-field--borderless` | Outlined without a border. |
| `mtx-text-field--full-width` | Takes up 100% of the width. |
| `mtx-text-field--margin-dense` / `--margin-normal` | MUI vertical margins (8/4px and 16/8px). |
| `mtx-text-field__label` | Floating label. |
| `mtx-text-field__container` | Field box (background and border). |
| `mtx-text-field__input` | `<input>`, `<textarea>` or `<select>`. |
| `mtx-text-field__adornment` / `--start` / `--end` / `--image` | Icons or images. |
| `mtx-text-field__adornment--action` | Adornment holding an IconButton (offsets its size to keep the alignment). |
| `mtx-text-field__action` / `--start` / `--end` | IconButton generated by `data-password-toggle` or `data-*-action`. |
| `mtx-text-field__outline` / `__legend` | Notch `fieldset` and `legend` (outlined). |
| `mtx-text-field__supporting-text` | Bottom row with helper text and counter. |
| `mtx-text-field__helper-text` | Helper or error text. |
| `mtx-text-field__counter` / `--error` | Counter and its over-the-limit state. |
| `mtx-text-field__chevron` | Arrow of a wrapped `<select>`. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `value` (get/set) | `string` | Field value. With a mask, the assigned value is formatted. |
| `unmaskedValue` (get/set) | `string` | Unformatted value (`"1250.50"` for currency). Formatted when assigned. |
| `isMaskComplete` (get) | `boolean` | `true` if every slot in the pattern is filled (or the amount is greater than 0). Without a mask, `true`. |
| `disabled` (get) | `boolean` | Whether the field is disabled. |
| `disable()` | `void` | Disables the field. |
| `enable()` | `void` | Enables the field. |
| `focus()` | `void` | Focuses the field. |
| `blur()` | `void` | Removes focus. |
| `setError(message)` | `void` | Sets the error state with the given message; `true` = error without a message (keeps the helper text); empty string or `false` = `clearError()`. |
| `clearError()` | `void` | Clears the error and restores the helper text. |
| `togglePasswordVisibility(force?)` | `boolean` | Shows (`true`) or hides (`false`) the password, or toggles without an argument. Returns whether it is visible. Requires `data-password-toggle`. |
| `passwordVisible` (get) | `boolean` | `true` when the password is shown in plain text. |
| `destroy()` | `void` | Removes every listener (input, action buttons, locale change) and pending timers. Unlinks the instance: `getInstance()` then returns `undefined`. The generated DOM stays, so `initAll()` re-attaches to it without wrapping the input again. |

Useful read-only properties: `element` (container), `input` (native control), `label`, `container`.

### Events

Besides the native control events (`field.input`), the container fires these events (bubbling):

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `input` | — (native) | The user types. With a mask, the value is already formatted. |
| `change` | — (native) | The value changes and the field loses focus. |
| `focus` / `blur` | — (native) | The field gains or loses focus. |
| `mtx:text-field:password-visibility` | `{ visible }` | The password is shown or hidden. |
| `mtx:text-field:adornment-click` | `{ position, button, input }` | A `data-start-action` / `data-end-action` button is clicked. |

Deprecated aliases: `mtx:password-visibility` and `mtx:adornment-click` are still dispatched with the same `detail` until 1.0.

### CSS variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--mtx-tf-color` | `var(--mtx-color-primary)` | Focus color of an instance (changed by `data-color` and the error state). |
| `--mtx-field-height-medium` | `56px` | Medium height. |
| `--mtx-field-height-small` | `40px` | Small height. |
| `--mtx-size-large-height` | `48px` | Large height. |
| `--mtx-control-height-borderless` | `56px` | Minimum height of the borderless variant. |
| `--mtx-color-input-filled` / `--mtx-color-input-filled-hover` | theme | Background of the filled variant. |

## Accessibility

- The generated label is a `<label for>` associated with the control's `id` (if it has no `id`, one is generated).
- The helper text and the error text are linked with `aria-describedby`, preserving any ids the field already had.
- The error state (via `setError()`, `data-error` or exceeding a limit) sets `aria-invalid="true"`.
- The counter uses `aria-live="polite"` to announce changes.
- Generated icons carry `aria-hidden="true"`. In `no-label` and `hidden-label` there is no visible label: add an `aria-label`.
- `required` adds the visual asterisk; the native attribute already announces it to screen readers.
- The password button is a `<button type="button">` with a translated `aria-label`, `aria-pressed` (state) and `aria-controls` (input id); a mouse click does not steal focus from the field, and it is disabled together with the field.
- `data-*-action` buttons need `data-*-action-label`: it is their only accessible name.
- `data-dialog-autofocus` / `data-drawer-autofocus` on the `<input data-mtx="text-field">` focus the field itself when the [Dialog]({{< relref "/components/dialog" >}}) or Drawer opens, even though the attribute is also copied to the generated wrapper.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next or previous field. |
| Text keys | Type into the field; with a mask, literals are inserted automatically and invalid characters are discarded. |
| <kbd>Enter</kbd> | In a `<textarea>`, a new line; in an `<input>`, submits the form (native). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on an adornment button | Shows or hides the password or runs the action. |
