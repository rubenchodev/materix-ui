---
title: "Toggle Button"
description: "Toggle buttons group related options with exclusive or multiple selection; on their own they work as an on/off switch for a single action."
group: "inputs"
icon: "toggle_off"
weight: 110
example: "toggle-button"
mui: "https://mui.com/material-ui/react-toggle-button/"
---

**Toggle Button** groups related options in a block with joined borders: text alignment, formatting, list or grid view. A **ToggleButtonGroup** handles exclusive selection (like a radio) or multiple selection (like checkboxes), and a standalone **ToggleButton** switches a single action on and off, such as marking a favorite. To choose among many options use a [Select](../select/); for a setting that applies immediately, a [Switch](../switch/).

{{< callout type="warning" title="aria-label is required on icon-only buttons" >}}
A button without visible text needs an `aria-label` (or `aria-labelledby`) that describes the option: "Align left", not "arrow". Also name the group with `aria-label` or `data-label`.
{{< /callout >}}

## Basic usage

A `data-mtx="toggle-button-group"` container with plain `<button>` elements. Each button only needs `data-value` and, when icon-only, `data-icon` and `aria-label`; the group initializes the buttons (no `data-mtx` needed on each one), joins their borders and manages `aria-pressed`.

{{< mtx-demo title="Basic usage" >}}
<div data-mtx="toggle-button-group" data-exclusive data-value="left" aria-label="Text alignment">
  <button data-value="left" data-icon="format_align_left" aria-label="Align left"></button>
  <button data-value="center" data-icon="format_align_center" aria-label="Center"></button>
  <button data-value="right" data-icon="format_align_right" aria-label="Align right"></button>
  <button data-value="justify" data-icon="format_align_justify" aria-label="Justify" disabled></button>
</div>
{{< /mtx-demo >}}

## Exclusive and multiple selection

With `data-exclusive` only one button can be active and the value is a string (or `null`). Without it the selection is **multiple** (MUI's default) and the value is an array in DOM order; `data-value` accepts a comma-separated list.

{{< mtx-demo title="Exclusive" >}}
<div data-mtx="toggle-button-group" data-exclusive data-value="center" aria-label="Alignment">
  <button data-value="left" data-icon="format_align_left" aria-label="Left"></button>
  <button data-value="center" data-icon="format_align_center" aria-label="Center"></button>
  <button data-value="right" data-icon="format_align_right" aria-label="Right"></button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Multiple" >}}
<div data-mtx="toggle-button-group" data-value="bold,italic" aria-label="Text formatting">
  <button data-value="bold" data-icon="format_bold" aria-label="Bold"></button>
  <button data-value="italic" data-icon="format_italic" aria-label="Italic"></button>
  <button data-value="underlined" data-icon="format_underlined" aria-label="Underline"></button>
  <button data-value="color" data-icon="format_color_fill" aria-label="Fill color"></button>
</div>
{{< /mtx-demo >}}

## Sizes

`data-size` on the group (or on each button). The icon keeps its native 24px grid; the padding changes (7, 11 and 15px, as in MUI).

| Size | `data-size` | Height | Aligns with |
| :--- | :--- | :--- | :--- |
| Large | `large` | 56px | Text Field medium |
| Medium | — (default) | 48px | Button large, IconButton large |
| Small | `small` | 40px | Button medium, Text Field small |

{{< mtx-demo title="Sizes" layout="column" >}}
<div data-mtx="toggle-button-group" data-exclusive data-size="large" data-value="list" aria-label="View (large)">
  <button data-value="list" data-icon="view_list" aria-label="List"></button>
  <button data-value="module" data-icon="view_module" aria-label="Modules"></button>
  <button data-value="quilt" data-icon="view_quilt" aria-label="Quilt"></button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-value="list" aria-label="View (medium)">
  <button data-value="list" data-icon="view_list" aria-label="List"></button>
  <button data-value="module" data-icon="view_module" aria-label="Modules"></button>
  <button data-value="quilt" data-icon="view_quilt" aria-label="Quilt"></button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-size="small" data-value="list" aria-label="View (small)">
  <button data-value="list" data-icon="view_list" aria-label="List"></button>
  <button data-value="module" data-icon="view_module" aria-label="Modules"></button>
  <button data-value="quilt" data-icon="view_quilt" aria-label="Quilt"></button>
</div>
{{< /mtx-demo >}}

## With icons

Text only, icon and text (`data-icon` is inserted before the text) or icon only with `aria-label`.

{{< mtx-demo title="Text, icon and text, icon only" layout="column" >}}
<div data-mtx="toggle-button-group" data-exclusive data-value="web" aria-label="Platform">
  <button data-value="web">Web</button>
  <button data-value="android">Android</button>
  <button data-value="ios">iOS</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-value="month" aria-label="Period">
  <button data-value="day" data-icon="today">Day</button>
  <button data-value="week" data-icon="view_week">Week</button>
  <button data-value="month" data-icon="calendar_month">Month</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-value="phone" aria-label="Device">
  <button data-value="laptop" data-icon="laptop" aria-label="Laptop"></button>
  <button data-value="tv" data-icon="tv" aria-label="TV"></button>
  <button data-value="phone" data-icon="phone_android" aria-label="Phone"></button>
</div>
{{< /mtx-demo >}}

## Colors

`data-color` colors the selected state: `standard` (default, primary text) or a palette color.

{{< mtx-demo title="Colors" layout="column" >}}
<div data-mtx="toggle-button-group" data-exclusive data-value="web" aria-label="Standard">
  <button data-value="web">Web</button><button data-value="android">Android</button><button data-value="ios">iOS</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-color="primary" data-value="web" aria-label="Primary">
  <button data-value="web">Web</button><button data-value="android">Android</button><button data-value="ios">iOS</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-color="secondary" data-value="android" aria-label="Secondary">
  <button data-value="web">Web</button><button data-value="android">Android</button><button data-value="ios">iOS</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-color="success" data-value="ios" aria-label="Success">
  <button data-value="web">Web</button><button data-value="android">Android</button><button data-value="ios">iOS</button>
</div>
{{< /mtx-demo >}}

## States

Hover shows a subtle background, keyboard focus a primary ring and a press the ripple. `disabled` (or `data-disabled`) on a button dims it; `data-disabled` on the group disables them all.

{{< mtx-demo title="Selected, enabled and disabled" layout="column" >}}
<div data-mtx="toggle-button-group" data-value="bold" aria-label="Formatting states">
  <button data-value="bold" data-icon="format_bold" aria-label="Bold"></button>
  <button data-value="italic" data-icon="format_italic" aria-label="Italic"></button>
  <button data-value="underlined" data-icon="format_underlined" aria-label="Underline" disabled></button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-disabled data-value="day" aria-label="Period (disabled)">
  <button data-value="day">Day</button>
  <button data-value="week">Week</button>
  <button data-value="month">Month</button>
</div>
{{< /mtx-demo >}}

## Orientation and full width

`data-orientation="vertical"` stacks the buttons (the up/down arrows move focus); `data-full-width` distributes the available width.

{{< mtx-demo title="Vertical" >}}
<div data-mtx="toggle-button-group" data-exclusive data-orientation="vertical" data-value="list" aria-label="View">
  <button data-value="list" data-icon="view_list" aria-label="List"></button>
  <button data-value="module" data-icon="view_module" aria-label="Modules"></button>
  <button data-value="quilt" data-icon="view_quilt" aria-label="Quilt"></button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Full width" layout="block" >}}
<div data-mtx="toggle-button-group" data-exclusive data-full-width data-color="primary" data-value="monthly" aria-label="Billing">
  <button data-value="monthly">Monthly</button>
  <button data-value="yearly">Yearly</button>
</div>
{{< /mtx-demo >}}

## Enforce value set

`data-enforce-value-set` prevents deselecting the last active button, so the group always has a value (MUI's *enforce value set* pattern).

{{< mtx-demo title="data-enforce-value-set" >}}
<div data-mtx="toggle-button-group" data-exclusive data-enforce-value-set data-value="left" aria-label="Required alignment">
  <button data-value="left" data-icon="format_align_left" aria-label="Left"></button>
  <button data-value="center" data-icon="format_align_center" aria-label="Center"></button>
  <button data-value="right" data-icon="format_align_right" aria-label="Right"></button>
</div>
{{< /mtx-demo >}}

## Standalone button

A single `data-mtx="toggle-button"` outside a group toggles its own state and fires `mtx:toggle-button:change`. `data-selected` sets the initial state.

{{< mtx-demo title="Standalone" >}}
<button data-mtx="toggle-button" data-value="favorite" data-icon="star" data-color="warning" aria-label="Mark as favorite"></button>
<button data-mtx="toggle-button" data-value="done" data-icon="check" data-color="success" data-selected aria-label="Mark as done"></button>
<button data-mtx="toggle-button" data-value="wifi" data-icon="wifi" data-size="small" data-selected>Wi-Fi</button>
{{< /mtx-demo >}}

## Real-world examples

An editor toolbar: multiple formatting and required exclusive alignment.

{{< mtx-demo title="Toolbar" >}}
<div data-mtx="toggle-button-group" data-size="small" data-value="bold" aria-label="Formatting">
  <button data-value="bold" data-icon="format_bold" aria-label="Bold"></button>
  <button data-value="italic" data-icon="format_italic" aria-label="Italic"></button>
  <button data-value="underlined" data-icon="format_underlined" aria-label="Underline"></button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-enforce-value-set data-size="small" data-value="left" aria-label="Alignment">
  <button data-value="left" data-icon="format_align_left" aria-label="Left"></button>
  <button data-value="center" data-icon="format_align_center" aria-label="Center"></button>
  <button data-value="right" data-icon="format_align_right" aria-label="Right"></button>
</div>
{{< /mtx-demo >}}

A theme switcher built on the [theme API]({{< relref "/guide/theming" >}}): each button carries `data-mtx-theme-toggle="light|system|dark"`, so `Materix.theme` applies the mode and syncs `aria-pressed`. Use `data-enforce-value-set` so a mode is always active.

{{< mtx-demo title="Theme switcher" >}}
<div data-mtx="toggle-button-group" data-exclusive data-enforce-value-set data-size="small" data-color="primary" aria-label="Theme">
  <button data-value="light" data-icon="light_mode" data-mtx-theme-toggle="light">Light</button>
  <button data-value="system" data-icon="settings_brightness" data-mtx-theme-toggle="system">System</button>
  <button data-value="dark" data-icon="dark_mode" data-mtx-theme-toggle="dark">Dark</button>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

Classes and `aria-pressed` written by hand; the library reuses the nodes and the existing icon.

```html
<div class="mtx-toggle-button-group" data-mtx="toggle-button-group" data-exclusive role="group" aria-label="View">
  <button type="button" class="mtx-toggle-button" data-mtx="toggle-button" data-value="list" aria-pressed="true" aria-label="List">
    <span class="material-icons" aria-hidden="true">view_list</span>
  </button>
  <button type="button" class="mtx-toggle-button" data-mtx="toggle-button" data-value="grid" aria-pressed="false" aria-label="Grid">
    <span class="material-icons" aria-hidden="true">grid_view</span>
  </button>
</div>
```

## Programmatic usage

`Materix.getInstance(group)` returns the ToggleButtonGroup: `value` can be read and written (without firing events) and `mtx:toggle-button-group:change` reports user changes.

```javascript
const groupEl = document.querySelector('#formatting');
const group = Materix.getInstance(groupEl);

console.log(group.value);          // ['bold'] (multiple) or 'left' / null (exclusive)
group.value = ['bold', 'italic'];  // fires no events

groupEl.addEventListener('mtx:toggle-button-group:change', (event) => {
  console.log('New value:', event.detail.value);
});

group.disable();
group.enable();

// Standalone button
const fav = new Materix.ToggleButton(document.querySelector('#fav'));
fav.selected = true;
fav.toggle();
```

With ES modules:

```javascript
import { init, getInstance, ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="value and mtx:toggle-button-group:change" >}}
<div data-mtx="toggle-button-group" id="doc-tb-group" data-value="bold" aria-label="Formatting">
  <button data-value="bold" data-icon="format_bold" aria-label="Bold"></button>
  <button data-value="italic" data-icon="format_italic" aria-label="Italic"></button>
  <button data-value="underlined" data-icon="format_underlined" aria-label="Underline"></button>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-tb-set">group.value = ['italic', 'underlined']</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var groupEl = document.getElementById('doc-tb-group');
  var group = Materix.init(groupEl);
  var status = groupEl.closest('.doc-demo').querySelector('.doc-demo-status');
  groupEl.addEventListener('mtx:toggle-button-group:change', function (event) {
    if (status) status.textContent = 'mtx:toggle-button-group:change → ' + JSON.stringify(event.detail.value);
  });
  document.getElementById('doc-tb-set').addEventListener('click', function () {
    group.value = ['italic', 'underlined'];
    if (status) status.textContent = 'value = ' + JSON.stringify(group.value);
  });
});
</script>

## API reference

### Data attributes (ToggleButton)

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `toggle-button` | — | Initialization (optional inside a group). |
| `data-value` | text | the button's `value` or text | Value contributed to the group. |
| `data-icon` | Material Icons name | — | Inserts the icon (24px, `aria-hidden`) before the text. Ignored if there is already an icon or SVG. |
| `data-selected` | boolean | — | Initial selected state (`aria-pressed="true"`). |
| `data-disabled` | boolean | — | Disables the button (the native `disabled` also works). |
| `data-size` | `small` \| `medium` \| `large` | `medium` | Height 40 / 48 / 56px. |
| `data-color` | `standard` \| `primary` \| `secondary` \| `error` \| `warning` \| `info` \| `success` | `standard` | Color of the selected state. |

### Data attributes (ToggleButtonGroup)

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `toggle-button-group` | — | Initialization. Initializes its descendant `<button>` elements. |
| `data-exclusive` | boolean | multiple | Only one active button; the value is a `string` or `null`. |
| `data-value` | text (comma-separated list when multiple) | — | Initial value. |
| `data-enforce-value-set` | boolean | — | Prevents deselecting the last active button. |
| `data-orientation` | `horizontal` \| `vertical` | `horizontal` | Direction of the group and of the arrow keys. |
| `data-full-width` | boolean | — | The group fills the width and distributes the buttons. |
| `data-size`, `data-color` | same as ToggleButton | — | Applied to buttons that do not set their own. |
| `data-disabled` | boolean | — | Disables every button. |
| `data-label` | text | — | Accessible name (`aria-label`) when none is set. |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-toggle-button` | Base button (1px divider border, 4px radius, uppercase button typography). |
| `mtx-toggle-button__icon` | Icon generated from `data-icon`. |
| `mtx-toggle-button--small`, `--large` | 40 and 56px sizes. |
| `mtx-toggle-button--primary`, `--secondary`, `--error`, `--warning`, `--info`, `--success` | Color of the selected state. |
| `mtx-toggle-button--selected` | Manual BEM only: converted into `aria-pressed="true"` on init. Styling relies on `[aria-pressed="true"]`. |
| `mtx-toggle-button-group` | Container with joined borders. |
| `mtx-toggle-button-group--vertical` | Stacked group. |
| `mtx-toggle-button-group--full-width` | Full-width group. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `ToggleButton.selected` (get/set) | `boolean` | `aria-pressed` state; the setter fires no events. |
| `ToggleButton.toggle()` | `boolean` | Toggles the state and returns the new one (no events). |
| `ToggleButton.value` (getter) | `string` | `data-value`, `value` or text. |
| `ToggleButton.disable()` / `enable()` / `disabled` | `void` / `boolean` | Disabled state. |
| `ToggleButton.focus()` / `destroy()` | `void` | Focuses / removes listeners. |
| `ToggleButtonGroup.value` (get/set) | `string \| null` or `string[]` | Group value; the setter fires no events. |
| `ToggleButtonGroup.buttons` (getter) | `ToggleButton[]` | Button instances. |
| `ToggleButtonGroup.disable()` / `enable()` / `disabled` | `void` / `boolean` | Disables or enables every button. |
| `ToggleButtonGroup.destroy()` | `void` | Removes the listeners. |

### Events

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `mtx:toggle-button-group:change` (on the group, bubbles) | `{ value }` (`string \| null` or `string[]`) | The user changes the group's selection. |
| `mtx:toggle-button:change` (on the button, bubbles) | `{ selected, value }` | The user toggles a standalone button (outside a group). |

### CSS variables

| Variable | Use |
| :--- | :--- |
| `--mtx-tb-color` | Local color of the selected state (set by `data-color`). |
| `--mtx-tb-size` | Local height and minimum width (40 / 48 / 56px). |
| `--mtx-color-divider` | Border. |
| `--mtx-color-action-active`, `--mtx-color-action-hover` | Default and hover color. |
| `--mtx-color-action-disabled`, `--mtx-color-action-disabled-background` | Disabled state. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |

## Accessibility

- Every button is a native `<button>` with `aria-pressed` (WAI-ARIA *toggle button* pattern), also in exclusive mode. As in MUI, the group uses `role="group"` rather than `radiogroup`: the buttons keep their button semantics, all of them are tabbable and they can be deselected. If you need strict single-choice semantics, use [Radio](../radio/).
- Name the group with `aria-label`, `aria-labelledby` or `data-label`, and every icon-only button with `aria-label`.
- Generated icons carry `aria-hidden="true"`. Disabled buttons use the native `disabled`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the buttons (all are tabbable, as in MUI). |
| <kbd>→</kbd> / <kbd>←</kbd> | Moves focus to the next/previous button in horizontal groups (wraps around; reversed in RTL). |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Same in vertical groups. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last enabled button. |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Toggles the focused button. |
