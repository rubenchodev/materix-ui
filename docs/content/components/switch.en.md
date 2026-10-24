---
title: "Switch"
description: "Toggle that turns an option on or off instantly, like a settings preference; uses role=switch on a native checkbox."
group: "inputs"
icon: "toggle_on"
weight: 60
example: "switch"
import: "Switch"
mui: "https://mui.com/material-ui/react-switch/"
---

**Switch** turns a single option on or off with immediate effect: Wi-Fi, dark mode, notifications. It renders a native `<input type="checkbox" role="switch">` inside a `<label class="mtx-switch">`, so it is announced as "on / off". If the change only applies when a form is submitted, or there are several options to confirm, use a [Checkbox](../checkbox/).

{{< callout type="tip" title="Switch or Checkbox?" >}}
Ask yourself whether the user expects to see the effect **without pressing "Save"**. If the answer is yes, it is a Switch ("Dark mode"). If the value is submitted with a form ("I accept the terms", "Subscribe to the newsletter"), it is a Checkbox.
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Switch } from '@rubenchodev/materix-react';

<Switch label="Wi-Fi" defaultChecked />
```

## Basic usage

One element with `label` is enough: the component renders the `<label>`, the native input, the track with its thumb and the text.

{{< react-demo "switch/01-basic" >}}

## Sizes

**Medium** (34×20px track, default) and **small** (28×16px) via `size="small"`.

{{< react-demo "switch/02-sizes" >}}

## With and without label

Without `label`, only the switch is rendered: give it a name with `aria-label` or `aria-labelledby` (forwarded to the input).

{{< react-demo "switch/03-label" >}}

## Colors

Primary is the default; `color` accepts `secondary`, `success`, `error`, `warning` and `info`.

{{< react-demo "switch/04-colors" >}}

## States

Hover, focus with <kbd>Tab</kbd>, toggle with <kbd>Space</kbd> and press to see the ripple on the thumb. `disabled` blocks the control; `readOnly` keeps it focusable and announced but the user cannot change it (for values managed by an administrator).

{{< react-demo "switch/05-states" >}}

## Helper and error text

`helperText` wraps the switch in `.mtx-form-control` and adds a `.mtx-form-helper-text` below it, linked with `aria-describedby`. `error` adds `aria-invalid="true"`; pass the message as `helperText`. Inside a [FormControl](../form-helper-text/) the switch inherits `error` and `disabled`.

{{< react-demo "switch/06-helper-error" >}}

## Grouping

Group several switches under a `FormControl` with `role="group"` and a `FormLabel` (or a `<fieldset>` with `<legend>`).

{{< react-demo "switch/07-grouping" >}}

## Real-world examples

A preferences panel where each switch applies its change immediately.

{{< react-demo "switch/08-use-cases" >}}

## Grid

Inside a `Grid` the switches are distributed in responsive columns.

{{< react-demo "switch/09-grid" >}}

## Controlled usage

With `checked` + `onChange` the parent owns the state; `toggle()`, `disable()` and `setError()` from vanilla become state changes and `focus()` uses `inputRef`.

{{< react-demo "switch/10-controlled" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | — | On state (controlled). |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled). |
| `onChange` | `(event, checked: boolean) => void` | — | Fired when the user toggles the switch. |
| `label` | `ReactNode` | — | Visible text (`.mtx-switch__label`). `children` works too. |
| `size` | `'medium' \| 'small'` | `'medium'` | Track size. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Color when on. |
| `disabled` | `boolean` | from `FormControl` | Disables the input. |
| `readOnly` | `boolean` | `false` | Focusable but not editable. |
| `required` | `boolean` | from `FormControl` | Native `required`. |
| `error` | `boolean` | from `FormControl` | `aria-invalid` and error colors. |
| `helperText` | `ReactNode` | — | Helper or error text below the switch. |
| `disableRipple` | `boolean` | `false` | Disables the ripple. |
| `id`, `name`, `value`, `form`, `autoFocus` | | — | Forwarded to the `<input>`. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Forwarded to the `<input>`. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref to the native input. |
| `inputProps` | `InputHTMLAttributes` | — | Extra attributes for the native input. |
| `ref` | `Ref<HTMLLabelElement>` | — | Ref to the root `<label>`. |

`className`, `style` and any other attribute go to the root `<label>`, which is always rendered inside a stable `.mtx-form-control` so toggling `helperText` never remounts the input.

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-switch` | Root `<label>`. |
| `.mtx-switch--small` | Small size. |
| `.mtx-switch--{color}` | Palette color (not added for primary). |
| `.mtx-switch__input` | Native input with `role="switch"`. |
| `.mtx-switch__track` | Track. |
| `.mtx-switch__thumb` | Thumb (hosts the ripple). |
| `.mtx-switch__label` | Text. |

### CSS variables

| Variable | Description |
| :--- | :--- |
| `--mtx-sw-color` | Track and thumb color when on. |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<input type="checkbox" data-mtx="switch" data-label="…">` | `<Switch label="…" />` |
| Attribute `checked` | `defaultChecked` or `checked` + `onChange` |
| `data-size="small"` | `size="small"` |
| `data-color="success"` | `color="success"` |
| `readonly` | `readOnly` |
| `data-helper-text` / `setHelperText()` | `helperText` |
| `data-error="message"` / `setError('message')` | `error` + `helperText="message"` |
| `data-disable-ripple` | `disableRipple` |
| `disable()` / `enable()` | `disabled` |
| `toggle()` / `checked = …` | Update the `checked` state |
| `focus()` | `inputRef.current.focus()` |

## Accessibility

- The input keeps its native semantics with `role="switch"`: screen readers announce "switch, on/off" from the native checked state (no redundant `aria-checked`). Uncontrolled switches are native (`defaultChecked`), so `form.reset()` restores them.
- The helper text stays **outside** the `<label>` and is linked with `aria-describedby`; `error` adds `aria-invalid="true"`.
- The whole row is clickable. Without `label`, use `aria-label` or `aria-labelledby`.
- `readOnly` keeps the control focusable and readable without faking a disabled state.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next / previous switch. |
| <kbd>Space</kbd> | Turns the switch on or off (unless `readOnly` or `disabled`). |
