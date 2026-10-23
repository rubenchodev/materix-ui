---
title: "Select"
description: "Select with a custom MUI-style menu: search, multiple selection, bulk actions, groups, limits and icons or images in the options."
group: "inputs"
icon: "list"
weight: 80
example: "select"
mui: "https://mui.com/material-ui/react-select/"
---

`Select` lets users pick one or more values from a list by showing a custom MUI-styled menu with search, multiple selection and options with an icon or image. The native `<select>` remains the source of truth (it is submitted with the form and emits `change`), but it is hidden. If you only need the operating system's dropdown, lighter and better on mobile, use [NativeSelect](../native-select/); for free-text input, use [TextField](../text-field/).

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

Write only the `<select>` with `data-mtx="select"` and `data-label`. The JavaScript creates the visible control, the label, the outline notch and the menu.

{{< mtx-demo title="Simplified syntax" layout="block" >}}
<select data-mtx="select" data-label="City" name="city">
  <option value="mdx">Mexico City</option>
  <option value="gdl">Guadalajara</option>
  <option value="mty">Monterrey</option>
</select>
{{< /mtx-demo >}}

## Variants

`data-variant`: `outlined` (default, with notch), `filled` and `standard`.

{{< mtx-demo title="Variants" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="select" data-label="Outlined" data-variant="outlined">
      <option value="es">Spanish</option>
      <option value="en">English</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="select" data-label="Filled" data-variant="filled">
      <option value="es">Spanish</option>
      <option value="en">English</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="select" data-label="Standard" data-variant="standard">
      <option value="es">Spanish</option>
      <option value="en">English</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Sizes

Medium 56px (default) and small 40px with `data-size="small"` or `data-small`: the same heights as TextField, so fields line up in a row.

{{< mtx-demo title="Medium 56px and small 40px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Medium · 56px">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Small · 40px" data-size="small">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## With icons

`data-start-icon` adds an icon (Material Icons) or an image (URL) at the start of the control. On each `<option>`, `data-icon` or `data-image` shows an icon or an image next to the text, both in the menu and in the control once selected.

{{< mtx-demo title="Start icon and per-option icons or images" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <select data-mtx="select" data-label="Destination" data-start-icon="place">
      <option value="bog">Bogotá</option>
      <option value="med">Medellín</option>
      <option value="cal">Cali</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <select data-mtx="select" data-label="Payment method">
      <option value="card" data-icon="credit_card">Card</option>
      <option value="cash" data-icon="payments">Cash</option>
      <option value="bank" data-icon="account_balance">Bank transfer</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <select data-mtx="select" data-label="Country">
      <option value="co" data-image="https://flagcdn.com/w40/co.png">Colombia</option>
      <option value="mx" data-image="https://flagcdn.com/w40/mx.png">Mexico</option>
      <option value="es" data-image="https://flagcdn.com/w40/es.png">Spain</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Colors

`data-color` accepts the whole MUI palette: `primary` (default), `secondary`, `error`, `warning`, `info` and `success`. It changes the label, the border (outlined) or the bottom line (filled and standard) when focused or open, and the selected option color in the menu. `data-color="error"` only changes the accent; the error state is enabled with `data-error`.

{{< mtx-demo title="Full palette" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Primary">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Secondary" data-color="secondary">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Error" data-color="error">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Warning" data-color="warning" data-variant="filled">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Info" data-color="info" data-variant="filled">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Success" data-color="success" data-variant="standard">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## States

`data-helper-text` adds helper text linked with `aria-describedby`; `data-error` paints the control red (and sets `aria-invalid`); `disabled` (or `data-disabled`) disables it, and `data-readonly` (or `readonly`) shows the value without allowing the menu to open. `required` on the `<select>` adds the asterisk to the label (included in the outlined notch) and sets `aria-required`.

{{< mtx-demo title="Helper text, error, disabled and read-only" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Country of residence" data-helper-text="Where you currently pay taxes">
      <option value="co">Colombia</option>
      <option value="mx">Mexico</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Currency" data-error data-helper-text="Select a valid currency" required>
      <option value="">Not selected</option>
      <option value="usd">USD</option>
      <option value="eur">EUR</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Plan" disabled>
      <option value="pro">Professional</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Region" data-readonly>
      <option value="latam">Latin America</option>
      <option value="eu">Europe</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Placeholder and long text

In single selection, `data-placeholder` (or the `<select>`'s `title`) is shown while no option has the `selected` attribute: the component leaves the select without a value (`selectedIndex = -1`), so `required` validates it. An option with `value=""` also counts as no selection when there is a placeholder. Long text is truncated with an ellipsis without widening the field.

{{< mtx-demo title="Placeholder and ellipsis" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Role" data-placeholder="Choose a role" required>
      <option value="admin">Administrator</option>
      <option value="editor">Editor</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Shipping address" data-start-icon="local_shipping">
      <option value="1">1600 Amphitheatre Parkway, Building 40, Mountain View, CA 94043, United States</option>
      <option value="2">221B Baker Street, Marylebone, London NW1 6XE, United Kingdom</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Search

`data-search` adds a box that filters the options by text and by value as you type. `data-header` shows a header in the menu, and `data-none-results-text` customizes the no-match message (`{0}` is replaced by the search term).

{{< mtx-demo title="Search with header" layout="block" >}}
<select data-mtx="select" data-label="Country" data-search data-header="Select a country" data-none-results-text="No country matches “{0}”">
  <option value="ar">Argentina</option>
  <option value="bo">Bolivia</option>
  <option value="cl">Chile</option>
  <option value="co">Colombia</option>
  <option value="ec">Ecuador</option>
  <option value="es">Spain</option>
  <option value="mx">Mexico</option>
  <option value="pe">Peru</option>
  <option value="uy">Uruguay</option>
</select>
{{< /mtx-demo >}}

## Multiple selection

With `multiple` on the `<select>`, each option shows a checkbox and the menu stays open so several can be checked. `data-actions-box` adds "Select all" and "Deselect all" (texts configurable with `data-select-all-text` and `data-deselect-all-text`). The control text is set with `data-selected-text-format`:

- `values` (default): comma-separated list.
- `count`: "N selected".
- `count > N`: list up to N items and a counter from N + 1 onwards.
- `static`: always shows the placeholder (`data-placeholder` or `title`).

{{< mtx-demo title="Multiple with search, actions and formats" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <select data-mtx="select" data-label="Skills" data-search data-actions-box multiple>
      <option value="js" selected>JavaScript</option>
      <option value="ts" selected>TypeScript</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
      <option value="py">Python</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <select data-mtx="select" data-label="Languages" data-selected-text-format="count > 2" data-placeholder="Choose languages" multiple>
      <option value="js">JavaScript</option>
      <option value="ts">TypeScript</option>
      <option value="go">Go</option>
      <option value="rs">Rust</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

{{< callout type="tip" >}}
Materix multiple selection follows MUI's checkbox pattern (`renderValue` with text). It does not render chips inside the control; if you need visible tags, render [Chips](../chip/) separately from `select.value`.
{{< /callout >}}

## Groups and selection limit

`<optgroup>` elements are shown as subheaders (empty groups are hidden while filtering). `disabled` options and groups cannot be chosen. `data-max-options` limits how many options can be checked and disables the rest once the limit is reached.

{{< mtx-demo title="Optgroups, disabled options and a maximum of 2" layout="block" >}}
<select data-mtx="select" data-label="Stack (max. 2)" data-max-options="2" multiple>
  <optgroup label="Frontend">
    <option value="react">React</option>
    <option value="vue">Vue</option>
    <option value="angular" disabled>Angular (unavailable)</option>
  </optgroup>
  <optgroup label="Backend">
    <option value="node">Node.js</option>
    <option value="django">Django</option>
    <option value="laravel">Laravel</option>
  </optgroup>
</select>
{{< /mtx-demo >}}

## Real-world examples

Filters for a listing: text search, category with icons, multiple tags and sorting, aligned in a small 40px row next to a Button.

{{< mtx-demo title="Filter bar" layout="block" >}}
<div data-mtx="grid" data-spacing="2" data-align="center">
  <div data-mtx="grid" data-xs="12" data-md="3">
    <input data-mtx="text-field" data-label="Search" data-start-icon="search" data-size="small" type="search" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <select data-mtx="select" data-label="Category" data-size="small">
      <option value="all" data-icon="apps">All</option>
      <option value="laptops" data-icon="laptop">Laptops</option>
      <option value="phones" data-icon="smartphone">Phones</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <select data-mtx="select" data-label="Tags" data-size="small" data-selected-text-format="count" data-placeholder="Any" multiple>
      <option value="new">New</option>
      <option value="sale">On sale</option>
      <option value="eco">Sustainable</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="3">
    <button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button" type="button">Apply filters</button>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or fine-grained control. The component reuses the label, the control and the chevron if they exist and generates the rest (display, notch, menu).

```html
<div class="mtx-select mtx-select--outlined" data-mtx="select" data-search data-actions-box>
  <label class="mtx-select__label">Skills</label>
  <div class="mtx-select__control">
    <select class="mtx-select__native" multiple title="Choose…">
      <option value="js" selected>JavaScript</option>
      <option value="ts">TypeScript</option>
    </select>
    <span class="mtx-select__chevron"></span>
  </div>
  <div class="mtx-select__helper-text" id="skills-help">Choose at least one</div>
</div>
```

## Programmatic usage

```javascript
// Initialize a dynamically created <select>
const select = Materix.init(document.getElementById('city'), 'select');

// Direct instance or existing instance (with the <select> or the container)
const other = new Materix.Select(document.querySelector('#country'));
const same = Materix.getInstance(document.getElementById('city'));

select.value = 'gdl';                 // single selection
const skills = Materix.getInstance(document.getElementById('skills'));
skills.value = ['js', 'ts'];           // multiple selection (<select multiple>)
select.open();
select.close();
select.helperText = 'Updated';
select.select.addEventListener('change', () => console.log(select.value));
```

```javascript
import { Select, init, getInstance } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="Live API" >}}
<select id="doc-select-api" data-mtx="select" data-label="Environment" data-helper-text="Use the buttons">
  <option value="dev">Development</option>
  <option value="staging">Staging</option>
  <option value="prod">Production</option>
</select>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-select="value">value = 'prod'</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-select="open">open()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-select="toggle">disable() / enable()</button>
<output id="doc-select-out">value: dev</output>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-select-api');
  const out = document.getElementById('doc-select-out');
  if (!el || !window.Materix) return;
  const select = Materix.getInstance(el);
  if (!select) return;
  select.select.addEventListener('change', () => { out.textContent = 'change → value: ' + select.value; });
  document.querySelectorAll('[data-doc-select]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const action = btn.getAttribute('data-doc-select');
      if (action === 'value') { select.value = 'prod'; out.textContent = 'value: ' + select.value; }
      if (action === 'open') { event.stopPropagation(); select.open(); }
      if (action === 'toggle') { if (select.disabled) select.enable(); else select.disable(); out.textContent = 'disabled: ' + select.disabled; }
    });
  });
});
</script>

## API reference

### Data attributes

They are read from the container or from the `<select>` itself (except `data-placeholder`, `data-disabled`, `data-readonly` and `data-hidden-label`, which are only read from the container and, in the simplified syntax, are copied to it automatically).

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `select` | — | Initializes the component. |
| `data-label` | text | — | Floating label (also the `label` attribute). |
| `data-variant` | `outlined` \| `filled` \| `standard` | `outlined` | Visual variant. |
| `data-size` | `small` \| `medium` | `medium` (56px) | `small` = 40px. Also `data-small`. |
| `data-color` | `primary` \| `secondary` \| `error` \| `warning` \| `info` \| `success` | `primary` | Focus, open and selected-option color. |
| `data-start-icon` | icon \| URL | — | Icon or image at the start of the control. |
| `data-helper-text` | text | — | Helper text below the control. |
| `data-error` | boolean | — | Error state (border, label and helper text in red; `aria-invalid`). |
| `data-disabled` | boolean | — | Disables the control (same as `disabled` on the `<select>`). |
| `data-readonly` | boolean | — | Read-only: the menu does not open. Also `readonly` on the `<select>`. |
| `data-placeholder` | text | the `<select>`'s `title` | Text when nothing is selected. In single selection, if no option has `selected`, the select stays empty and this text is shown. |
| `data-search` | boolean | — | Search box in the menu. |
| `data-none-results-text` | text with `{0}` | i18n | No-match message. Alias `data-no-results-text`. |
| `data-header` | text | — | Header inside the menu. |
| `data-actions-box` | boolean | — | "Select all" / "Deselect all" buttons (`multiple` only). |
| `data-select-all-text` | text | i18n | Text of the "Select all" button. |
| `data-deselect-all-text` | text | i18n | Text of the "Deselect all" button. Alias `data-clear-all-text`. |
| `data-max-options` | number | no limit | Maximum number of checkable options (`multiple` only). |
| `data-selected-text-format` | `values` \| `count` \| `count > N` \| `static` | `values` | Control text in multiple selection. |
| `data-hidden-label` | boolean | — | Draws the outlined border without a notch. |
| `data-icon` *(on `<option>`)* | icon | — | Material Icons glyph next to the option. |
| `data-image` *(on `<option>`)* | URL | — | Image next to the option (flags, logos, avatars). |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-select` | Root container. |
| `mtx-select--outlined` / `--filled` / `--standard` | Variants. |
| `mtx-select--small` | 40px height. |
| `mtx-select--color-{color}` | Accent color (`primary`…`success`); the menu gets `mtx-select__menu--color-{color}`. The `mtx-select--secondary` alias is kept. |
| `mtx-select--error` | Error state. |
| `mtx-select--open` | The menu is open (managed by the JS). |
| `mtx-select--adorned-start` | Has a start icon. |
| `mtx-select--hidden-label` / `--no-label` | Outlined border without a notch. |
| `mtx-select__label` | Label. |
| `mtx-select__control` | Visible control (`role="combobox"`). |
| `mtx-select__native` | Hidden native `<select>`. |
| `mtx-select__display` / `--empty` | Displayed value (flex, with `__display-text` truncated with an ellipsis); `--empty` when the placeholder is shown. |
| `mtx-select__display-icon` / `__display-image` / `__display-text` | Icon, image and text of the chosen option. |
| `mtx-select__adornment` / `--start` / `--image` | Start icon or image. |
| `mtx-select__chevron` | Arrow (rotates when open). |
| `mtx-select__outline` / `__legend` | Notched border (outlined). |
| `mtx-select__helper-text` | Helper text. |
| `mtx-select__menu` | Menu (`role="listbox"`). Moved to a portal when opened. |
| `mtx-select__header` | Menu header. |
| `mtx-select__search-wrap` / `__search` | Search box. |
| `mtx-select__actions` / `__action` / `--select-all` / `--deselect-all` | Bulk action buttons. |
| `mtx-select__optgroup` / `--hidden` | Group subheader. |
| `mtx-select__option` | Option (`role="option"`). |
| `mtx-select__option--selected` / `--disabled` / `--hidden` | Option states. |
| `mtx-select__check` | Option checkbox (multiple selection). |
| `mtx-select__option-icon` / `__option-image` / `__option-text` | Option content. |
| `mtx-select__no-results` | No-match message. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `value` (get/set) | `string` \| `string[]` | Selected value (an array with `multiple`). Setting it does not emit `change`. |
| `multiple` (get) | `boolean` | Whether the `<select>` is multiple. |
| `disabled` (get) | `boolean` | Whether it is disabled. |
| `helperText` (get/set) | `string` | Helper text (an empty string removes it). |
| `open()` | `void` | Opens the menu (does nothing if disabled or read-only). |
| `close()` | `void` | Closes the menu. |
| `disable()` | `void` | Disables the control and closes the menu. |
| `enable()` | `void` | Enables the control. |
| `focus()` | `void` | Focuses the visible control. |
| `destroy()` | `void` | Removes the instance's listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

Useful properties: `element` (container), `select` (native `<select>`), `control`, `menu`.

### Events

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `change` (on the `<select>`, bubbles) | — (native) | The user selects or unchecks an option, or uses "Select all" / "Deselect all". |

It listens to the document's `mtx:locale:change` to translate its internal texts when the language changes with `Materix.setLocale()`.

### CSS variables

`Select` defines no variables of its own; it uses the global tokens `--mtx-control-height-outlined|filled|standard` (56px) and their `-small` variants (40px), `--mtx-color-input-filled`, `--mtx-color-input-filled-hover`, `--mtx-color-primary`, `--mtx-color-secondary` and `--mtx-color-error`.

## Accessibility

- The visible control is a `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` and `aria-labelledby` (pointing to the label). Without a label, it copies the `<select>`'s `aria-label`.
- The menu is a `role="listbox"` (`aria-multiselectable` when multiple) and each option a `role="option"` with `aria-selected` and `aria-disabled`.
- `aria-disabled`, `aria-readonly`, `aria-required`, `aria-invalid` and `aria-describedby` (helper text) are synchronized automatically.
- The native `<select>` gets `aria-hidden="true"` and `tabindex="-1"`, but is still submitted with the form.

| Key | Action |
| :--- | :--- |
| <kbd>Enter</kbd> (on the control) | Opens or closes the menu. |
| <kbd>↓</kbd> / <kbd>↑</kbd> / <kbd>Space</kbd> (on the control) | Opens the menu and focuses the selected option (or the search box). |
| <kbd>↓</kbd> / <kbd>↑</kbd> (in the menu) | Moves focus between options (wrapping). From the search box, <kbd>↓</kbd> moves to the first option. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> (on an option) | Chooses the option (in multiple mode, checks or unchecks it). |
| <kbd>Esc</kbd> | Closes the menu and returns focus to the control. |
| <kbd>Tab</kbd> | Closes the menu and continues navigation. |
