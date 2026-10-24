---
title: "Radio"
description: "Radio button to choose exactly one option from a visible group; RadioGroup reads and sets the group's value."
group: "inputs"
icon: "radio_button_checked"
weight: 50
example: "radio"
import: "Radio, RadioGroup"
mui: "https://mui.com/material-ui/react-radio-button/"
---

**Radio** lets the user choose exactly one option from a small set where it helps to see all the alternatives at once (plan, shipping method, frequency). Each option is a native `<input type="radio">`, so arrow-key navigation and form submission work with no extra code. **RadioGroup** shares a `name` (generated if you omit it), owns the selected value and adds `role="radiogroup"`, a label and helper/error text.

{{< callout type="tip" title="Radio, Select, Checkbox or Switch?" >}}
| You need… | Use |
| :--- | :--- |
| A single option out of 2 to ~6, all visible | **Radio** |
| A single option out of many, or little space | [Select](../select/) / [Native Select](../native-select/) |
| Several independent options | [Checkbox](../checkbox/) |
| To turn a single preference on or off | [Switch](../switch/) |
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Radio, RadioGroup } from '@rubenchodev/materix-react';

<RadioGroup label="Plan" defaultValue="basic">
  <Radio value="basic" label="Basic" />
  <Radio value="pro" label="Professional" />
</RadioGroup>
```

## Basic usage

Wrap the options in a `RadioGroup` with `label` and `defaultValue`. Each `Radio` only needs `value` and `label`.

{{< react-demo "radio/01-basic" >}}

## Sizes

**Medium** (20px circle, default) and **small** (16px) via `size="small"` on each `Radio`.

{{< react-demo "radio/02-sizes" >}}

## Orientation

Options are stacked by default; `row` lays them out horizontally and wraps them when space runs out.

{{< react-demo "radio/03-orientation" >}}

## Colors

`color` on each `Radio` (`secondary`, `success`, `error`, `warning`, `info`); primary is the default.

{{< react-demo "radio/04-colors" >}}

## States

`disabled` on the group disables every option (and sets `aria-disabled` on the radiogroup); `disabled` on a `Radio` disables just that option. `error` on the group sets `aria-invalid` and colors the empty circles.

{{< react-demo "radio/05-states" >}}

## Helper and error (FormHelperText)

`helperText` adds a `.mtx-form-helper-text` below the group, linked with `aria-describedby`. Combine `error` with the message in `helperText` to validate on submit.

{{< react-demo "radio/06-helper-error" >}}

## Accessible grouping

The group needs a name: `label` renders a `FormLabel` linked with `aria-labelledby`; you can also pass `aria-label` or your own `aria-labelledby`.

{{< react-demo "radio/07-accessible-grouping" >}}

## Real-world examples

A shipping method chooser that reads the selected value on submit.

{{< react-demo "radio/08-use-cases" >}}

## Grid

The radios can live in any nested layout (here `Grid`): they keep reading `name` and the selection from the closest `RadioGroup`.

{{< react-demo "radio/09-grid" >}}

## Controlled usage

With `value` + `onChange` the parent owns the selection: `group.value = 'low'` from vanilla becomes `setValue('low')`, `disable()`/`setError()` become props and `focus()` uses `inputRef`.

{{< react-demo "radio/10-controlled" >}}

## API reference

### Radio props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | — | Option value (compared with the group's `value`). |
| `label` | `ReactNode` | — | Visible text (`.mtx-radio__label`). `children` works too. |
| `checked` | `boolean` | from `RadioGroup` | Selected state (controlled). |
| `defaultChecked` | `boolean` | — | Initial state outside a `RadioGroup` (native behavior). |
| `onChange` | `(event, checked: boolean) => void` | — | Fired when the option is selected. |
| `size` | `'medium' \| 'small'` | `'medium'` | 20px or 16px circle. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Color when selected. |
| `disabled` | `boolean` | from `RadioGroup` / `FormControl` | Disables the option. |
| `required` | `boolean` | from `FormControl` | Native `required`. |
| `disableRipple` | `boolean` | `false` | Disables the ripple. |
| `id`, `name`, `form`, `autoFocus`, `aria-*`, `onFocus`, `onBlur` | | — | Forwarded to the `<input>` (`name` is set by the group). |
| `inputRef` / `inputProps` | | — | Ref and extra attributes for the native input. |
| `ref` | `Ref<HTMLLabelElement>` | — | Ref to the root `<label>`. |

### RadioGroup props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string \| null` | — | Selected value (controlled). |
| `defaultValue` | `string \| null` | `null` | Initial value (uncontrolled). |
| `onChange` | `(event, value: string) => void` | — | Fired when an option is selected (`mtx:radio-group:change`). |
| `name` | `string` | auto | Name shared by the radios. |
| `row` | `boolean` | `false` | Horizontal layout. |
| `label` | `ReactNode` | — | Group label (`.mtx-form-label`) linked with `aria-labelledby`. |
| `helperText` | `ReactNode` | — | Helper or error text. |
| `error` | `boolean` | from `FormControl` | `aria-invalid` on the group. |
| `disabled` | `boolean` | from `FormControl` | Disables every radio. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the `role="radiogroup"` element. |

`className`, `style` and other attributes go to the root element of each component. `useRadioGroup()` returns the group context (`name`, `value` — `undefined` when uncontrolled —, `defaultValue`, `disabled`, `onChange`) for custom options. An uncontrolled group uses native `defaultChecked` radios, so `form.reset()` restores `defaultValue`. The group is always rendered inside a stable `.mtx-form-control`.

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-radio` | Root `<label>`. |
| `.mtx-radio--small` / `.mtx-radio--{color}` | Size and color. |
| `.mtx-radio__input` | Native input. |
| `.mtx-radio__box` | Visual circle (hosts the ripple). |
| `.mtx-radio__label` | Text. |
| `.mtx-radio-group` / `.mtx-radio-group--row` | Group and row layout. |
| `.mtx-form-control` / `.mtx-form-label` / `.mtx-form-helper-text` | Wrapper, label and helper of the group. |

### CSS variables

| Variable | Description |
| :--- | :--- |
| `--mtx-rd-color` | Circle border color when selected. |
| `--mtx-rd-check` | Inner dot color. |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<div data-mtx="radio-group" data-name="plan" data-label="Plan">` | `<RadioGroup name="plan" label="Plan">` |
| `<input type="radio" data-mtx="radio" value="a" data-label="A" checked>` | `<Radio value="a" label="A" />` + `defaultValue="a"` on the group |
| `data-row` / `data-direction="row"` | `row` |
| `data-size="small"`, `data-color` | `size="small"`, `color` |
| `data-helper-text`, `data-error="message"` | `helperText`, `error` + `helperText` |
| `group.value` (get/set) | `value` / `onChange` |
| `group.disable()` / `radio.disable()` | `disabled` on the group / on the radio |
| `group.setError()` / `clearError()` | `error` |
| `mtx:radio-group:change` `{ value }` | `onChange(event, value)` |

## Accessibility

- Native inputs share the group `name`: the browser handles mutual exclusion, roving focus and arrow keys.
- RadioGroup renders `role="radiogroup"`; name it with `label`, `aria-label` or `aria-labelledby`. The radio relies on its native state (no `aria-checked`).
- The whole row is clickable; without `label`, use `aria-label` on each `Radio`.
- `error` sets `aria-invalid="true"` on the group and the helper text is linked with `aria-describedby`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Enters the group (on the selected option) or leaves it. |
| <kbd>↓</kbd> / <kbd>→</kbd> | Selects the next option. |
| <kbd>↑</kbd> / <kbd>←</kbd> | Selects the previous option. |
| <kbd>Space</kbd> | Selects the focused option if it is not already selected. |
