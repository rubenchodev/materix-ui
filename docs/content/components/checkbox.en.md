---
title: "Checkbox"
description: "A box for selecting one or more options from a list or confirming a condition; supports an indeterminate state."
group: "inputs"
icon: "check_box"
weight: 40
example: "checkbox"
import: "Checkbox"
mui: "https://mui.com/material-ui/react-checkbox/"
---

**Checkbox** lets users select zero, one or several options from a set, or confirm a condition ("I accept the terms"). It renders a native `<input type="checkbox">` inside a `<label class="mtx-checkbox">`, so it works in forms, with the keyboard and with screen readers without extra code. If the option applies a change immediately, use a [Switch](../switch/); if only one option can be chosen, use [Radio](../radio/).

{{< callout type="tip" title="Checkbox, Switch or Radio?" >}}
| Component | When to use it |
| :--- | :--- |
| **Checkbox** | Several independent options, or a confirmation applied when a form is submitted. |
| **Switch** | Turning a preference on/off with an immediate effect, without a "Save" button. |
| **Radio** | Choosing exactly one option from a small, visible group. |
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Checkbox } from '@rubenchodev/materix-react';

<Checkbox label="Remember me" defaultChecked />
```

## Basic usage

One element with `label` is enough: the component renders the wrapping `<label>`, the native input, the visual box and the text. Native props (`id`, `name`, `value`, `required`, `autoFocus`, `form`) go to the `<input>`.

{{< react-demo "checkbox/01-basic" >}}

## Sizes

Two sizes, as in MUI: **medium** (18px box, default) and **small** (16px with 14px text) via `size="small"`, for tables and dense forms.

{{< react-demo "checkbox/02-sizes" >}}

## With and without a label

Without `label`, only the box is rendered. In that case give it an accessible name with `aria-label` or `aria-labelledby` (both are forwarded to the input), for example in a table's selection column.

{{< react-demo "checkbox/03-label" >}}

## Colors

Primary is the default. Use `color` (`secondary`, `success`, `error`, `warning`, `info`) to change the checked color.

{{< react-demo "checkbox/04-colors" >}}

## States

Hover to see the border change color, press to see the ripple, and use <kbd>Tab</kbd> and <kbd>Space</kbd> to focus and check. The native checkbox does not support `readOnly`: to lock a checkbox use `disabled`.

{{< react-demo "checkbox/05-states" >}}

## Helper and error text (FormHelperText)

`helperText` wraps the checkbox in `.mtx-form-control` and adds a `.mtx-form-helper-text` below it, **outside** the `<label>`, linked with `aria-describedby`. `error` adds `aria-invalid="true"` to the input, colors the empty box border and turns the helper red; pass the error message as `helperText`. You can also compose the pieces yourself with [FormControl and FormHelperText](../form-helper-text/): the checkbox inherits `error`/`disabled` and links the helper automatically.

{{< react-demo "checkbox/06-helper-error" >}}

## Indeterminate

The indeterminate state shows that only some child options are checked. As in MUI, `indeterminate` is controlled by the parent: the component keeps the DOM property `input.indeterminate` and `aria-checked="mixed"` in sync with the prop. A user click clears the mixed state, as the browser and vanilla do, until the prop changes again.

{{< react-demo "checkbox/07-indeterminate" >}}

## Grouping

Group related checkboxes under a label so screen readers announce it when entering the group: a `FormControl` with `role="group"` and a `FormLabel` (or a `<fieldset>` with `<legend>`). Use the same `name` to submit them together.

{{< react-demo "checkbox/08-grouping" >}}

## Real-world examples

A sign-in form with a "Remember me" checkbox and a terms confirmation that enables the submit button.

{{< react-demo "checkbox/09-use-cases" >}}

## Grid

With the `Grid` component a long list of options is split into columns: one on mobile, two from 600px and three from 900px.

{{< react-demo "checkbox/10-grid" >}}

## Controlled usage

With `checked` + `onChange` the parent owns the state; the vanilla instance methods become state changes (`toggle()` → `setChecked(!checked)`, `disable()` → `disabled`, `setError()` → `error` + `helperText`) and `focus()` uses `inputRef`.

{{< react-demo "checkbox/11-controlled" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | — | Checked state (controlled). |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled). |
| `onChange` | `(event, checked: boolean) => void` | — | Fired when the user toggles the checkbox. |
| `indeterminate` | `boolean` | `false` | Partial state with `aria-checked="mixed"`. |
| `label` | `ReactNode` | — | Visible text (`.mtx-checkbox__label`). `children` works too. |
| `size` | `'medium' \| 'small'` | `'medium'` | 18px or 16px box. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Checked color. |
| `disabled` | `boolean` | from `FormControl` | Disables the input. |
| `required` | `boolean` | from `FormControl` | Native `required`. |
| `error` | `boolean` | from `FormControl` | `aria-invalid` and error colors. |
| `helperText` | `ReactNode` | — | Helper or error text below the checkbox. |
| `disableRipple` | `boolean` | `false` | Disables the ripple. |
| `id`, `name`, `value`, `form`, `autoFocus` | | — | Forwarded to the `<input>`. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Forwarded to the `<input>`. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref to the native input. |
| `inputProps` | `InputHTMLAttributes` | — | Extra attributes for the native input. |
| `ref` | `Ref<HTMLLabelElement>` | — | Ref to the root `<label>`. |

`className`, `style` and any other attribute go to the root `<label>`. The `<label>` is always rendered inside a stable `.mtx-form-control` (unless it is already inside a `FormControl`), so toggling `helperText` never remounts the input or moves the focus.

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-checkbox` | Root `<label>`. |
| `.mtx-checkbox--small` | Small size. |
| `.mtx-checkbox--{color}` | Palette color (not added for primary). |
| `.mtx-checkbox__input` | Native input (visually hidden, still in the DOM). |
| `.mtx-checkbox__box` | Visual box (hosts the ripple). |
| `.mtx-checkbox__label` | Text. |
| `.mtx-form-control` / `.mtx-form-helper-text` | Wrapper and helper text when `helperText` is set. |

### CSS variables

| Variable | Description |
| :--- | :--- |
| `--mtx-cb-color` | Box color when checked or indeterminate. |
| `--mtx-cb-check` | Check mark color. |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<input type="checkbox" data-mtx="checkbox" data-label="…">` | `<Checkbox label="…" />` |
| `checked` attribute | `defaultChecked` (uncontrolled) or `checked` + `onChange` |
| `data-size="small"` / `data-small` | `size="small"` |
| `data-color="secondary"` | `color="secondary"` |
| `data-indeterminate` / `instance.indeterminate = true` | `indeterminate` |
| `data-helper-text="…"` / `setHelperText()` | `helperText="…"` |
| `data-error="message"` / `setError('message')` | `error` + `helperText="message"` |
| `data-disable-ripple` | `disableRipple` |
| `disable()` / `enable()` | `disabled` |
| `focus()` | `inputRef.current.focus()` |
| `toggle()` / `checked = …` | Update the `checked` state |
| Native `change` event | `onChange(event, checked)` |

## Accessibility

- The native input stays in the DOM: it keeps form submission, `required` and checkbox semantics.
- The whole row (`<label>`) is clickable. Without `label`, use `aria-label` or `aria-labelledby`.
- The checked state comes from the native input (no redundant `aria-checked`); `indeterminate` adds `aria-checked="mixed"`. In uncontrolled mode the input is native (`defaultChecked`), so `form.reset()` restores it.
- The helper text stays **outside** the `<label>` (so it is not merged into the accessible name) and is linked with `aria-describedby`, keeping any ids you pass. `error` adds `aria-invalid="true"`.
- Group related options under a `FormLabel` (`role="group"` + `aria-labelledby`) or a `<fieldset>` with `<legend>`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next / previous checkbox. |
| <kbd>Space</kbd> | Checks or unchecks the focused checkbox. |
