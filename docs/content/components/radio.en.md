---
title: "Radio"
description: "Radio button to choose exactly one option from a visible group; RadioGroup reads and sets the group's value."
group: "inputs"
icon: "radio_button_checked"
weight: 50
example: "radio"
mui: "https://mui.com/material-ui/react-radio-button/"
---

**Radio** lets the user choose exactly one option from a small set where it helps to see all the alternatives at once (plan, shipping method, frequency). Each option is a native `<input type="radio">`, so mutual exclusion by `name`, arrow-key navigation and form submission work with no extra code. **RadioGroup** is the optional container that stacks the options and exposes the selected value.

{{< callout type="tip" title="Radio, Select, Checkbox or Switch?" >}}
| You need… | Use |
| :--- | :--- |
| A single option out of 2 to ~6, all visible | **Radio** |
| A single option out of many, or little space | [Select](../select/) / [Native Select](../native-select/) |
| Several independent options | [Checkbox](../checkbox/) |
| To turn a single preference on or off | [Switch](../switch/) |
{{< /callout >}}

## Basic usage

Each option is written as a single input with `data-mtx="radio"`, `data-label` and the same `name`. Wrap them in `data-mtx="radio-group"` to stack them and read the group's value.

{{< mtx-demo title="Basic usage" layout="block" >}}
<div data-mtx="radio-group" data-name="plan" aria-label="Plan">
  <input type="radio" data-mtx="radio" name="plan" value="basic" data-label="Basic" checked />
  <input type="radio" data-mtx="radio" name="plan" value="pro" data-label="Professional" />
  <input type="radio" data-mtx="radio" name="plan" value="enterprise" data-label="Enterprise" />
</div>
{{< /mtx-demo >}}

## Sizes

Two sizes: **medium** (20px circle, default) and **small** (16px with 14px text) with `data-size="small"`.

{{< mtx-demo title="Sizes" layout="block" >}}
<div data-mtx="radio-group" data-name="size-demo" data-row="true" aria-label="Sizes">
  <input type="radio" data-mtx="radio" name="size-demo" value="medium" data-label="Medium" checked />
  <input type="radio" data-mtx="radio" name="size-demo" value="small" data-label="Small" data-size="small" />
</div>
{{< /mtx-demo >}}

## Orientation

The group is vertical by default, the easiest layout to scan. With `data-row="true"` the options are laid out in a row (wrapping if they don't fit). Use it with few, short options.

{{< mtx-demo title="In a row" layout="block" >}}
<div data-mtx="radio-group" data-name="size" data-row="true" aria-label="Size">
  <input type="radio" data-mtx="radio" name="size" value="s" data-label="S" />
  <input type="radio" data-mtx="radio" name="size" value="m" data-label="M" checked />
  <input type="radio" data-mtx="radio" name="size" value="l" data-label="L" />
  <input type="radio" data-mtx="radio" name="size" value="xl" data-label="XL" />
</div>
{{< /mtx-demo >}}

## Colors

Primary is the default. Use `data-color` on the input (`secondary`, `success`, `error`, `warning`, `info`) or the `mtx-radio--{color}` class, which is appended to the generated container.

{{< mtx-demo title="Colors" layout="block" >}}
<div data-mtx="radio-group" data-name="colors" data-row="true" aria-label="Colors">
  <input type="radio" data-mtx="radio" name="colors" value="primary" data-label="Primary" checked />
  <input type="radio" data-color="secondary" data-mtx="radio" name="colors" value="secondary" data-label="Secondary" />
  <input type="radio" data-color="success" data-mtx="radio" name="colors" value="success" data-label="Success" />
  <input type="radio" data-color="error" data-mtx="radio" name="colors" value="error" data-label="Error" />
  <input type="radio" data-color="warning" data-mtx="radio" name="colors" value="warning" data-label="Warning" />
  <input type="radio" data-color="info" data-mtx="radio" name="colors" value="info" data-label="Info" />
</div>
{{< /mtx-demo >}}

## States

Hover colors the border, a press shows a centered ripple and keyboard focus a ring. `disabled` dims the option and excludes it from arrow-key navigation.

{{< mtx-demo title="Enabled and disabled" layout="block" >}}
<div data-mtx="radio-group" data-name="state" aria-label="States">
  <input type="radio" data-mtx="radio" name="state" value="a" data-label="Selected" checked />
  <input type="radio" data-mtx="radio" name="state" value="b" data-label="Unselected" />
  <input type="radio" data-mtx="radio" name="state" value="c" data-label="Disabled" disabled />
</div>
{{< /mtx-demo >}}

For a validation error use `data-error` on the group (or `group.setError()`): the radiogroup gets `aria-invalid="true"`, the unchecked circles and the label turn red, and the message is linked with `aria-describedby`. `data-helper-text` adds a permanent hint:

{{< mtx-demo title="Error and helper text" layout="block" >}}
<div data-mtx="radio-group" data-name="source" data-label="How did you hear about us?" data-error="Select an option.">
  <input type="radio" data-mtx="radio" name="source" value="search" data-label="Search engine" required />
  <input type="radio" data-mtx="radio" name="source" value="friend" data-label="Referral" required />
</div>
<div data-mtx="radio-group" data-name="billing" data-label="Billing" data-helper-text="You can change it at any time.">
  <input type="radio" data-mtx="radio" name="billing" value="monthly" data-label="Monthly" checked />
  <input type="radio" data-mtx="radio" name="billing" value="yearly" data-label="Yearly" />
</div>
{{< /mtx-demo >}}

{{< callout type="info" >}}
The native `<input type="radio">` does not support `readonly`. To lock the choice, use `disabled`.
{{< /callout >}}

## Accessible grouping

Every group needs an accessible name. The simplest way is `data-label` on the group: it generates a `.mtx-form-label` and links it with `aria-labelledby`. `<fieldset>` + `<legend>` or your own `aria-label`/`aria-labelledby` also work. RadioGroup adds `role="radiogroup"` automatically (unless the container already declares another `role`).

```html
<span id="theme-label">Theme</span>
<div data-mtx="radio-group" data-name="theme" aria-labelledby="theme-label">
  <input type="radio" data-mtx="radio" name="theme" value="light" data-label="Light" checked />
  <input type="radio" data-mtx="radio" name="theme" value="dark" data-label="Dark" />
</div>
```

## Real-world examples

Shipping method at checkout: a few mutually exclusive options with information worth comparing.

{{< mtx-demo title="Shipping method" layout="block" >}}
<fieldset>
  <legend>Shipping method</legend>
  <div data-mtx="radio-group" data-name="shipping">
    <input type="radio" data-mtx="radio" name="shipping" value="standard" data-label="Standard (3-5 days) · Free" checked />
    <input type="radio" data-mtx="radio" name="shipping" value="express" data-label="Express (24 h) · $6.90" />
    <input type="radio" data-mtx="radio" name="shipping" value="pickup" data-label="In-store pickup · Free" />
  </div>
</fieldset>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or fine-grained control, declare each `<label class="mtx-radio">` with its input, circle and label, and the group with its classes.

```html
<div class="mtx-radio-group" data-mtx="radio-group" data-name="plan" aria-label="Plan">
  <label class="mtx-radio" data-mtx="radio">
    <input type="radio" name="plan" value="basic" checked />
    <span class="mtx-radio__box"></span>
    <span class="mtx-radio__label">Basic</span>
  </label>
  <label class="mtx-radio" data-mtx="radio">
    <input type="radio" name="plan" value="pro" />
    <span class="mtx-radio__box"></span>
    <span class="mtx-radio__label">Professional</span>
  </label>
</div>
```

## Programmatic usage

Get the RadioGroup instance with `Materix.getInstance(container)`. It exposes `value` (read and write) and emits `mtx:radio-group:change` when the user changes the selection. Each Radio is retrieved with `Materix.getInstance(input)`.

```javascript
const groupEl = document.querySelector('#priority');
const group = Materix.getInstance(groupEl);

console.log(group.value);   // 'medium'
group.value = 'high';       // checks the radio with value="high" (emits no events)

groupEl.addEventListener('mtx:radio-group:change', (event) => {
  console.log('New value:', event.detail.value);
});

const radio = Materix.getInstance(document.querySelector('#priority-high'));
radio.checked = true;
radio.disable();
radio.enable();
radio.focus();
```

With ES modules:

```javascript
import { init, getInstance, Radio } from '@rubenchodev/materix-ui';
```

{{< callout type="info" >}}
RadioGroup is exported as `Materix.RadioGroup` (`new Materix.RadioGroup(el)`), in addition to the declarative `data-mtx="radio-group"` or `Materix.init(el, 'radio-group')`. It exposes `value`, `disable()`/`enable()`, `setError()`, `clearError()` and `setHelperText()`.
{{< /callout >}}

{{< mtx-demo title="value and mtx:radio-group:change" layout="column" >}}
<div data-mtx="radio-group" data-name="doc-priority" data-row="true" aria-label="Priority" id="doc-radio-group">
  <input type="radio" data-mtx="radio" name="doc-priority" value="low" data-label="Low" />
  <input type="radio" data-mtx="radio" name="doc-priority" value="medium" data-label="Medium" checked />
  <input type="radio" data-mtx="radio" name="doc-priority" value="high" data-label="High" />
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-radio-set">group.value = 'high'</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var groupEl = document.getElementById('doc-radio-group');
  var group = Materix.init(groupEl);
  var status = groupEl.closest('.doc-demo').querySelector('.doc-demo-status');
  groupEl.addEventListener('mtx:radio-group:change', function (event) {
    if (status) status.textContent = 'mtx:radio-group:change → ' + event.detail.value;
  });
  document.getElementById('doc-radio-set').addEventListener('click', function () {
    group.value = 'high';
    if (status) status.textContent = 'value = ' + group.value;
  });
});
</script>

## API reference

### Data attributes (Radio)

Written on the input (simplified syntax) or on the `<label>` (BEM).

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `radio` | — | Enables auto-initialization. |
| `data-label` | text | — | Creates `.mtx-radio__label`. `label` is also accepted. |
| `data-size` | `small` | medium | Compact size (`mtx-radio--small`). |
| `data-small` | boolean | — | Shortcut for `data-size="small"`. |
| `data-disable-ripple` | boolean | — | Disables the ripple. |
| `data-color` | `primary` \| `secondary` \| `success` \| `error` \| `warning` \| `info` | `primary` | Color of the checked state. |

Preserved native attributes: `id`, `name`, `value`, `checked`, `disabled`, `required`, `aria-*`.

### Data attributes (RadioGroup)

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `radio-group` | — | Enables initialization. |
| `data-name` | text | — | `name` of the radios in the group (`name` is also accepted). If omitted, the group considers all of its radios. |
| `data-row` | boolean | vertical | Lays the options out in a row (`mtx-radio-group--row`). `data-row="false"` turns it off. |
| `data-label` | text | — | Creates the group label (`.mtx-form-label`) and links it with `aria-labelledby` when there is no name yet. |
| `data-direction` | `row` | vertical | Alias of `data-row`. |
| `data-helper-text` | text | — | Helper text below the group (`aria-describedby` on the radiogroup). |
| `data-error` | text \| empty \| `true` | — | Group error: `aria-invalid="true"` on the radiogroup, red circles and label. |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-radio` | `<label>` container. |
| `mtx-radio__input` | Invisible, overlaid native input (added by the JS). |
| `mtx-radio__box` | 20px visual circle with the center dot. |
| `mtx-radio__label` | Option text. |
| `mtx-radio--small` | 16px circle and 14px text. |
| `mtx-radio--secondary`, `--success`, `--error`, `--warning`, `--info` | Color of the checked state. |
| `mtx-radio-group` | Group container (column; each option takes a 42px row like MUI). |
| `mtx-form-control` | Generated (or hand-written) wrapper grouping the control and `.mtx-form-helper-text`; `--error` / `--disabled` reflect the state. |
| `mtx-form-helper-text` / `--error` | Helper or error text (MUI FormHelperText). |
| `mtx-radio-group--row` | Group in a row with a 16px gap. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `Radio.checked` (get/set) | `boolean` | Checked state of the input. |
| `Radio.disable()` / `enable()` | `void` | Toggles the input's `disabled`. |
| `Radio.disabled` (getter) | `boolean` | Disabled state. |
| `Radio.focus()` | `void` | Focuses the input. |
| `Radio.input` (property) | `HTMLInputElement` | Native input. |
| `Radio.destroy()` | `void` | Removes the ripple listener. |
| `RadioGroup.value` (get/set) | `string` | Value of the checked radio (`''` if none); setting it checks the radio with that `value`. |
| `RadioGroup.disable()` / `enable()` | `void` | Disables/enables every radio in the group and syncs `aria-disabled`. |
| `RadioGroup.disabled` (getter) | `boolean` | `true` when every radio is disabled. |
| `RadioGroup.setHelperText(text)` / `setError(message?)` / `clearError()` | `void` | Group helper and error text (FormHelperText). |
| `RadioGroup.error` (getter) | `boolean` | Whether the group is in the error state. |
| `RadioGroup.destroy()` | `void` | Removes the change listener. |

### Events

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `mtx:radio-group:change` (on the RadioGroup, bubbles) | `{ value: string }` | The user selects another option in the group. Not fired when `value` or `checked` are set from code. |
| `change` (native, on the input) | — | The user selects that radio. |

Deprecated alias: `mtx:change` is still dispatched with the same `detail` until 1.0.

### CSS variables

| Variable | Use in Radio |
| :--- | :--- |
| `--mtx-color-{color}` | Border and dot in the checked state. |
| `--mtx-color-text-secondary` | Unchecked border. |
| `--mtx-color-text-primary`, `--mtx-type-body1` | Label. |
| `--mtx-color-action-disabled`, `--mtx-color-text-disabled` | Disabled state. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-rd-color`, `--mtx-rd-check` | Local variables (border and dot) for customization. |

## Accessibility

- Native inputs are grouped by `name`: the browser handles mutual exclusion, roving focus and arrow keys.
- RadioGroup adds `role="radiogroup"` automatically; name it with `data-label`, `<fieldset>`/`<legend>` or `aria-labelledby`. The radio relies on its native state (no `aria-checked` is added).
- The whole row is clickable; without `data-label`, use an `aria-label` on each input.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Enters the group (on the selected option) or leaves it. |
| <kbd>↓</kbd> / <kbd>→</kbd> | Selects the next option. |
| <kbd>↑</kbd> / <kbd>←</kbd> | Selects the previous option. |
| <kbd>Space</kbd> | Selects the focused option if it is not already selected. |
