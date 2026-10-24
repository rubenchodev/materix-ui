---
title: "Autocomplete"
description: "Text field with filterable suggestions: single or multiple selection with chips, free values, groups and asynchronous loading."
group: "inputs"
icon: "manage_search"
weight: 95
example: "autocomplete"
import: "Autocomplete"
mui: "https://mui.com/material-ui/react-autocomplete/"
---

`Autocomplete` is a text input enhanced with a list of suggestions: the user types, the list is filtered (ignoring case and accents) and they choose with the mouse or keyboard. It follows the WAI-ARIA 1.2 **combobox with listbox** pattern. Use it when the list is long and searching is faster than scrolling, when values come from a server or when free values are allowed. For short lists without search, use [Select](../select/) or [NativeSelect](../native-select/); for free text with no suggestions, use [TextField](../text-field/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Autocomplete } from '@rubenchodev/materix-react';

<Autocomplete
  label="Country"
  name="country"
  options={[
    { value: 'co', label: 'Colombia' },
    { value: 'mx', label: 'Mexico' },
  ]}
/>
```

{{< callout type="info" title="Select, NativeSelect or Autocomplete?" >}}
| Need | NativeSelect | Select | Autocomplete |
| :--- | :--- | :--- | :--- |
| Short list (≤ 10 options), mobile-first | Best choice | Good | Overkill |
| Type to filter (accent- and case-insensitive) | No | Search box inside the menu (`search`) | Yes, in the field itself |
| Long lists (countries, users, products) | Poor | Acceptable with search | Best choice |
| Multiple selection | Native list (Ctrl/Cmd) | Checkboxes and "Select all" | Deletable chips |
| Values outside the list | No | No | Yes (`freeSolo`) |
| Options loaded from a server while typing | No | No | Yes (`onInputChange` + `options`) |
| Form value | Native `<select>` | Native `<select>` (hidden) | Hidden inputs with `name` |
{{< /callout >}}

## Basic usage

One element with `label` and `options` is enough: the component renders the TextField (label, notched border), the clear and open buttons, the listbox in a portal and the hidden input that submits the option's `value` under `name`. Type to filter, ignoring case and accents.

{{< react-demo "autocomplete/01-basic" >}}

Options can be strings or objects `{ value, label, group?, disabled?, icon?, description? }`, the same format as vanilla. Any other shape works with `getOptionLabel` (and `getOptionValue` for the submitted key).

## Variants

The same as TextField with `variant`: `outlined` (default), `filled` and `standard`.

{{< react-demo id="autocomplete/02-variants" layout="block" >}}

## Sizes

Medium 56px (default) and small 40px with `size="small"`, the same heights as TextField, Select and a medium Button. In multiple mode the chips become 24px and the field grows when they wrap onto several lines.

{{< react-demo id="autocomplete/03-sizes" layout="block" >}}

## With and without icons

`startIcon` adds a start icon (Material Icons name, image URL or node; the label lines up with the text). On each option, `icon` shows a Material icon and `description` a secondary line. The trailing arrow is the popup indicator and the ✕ (visible on hover or focus) is the clear button.

{{< react-demo id="autocomplete/04-icons" layout="block" >}}

## Colors

`color` changes the field's focus color (as in TextField) and the background of selected options: `primary` (default), `secondary`, `success`, `warning`, `info` (and `error` for the options).

{{< react-demo id="autocomplete/05-colors" layout="block" >}}

## States

`helperText`, `error`, `disabled`, `readOnly` (shows the value; it neither opens nor deletes), `required` (native validation while there is no value), `loading` (CircularProgress in the field and "Loading…" in the list) and the "No options" message (customizable with `noOptionsText`).

{{< react-demo id="autocomplete/06-states" layout="block" >}}

## Groups and disabled options

`group` on each option (or `groupBy`) shows a sticky subheader; consecutive options with the same group are grouped, as in MUI. Disabled options (`disabled` or `getOptionDisabled`) are skipped with the keyboard and cannot be clicked. The time zone field uses its own objects with `getOptionLabel`, `getOptionValue` and `groupBy`.

{{< react-demo id="autocomplete/07-groups" layout="block" >}}

## Multiple values

`multiple` shows each value as a deletable [Chip](../chip/) (its ✕, <kbd>Backspace</kbd> with empty text, or <kbd>Delete</kbd>/<kbd>Backspace</kbd> on a focused chip; <kbd>←</kbd>/<kbd>→</kbd> move between chips). `limitTags` limits the chips visible without focus ("+N"), `disableCloseOnSelect` keeps the list open and `filterSelectedOptions` hides the options already chosen.

{{< react-demo id="autocomplete/08-multiple" layout="block" >}}

## Free solo

`freeSolo` accepts values that are not in the list: <kbd>Enter</kbd> confirms the text (in single selection also when leaving the field) and an option with the same label is reused. With no matching options neither the popup nor the open button is shown (`forcePopupIcon` brings the button back).

{{< react-demo id="autocomplete/09-free-solo" layout="block" >}}

## Behavior options

<kbd>↓</kbd>/<kbd>↑</kbd> open and move, <kbd>Page Up</kbd>/<kbd>Page Down</kbd> jump 5, <kbd>Home</kbd>/<kbd>End</kbd> go to the ends, <kbd>Enter</kbd> selects and <kbd>Esc</kbd> closes (and, closed, clears with `clearOnEscape`). Options: `autoHighlight` (highlights the first one), `autoSelect` (<kbd>Tab</kbd> or blur accept the highlighted one), `clearOnEscape`, `openOnFocus`, `disableClearable`, `matchFrom="start"` and `includeInputInList` (the arrows go back to the field at the ends).

{{< react-demo id="autocomplete/10-behavior" layout="block" >}}

## Asynchronous loading

Listen to `onInputChange` (with `debounce={300}` the `input` reason waits until the user stops typing), turn on `loading`, fetch the data and pass the new `options`. `filterOptions={false}` leaves filtering to the server (and disables the highlighting). The demo simulates 800 ms of latency and aborts the pending request on every new search and on unmount.

{{< react-demo "autocomplete/11-async" >}}

```tsx
const [options, setOptions] = useState([]);
const [loading, setLoading] = useState(false);

<Autocomplete
  label="Repository"
  debounce={300}
  filterOptions={false}
  options={options}
  loading={loading}
  onInputChange={async (_event, text, reason) => {
    if (reason !== 'input') return;
    setLoading(true);
    setOptions(await searchRepos(text)); // [{ value, label, description }]
    setLoading(false);
  }}
/>
```

The selected value keeps its label when new options arrive: a `defaultValue="co"` shows "co" until an option with that `value` is loaded and then "Colombia".

## Forms

`name` goes to hidden inputs: one with the value in single selection; one per value in multiple selection (like `<select multiple>`) or a single field with `valueFormat="csv"` (and `separator`). `required` uses native validation (a typed text that is not an option is invalid unless `freeSolo`); the form's `reset` restores the initial value.

{{< react-demo id="autocomplete/12-form" layout="block" >}}

## Grid layout

It takes 100% of its column in [Grid](../grid/).

{{< react-demo id="autocomplete/13-grid" layout="block" >}}

## Controlled usage

With `value` + `onChange`, `inputValue` + `onInputChange` and `open` + `onOpen`/`onClose` the parent owns the state; the vanilla instance methods become state changes (`value = 'matrix'`, `open()`, `clear()`, `setOptions()`, `disable()`) and `focus()` uses `inputRef`. `value` accepts an option, an option key (`'matrix'`) or, in `freeSolo`, a string; `onChange` returns the option.

{{< react-demo id="autocomplete/14-controlled" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `T[]` | — | Strings or `{ value, label, group?, disabled?, icon?, description? }` (or any object with `getOptionLabel`). |
| `getOptionLabel` | `(option) => string` | `label` / `value` | Visible label. |
| `getOptionValue` | `(option) => string` | `value` / label | Unique key: hidden inputs and comparison. |
| `isOptionEqualToValue` | `(option, value) => boolean` | key comparison | Equality between option and value. |
| `getOptionDisabled` | `(option) => boolean` | `option.disabled` | Disabled option. |
| `groupBy` | `(option) => string` | `option.group` | Group of the option (consecutive). |
| `renderOption` | `(option, state) => ReactNode` | — | Own content of each option (`state`: `index`, `selected`, `inputValue`). |
| `filterOptions` | `(options, state) => T[] \| false` | accent-insensitive filter | Own filter; `false` does not filter nor highlight (server filtering). |
| `matchFrom` | `'any' \| 'start'` | `'any'` | Match anywhere or at the beginning. |
| `multiple` | `boolean` | `false` | Multiple selection with chips. |
| `freeSolo` | `boolean` | `false` | Accepts values outside the list. |
| `value` / `defaultValue` | `T \| string \| null` (`array` with `multiple`) | — / `null` | Value (controlled / uncontrolled): option, option key or free text. |
| `onChange` | `(event, value, reason, { option }) => void` | — | `reason`: `selectOption`, `createOption`, `removeOption`, `clear`, `blur`. |
| `inputValue` | `string` | — | Text of the field (controlled). |
| `onInputChange` | `(event, text, reason) => void` | — | `reason`: `input`, `reset`, `clear`. |
| `debounce` | `number` | `0` | Ms to wait before notifying `input` (ignored with a controlled `inputValue`). |
| `open` | `boolean` | — | Popup open (controlled). |
| `onOpen` / `onClose` | `(event, reason) => void` | — | Opening (`input`, `keyboard`, `toggleInput`, `focus`) and closing (`escape`, `blur`, `selectOption`, `createOption`, `toggleInput`, `reset`, `disabled`). |
| `onHighlightChange` | `(event, option \| null, reason) => void` | — | Highlighted option (`keyboard`, `mouse`, `auto`). |
| `limitTags` | `number` | `-1` | Chips visible without focus ("+N"). |
| `filterSelectedOptions` | `boolean` | `false` | Hides selected options (multiple). |
| `disableClearable` | `boolean` | `false` | No clear button. |
| `clearOnEscape` | `boolean` | `false` | <kbd>Esc</kbd> with the list closed clears. |
| `disableCloseOnSelect` | `boolean` | `false` | Keeps the list open on select (multiple). |
| `openOnFocus` | `boolean` | `false` | Opens on focus. |
| `autoHighlight` | `boolean` | `false` | Highlights the first option while filtering. |
| `autoSelect` | `boolean` | `false` | <kbd>Tab</kbd>/blur accept the highlighted option. |
| `includeInputInList` | `boolean` | `false` | Arrows return to the field at the ends. |
| `forcePopupIcon` | `boolean \| 'auto'` | `'auto'` | Open button (`auto`: hidden in `freeSolo`). |
| `disabled` / `readOnly` / `required` | `boolean` | `false` | States. |
| `loading` | `boolean` | `false` | CircularProgress and "Loading…". |
| `loadingText` / `noOptionsText` | `ReactNode` | i18n | Status texts. |
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` | Field variant. |
| `size` | `'medium' \| 'small'` | `'medium'` | 56px or 40px. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Focus and selection color. |
| `label` / `placeholder` | `ReactNode` / `string` | — | Floating label; without `label` the placeholder is used as label. |
| `helperText` / `error` | `ReactNode` / `boolean` | — | Helper text and error state (`aria-invalid`). |
| `startIcon` | `ReactNode` | — | Start icon. |
| `name` / `form` | `string` | — | Hidden inputs. |
| `valueFormat` / `separator` | `'multiple' \| 'csv'` / `string` | `'multiple'` / `','` | Submission of multiple values. |
| `locale` | `string` | context | Language of the texts. |
| `id` | `string` | auto | Input id; listbox, label and options derive from it. |
| `autoFocus` | `boolean` | — | Focuses on mount. |
| `inputRef` / `inputProps` | | — | Ref and attributes of the `<input>`. |
| `aria-label`, `aria-labelledby`, `aria-describedby` | | — | Applied to the combobox. |
| `popperClassName` | `string` | — | Extra class of the portaled popup. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the root `<div>`. |

`className`, `style` and any other attribute go to the root `<div>`.

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-autocomplete` | Root container. |
| `.mtx-autocomplete--open` / `--focused` / `--multiple` / `--loading` / `--disabled` / `--readonly` / `--required` | States. |
| `.mtx-autocomplete--has-clear` / `--has-popup` / `--has-end` | Reserve space for the end buttons. |
| `.mtx-autocomplete__field` | The `.mtx-text-field` (with its variants and sizes). |
| `.mtx-autocomplete__input-root` | The field box (`.mtx-text-field__container`). |
| `.mtx-autocomplete__input` | `<input role="combobox">`. |
| `.mtx-autocomplete__tag` / `__tag-more` | Chips and "+N" counter. |
| `.mtx-autocomplete__end-adornment` | Container of loading, clear and open. |
| `.mtx-autocomplete__loading-indicator`, `__indicator`, `__clear-indicator`, `__popup-indicator` | End buttons. |
| `.mtx-autocomplete__popper` / `--{color}` | Floating surface (portal). |
| `.mtx-autocomplete__paper`, `__listbox`, `__status` | Paper, list and status message. |
| `.mtx-autocomplete__option`, `--focused`, `--disabled` | Option and states (`aria-selected="true"` for selected). |
| `.mtx-autocomplete__option-icon`, `__option-content`, `__option-label`, `__option-description`, `__highlight` | Parts of the option. |
| `.mtx-autocomplete__group`, `__group-label`, `__group-list` | Groups. |
| `.mtx-autocomplete__values`, `__live` | Hidden inputs and live region. |

### CSS variables

`--mtx-ac-accent` (set by `color` on the popup), plus `--mtx-field-height-*`, `--mtx-elevation-8`, `--mtx-color-action-hover` and `--mtx-z-index-modal`.

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<input data-mtx="autocomplete" data-label="…" data-options="#list">` | `<Autocomplete label="…" options={[…]} />` |
| `<datalist>` / `<select>` / `data-options='[…]'` / `list` | `options` |
| `data-variant`, `data-size`, `data-color`, `data-start-icon` | `variant`, `size`, `color`, `startIcon` |
| `data-helper-text`, `data-error="…"` | `helperText`, `error` |
| `data-value` | `defaultValue` (or `value`) |
| `data-multiple`, `data-limit-tags`, `data-filter-selected-options`, `data-disable-close-on-select` | `multiple`, `limitTags`, `filterSelectedOptions`, `disableCloseOnSelect` |
| `data-free-solo`, `data-force-popup-icon` | `freeSolo`, `forcePopupIcon` |
| `data-auto-highlight`, `data-auto-select`, `data-clear-on-escape`, `data-open-on-focus`, `data-disable-clearable`, `data-match-from` | `autoHighlight`, `autoSelect`, `clearOnEscape`, `openOnFocus`, `disableClearable`, `matchFrom` |
| `data-filter="false"` | `filterOptions={false}` |
| `data-debounce` | `debounce` |
| `data-value-format`, `data-separator` | `valueFormat`, `separator` |
| `data-loading`, `data-loading-text`, `data-no-options-text` | `loading`, `loadingText`, `noOptionsText` |
| `disabled`, `readonly`, `required` | `disabled`, `readOnly`, `required` |
| `mtx:autocomplete:change` | `onChange(event, value, reason, { option })` |
| `mtx:autocomplete:input` | `onInputChange(event, text, reason)` |
| `mtx:autocomplete:open` / `close` | `onOpen` / `onClose` |
| `mtx:autocomplete:highlight` | `onHighlightChange` |
| `value = …`, `inputValue = …`, `setOptions()`, `loading = …` | Update the `value`, `inputValue`, `options` and `loading` props |
| `open()` / `close()` / `clear()` | `open` + `onOpen`/`onClose`; `value={null}` |
| `disable()` / `enable()`, `setError()` | `disabled`, `error` + `helperText` |
| `focus()` / `blur()` | `inputRef.current.focus()` / `.blur()` |

## Accessibility

- WAI-ARIA 1.2 *combobox with listbox* pattern: focus stays on the `<input role="combobox">` with `aria-autocomplete="list"`, `aria-expanded` (true when there are options visible), `aria-controls` (the listbox while open) and `aria-activedescendant` (the highlighted option).
- The list is a `role="listbox"` labelled by the label (`aria-labelledby`, or `aria-label` without a label), with `aria-multiselectable` in multiple mode and `aria-busy` while loading; each option is a `role="option"` with `aria-selected` and `aria-disabled`. Groups use `role="group"` labelled by their subheader.
- A `role="status"` live region announces "N results available", "No options" or "Loading…" after filtering.
- The clear and open/close buttons have a translated `aria-label` and stay out of the tab order (`tabindex="-1"`), as in MUI: everything can be done from the keyboard in the field.
- `aria-required`, `aria-readonly`, `aria-invalid` and `aria-describedby` (helper text) are synchronized; `required` uses native validation.
- Escape goes through the common layer stack: only the top layer closes and it does not reach a containing [Dialog](../dialog/).
- Chips are reachable with the arrow keys from the field (`tabindex="-1"`, outside the tab order, as in MUI) and are deleted with <kbd>Backspace</kbd>/<kbd>Delete</kbd>.

| Key | Action |
| :--- | :--- |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Opens the list; when open, moves the highlighted option (wrapping, skipping disabled ones). |
| <kbd>Page Down</kbd> / <kbd>Page Up</kbd> | Moves 5 options. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last option (when open; not in free solo). |
| <kbd>Enter</kbd> | Selects the highlighted option (in free solo, confirms the text). |
| <kbd>Esc</kbd> | Closes the list; when closed and with `clearOnEscape`, clears. |
| <kbd>Tab</kbd> | Leaves the field (with `autoSelect`, accepts the highlighted option). |
| <kbd>Backspace</kbd> (empty field, multiple) | Removes the last chip. |
| <kbd>←</kbd> / <kbd>→</kbd> (multiple) | Moves between chips and back to the field. |
