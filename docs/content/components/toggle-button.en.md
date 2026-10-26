---
title: "Toggle Button"
description: "Toggle buttons group related options with exclusive or multiple selection; on their own they work as an on/off switch for a single action."
group: "inputs"
icon: "toggle_off"
weight: 110
example: "toggle-button"
import: "ToggleButton, ToggleButtonGroup"
mui: "https://mui.com/material-ui/react-toggle-button/"
---

**Toggle Button** groups related options in a block with joined borders: text alignment, formatting, list or grid view. A **ToggleButtonGroup** handles exclusive selection (like a radio) or multiple selection (like checkboxes), and a standalone **ToggleButton** switches a single action on and off, such as marking a favorite. To choose among many options use a Select; for a setting that applies immediately, a [Switch](../switch/).

{{< callout type="warning" title="aria-label is required on icon-only buttons" >}}
A button without visible text needs an `aria-label` (or `aria-labelledby`) that describes the option: "Align left", not "arrow". Also name the group with `aria-label` or `label`.
{{< /callout >}}

## Import

```tsx
import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react';
```

## Basic usage

A `<ToggleButtonGroup>` with `<ToggleButton>` children. Each button only needs `value` and, when icon-only, `icon` and `aria-label`; the group joins their borders, manages `aria-pressed` and passes its size, color and disabled state through context.

{{< react-demo "toggle-button/01-basic" >}}

## Exclusive and multiple selection

With `exclusive` only one button can be active and the value is a `string` (or `null`). Without it the selection is **multiple** (MUI's default) and the value is a `string[]` in DOM order.

{{< react-demo "toggle-button/02-exclusive-multiple" >}}

## Sizes

`size` on the group (or on each button). The icon keeps its native 24px grid; the padding changes (7, 11 and 15px, as in MUI). Each row aligns with the [Text Field](../text-field/) and [Button](../button/) of the same height.

| Size | `size` | Height | Aligns with |
| :--- | :--- | :--- | :--- |
| Large | `large` | 56px | Text Field medium |
| Medium | — (default) | 48px | Button large, IconButton large |
| Small | `small` | 40px | Button medium, Text Field small |

{{< react-demo id="toggle-button/03-sizes" layout="block" >}}

## With and without icons

Text only, icon and text (`icon` is rendered before the text) or icon only with `aria-label`. `icon` accepts a Material Icons name or any node (an SVG, for example).

{{< react-demo id="toggle-button/04-icons" layout="block" >}}

## Colors

`color` colors the selected state: `standard` (default, primary text) or a palette color.

{{< react-demo id="toggle-button/05-colors" layout="block" >}}

## States

Hover shows a subtle background, keyboard focus a primary ring and a press the ripple (`disableRipple` turns it off). `disabled` on a button dims it; `disabled` on the group disables them all and sets `aria-disabled="true"` on it.

{{< react-demo id="toggle-button/06-states" layout="block" >}}

## Orientation

`orientation="vertical"` stacks the buttons; the up/down arrows then move focus.

{{< react-demo "toggle-button/07-orientation" >}}

## Full width

`fullWidth` distributes the available width among the buttons.

{{< react-demo id="toggle-button/08-full-width" layout="block" >}}

## Enforce value set

`enforceValueSet` prevents deselecting the last active button, so the group always has a value (MUI's *enforce value set* pattern), in exclusive and multiple mode.

{{< react-demo "toggle-button/09-enforce-value-set" >}}

## Standalone button

A `ToggleButton` outside a group toggles its own state (`defaultSelected`) or is controlled with `selected` + `onChange(event, selected, value)`.

{{< react-demo "toggle-button/10-standalone" >}}

## Real-world example

An editor toolbar: multiple formatting and required exclusive alignment, both controlled.

{{< react-demo id="toggle-button/11-use-cases" layout="block" >}}

## Grid layout

With `fullWidth` the group adapts to the grid column.

{{< react-demo id="toggle-button/12-grid" layout="block" >}}

## Programmatic usage

The group is controlled with `value` + `onChange(event, value)`: writing `value` from code fires no `onChange`, as the vanilla setter.

{{< react-demo id="toggle-button/13-programmatic" layout="block" >}}

```tsx
const [formats, setFormats] = useState<ToggleButtonGroupValue>(['bold']);

<ToggleButtonGroup value={formats} onChange={(event, next) => setFormats(next)} aria-label="Formatting">
  <ToggleButton value="bold" icon="format_bold" aria-label="Bold" />
  <ToggleButton value="italic" icon="format_italic" aria-label="Italic" />
</ToggleButtonGroup>
```

## API reference

### ToggleButton props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | text of `children` | Value contributed to the group; required inside a group (if missing: dev warning and a generated value). |
| `selected` | `boolean` | — | Selected state (controlled; ignored inside a group). |
| `defaultSelected` | `boolean` | `false` | Initial state (uncontrolled). |
| `onChange` | `(event, selected, value) => void` | — | The user toggles the button; inside a group, only when the group applies the change. |
| `icon` | `ReactNode` | — | Material Icons name or node, before the text (`aria-hidden`). |
| `size` | `'small' \| 'medium' \| 'large'` | group or `'medium'` | Height 40 / 48 / 56px. |
| `color` | `'standard' \| 'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | group or `'standard'` | Color of the selected state. |
| `disabled` | `boolean` | `false` | Native `disabled` (also inherited from the group). |
| `disableRipple` | `boolean` | `false` | Disables the ripple. |

Other props go to the native `<button>` (`type="button"`); `ref` points to it. An `onClick` that calls `preventDefault()` cancels the toggle.

### ToggleButtonGroup props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `exclusive` | `boolean` | `false` | Only one active button; the value is `string \| null`. |
| `value` | `string \| string[] \| null` | — | Selected value (controlled). |
| `defaultValue` | `string \| string[] \| null` | `null` / `[]` | Initial value (uncontrolled). |
| `onChange` | `(event, value) => void` | — | The user changes the selection. |
| `enforceValueSet` | `boolean` | `false` | Prevents deselecting the last active button. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the group and of the arrow keys. |
| `size`, `color` | same as ToggleButton | — | Inherited by buttons that do not set their own. |
| `fullWidth` | `boolean` | `false` | Fills the width and distributes the buttons. |
| `disabled` | `boolean` | `false` | Disables every button; `aria-disabled` on the group. |
| `label` | `string` | — | Accessible name (`aria-label`). |
| `role` | `string` | `'group'` | Root role. |

Other props go to the root `<div>`; `ref` points to it.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-toggle-button` | Base button (1px divider border, 4px radius, uppercase button typography). |
| `mtx-toggle-button__icon` | Icon rendered from `icon`. |
| `mtx-toggle-button--small`, `--large` | 40 and 56px sizes. |
| `mtx-toggle-button--{primary,secondary,error,warning,info,success}` | Color of the selected state. |
| `mtx-toggle-button-group` | Container with joined borders. |
| `mtx-toggle-button-group--vertical` · `--full-width` | Stacked / full-width group. |

The selected state is styled from `[aria-pressed="true"]`. Local CSS variables: `--mtx-tb-color` (selected color) and `--mtx-tb-size` (height).

### Equivalence with the vanilla version

| Vanilla | React |
| :--- | :--- |
| `data-value` · `data-icon` · `data-selected` | `value` · `icon` · `defaultSelected` |
| `data-size` · `data-color` · `data-disabled` | `size` · `color` · `disabled` |
| `data-exclusive` · `data-value` (group) · `data-enforce-value-set` | `exclusive` · `defaultValue` / `value` · `enforceValueSet` |
| `data-orientation` · `data-full-width` · `data-label` | `orientation` · `fullWidth` · `label` |
| `mtx:toggle-button-group:change` `{ value }` | `onChange(event, value)` on the group |
| `mtx:toggle-button:change` `{ selected, value }` | `onChange(event, selected, value)` on the button |
| `group.value = …` · `button.selected = …` · `toggle()` | controlled `value` / `selected` |
| `disable()` / `enable()` | `disabled` prop |

## Accessibility

- Every button is a native `<button>` with `aria-pressed` (WAI-ARIA *toggle button* pattern), also in exclusive mode. As in MUI, the group uses `role="group"` rather than `radiogroup`: the buttons keep their button semantics, all of them are tabbable and they can be deselected. For strict single-choice semantics, use [Radio](../radio/).
- Name the group with `aria-label`, `aria-labelledby` or `label`, and every icon-only button with `aria-label`.
- Icons carry `aria-hidden="true"`. Disabled buttons use the native `disabled`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the buttons (all are tabbable, as in MUI). |
| <kbd>→</kbd> / <kbd>←</kbd> | Next/previous enabled button in horizontal groups (wraps around; reversed in RTL). |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Same in vertical groups. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last enabled button. |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Toggles the focused button. |
