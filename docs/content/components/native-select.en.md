---
title: "Native Select"
description: "The browser's <select> with MUI styling: lightweight, accessible by default and with the native touch picker on mobile."
group: "inputs"
icon: "arrow_drop_down_circle"
weight: 90
example: "native-select"
mui: "https://mui.com/material-ui/react-select/#native-select"
---

`NativeSelect` applies MUI styling to the browser's `<select>` without replacing its menu: the list is drawn by the operating system, which makes it the lightest picker, fast with long lists and comfortable on mobile. Use it in simple forms. If you need search, multiple selection with checkboxes, icons in the options or helper text, use [Select](../select/).

{{< callout type="info" title="Select or NativeSelect?" >}}
| Need | Select | NativeSelect |
| :--- | :--- | :--- |
| Menu with MUI styling (Paper, check mark) | Yes | No, uses the system's |
| Search within the menu | Yes (`data-search`) | No |
| Comfortable multiple selection | Yes, with checkboxes and "Select all" | Native list (`multiple`, Ctrl/Cmd + click) |
| Icons or images in the options | Yes (`data-icon`, `data-image`) | No |
| Helper text, start icon, read-only | Yes | No |
| Weight and performance with thousands of options | Medium | Minimal |
| Native touch experience on mobile | Custom menu | System picker |

Rule of thumb: **NativeSelect** for simple forms and long lists on mobile; **Select** when you need search, multiple selection, icons or full visual consistency.
{{< /callout >}}

## Basic usage

Write only the `<select>` with `data-mtx="native-select"` and `data-label`. The JavaScript wraps it and adds the label (associated through `for`/`id`, so the select already has an accessible name) and the chevron. As in MUI NativeSelect, the default variant is `standard`; use `data-variant` for `outlined` or `filled`.

{{< mtx-demo title="Simplified syntax" layout="block" >}}
<select data-mtx="native-select" data-variant="outlined" data-label="Age" name="age">
  <option value="10">Ten</option>
  <option value="20">Twenty</option>
  <option value="30">Thirty</option>
</select>
{{< /mtx-demo >}}

{{< callout type="info" >}}
Without `data-variant`, `standard` is applied. If you don't use `data-label`, name the select with `aria-label` or your own `<label for>`.
{{< /callout >}}

## Variants

`outlined` (full border), `filled` (background and rounded top corners) and `standard` (bottom line).

{{< mtx-demo title="Variants" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="native-select" data-variant="outlined" data-label="Outlined">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="native-select" data-variant="filled" data-label="Filled">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="native-select" data-variant="standard" data-label="Standard">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Sizes

Medium 56px (default) and small 40px with `data-size="small"` or `data-small` (it also reduces the text to 14px). The heights match TextField and Select.

{{< mtx-demo title="Medium 56px and small 40px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Medium · 56px">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Small · 40px" data-size="small">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## States

`data-error` paints the border, label and chevron red and sets `aria-invalid="true"`; `disabled` on the `<select>` disables it. On focus, the border and label switch to the primary color.

{{< mtx-demo title="Error and disabled" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Size" data-error>
      <option value="">Not selected</option>
      <option value="m">M</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Plan" disabled>
      <option value="pro">Professional</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Groups and multiple selection

`<optgroup>` and `<option disabled>` work natively. With `multiple` (and `size` to set the visible rows) the browser's list box is shown with the border or background of its variant (outlined, filled or standard) and no chevron.

{{< mtx-demo title="Optgroup and multiple" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="filled" data-label="City">
      <optgroup label="Colombia">
        <option value="bog">Bogotá</option>
        <option value="med">Medellín</option>
      </optgroup>
      <optgroup label="Mexico">
        <option value="cdmx">Mexico City</option>
        <option value="gdl" disabled>Guadalajara (no coverage)</option>
      </optgroup>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Languages" multiple size="4">
      <option value="js" selected>JavaScript</option>
      <option value="ts">TypeScript</option>
      <option value="py">Python</option>
      <option value="go">Go</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Real-world examples

A quick address form on mobile: the system picker appears when each field is tapped.

{{< mtx-demo title="Shipping address" layout="block" >}}
<form data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Country" name="country" autocomplete="country">
      <option value="co">Colombia</option>
      <option value="mx">Mexico</option>
      <option value="es">Spain</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Street type" name="street-type">
      <option value="calle">Street</option>
      <option value="carrera">Road</option>
      <option value="avenida">Avenue</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12">
    <input data-mtx="text-field" data-label="Address" autocomplete="street-address" type="text" />
  </div>
</form>
{{< /mtx-demo >}}

## Full BEM syntax

```html
<div class="mtx-native-select mtx-native-select--outlined" data-mtx="native-select">
  <label class="mtx-native-select__label" for="age">Age</label>
  <select class="mtx-native-select__input" id="age">
    <option value="10">Ten</option>
    <option value="20">Twenty</option>
  </select>
</div>
```

In manual markup associate the label with `for`/`id` (if `for` is missing, the JavaScript generates the `id` and links it). The chevron is generated by the JavaScript; if you write an empty `<span class="mtx-native-select__chevron">`, it is filled with the icon.

## Programmatic usage

```javascript
const select = Materix.init(document.getElementById('age'), 'native-select');
const other = new Materix.NativeSelect(document.querySelector('#size'));
const same = Materix.getInstance(document.getElementById('age'));

select.value = '20';                 // does not emit change
select.focus();
select.disable();
select.enable();
select.input.addEventListener('change', () => console.log(select.value));
```

```javascript
import { NativeSelect, init, getInstance } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="Live API" >}}
<select id="doc-ns-api" data-mtx="native-select" data-variant="outlined" data-label="Size">
  <option value="s">S</option>
  <option value="m">M</option>
  <option value="l">L</option>
</select>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ns="value">value = 'l'</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ns="toggle">disable() / enable()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ns="focus">focus()</button>
<output id="doc-ns-out">value: s</output>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-ns-api');
  const out = document.getElementById('doc-ns-out');
  if (!el || !window.Materix) return;
  const ns = Materix.getInstance(el);
  if (!ns) return;
  ns.input.addEventListener('change', () => { out.textContent = 'change → value: ' + ns.value; });
  document.querySelectorAll('[data-doc-ns]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-doc-ns');
      if (action === 'value') { ns.value = 'l'; out.textContent = 'value: ' + ns.value; }
      if (action === 'toggle') { if (ns.disabled) ns.enable(); else ns.disable(); out.textContent = 'disabled: ' + ns.disabled; }
      if (action === 'focus') ns.focus();
    });
  });
});
</script>

## API reference

### Data attributes

In the simplified syntax they are written on the `<select>` and copied to the container; in BEM, on the `.mtx-native-select` container.

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `native-select` | — | Initializes the component. |
| `data-variant` | `standard` \| `outlined` \| `filled` | `standard` | Visual variant (defaults to `standard`, like MUI NativeSelect). A `mtx-native-select--{variant}` class is also honored. |
| `data-label` | text | — | Visual floating label (also the `label` attribute). |
| `data-size` | `small` | medium (56px) | `small` = 40px and 14px text. Also `data-small`. |
| `data-error` | boolean | — | Error state and `aria-invalid="true"`. |

Native attributes (`name`, `required`, `disabled`, `multiple`, `size`, `autocomplete`, `form`) work as on any `<select>`; `required` also adds the asterisk to the label.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-native-select` | Root container. |
| `mtx-native-select--outlined` / `--filled` / `--standard` | Variants. |
| `mtx-native-select--small` | 40px height. |
| `mtx-native-select--error` | Error state. |
| `mtx-native-select--multiple` | `<select multiple>` (automatic height, no chevron, with the variant's border or background). Added by the JS. |
| `mtx-native-select--has-label` | A label exists: in filled, the value moves down so it is not under the label. Added by the JS. |
| `mtx-native-select__label` | Floating label. |
| `mtx-native-select__input` | Native `<select>`. |
| `mtx-native-select__chevron` | Decorative arrow. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `value` (get/set) | `string` \| `string[]` | Value (an array with `multiple`). Setting it does not emit `change`. |
| `disabled` (get) | `boolean` | Whether it is disabled. |
| `disable()` | `void` | Disables the `<select>`. |
| `enable()` | `void` | Enables the `<select>`. |
| `focus()` | `void` | Focuses the `<select>`. |

Useful properties: `element` (container), `input` (`<select>`), `chevron`.

### Events

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `change` (on `select.input`) | — (native) | The user picks another option. |
| `input` (on `select.input`) | — (native) | Same as `change`, immediately. |

### CSS variables

No variables of its own; it uses `--mtx-control-height-outlined|filled|standard` (56px), their `-small` variants (40px), `--mtx-color-input-filled`, `--mtx-color-divider`, `--mtx-color-primary` and `--mtx-color-error`.

## Accessibility

- It is a real `<select>`: the browser and screen readers announce and handle it natively.
- The generated label (`data-label`) is associated with the `<select>` via `for`/`id`, so the accessible name is the label text. Without a label, use `aria-label` or `aria-labelledby`.
- `data-error` adds `aria-invalid="true"`; the chevron is decorative (`aria-hidden`).

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Focuses the select. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Changes the option (or opens the list, depending on the OS). |
| <kbd>Alt</kbd> + <kbd>↓</kbd> / <kbd>Space</kbd> | Opens the system list. |
| Letters | Jump to the option that starts with that letter. |
| <kbd>Esc</kbd> | Closes the list without changing the value. |
