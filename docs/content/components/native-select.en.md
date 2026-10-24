---
title: "Native Select"
description: "The browser's <select> with MUI styling: lightweight, accessible by default and with the native touch picker on mobile."
group: "inputs"
icon: "arrow_drop_down_circle"
weight: 90
example: "native-select"
import: "NativeSelect"
mui: "https://mui.com/material-ui/react-select/#native-select"
---

`NativeSelect` applies MUI styling to the browser's `<select>` without replacing its menu: the list is drawn by the operating system, which makes it the lightest picker, fast with long lists and comfortable on mobile. Use it in simple forms. If you need search, multiple selection with checkboxes or icons in the options, use [Select](../select/).

{{< callout type="info" title="Select or NativeSelect?" >}}
| Need | [Select](../select/) | NativeSelect |
| :--- | :--- | :--- |
| Menu with MUI styling (Paper, check mark) | Yes | No, uses the system's |
| Search within the menu | Yes | No |
| Comfortable multiple selection | Yes, with checkboxes | Native list (`multiple`, Ctrl/Cmd + click) |
| Icons or images in the options | Yes | No |
| Weight and performance with thousands of options | Medium | Minimal |
| Native touch experience on mobile | Custom menu | System picker |

Rule of thumb: **NativeSelect** for simple forms and long lists on mobile; **Select** when you need search, multiple selection, icons or full visual consistency.
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { NativeSelect } from '@rubenchodev/materix-react';

<NativeSelect label="Age" name="age" defaultValue="20">
  <option value="10">Ten</option>
  <option value="20">Twenty</option>
</NativeSelect>
```

## Basic usage

One element with `label` is enough: the component renders the container, the floating label (associated through `for`/`id`, so the select already has an accessible name), the native `<select>` and the chevron. As in MUI NativeSelect, the default variant is `standard`. Options are written as `<option>`/`<optgroup>` children or passed through the `options` prop.

{{< react-demo "native-select/01-basic" >}}

## Variants

`outlined` (full border), `filled` (background and rounded top corners) and `standard` (bottom line, default) through `variant`.

{{< react-demo "native-select/02-variants" >}}

## Sizes

Medium 56px (default) and small 40px with `size="small"` (it also reduces the text to 14px). The heights match TextField and Select, so a small NativeSelect lines up with a small [TextField](../text-field/) and a medium Button.

{{< react-demo id="native-select/03-sizes" layout="block" >}}

## States

`error` paints the border, label and chevron red and sets `aria-invalid="true"`; `disabled` disables the `<select>`; `required` adds the native attribute and the asterisk to the label. On focus, the border and label switch to the primary color.

{{< react-demo "native-select/04-states" >}}

## Helper and error text

Outside a `FormControl` the field is always wrapped in `.mtx-form-control` (so the select is not remounted and keeps focus when the helper appears); `helperText` adds a [FormHelperText](../form-helper-text/) below it, linked with `aria-describedby`. Combined with `error` it becomes the error message. Inside a `FormControl` the select inherits `error`, `disabled` and `required`.

{{< react-demo "native-select/05-helper-text" >}}

## Groups and multiple selection

`<optgroup>` and `<option disabled>` work natively, also through `options` (an item with `options` becomes an `<optgroup>`). With `multiple` (and `htmlSize` for the visible rows) the browser's list box is shown with the border or background of its variant and no chevron; `value`/`onChange` then use an array.

{{< react-demo id="native-select/06-groups-multiple" layout="block" >}}

## Real-world examples

A quick address form on mobile: the system picker appears when each field is tapped, and the values are submitted with the form.

{{< react-demo "native-select/07-use-cases" >}}

## Select or NativeSelect?

The same data with both components: NativeSelect opens the system menu, while [Select](../select/) draws its own MUI menu with search.

{{< react-demo "native-select/08-comparison" >}}

## Grid

Inside a [Grid](../grid/) each select takes the full width of its column: one per row on mobile, two from 600px and four from 900px.

{{< react-demo "native-select/09-grid" >}}

## Controlled usage

With `value` + `onChange` the parent owns the value; the vanilla instance methods become state changes (`value = …` → `setValue`, `disable()` → `disabled`) and `focus()` uses `inputRef`.

{{< react-demo "native-select/10-controlled" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'standard' \| 'outlined' \| 'filled'` | `'standard'` | Visual variant. |
| `size` | `'medium' \| 'small'` | `'medium'` | 56px or 40px (14px text). |
| `label` | `ReactNode` | — | Floating label associated with the select. |
| `value` | `string \| number \| string[]` | — | Value (controlled); an array with `multiple`. |
| `defaultValue` | `string \| number \| string[]` | — | Initial value (uncontrolled). |
| `onChange` | `(event, value: string \| string[]) => void` | — | Fired when the user picks another option. |
| `options` | `Array<{ value, label, disabled? } \| { label, options, disabled? }>` | — | Options as data; groups become `<optgroup>`. They are rendered before `children`. |
| `multiple` | `boolean` | `false` | Native list box (no chevron). |
| `htmlSize` | `number` | — | Visible rows (native `size` attribute). |
| `error` | `boolean` | from `FormControl` | `aria-invalid` and error colors. |
| `helperText` | `ReactNode` | — | Helper or error text below the field. |
| `disabled` | `boolean` | from `FormControl` | Disables the select. |
| `required` | `boolean` | from `FormControl` | Native `required` and asterisk. |
| `fullWidth` | `boolean` | `true` | Takes the container width (vanilla behavior); `false` adapts to the content. |
| `id`, `name`, `form`, `autoComplete`, `autoFocus` | | — | Forwarded to the `<select>`. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Forwarded to the `<select>`. |
| `inputRef` | `Ref<HTMLSelectElement>` | — | Ref to the native select. |
| `inputProps` | `SelectHTMLAttributes` | — | Extra attributes for the native select. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the root `<div>`. |

`className`, `style` and any other attribute go to the root `<div>`.

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-native-select` | Root container. |
| `.mtx-native-select--outlined` / `--filled` / `--standard` | Variants. |
| `.mtx-native-select--small` | 40px height. |
| `.mtx-native-select--error` | Error state. |
| `.mtx-native-select--multiple` | `<select multiple>` (automatic height, no chevron). |
| `.mtx-native-select--has-label` | A label exists (in filled, the value moves down). |
| `.mtx-native-select__label` | Floating label. |
| `.mtx-native-select__input` | Native `<select>`. |
| `.mtx-native-select__chevron` | Decorative arrow. |
| `.mtx-form-control` / `.mtx-form-helper-text` | Wrapper (always, outside a `FormControl`) and helper text when `helperText` is set. |

### CSS variables

No variables of its own; it uses `--mtx-control-height-outlined|filled|standard` (56px), their `-small` variants (40px), `--mtx-color-input-filled`, `--mtx-color-divider`, `--mtx-color-primary` and `--mtx-color-error`.

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<select data-mtx="native-select" data-label="…">` | `<NativeSelect label="…">` |
| `data-variant="outlined"` | `variant="outlined"` |
| `data-size="small"` / `data-small` | `size="small"` |
| `data-error` | `error` (+ `helperText` for the message) |
| `disabled` / `disable()` / `enable()` | `disabled` |
| `multiple size="4"` | `multiple htmlSize={4}` |
| `selected` on the options | `defaultValue` (uncontrolled) or `value` + `onChange` |
| `instance.value = …` | Update the `value` state |
| `focus()` | `inputRef.current.focus()` |
| Native `change` event | `onChange(event, value)` |

## Accessibility

- It is a real `<select>`: the browser and screen readers announce and handle it natively.
- The `label` is associated with the `<select>` via `for`/`id`, so the accessible name is the label text. Without a label, use `aria-label` or `aria-labelledby`.
- `error` adds `aria-invalid="true"`; `helperText` is linked with `aria-describedby`; the chevron is decorative (`aria-hidden`).

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Focuses the select. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Changes the option (or opens the list, depending on the OS). |
| <kbd>Alt</kbd> + <kbd>↓</kbd> / <kbd>Space</kbd> | Opens the system list. |
| Letters | Jump to the option that starts with that letter. |
| <kbd>Esc</kbd> | Closes the list without changing the value. |
