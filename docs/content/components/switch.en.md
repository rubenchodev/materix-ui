---
title: "Switch"
description: "Toggle that turns an option on or off instantly, like a settings preference; uses role=switch on a native checkbox."
group: "inputs"
icon: "toggle_on"
weight: 60
example: "switch"
mui: "https://mui.com/material-ui/react-switch/"
---

**Switch** turns a single option on or off with immediate effect: Wi-Fi, dark mode, notifications. It is a native `<input type="checkbox">` to which the library adds `role="switch"`, so it is announced as "on / off". If the change only applies when a form is submitted, or there are several options to confirm, use a [Checkbox](../checkbox/).

{{< callout type="tip" title="Switch or Checkbox?" >}}
Ask yourself whether the user expects to see the effect **without pressing "Save"**. If the answer is yes, it is a Switch ("Dark mode"). If the value is submitted with a form ("I accept the terms", "Subscribe to the newsletter"), it is a Checkbox.
{{< /callout >}}

## Basic usage

Write only the input with `data-mtx="switch"` and `data-label`. The library generates the track, the thumb and the label inside a `<label class="mtx-switch">` and preserves all of the input's attributes.

{{< mtx-demo title="Basic usage" >}}
<input type="checkbox" data-mtx="switch" data-label="Wi-Fi" checked />
<input type="checkbox" data-mtx="switch" data-label="Bluetooth" />
{{< /mtx-demo >}}

## Sizes

Two sizes, as in MUI: **medium** (34×20px track, default) and **small** (28×16px with 14px text) with `data-size="small"`.

{{< mtx-demo title="Sizes" >}}
<input type="checkbox" data-mtx="switch" data-label="Medium" checked />
<input type="checkbox" data-mtx="switch" data-label="Small" data-size="small" checked />
{{< /mtx-demo >}}

## With and without label

Without `data-label` only the switch is drawn; give it an accessible name with `aria-label` or `aria-labelledby`.

{{< mtx-demo title="Switch only" >}}
<input type="checkbox" data-mtx="switch" aria-label="Auto sync" checked />
<input type="checkbox" data-mtx="switch" aria-label="Auto sync (small)" data-size="small" />
{{< /mtx-demo >}}

## Colors

Primary is the default. Use `data-color` on the input (`secondary`, `success`, `error`, `warning`, `info`) or the `mtx-switch--{color}` class, which is appended to the generated container.

{{< mtx-demo title="Colors" >}}
<input type="checkbox" data-mtx="switch" data-label="Primary" checked />
<input type="checkbox" data-color="secondary" data-mtx="switch" data-label="Secondary" checked />
<input type="checkbox" data-color="success" data-mtx="switch" data-label="Success" checked />
<input type="checkbox" data-color="error" data-mtx="switch" data-label="Error" checked />
<input type="checkbox" data-color="warning" data-mtx="switch" data-label="Warning" checked />
<input type="checkbox" data-color="info" data-mtx="switch" data-label="Info" checked />
{{< /mtx-demo >}}

## States

A press shows a ripple over the thumb, and keyboard focus a ring around the track.

- `disabled`: dims the control and removes it from the tab order.
- `readonly`: the control stays focusable and readable, but the library blocks changes by click or keyboard. Useful for settings managed by an administrator.

{{< mtx-demo title="States" layout="column" >}}
<div>
  <input type="checkbox" data-mtx="switch" data-label="Off" />
  <input type="checkbox" data-mtx="switch" data-label="On" checked />
</div>
<div>
  <input type="checkbox" data-mtx="switch" data-label="Disabled" disabled />
  <input type="checkbox" data-mtx="switch" data-label="Disabled on" checked disabled />
</div>
<div>
  <input type="checkbox" data-mtx="switch" data-label="Read-only (managed)" checked readonly />
</div>
{{< /mtx-demo >}}

## Helper and error text

`data-helper-text` adds a `.mtx-form-helper-text` (FormHelperText) below the switch, linked with `aria-describedby`; `data-error` (empty or with a message) turns on the error state with `aria-invalid="true"`. See the matching section in [Checkbox]({{< relref "/components/checkbox" >}}).

{{< mtx-demo title="Helper and error text" layout="column" >}}
<input type="checkbox" data-mtx="switch" data-label="Automatic backups" data-helper-text="Every night at 02:00." checked />
<input type="checkbox" data-mtx="switch" data-label="Two-step verification" data-error="Required for administrators." />
<input type="checkbox" data-mtx="switch" data-label="Security alerts" data-helper-text="Always on." checked disabled />
{{< /mtx-demo >}}

## Grouping

Group related switches in a `<fieldset>` with a `<legend>`. Each switch remains independent.

{{< mtx-demo title="Preferences group" layout="column" >}}
<fieldset>
  <legend>Notifications</legend>
  <input type="checkbox" name="notify" value="push" data-mtx="switch" data-label="Push notifications" checked />
  <input type="checkbox" name="notify" value="email" data-mtx="switch" data-label="Email digest" />
  <input type="checkbox" name="notify" value="sms" data-mtx="switch" data-label="SMS alerts" />
</fieldset>
{{< /mtx-demo >}}

## Real-world examples

A settings panel where each switch applies the change as soon as it is toggled, with no "Save" button.

{{< mtx-demo title="Settings" layout="column" >}}
<input type="checkbox" data-mtx="switch" data-label="Autoplay videos" checked />
<input type="checkbox" data-mtx="switch" data-label="Show link previews" checked />
<input type="checkbox" data-mtx="switch" data-label="Use mobile data for downloads" />
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or fine-grained control, declare the `<label>` with the input, the track with its thumb, and the label. The library reuses the nodes and adds `role="switch"` to the input.

```html
<label class="mtx-switch mtx-switch--success" data-mtx="switch">
  <input type="checkbox" name="wifi" checked />
  <span class="mtx-switch__track"><span class="mtx-switch__thumb"></span></span>
  <span class="mtx-switch__label">Wi-Fi</span>
</label>
```

## Programmatic usage

`Materix.getInstance()` accepts the input or the generated `<label>`. Changes made from code do not fire events; user interactions emit the input's native `change`.

```javascript
const wifi = Materix.getInstance(document.querySelector('#wifi'));

wifi.checked = true;
wifi.toggle();   // does nothing if disabled or readonly
wifi.disable();
wifi.enable();
wifi.focus();

wifi.input.addEventListener('change', (event) => {
  applyWifi(event.target.checked);
});

// Initialize a dynamically created input
Materix.init(newInput, 'switch');
```

With ES modules:

```javascript
import { init, getInstance, Switch } from 'materix-ui';
const wifi = new Switch(document.querySelector('#wifi'));
```

{{< mtx-demo title="toggle()" >}}
<input type="checkbox" data-mtx="switch" data-label="Controlled switch" id="doc-switch-target" />
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-switch-toggle">toggle()</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('doc-switch-toggle').addEventListener('click', function () {
    Materix.getInstance(document.getElementById('doc-switch-target')).toggle();
  });
});
</script>

## API reference

### Data attributes

Written on the input (simplified syntax) or on the `<label>` (BEM).

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `switch` | — | Enables auto-initialization. |
| `data-label` | text | — | Creates `.mtx-switch__label`. `label` is also accepted. |
| `data-size` | `small` | medium | Compact size (`mtx-switch--small`). |
| `data-small` | boolean | — | Shortcut for `data-size="small"`. |
| `data-disable-ripple` | boolean | — | Disables the ripple. |
| `data-color` | `primary` \| `secondary` \| `success` \| `error` \| `warning` \| `info` | `primary` | Color of the checked state (adds `mtx-{component}--{color}`). |
| `data-helper-text` | text | — | Creates a `.mtx-form-helper-text` below the control inside `.mtx-form-control`, linked with `aria-describedby`. |
| `data-error` | text \| empty \| `true` | — | Error state: `aria-invalid="true"` and red helper text. With text, the message replaces the helper text. |

Relevant native attributes: `checked`, `disabled`, `readonly` (blocks changes), `name`, `value`, `aria-*`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-switch` | `<label>` container. |
| `mtx-switch__input` | Invisible, overlaid native input with `role="switch"` (added by the JS). |
| `mtx-switch__track` | 34×20px track. |
| `mtx-switch__thumb` | 16px thumb that slides when checked. |
| `mtx-switch__label` | Label text. |
| `mtx-switch--small` | 28×16px track and 14px text. |
| `mtx-switch--secondary`, `--success`, `--error`, `--warning`, `--info` | Color of the checked state. |
| `mtx-form-control` | Generated (or hand-written) wrapper grouping the control and `.mtx-form-helper-text`; `--error` / `--disabled` reflect the state. |
| `mtx-form-helper-text` / `--error` | Helper or error text (MUI FormHelperText). |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `checked` (get/set) | `boolean` | Checked state. |
| `toggle()` | `void` | Toggles the state unless it is `disabled` or `readonly`. |
| `disable()` / `enable()` | `void` | Toggles the input's `disabled`. |
| `disabled` (getter) | `boolean` | Disabled state. |
| `focus()` | `void` | Focuses the input. |
| `input` (property) | `HTMLInputElement` | Native input. |
| `setHelperText(text)` | `void` | Creates or changes the helper text (empty removes it). |
| `setError(message?)` | `void` | Turns on the error state (`aria-invalid`); with text, the message replaces the helper text. |
| `clearError()` | `void` | Clears the error and restores the helper text. |
| `error` (getter) | `boolean` | Whether it is in the error state. |
| `destroy()` | `void` | Removes the ripple and read-only listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

Switch emits no events of its own. Use the input's native `change` event (it bubbles), which only fires on user interaction.

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `change` (native) | — (read `event.target.checked`) | The user turns the switch on or off. |

### CSS variables

| Variable | Use in Switch |
| :--- | :--- |
| `--mtx-switch-track` | Unchecked track. |
| `--mtx-switch-thumb` | Unchecked thumb. |
| `--mtx-switch-track-disabled`, `--mtx-switch-thumb-disabled` | Disabled state. |
| `--mtx-color-{color}` | Checked thumb and track (at 50%). |
| `--mtx-elevation-2` | Thumb shadow. |
| `--mtx-color-text-primary`, `--mtx-color-text-disabled`, `--mtx-type-body1` | Label. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-sw-color` | Local variable holding the checked color, for customization. |

## Accessibility

- The input keeps its native semantics and gets `role="switch"`: screen readers announce "switch, on/off". `aria-checked` is kept in sync with `checked` (setter and user changes).
- The helper text stays **outside** the `<label>` (so it is not merged into the accessible name) and is linked with `aria-describedby`, keeping any existing ids. `setError()` adds `aria-invalid="true"` and `clearError()` removes it (only when the library set it).
- The whole row is clickable. Without `data-label`, use `aria-label` or `aria-labelledby`.
- `readonly` keeps the control focusable and readable without faking a disabled state.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next / previous switch. |
| <kbd>Space</kbd> | Turns the switch on or off (unless `readonly` or `disabled`). |
