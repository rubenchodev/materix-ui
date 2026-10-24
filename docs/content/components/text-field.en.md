---
title: "Text Field"
description: "Text field with a floating label, MUI variants, icons, counters, input masks and validation."
group: "inputs"
icon: "edit"
weight: 70
example: "text-field"
import: "TextField"
mui: "https://mui.com/material-ui/react-text-field/"
---

**TextField** lets users enter and edit text in forms: name, email, password, amounts or long comments. It renders the same markup as the vanilla component after initialization: the floating `<label>`, the notched border (*NotchedOutline*, a `fieldset` with `legend`), the icons, the helper text and the counter, around a native `<input>`, `<textarea>` or `<select>`. To choose from a closed set of options use [Select](../select/) or [NativeSelect](../native-select/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { TextField } from '@rubenchodev/materix-react';

<TextField label="Full name" />
```

## Basic usage

A single element with `label` is enough. Native props (`id`, `name`, `type`, `autoComplete`, `required`, `disabled`, `readOnly`, `maxLength`, `autoFocus`…) go to the native control; `className`, `style` and other attributes go to the root `<div>`. Without `label`, the `placeholder` becomes the label (as in vanilla). `multiline` renders a `<textarea>`.

{{< react-demo "text-field/01-basic" >}}

## Variants

`outlined` (default, with border and notch), `filled` (background and bottom line) and `standard` (bottom line only). `variant="no-label"` draws a full border with no label or notch, for search boxes and filters. With `select`, the field wraps a native `<select>` (options as `children`) and adds a single chevron.

{{< react-demo id="text-field/02-variants" layout="block" >}}

## Sizes

**Large** 48px (`size="large"`), **medium** 56px (default) and **small** 40px (`size="small"`). The alignment rows show the field next to components of the same height: TextField small + Button medium (40px), TextField large + Button/IconButton large (48px), TextField medium + FAB (56px).

{{< react-demo id="text-field/03-sizes" layout="block" >}}

## With icons

`startIcon` and `endIcon` accept a Material Icons name (`"email"`), an image URL (rendered as `<img class="mtx-text-field__adornment--image">`) or a node (SVG, Material Symbols). With a start icon, the label is translated exactly 32px so its first letter lines up with the typed text. `startAdornment` and `endAdornment` take free content such as a `$` prefix or a `kg` suffix; as in MUI, a free `startAdornment` keeps the label floated and aligned with the start of the field (the prefix sits where the text would start), in all three variants, because its width is not the 24px of an icon.

{{< react-demo id="text-field/04-icons" layout="block" >}}

## Interactive adornments

The equivalent of MUI's `InputAdornment` + `IconButton`. `passwordToggle` (only with `type="password"`) adds the show/hide button with `aria-pressed`, `aria-controls` and a translated name, and calls `onPasswordVisibilityChange(visible)`; the state can be controlled with `passwordVisible`. `startAction` / `endAction` create an IconButton with the given icon and call `onAdornmentClick({ position, button, input })`; name them with `startActionLabel` / `endActionLabel`. A mouse click does not steal focus from the field, and the buttons are disabled together with it.

{{< react-demo id="text-field/05-adornments" layout="block" >}}

## Colors

`color` changes the focus color (label, border and underline): `primary` (default), `secondary`, `success`, `warning` and `info`. Red is reserved for the error state.

{{< react-demo "text-field/06-colors" >}}

## States

Normal, helper text, error with a message (`error` + `helperText`), error without its own message (the helper turns red), required (asterisk), disabled and read-only. Hover to see the *hover* state and use <kbd>Tab</kbd> to see focus.

{{< react-demo id="text-field/07-states" layout="block" >}}

## Static, hidden and borderless label

`staticLabel` keeps the label on top and the placeholder visible, `hiddenLabel` hides the label and the notch (give an `aria-label`), and `borderless` removes the border. `margin` (`none`, `dense`, `normal`) and `fullWidth` work like in MUI.

{{< react-demo id="text-field/08-label" layout="block" >}}

## Multiline and auto-resize

`multiline` renders a `<textarea>` with `rows` (3 by default). `autoResize` grows the field as you type, and `maxRows` caps the growth before showing a scrollbar. As in MUI, `minRows` or `maxRows` turn auto-resize on by themselves.

{{< react-demo id="text-field/09-multiline" layout="block" >}}

## Counters and limits

`counter="characters" | "words" | "both"` with `maxChars` (or the native `maxLength`) and `maxWords`. A limit alone is enough to show its counter. When the limit is exceeded the field switches to the error state (`aria-invalid="true"`); the counter is announced with `aria-live="polite"` and its texts are translated.

{{< react-demo id="text-field/10-counters" layout="block" >}}

## Input masks

`mask` accepts a pattern (`0` digit, `a` lowercase letter, `A` uppercase letter, `*` alphanumeric; any other character is a literal), a preset (`phone`, `phone-intl`, `credit-card`, `date`, `date-short`, `time`, `time-ampm`, `time-seconds`, `cpf`, `cnpj`, `zip`, `postal-code`) or `currency`, configurable with `currencyOptions` (`prefix`, `suffix`, `thousands`, `decimal`, `precision`). The value is formatted as you type and the caret keeps its position. `onChange` receives the formatted value and `{ unmaskedValue, isMaskComplete }`.

{{< react-demo id="text-field/11-masks" layout="block" >}}

## Validation

Combine native validation (`required`, `type`, `checkValidity()` through `inputRef`) with `error` and `helperText`. Inside a [FormControl](../form-helper-text/), the field inherits `error`, `disabled` and `required` and links the FormControl helper texts with `aria-describedby`. In uncontrolled mode, a form `reset` restores the initial value.

{{< react-demo id="text-field/12-validation" layout="block" >}}

## Grid

A sign-up form with [Grid](../grid/): one column on mobile and two or three on desktop, combining icons, masks, a counter and Buttons.

{{< react-demo id="text-field/13-grid" layout="block" >}}

## Controlled usage

With `value` + `onChange` the parent owns the value. With a mask, `value` can be the raw value (`"125000"`): it is displayed formatted (`"$ 1,250.00"`). The vanilla instance methods become state: `value`/`unmaskedValue = …` → `setValue()`, `setError()`/`clearError()` → `error` + `helperText`, `disable()`/`enable()` → `disabled`, and `focus()` uses `inputRef`. Fields created at runtime are just new elements in the state (the equivalent of `Materix.init()` / `initAll()`).

{{< react-demo id="text-field/14-controlled" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `ReactNode` | — | Floating label; also sizes the notch. |
| `variant` | `'outlined' \| 'filled' \| 'standard' \| 'no-label'` | `'outlined'` | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | medium | 40px, 56px or 48px. |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'info'` | `'primary'` | Focus color. |
| `value` | `string \| number` | — | Value (controlled). |
| `defaultValue` | `string \| number` | — | Initial value (uncontrolled). |
| `onChange` | `(event, value, { unmaskedValue, isMaskComplete }) => void` | — | Fired on every change. |
| `placeholder` | `string` | — | Placeholder; becomes the label when `label` is missing. |
| `helperText` | `ReactNode` | — | Helper or error text below the field. |
| `error` | `boolean` | from `FormControl` | Error state and `aria-invalid`. |
| `disabled` | `boolean` | from `FormControl` | Disables the field and its buttons. |
| `required` | `boolean` | from `FormControl` | Native `required` and asterisk. |
| `readOnly` | `boolean` | `false` | Read-only. |
| `fullWidth` | `boolean` | `false` | 100% width. |
| `margin` | `'none' \| 'dense' \| 'normal'` | `'none'` | Vertical margin. |
| `staticLabel` / `hiddenLabel` / `borderless` | `boolean` | `false` | Label always on top / hidden label / no border. |
| `startIcon` / `endIcon` | `ReactNode` | — | Icon name, image URL or node. |
| `startAdornment` / `endAdornment` | `ReactNode` | — | Free adornment (prefix or suffix). |
| `startAction` / `endAction` | `ReactNode` | — | IconButton icon of an action adornment. |
| `startActionLabel` / `endActionLabel` | `string` | — | Accessible name of the action button. |
| `onAdornmentClick` | `({ position, button, input }) => void` | — | Click on an action button. |
| `passwordToggle` | `boolean` | `false` | Show/hide button (`type="password"`). |
| `passwordToggleLabel` | `string` | translated | Accessible name of the password button. |
| `passwordVisible` / `defaultPasswordVisible` | `boolean` | `false` | Password visibility (controlled / initial). |
| `onPasswordVisibilityChange` | `(visible: boolean) => void` | — | The password is shown or hidden. |
| `multiline` | `boolean` | `false` | Renders a `<textarea>`. |
| `rows` / `minRows` / `maxRows` | `number` | `3` / — / — | Rows; `minRows`/`maxRows` turn auto-resize on. |
| `autoResize` | `boolean` | `false` | Height follows the content. |
| `counter` | `'characters' \| 'words' \| 'both' \| boolean` | — | Counter type. |
| `maxChars` / `maxWords` | `number` | `maxLength` / — | Counter limits (they do not block typing). |
| `mask` | `string` | — | Pattern, preset or `currency`. |
| `currencyOptions` | `Partial<CurrencyMaskOptions>` | `$ ` `,` `.` `2` | Prefix, suffix, separators and precision. |
| `select` | `boolean` | `false` | Native `<select>`; options as `children`. |
| `locale` | `string` | context | Language of the counter and password texts. |
| `id`, `name`, `type`, `autoComplete`, `autoFocus`, `inputMode`, `maxLength`, `minLength`, `form` | | — | Forwarded to the native control. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Forwarded to the native control. |
| `inputRef` | `Ref<HTMLInputElement \| HTMLTextAreaElement \| HTMLSelectElement>` | — | Ref to the native control. |
| `inputProps` | `InputHTMLAttributes` | — | Extra attributes for the native control. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the root `.mtx-text-field`. |

The mask helpers (`resolveMask`, `formatMasked`, `unmaskValue`, `isMaskComplete`, `applyMaskInput`) are exported next to the component (`@rubenchodev/materix-react/components/text-field`).

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-text-field` | Root container. |
| `mtx-text-field--outlined` / `--filled` / `--standard` | Variants. |
| `mtx-text-field--no-label` | Outlined without label or notch. |
| `mtx-text-field--small` / `--medium` / `--large` | Height 40px / 56px / 48px. |
| `mtx-text-field--secondary` / `--success` / `--warning` / `--info` | Focus color. |
| `mtx-text-field--error` | Error state. |
| `mtx-text-field--has-value` | The field has a value, a visible placeholder or is a date/select (the label floats). |
| `mtx-text-field--adorned-start` / `--adorned-end` | There is a start / end adornment. |
| `mtx-text-field--multiline` / `--auto-resize` | Multiline field / automatic height. |
| `mtx-text-field--select` | Wraps a native `<select>`. |
| `mtx-text-field--static-label` / `--hidden-label` / `--borderless` | Label and border modifiers. |
| `mtx-text-field--full-width` / `--margin-dense` / `--margin-normal` | Width and margins. |
| `mtx-text-field__label` / `__container` / `__input` | Label, box and native control. |
| `mtx-text-field__adornment` / `--start` / `--end` / `--image` / `--action` | Adornments (a free `startAdornment` uses only `mtx-text-field__adornment`, without `--start`). |
| `mtx-text-field__action` / `--start` / `--end` | IconButton of an action adornment. |
| `mtx-text-field__outline` / `__legend` | Notch `fieldset` and `legend` (outlined). |
| `mtx-text-field__supporting-text` / `__helper-text` / `__counter` / `--error` | Bottom row, helper text and counter. |
| `mtx-text-field__chevron` | Arrow of a `<select>`. |

### CSS variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--mtx-tf-color` | `var(--mtx-color-primary)` | Focus color of an instance. |
| `--mtx-field-height-medium` / `--mtx-field-height-small` | `56px` / `40px` | Heights. |
| `--mtx-size-large-height` | `48px` | Large height. |
| `--mtx-color-input-filled` / `--mtx-color-input-filled-hover` | theme | Background of the filled variant. |

## Accessibility

- The label is a `<label for>` linked to the control `id` (generated with `useId` when missing).
- The helper text and the counter (`.mtx-text-field__supporting-text`) are linked with `aria-describedby`, keeping the ids you pass and those of a parent FormControl.
- The error state (`error`, a parent FormControl or an exceeded limit) sets `aria-invalid="true"`.
- The counter uses `aria-live="polite"`. Generated icons carry `aria-hidden="true"`.
- In `no-label` and `hiddenLabel` there is no visible label: add an `aria-label`.
- `required` adds the visual asterisk; the native attribute announces it to screen readers.
- The password button is a `<button type="button">` with a translated `aria-label`, `aria-pressed` and `aria-controls`; action buttons need `startActionLabel` / `endActionLabel`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next or previous field (and its buttons). |
| Text keys | Type into the field; with a mask, literals are inserted and invalid characters are discarded. |
| <kbd>Enter</kbd> | New line in a `<textarea>`; submits the form in an `<input>` (native). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on an adornment button | Shows or hides the password or runs the action. |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<input data-mtx="text-field" data-label="…">` | `<TextField label="…" />` |
| `<textarea data-mtx="textarea">` / `data-multiline` | `multiline` |
| `<select data-mtx="text-field">` | `select` + `<option>` children |
| `data-variant="filled"` | `variant="filled"` |
| `data-size="small"` / `data-small` | `size="small"` |
| `data-color="secondary"` | `color="secondary"` |
| `data-start-icon` / `data-end-icon` | `startIcon` / `endIcon` |
| `data-start-action` / `data-end-action` (+ `-label`) | `startAction` / `endAction` (+ `startActionLabel` / `endActionLabel`) |
| `data-password-toggle` / `data-password-toggle-label` | `passwordToggle` / `passwordToggleLabel` |
| `data-helper-text` | `helperText` |
| `data-error="message"` / `setError('message')` | `error` + `helperText="message"` |
| `data-rows` / `data-auto-resize` / `data-max-rows` | `rows` / `autoResize` / `maxRows` |
| `data-counter` / `data-max-characters` / `data-max-words` | `counter` / `maxChars` / `maxWords` |
| `data-mask` / `data-currency-prefix`, `-suffix`, `data-thousands`, `data-decimal`, `data-precision` | `mask` / `currencyOptions` |
| `class="mtx-text-field--static-label"` (and `--hidden-label`, `--borderless`, `--margin-dense`, `--full-width`) | `staticLabel`, `hiddenLabel`, `borderless`, `margin="dense"`, `fullWidth` |
| `field.value` / `field.unmaskedValue` / `field.isMaskComplete` | `value` + `onChange(event, value, { unmaskedValue, isMaskComplete })` |
| `disable()` / `enable()` / `focus()` / `blur()` | `disabled` / `inputRef.current.focus()` / `.blur()` |
| `togglePasswordVisibility()` / `passwordVisible` | `passwordVisible` + `onPasswordVisibilityChange` |
| `mtx:text-field:password-visibility` | `onPasswordVisibilityChange(visible)` |
| `mtx:text-field:adornment-click` | `onAdornmentClick({ position, button, input })` |
