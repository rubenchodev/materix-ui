---
title: "Select"
description: "Select with a custom MUI-style menu: search, multiple selection, bulk actions, groups, limits and icons or images in the options."
group: "inputs"
icon: "list"
weight: 80
example: "select"
import: "Select"
mui: "https://mui.com/material-ui/react-select/"
---

`Select` lets users pick one or more values from a list through a custom MUI-styled menu with search, multiple selection with checkboxes, bulk actions, groups and options with an icon or image. A hidden native `<select>` mirrors the selection, so the value is submitted with the form and `required` is validated by the browser. If you only need the operating system's dropdown, lighter and better on mobile, use [NativeSelect](../native-select/); for free-text input, use [TextField](../text-field/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Select } from '@rubenchodev/materix-react';

<Select label="City" name="city">
  <option value="mdx">Mexico City</option>
  <option value="gdl">Guadalajara</option>
</Select>
```

## Basic usage

One element with `label` is enough: the component renders the container, the floating label, the combobox, the hidden native `<select>`, the chevron and, in `outlined`, the notched border. Options are written as `<option>`/`<optgroup>` children (with `data-icon`/`data-image` as in vanilla) or passed through the `options` prop. Without `defaultValue` the first enabled option is selected, like a native select.

{{< react-demo "select/01-basic" >}}

## Variants

`variant`: `outlined` (default, with notch), `filled` and `standard`.

{{< react-demo id="select/02-variants" layout="block" >}}

## Sizes

Medium 56px (default) and small 40px with `size="small"`: the same heights as TextField and NativeSelect, so a small Select lines up with a small TextField and a medium Button in the same row.

{{< react-demo id="select/03-sizes" layout="block" >}}

## With and without icons

`startIcon` on the control (Material Icons name, image URL or React node) and `icon` / `image` on each option. The icon of the chosen option also appears in the control. `secondary` adds a second line to the option in the menu.

{{< react-demo id="select/04-icons" layout="block" >}}

## Colors

`color` accepts the whole MUI palette (`primary`, `secondary`, `error`, `warning`, `info`, `success`): it changes the label, the border or underline on focus and the selected option in the menu. `color="error"` does not set the error state.

{{< react-demo id="select/05-colors" layout="block" >}}

## States

`helperText`, `error`, `disabled` and `readOnly` (shows the value but does not open the menu). `required` sets the native attribute and the asterisk. Inside a [FormControl](../form-helper-text/) the select inherits `error`, `disabled` and `required`.

{{< react-demo id="select/06-states" layout="block" >}}

## Placeholder and long text

In single selection, `placeholder` is shown while there is no value (the hidden select stays empty, so `required` validates it). An option with an empty value counts as "no selection" when there is a placeholder. Long text is truncated with an ellipsis without widening the field.

{{< react-demo id="select/07-placeholder" layout="block" >}}

## Search

`search` adds a search box that filters by text and value, ignoring case and accents (with a 150 ms debounce). `header` adds a header and `noResultsText` the no-match message (`{0}` = search term). Try typing "zz".

{{< react-demo "select/08-search" >}}

## Multiple selection

With `multiple` each option gets a checkbox and the menu stays open. `actionsBox` adds "Select all / Deselect all", and `selectedTextFormat` controls the text in the control: `values` (default), `count`, `count > N` or `static` (always the placeholder). `renderValue` replaces the text, for example with [Chips](../chip/).

{{< react-demo id="select/09-multiple" layout="block" >}}

## Groups and selection limit

`<optgroup>` (or an item with `options`) is shown as a subheader; disabled options and groups cannot be chosen, and `maxOptions` locks the rest once the limit is reached.

{{< react-demo id="select/10-groups" layout="block" >}}

## Automatic positioning

The menu is mounted in a portal with the control's width, repositions itself on scroll and resize, opens upwards when it does not fit below (and keeps that side while filtering) and limits its height to the available space. It closes when the control leaves the viewport and respects RTL.

{{< react-demo "select/11-positioning" >}}

## Grid and form

A shipping form in `mtx-grid` combining Select, [TextField](../text-field/) and Button: each field takes the full width of its column (one column on mobile, three on desktop). `name` is submitted with the form (several entries with `multiple`) and the form's `reset` restores the initial value.

{{< react-demo id="select/12-grid-form" layout="block" >}}

## Controlled usage

With `value` + `onChange` and `open` + `onOpen`/`onClose` the parent owns the state; the vanilla instance methods become state changes (`value = …`, `open()`, `disable()`, `helperText = …`) and `focus()` uses `controlRef`.

{{< react-demo id="select/13-controlled" layout="block" >}}

## Inside a Dialog

The portaled menu registers itself as an upper layer: the [Dialog](../dialog/) focus trap lets focus into its search box, <kbd>Esc</kbd> closes only the menu (a second press closes the dialog) and its z-index stays above the dialog.

{{< react-demo "select/14-dialog" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` | Visual variant. |
| `size` | `'medium' \| 'small'` | `'medium'` | 56px or 40px. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Focus and selection color. |
| `label` | `ReactNode` | — | Floating label (and notch in `outlined`). |
| `options` | `Array<SelectOption \| SelectOptionGroup>` | — | `{ value, label, icon?, image?, secondary?, disabled? }` or `{ label, options, disabled? }`. Rendered before `children`. |
| `children` | `<option>` / `<optgroup>` | — | Declarative options; `data-icon`, `data-image` and `data-secondary` are read. |
| `multiple` | `boolean` | `false` | Multiple selection with checkboxes. |
| `value` | `string \| number \| Array` | — | Value (controlled); an array with `multiple`. |
| `defaultValue` | `string \| number \| Array` | — | Initial value (uncontrolled). |
| `onChange` | `(event, value: string \| string[]) => void` | — | Fired when the user changes the selection. |
| `open` / `defaultOpen` | `boolean` | — / `false` | Menu open state (controlled / uncontrolled). |
| `onOpen` / `onClose` | `(event) => void` | — | Open and close requests (click, keyboard, click away, Escape, Tab). |
| `placeholder` | `string` | `''` | Text when there is no selection. |
| `startIcon` | `ReactNode` | — | Start icon: Material Icons name, image URL or node. |
| `search` | `boolean` | `false` | Search box inside the menu. |
| `searchPlaceholder` | `string` | i18n | Placeholder of the search box. |
| `noResultsText` | `string` | i18n | No-match message; `{0}` is the term. |
| `actionsBox` | `boolean` | `false` | Select all / deselect all (multiple only). |
| `selectAllText` / `deselectAllText` | `string` | i18n | Texts of the bulk actions. |
| `header` | `ReactNode` | — | Header inside the menu. |
| `maxOptions` | `number` | — | Maximum selected options (multiple). |
| `selectedTextFormat` | `'values' \| 'count' \| 'count > N' \| 'static'` | `'values'` | Text of the multiple selection. |
| `renderValue` | `(selected) => ReactNode` | — | Custom content of the control when there is a selection. |
| `error` | `boolean` | from `FormControl` | Error colors and `aria-invalid`. |
| `helperText` | `ReactNode` | — | Helper or error text, linked with `aria-describedby`. |
| `disabled` | `boolean` | from `FormControl` | Disables the field. |
| `readOnly` | `boolean` | `false` | Shows the value but does not open. |
| `required` | `boolean` | from `FormControl` | Native `required` and asterisk. |
| `fullWidth` | `boolean` | `true` | Takes the container width (vanilla behavior). |
| `name`, `form` | `string` | — | Forwarded to the hidden `<select>`. |
| `autoFocus` | `boolean` | — | Focuses the combobox on mount. |
| `locale` | `string` | context | Language of the component's texts. |
| `id` | `string` | auto | Root id; the control, listbox, label and helper derive from it. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Applied to the combobox. |
| `inputRef` / `inputProps` | | — | Ref and attributes of the hidden `<select>`. |
| `controlRef` | `Ref<HTMLDivElement>` | — | Ref to the combobox (`focus()`). |
| `menuClassName` | `string` | — | Extra class of the portaled menu. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the root `<div>`. |

`className`, `style` and any other attribute go to the root `<div>`.

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-select` | Root container. |
| `.mtx-select--outlined` / `--filled` / `--standard` | Variants. |
| `.mtx-select--small` | 40px height. |
| `.mtx-select--color-{color}` | Palette color (also on the menu as `.mtx-select__menu--color-{color}`). |
| `.mtx-select--error` / `--open` / `--adorned-start` | Error, open menu, start icon. |
| `.mtx-select__label` / `__control` / `__display` / `__display-text` / `__chevron` | Label, combobox, shown value and arrow. |
| `.mtx-select__outline` / `__legend` | Notched border (`outlined`). |
| `.mtx-select__adornment--start` | Start icon. |
| `.mtx-select__native` | Hidden native `<select>`. |
| `.mtx-select__helper-text` | Helper text. |
| `.mtx-select__menu`, `__header`, `__search`, `__actions`, `__action`, `__optgroup`, `__option`, `__check`, `__no-results` | Menu parts. |
| `.mtx-select__option--selected` / `--disabled` / `--focused` | Option states (`--focused` = active option for the keyboard). |

### CSS variables

`--mtx-select-accent` and `--mtx-select-accent-text` (set by `color`), plus `--mtx-control-height-*`, `--mtx-color-input-filled`, `--mtx-color-divider`, `--mtx-elevation-8` and `--mtx-z-index-modal`.

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<select data-mtx="select" data-label="…">` | `<Select label="…">` |
| `data-variant`, `data-size`, `data-color` | `variant`, `size`, `color` |
| `data-start-icon` | `startIcon` |
| `data-icon` / `data-image` on `<option>` | Same attributes on `<option>` children, or `icon` / `image` in `options` |
| `data-search`, `data-header`, `data-none-results-text` | `search`, `header`, `noResultsText` |
| `data-actions-box`, `data-select-all-text`, `data-deselect-all-text` | `actionsBox`, `selectAllText`, `deselectAllText` |
| `data-max-options`, `data-selected-text-format` | `maxOptions`, `selectedTextFormat` |
| `data-placeholder` / `title` | `placeholder` |
| `data-helper-text`, `data-error`, `data-readonly`, `disabled` | `helperText`, `error`, `readOnly`, `disabled` |
| `instance.value = …` | Update the `value` state |
| `open()` / `close()` | `open` + `onOpen` / `onClose` |
| `disable()` / `enable()` | `disabled` |
| `focus()` | `controlRef.current.focus()` |
| Native `change` event | `onChange(event, value)` |

## Accessibility

- WAI-ARIA *select-only combobox* pattern: the control has `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded` and `aria-controls`; the menu contains a `role="listbox"` with `role="option"` items (`aria-selected`, `aria-disabled`) and `role="group"` for groups. With `multiple`, the listbox has `aria-multiselectable`.
- Focus stays on the combobox and the active option is announced through `aria-activedescendant`; with `search`, focus moves to the search box, which carries `aria-activedescendant`.
- The label names the combobox (`aria-labelledby`); without a label use `aria-label`. `error` sets `aria-invalid`, `required` `aria-required`, `readOnly` `aria-readonly`, and `helperText` is linked with `aria-describedby`.
- The hidden native `<select>` is `aria-hidden` and out of the tab order; Escape is delivered through the common layer stack (only the top layer closes).

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Focuses the combobox; with the menu open, closes it and moves on. |
| <kbd>↓</kbd> / <kbd>↑</kbd> / <kbd>Space</kbd> / <kbd>Enter</kbd> | Opens the menu. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Moves the active option (wraps around). |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last option. |
| Letters | Typeahead: jumps to the option that starts with what was typed. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Selects the active option (toggles it in `multiple`). |
| <kbd>Esc</kbd> | Closes the menu and returns focus to the combobox. |
